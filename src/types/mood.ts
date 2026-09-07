export type MoodVibeKey = 'focus' | 'latenight' | 'energy' | 'feels' | 'drive' | 'chill' | 'discover';

export interface MoodCapsule {
  id: MoodVibeKey;
  label: string;
  emoji: string;
  tagline: string;
  dominantColor: string;
  secondaryColor: string;
  energyRange: [number, number];
  preferredGenres: string[];
}

export interface ListeningPersonality {
  title: string;
  subtitle: string;
  peakListeningTime: string;
  topGenre: string;
  moodAffinity: string;
}
