import { Track } from '../../types/track';
import { MoodVibeKey, MoodCapsule } from '../../types/mood';
import { MOOD_CAPSULES } from '../../constants/moods';

export class AuraEngine {
  /**
   * Generates a dynamic queue of tracks based on the chosen mood capsule
   */
  public static buildMoodQueue(moodId: MoodVibeKey, libraryTracks: Track[]): Track[] {
    if (!libraryTracks || libraryTracks.length === 0) return [];

    const capsule = MOOD_CAPSULES.find((c) => c.id === moodId);
    if (!capsule) return [...libraryTracks];

    // Score each track against the capsule criteria
    const scored = libraryTracks.map((track) => {
      let score = 0;

      // 1. Explicit mood match
      if (track.moodVibe === moodId) {
        score += 50;
      }

      // 2. Energy affinity
      const [minEnergy, maxEnergy] = capsule.energyRange;
      const trackEnergy = track.energy ?? 0.5;
      if (trackEnergy >= minEnergy && trackEnergy <= maxEnergy) {
        score += 30;
      } else {
        const dist = Math.min(Math.abs(trackEnergy - minEnergy), Math.abs(trackEnergy - maxEnergy));
        score += Math.max(0, 30 - dist * 40);
      }

      // 3. Genre affinity
      if (track.genre) {
        const isGenreMatch = capsule.preferredGenres.some(
          (g) => g.toLowerCase() === 'all' || track.genre?.toLowerCase().includes(g.toLowerCase())
        );
        if (isGenreMatch) {
          score += 25;
        }
      }

      // 4. Favorites boost
      if (track.isFavorite) {
        score += 10;
      }

      // 5. Mild random jitter so repeated taps offer fresh listening experiences
      score += Math.random() * 15;

      return { track, score };
    });

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);

    return scored.map((s) => s.track);
  }

  /**
   * Automatically suggests continuation tracks when queue is running low (✨ AURA Queue)
   */
  public static generateAuraContinuation(currentTrack: Track, libraryTracks: Track[], count = 5): Track[] {
    if (!libraryTracks || libraryTracks.length === 0) return [];

    const candidates = libraryTracks.filter((t) => t.id !== currentTrack.id);

    const scored = candidates.map((track) => {
      let score = 0;

      // Same artist
      if (track.artist.toLowerCase() === currentTrack.artist.toLowerCase()) {
        score += 30;
      }

      // Same mood vibe
      if (track.moodVibe && track.moodVibe === currentTrack.moodVibe) {
        score += 25;
      }

      // Energy proximity
      const currentEnergy = currentTrack.energy ?? 0.5;
      const trackEnergy = track.energy ?? 0.5;
      const energyDiff = Math.abs(currentEnergy - trackEnergy);
      score += Math.max(0, 20 - energyDiff * 25);

      // Random spice
      score += Math.random() * 10;

      return { track, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, count).map((s) => s.track);
  }
}
