export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId?: string;
  artistId?: string;
  artwork?: string;
  uri: string;
  duration: number; // in seconds
  genre?: string;
  year?: number;
  isFavorite: boolean;
  playCount: number;
  lastPlayedAt?: number;
  lyrics?: string;
  dominantColor?: string;
  secondaryColor?: string;
  energy?: number; // 0.0 - 1.0 (for AURA Flow mood engine)
  tempo?: number; // BPM
  moodVibe?: string; // 'focus' | 'latenight' | 'energy' | 'feels' | 'drive' | 'chill'
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  year?: number;
  trackCount: number;
  dominantColor?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar?: string;
  trackCount: number;
  albumCount: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverType: 'gradient' | 'artwork' | 'custom';
  gradientColors: [string, string];
  customCoverUri?: string;
  trackCount: number;
  duration: number; // total in seconds
  createdAt: number;
  updatedAt: number;
}

export interface PlayHistoryItem {
  id: string;
  trackId: string;
  playedAt: number; // timestamp
  completionRate: number; // 0.0 - 1.0
}
