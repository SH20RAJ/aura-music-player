import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer, AudioStatus } from 'expo-audio';
import { Track } from '../../types/track';

type StatusCallback = (status: {
  position: number;
  duration: number;
  isPlaying: boolean;
  isBuffering: boolean;
  isLoaded: boolean;
}) => void;

type FinishCallback = () => void;

class AudioEngine {
  private player: AudioPlayer | null = null;
  private statusListeners: Set<StatusCallback> = new Set();
  private finishListeners: Set<FinishCallback> = new Set();
  private isInitialized = false;
  private webAudio: HTMLAudioElement | null = null;
  private webInterval: any = null;

  constructor() {
    this.initAudioMode();
  }

  private async initAudioMode() {
    if (this.isInitialized) return;
    try {
      if (Platform.OS !== 'web') {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: 'doNotMix',
        });
      }
      this.isInitialized = true;
    } catch (err) {
      console.warn('Could not initialize audio mode:', err);
    }
  }

  public async loadTrack(track: Track, autoPlay = true): Promise<void> {
    await this.initAudioMode();

    if (Platform.OS === 'web') {
      this.loadWebTrack(track, autoPlay);
      return;
    }

    try {
      if (this.player) {
        this.player.pause();
        this.player.clearLockScreenControls();
        this.player.remove();
        this.player = null;
      }

      this.player = createAudioPlayer(track.uri, {
        updateInterval: 500,
      });

      this.player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
        const isLoaded = status.isLoaded;
        const isPlaying = status.playing;
        const position = status.currentTime || 0;
        const duration = status.duration || track.duration || 0;
        const isBuffering = status.isBuffering || false;

        this.notifyStatus({
          position,
          duration,
          isPlaying,
          isBuffering,
          isLoaded,
        });

        // Detect track completion (within 0.5s of duration or reached end)
        if (duration > 0 && position >= duration - 0.5 && !status.loop && isLoaded && !isPlaying) {
          this.notifyFinish();
        }
      });

      // Configure lock screen controls
      try {
        this.player.setActiveForLockScreen(true, {
          title: track.title,
          artist: track.artist,
          albumTitle: track.album,
          artworkUrl: track.artwork,
        });
      } catch (lockErr) {
        console.warn('Failed to set lock screen controls:', lockErr);
      }

      if (autoPlay) {
        this.player.play();
      }
    } catch (err) {
      console.warn('Error loading native track, falling back:', err);
      this.loadWebTrack(track, autoPlay);
    }
  }

  private loadWebTrack(track: Track, autoPlay = true) {
    if (typeof window === 'undefined') return;

    if (this.webAudio) {
      this.webAudio.pause();
      this.webAudio.src = '';
      if (this.webInterval) clearInterval(this.webInterval);
    }

    this.webAudio = new Audio(track.uri);
    this.webAudio.volume = 1.0;

    this.webAudio.onended = () => {
      this.notifyFinish();
    };

    this.webAudio.onloadedmetadata = () => {
      this.notifyStatus({
        position: this.webAudio?.currentTime || 0,
        duration: this.webAudio?.duration || track.duration,
        isPlaying: !this.webAudio?.paused,
        isBuffering: false,
        isLoaded: true,
      });
    };

    this.webInterval = setInterval(() => {
      if (this.webAudio) {
        this.notifyStatus({
          position: this.webAudio.currentTime || 0,
          duration: this.webAudio.duration || track.duration || 0,
          isPlaying: !this.webAudio.paused,
          isBuffering: false,
          isLoaded: true,
        });
      }
    }, 500);

    if (autoPlay) {
      this.webAudio.play().catch((e) => console.log('Web audio autoplay prevented:', e));
    }
  }

  public async play(): Promise<void> {
    if (Platform.OS === 'web' && this.webAudio) {
      await this.webAudio.play();
      return;
    }
    if (this.player) {
      this.player.play();
    }
  }

  public async pause(): Promise<void> {
    if (Platform.OS === 'web' && this.webAudio) {
      this.webAudio.pause();
      return;
    }
    if (this.player) {
      this.player.pause();
    }
  }

  public async seek(positionSeconds: number): Promise<void> {
    if (Platform.OS === 'web' && this.webAudio) {
      this.webAudio.currentTime = positionSeconds;
      return;
    }
    if (this.player) {
      await this.player.seekTo(positionSeconds);
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    if (Platform.OS === 'web' && this.webAudio) {
      this.webAudio.volume = clamped;
      return;
    }
    if (this.player) {
      this.player.volume = clamped;
    }
  }

  public setLoop(loop: boolean): void {
    if (Platform.OS === 'web' && this.webAudio) {
      this.webAudio.loop = loop;
      return;
    }
    if (this.player) {
      this.player.loop = loop;
    }
  }

  public onStatusUpdate(cb: StatusCallback): () => void {
    this.statusListeners.add(cb);
    return () => this.statusListeners.delete(cb);
  }

  public onTrackFinish(cb: FinishCallback): () => void {
    this.finishListeners.add(cb);
    return () => this.finishListeners.delete(cb);
  }

  private notifyStatus(status: {
    position: number;
    duration: number;
    isPlaying: boolean;
    isBuffering: boolean;
    isLoaded: boolean;
  }) {
    this.statusListeners.forEach((cb) => cb(status));
  }

  private notifyFinish() {
    this.finishListeners.forEach((cb) => cb());
  }

  public cleanup() {
    if (this.player) {
      this.player.clearLockScreenControls();
      this.player.remove();
      this.player = null;
    }
    if (this.webAudio) {
      this.webAudio.pause();
      this.webAudio.src = '';
      if (this.webInterval) clearInterval(this.webInterval);
    }
    this.statusListeners.clear();
    this.finishListeners.clear();
  }
}

export const audioEngine = new AudioEngine();
