import { create } from 'zustand';
import { PlayerState, RepeatMode } from '../../types/player';
import { Track } from '../../types/track';
import { audioEngine } from './audio-engine';
import { QueueEngine } from './queue-engine';
import { recordPlay, updateTrackFavorite } from '../../db/database';

const queueEngine = new QueueEngine();

export const usePlayerStore = create<PlayerState>((set, get) => {
  // Wire audio engine events to store
  audioEngine.onStatusUpdate((status) => {
    set({
      position: status.position,
      duration: status.duration,
      isPlaying: status.isPlaying,
      isBuffering: status.isBuffering,
    });
  });

  audioEngine.onTrackFinish(async () => {
    const state = get();
    if (state.currentTrack) {
      await recordPlay(state.currentTrack.id, 1.0);
    }
    await state.next();
  });

  return {
    currentTrack: null,
    queue: [],
    queueIndex: -1,
    isPlaying: false,
    position: 0,
    duration: 0,
    repeatMode: 'off',
    shuffle: false,
    volume: 1.0,
    isBuffering: false,
    isAuraQueue: false,
    activePlayerView: 'artwork',

    play: async () => {
      const state = get();
      if (!state.currentTrack && state.queue.length > 0) {
        await state.setQueue(state.queue, 0);
        return;
      }
      await audioEngine.play();
      set({ isPlaying: true });
    },

    pause: async () => {
      await audioEngine.pause();
      set({ isPlaying: false });
    },

    togglePlayPause: async () => {
      const state = get();
      if (state.isPlaying) {
        await state.pause();
      } else {
        await state.play();
      }
    },

    setQueue: async (tracks: Track[], startIndex = 0, isAuraQueue = false) => {
      if (!tracks || tracks.length === 0) return;
      const { currentTrack, index } = queueEngine.setQueue(tracks, startIndex);
      set({
        queue: queueEngine.getQueue(),
        queueIndex: index,
        currentTrack,
        isAuraQueue,
        position: 0,
        duration: currentTrack?.duration || 0,
      });

      if (currentTrack) {
        await audioEngine.loadTrack(currentTrack, true);
        set({ isPlaying: true });
        recordPlay(currentTrack.id, 0.1);
      }
    },

    next: async () => {
      const nextIdx = queueEngine.getNextIndex();
      if (nextIdx !== null) {
        const nextTrack = queueEngine.moveTo(nextIdx);
        if (nextTrack) {
          set({
            currentTrack: nextTrack,
            queueIndex: nextIdx,
            position: 0,
            duration: nextTrack.duration || 0,
          });
          await audioEngine.loadTrack(nextTrack, true);
          set({ isPlaying: true });
          recordPlay(nextTrack.id, 0.1);
        }
      } else {
        await audioEngine.pause();
        await audioEngine.seek(0);
        set({ isPlaying: false, position: 0 });
      }
    },

    previous: async () => {
      const state = get();
      // If played more than 3 seconds, restart current song
      if (state.position > 3) {
        await audioEngine.seek(0);
        set({ position: 0 });
        return;
      }

      const prevIdx = queueEngine.getPreviousIndex();
      if (prevIdx !== null) {
        const prevTrack = queueEngine.moveTo(prevIdx);
        if (prevTrack) {
          set({
            currentTrack: prevTrack,
            queueIndex: prevIdx,
            position: 0,
            duration: prevTrack.duration || 0,
          });
          await audioEngine.loadTrack(prevTrack, true);
          set({ isPlaying: true });
        }
      }
    },

    seek: async (position: number) => {
      set({ position });
      await audioEngine.seek(position);
    },

    addToQueue: (track: Track) => {
      queueEngine.addToQueue(track);
      set({ queue: queueEngine.getQueue() });
    },

    playNext: (track: Track) => {
      queueEngine.playNext(track);
      set({ queue: queueEngine.getQueue() });
    },

    removeFromQueue: (index: number) => {
      queueEngine.removeTrack(index);
      set({
        queue: queueEngine.getQueue(),
        queueIndex: queueEngine.getCurrentIndex(),
      });
    },

    reorderQueue: (fromIndex: number, toIndex: number) => {
      queueEngine.reorder(fromIndex, toIndex);
      set({
        queue: queueEngine.getQueue(),
        queueIndex: queueEngine.getCurrentIndex(),
      });
    },

    clearQueue: () => {
      audioEngine.pause();
      set({
        currentTrack: null,
        queue: [],
        queueIndex: -1,
        isPlaying: false,
        position: 0,
        duration: 0,
      });
    },

    toggleRepeat: () => {
      const current = get().repeatMode;
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const nextMode = modes[(modes.indexOf(current) + 1) % modes.length];
      queueEngine.setRepeatMode(nextMode);
      audioEngine.setLoop(nextMode === 'one');
      set({ repeatMode: nextMode });
    },

    toggleShuffle: () => {
      const result = queueEngine.toggleShuffle();
      set({
        shuffle: result.isShuffle,
        queue: result.queue,
        queueIndex: result.newIndex,
      });
    },

    setVolume: (volume: number) => {
      audioEngine.setVolume(volume);
      set({ volume });
    },

    toggleFavorite: async (trackId: string) => {
      const state = get();
      const updatedQueue = state.queue.map((t) => {
        if (t.id === trackId) {
          const newFav = !t.isFavorite;
          updateTrackFavorite(trackId, newFav);
          return { ...t, isFavorite: newFav };
        }
        return t;
      });

      const updatedCurrent =
        state.currentTrack?.id === trackId
          ? { ...state.currentTrack, isFavorite: !state.currentTrack.isFavorite }
          : state.currentTrack;

      set({
        queue: updatedQueue,
        currentTrack: updatedCurrent,
      });
    },

    setActivePlayerView: (view: 'artwork' | 'lyrics' | 'visualizer') => {
      set({ activePlayerView: view });
    },

    cyclePlayerView: () => {
      const current = get().activePlayerView;
      const order: ('artwork' | 'lyrics' | 'visualizer')[] = ['artwork', 'lyrics', 'visualizer'];
      const next = order[(order.indexOf(current) + 1) % order.length];
      set({ activePlayerView: next });
    },
  };
});
