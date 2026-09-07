import { Track } from '../../types/track';

type StatusCallback = (status: {
  position: number;
  duration: number;
  isPlaying: boolean;
  isBuffering: boolean;
  isLoaded: boolean;
}) => void;

type FinishCallback = () => void;

class WebAudioEngine {
  private statusListeners: Set<StatusCallback> = new Set();
  private finishListeners: Set<FinishCallback> = new Set();
  private webAudio: HTMLAudioElement | null = null;
  private webInterval: any = null;
  private currentTrack: Track | null = null;

  public async loadTrack(track: Track, autoPlay = true): Promise<void> {
    this.currentTrack = track;
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
      this.webAudio.play().catch((e) => console.log('Web audio autoplay:', e));
    }
  }

  public async play(): Promise<void> {
    if (this.webAudio) {
      await this.webAudio.play();
    }
  }

  public async pause(): Promise<void> {
    if (this.webAudio) {
      this.webAudio.pause();
    }
  }

  public async seek(positionSeconds: number): Promise<void> {
    if (this.webAudio) {
      this.webAudio.currentTime = positionSeconds;
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    if (this.webAudio) {
      this.webAudio.volume = clamped;
    }
  }

  public setLoop(loop: boolean): void {
    if (this.webAudio) {
      this.webAudio.loop = loop;
    }
  }

  public setPlaybackRate(rate: number): void {
    if (this.webAudio) {
      this.webAudio.playbackRate = rate;
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
    if (this.webAudio) {
      this.webAudio.pause();
      this.webAudio.src = '';
      if (this.webInterval) clearInterval(this.webInterval);
    }
    this.statusListeners.clear();
    this.finishListeners.clear();
  }
}

export const audioEngine = new WebAudioEngine();
