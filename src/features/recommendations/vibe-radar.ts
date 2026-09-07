import { Track } from '../../types/track';

export interface VibePoint {
  x: number; // -1.0 (Acoustic / Mellow) to +1.0 (Electronic / High Energy)
  y: number; // -1.0 (Midnight Mood) to +1.0 (Daylight Focus)
}

export class VibeRadarEngine {
  /**
   * Reorganizes tracks based on distance from the chosen 2D Vibe coordinate
   */
  public static matchTracks(point: VibePoint, tracks: Track[]): Track[] {
    if (!tracks || tracks.length === 0) return [];

    const scored = tracks.map((track) => {
      // Map track attributes to 2D coordinate space
      // Energy & genre mapping to X axis (-1 to +1)
      let trackX = (track.energy ?? 0.5) * 2 - 1; // 0..1 -> -1..1
      if (track.genre?.toLowerCase().includes('electronic') || track.genre?.toLowerCase().includes('dance')) {
        trackX = Math.min(1.0, trackX + 0.3);
      } else if (track.genre?.toLowerCase().includes('acoustic') || track.genre?.toLowerCase().includes('ambient')) {
        trackX = Math.max(-1.0, trackX - 0.3);
      }

      // Mood vibe mapping to Y axis (-1 to +1)
      let trackY = 0;
      if (track.moodVibe === 'latenight') trackY = -0.8;
      else if (track.moodVibe === 'focus') trackY = 0.8;
      else if (track.moodVibe === 'energy') trackY = 0.4;
      else if (track.moodVibe === 'drive') trackY = -0.3;
      else if (track.moodVibe === 'chill') trackY = -0.2;
      else if (track.moodVibe === 'feels') trackY = -0.5;

      // Euclidean distance in 2D vibe space
      const dx = point.x - trackX;
      const dy = point.y - trackY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Score: smaller distance = higher score
      const score = 100 - distance * 40 + (track.isFavorite ? 8 : 0);

      return { track, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.track);
  }

  public static getVibeDescription(point: VibePoint): { label: string; vibeBadge: string } {
    if (point.y < -0.3) {
      if (point.x > 0.2) return { label: 'Neon Cyber Night', vibeBadge: '🚗 Drive & Synth' };
      return { label: 'Deep Midnight Introspection', vibeBadge: '🌙 Late Night R&B' };
    } else if (point.y > 0.3) {
      if (point.x > 0.2) return { label: 'Peak Flow Velocity', vibeBadge: '⚡ High Focus' };
      return { label: 'Serene Afternoon Clarity', vibeBadge: '☀️ Ambient Focus' };
    } else {
      if (point.x > 0.2) return { label: 'Electro Pulse Groove', vibeBadge: '⚡ Energetic' };
      return { label: 'Golden Hour Drift', vibeBadge: '☁️ Chill & Acoustic' };
    }
  }
}
