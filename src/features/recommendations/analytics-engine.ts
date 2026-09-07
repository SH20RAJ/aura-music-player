import { Track } from '../../types/track';
import { ListeningPersonality } from '../../types/mood';

export class AnalyticsEngine {
  public static calculateListeningPersonality(
    tracks: Track[],
    recentlyPlayed: Track[]
  ): ListeningPersonality {
    if (tracks.length === 0) {
      return {
        title: 'Curious Explorer',
        subtitle: 'Beginning your journey with AURA',
        peakListeningTime: 'Anytime',
        topGenre: 'Eclectic',
        moodAffinity: 'Discover',
      };
    }

    // Determine peak listening time from history
    let lateNightCount = 0;
    let morningCount = 0;
    let afternoonCount = 0;
    let eveningCount = 0;

    recentlyPlayed.forEach((t) => {
      if (t.lastPlayedAt) {
        const hour = new Date(t.lastPlayedAt).getHours();
        if (hour >= 22 || hour < 4) lateNightCount++;
        else if (hour >= 4 && hour < 12) morningCount++;
        else if (hour >= 12 && hour < 17) afternoonCount++;
        else eveningCount++;
      }
    });

    // Default to Night Owl as per user persona if no historical bias
    if (lateNightCount >= morningCount && lateNightCount >= eveningCount) {
      return {
        title: 'Night Owl',
        subtitle: 'Your peak listening happens while the world sleeps.',
        peakListeningTime: '11:00 PM – 1:00 AM',
        topGenre: 'Midnight Pop / Synthwave',
        moodAffinity: 'Late Night 🌙',
      };
    } else if (morningCount > eveningCount) {
      return {
        title: 'Dawn Seeker',
        subtitle: 'You greet the day with rhythmic intention.',
        peakListeningTime: '7:00 AM – 9:30 AM',
        topGenre: 'Acoustic / Lo-Fi',
        moodAffinity: 'Focus ☀️',
      };
    } else {
      return {
        title: 'Sunset Cruiser',
        subtitle: 'Golden hour unlocks your deepest musical groove.',
        peakListeningTime: '6:00 PM – 8:30 PM',
        topGenre: 'R&B / Soul',
        moodAffinity: 'Drive 🚗',
      };
    }
  }

  public static getTopArtist(tracks: Track[]): { name: string; count: number } {
    const map = new Map<string, number>();
    tracks.forEach((t) => {
      const current = map.get(t.artist) || 0;
      map.set(t.artist, current + (t.playCount || 1));
    });

    let topArtist = 'The Weeknd';
    let max = 0;

    map.forEach((count, artist) => {
      if (count > max) {
        max = count;
        topArtist = artist;
      }
    });

    return { name: topArtist, count: max };
  }
}
