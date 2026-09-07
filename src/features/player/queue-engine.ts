import { Track } from '../../types/track';
import { RepeatMode } from '../../types/player';

export class QueueEngine {
  private queue: Track[] = [];
  private originalQueue: Track[] = [];
  private currentIndex: number = -1;
  private isShuffle: boolean = false;
  private repeatMode: RepeatMode = 'off';

  public setQueue(tracks: Track[], startIndex: number = 0): { currentTrack: Track | null; index: number } {
    this.originalQueue = [...tracks];
    this.queue = [...tracks];
    this.currentIndex = Math.max(0, Math.min(startIndex, tracks.length - 1));
    return {
      currentTrack: this.queue[this.currentIndex] || null,
      index: this.currentIndex,
    };
  }

  public getQueue(): Track[] {
    return [...this.queue];
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getCurrentTrack(): Track | null {
    return this.queue[this.currentIndex] || null;
  }

  public getNextIndex(): number | null {
    if (this.queue.length === 0) return null;

    if (this.repeatMode === 'one') {
      return this.currentIndex;
    }

    if (this.currentIndex < this.queue.length - 1) {
      return this.currentIndex + 1;
    }

    if (this.repeatMode === 'all') {
      return 0;
    }

    return null;
  }

  public getPreviousIndex(): number | null {
    if (this.queue.length === 0) return null;

    if (this.repeatMode === 'one') {
      return this.currentIndex;
    }

    if (this.currentIndex > 0) {
      return this.currentIndex - 1;
    }

    if (this.repeatMode === 'all') {
      return this.queue.length - 1;
    }

    return 0;
  }

  public moveTo(index: number): Track | null {
    if (index >= 0 && index < this.queue.length) {
      this.currentIndex = index;
      return this.queue[this.currentIndex];
    }
    return null;
  }

  public addToQueue(track: Track): void {
    this.queue.push(track);
    this.originalQueue.push(track);
  }

  public playNext(track: Track): void {
    const insertAt = this.currentIndex + 1;
    this.queue.splice(insertAt, 0, track);
    this.originalQueue.splice(insertAt, 0, track);
  }

  public removeTrack(index: number): void {
    if (index < 0 || index >= this.queue.length) return;
    this.queue.splice(index, 1);
    if (index < this.currentIndex) {
      this.currentIndex--;
    }
  }

  public reorder(fromIndex: number, toIndex: number): void {
    if (
      fromIndex < 0 ||
      fromIndex >= this.queue.length ||
      toIndex < 0 ||
      toIndex >= this.queue.length
    ) {
      return;
    }

    const currentTrack = this.getCurrentTrack();
    const [moved] = this.queue.splice(fromIndex, 1);
    this.queue.splice(toIndex, 0, moved);

    // Update currentIndex to follow currently playing track
    if (currentTrack) {
      this.currentIndex = this.queue.findIndex((t) => t.id === currentTrack.id);
    }
  }

  public toggleShuffle(): { isShuffle: boolean; queue: Track[]; newIndex: number } {
    this.isShuffle = !this.isShuffle;

    const currentTrack = this.getCurrentTrack();

    if (this.isShuffle) {
      // Shuffle remaining tracks while preserving current track
      const rest = this.queue.filter((_, idx) => idx !== this.currentIndex);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      this.queue = currentTrack ? [currentTrack, ...rest] : rest;
      this.currentIndex = 0;
    } else {
      // Restore original queue order
      this.queue = [...this.originalQueue];
      if (currentTrack) {
        const found = this.queue.findIndex((t) => t.id === currentTrack.id);
        this.currentIndex = found !== -1 ? found : 0;
      }
    }

    return {
      isShuffle: this.isShuffle,
      queue: [...this.queue],
      newIndex: this.currentIndex,
    };
  }

  public setRepeatMode(mode: RepeatMode): void {
    this.repeatMode = mode;
  }

  public getRepeatMode(): RepeatMode {
    return this.repeatMode;
  }
}
