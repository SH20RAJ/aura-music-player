import { usePlayerStore } from './player-store';
import { audioEngine } from './audio-engine';

type SleepTimerType = 'minutes' | 'track_end' | null;

type TickCallback = (secondsRemaining: number, isActive: boolean) => void;

class SleepTimerManager {
  private timerInterval: any = null;
  private secondsRemaining: number = 0;
  private timerType: SleepTimerType = null;
  private listeners: Set<TickCallback> = new Set();
  private originalVolume: number = 1.0;

  public startTimer(minutes: number): void {
    this.cancelTimer();
    this.timerType = 'minutes';
    this.secondsRemaining = minutes * 60;
    this.originalVolume = usePlayerStore.getState().volume || 1.0;

    this.notify();

    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;

      // Gentle fade-out during the final 45 seconds
      if (this.secondsRemaining <= 45 && this.secondsRemaining > 0) {
        const fadeRatio = this.secondsRemaining / 45;
        audioEngine.setVolume(this.originalVolume * fadeRatio);
      }

      if (this.secondsRemaining <= 0) {
        this.triggerExpiry();
      } else {
        this.notify();
      }
    }, 1000);
  }

  public startEndOfTrackTimer(): void {
    this.cancelTimer();
    this.timerType = 'track_end';
    const state = usePlayerStore.getState();
    const remaining = Math.max(5, Math.floor(state.duration - state.position));
    this.secondsRemaining = remaining;
    this.originalVolume = state.volume || 1.0;

    this.notify();

    this.timerInterval = setInterval(() => {
      const currentState = usePlayerStore.getState();
      const currentRemaining = Math.max(0, Math.floor(currentState.duration - currentState.position));
      this.secondsRemaining = currentRemaining;

      if (currentRemaining <= 20 && currentRemaining > 0) {
        const fadeRatio = currentRemaining / 20;
        audioEngine.setVolume(this.originalVolume * fadeRatio);
      }

      if (currentRemaining <= 1 || !currentState.isPlaying) {
        this.triggerExpiry();
      } else {
        this.notify();
      }
    }, 1000);
  }

  public cancelTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.secondsRemaining = 0;
    this.timerType = null;
    // Restore volume
    audioEngine.setVolume(this.originalVolume);
    this.notify();
  }

  private triggerExpiry(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.secondsRemaining = 0;
    this.timerType = null;
    usePlayerStore.getState().pause();
    // Restore volume for subsequent playback
    setTimeout(() => {
      audioEngine.setVolume(this.originalVolume);
    }, 500);
    this.notify();
  }

  public getStatus(): { isActive: boolean; secondsRemaining: number; type: SleepTimerType } {
    return {
      isActive: this.secondsRemaining > 0,
      secondsRemaining: this.secondsRemaining,
      type: this.timerType,
    };
  }

  public onTick(cb: TickCallback): () => void {
    this.listeners.add(cb);
    cb(this.secondsRemaining, this.secondsRemaining > 0);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    this.listeners.forEach((cb) => cb(this.secondsRemaining, this.secondsRemaining > 0));
  }
}

export const sleepTimer = new SleepTimerManager();
