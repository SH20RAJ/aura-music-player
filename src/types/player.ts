import { Track } from './track';

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  position: number;
  duration: number;
  repeatMode: RepeatMode;
  shuffle: boolean;
  volume: number;
  isBuffering: boolean;
  isAuraQueue: boolean; // ✨ AURA Queue indicator
  activePlayerView: 'artwork' | 'lyrics' | 'visualizer';
  playbackRate: number;
  soundProfile: import('./audiophile').SoundProfile;
  
  // Actions
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setQueue: (tracks: Track[], startIndex?: number, isAuraQueue?: boolean) => Promise<void>;
  addToQueue: (track: Track) => void;
  playNext: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setSoundProfile: (profile: import('./audiophile').SoundProfile) => void;
  toggleFavorite: (trackId: string) => Promise<void>;
  setActivePlayerView: (view: 'artwork' | 'lyrics' | 'visualizer') => void;
  cyclePlayerView: () => void;
}
