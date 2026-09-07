import { Track, Album, Artist, Playlist } from '../types/track';

const STORAGE_KEYS = {
  TRACKS: 'aura_tracks',
  PLAYLISTS: 'aura_playlists',
  PLAYLIST_TRACKS: 'aura_playlist_tracks',
  HISTORY: 'aura_history',
};

const memoryStore = {
  tracks: new Map<string, Track>(),
  playlists: new Map<string, Playlist>(),
  playlistTracks: new Map<string, string[]>(), // playlistId -> trackIds
  history: [] as { id: string; trackId: string; playedAt: number; completionRate: number }[],
};

export async function initDatabase(): Promise<void> {
  // Web initialization
}

export async function insertTracks(tracks: Track[]): Promise<void> {
  tracks.forEach((t) => memoryStore.tracks.set(t.id, t));
}

export async function getAllTracks(): Promise<Track[]> {
  return Array.from(memoryStore.tracks.values());
}

export async function getTrackById(id: string): Promise<Track | null> {
  return memoryStore.tracks.get(id) || null;
}

export async function updateTrackFavorite(trackId: string, isFavorite: boolean): Promise<void> {
  const track = memoryStore.tracks.get(trackId);
  if (track) {
    track.isFavorite = isFavorite;
  }
}

export async function recordPlay(trackId: string, completionRate: number = 1.0): Promise<void> {
  const now = Date.now();
  const track = memoryStore.tracks.get(trackId);
  if (track) {
    track.playCount = (track.playCount || 0) + 1;
    track.lastPlayedAt = now;
  }
  memoryStore.history.push({ id: `hist_${now}_${trackId}`, trackId, playedAt: now, completionRate });
}

export async function getRecentlyPlayedTracks(limit: number = 20): Promise<Track[]> {
  return Array.from(memoryStore.tracks.values())
    .filter((t) => !!t.lastPlayedAt)
    .sort((a, b) => (b.lastPlayedAt || 0) - (a.lastPlayedAt || 0))
    .slice(0, limit);
}

export async function getFavoriteTracks(): Promise<Track[]> {
  return Array.from(memoryStore.tracks.values()).filter((t) => t.isFavorite);
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  return Array.from(memoryStore.playlists.values());
}

export async function createPlaylist(playlist: Omit<Playlist, 'trackCount' | 'duration'>): Promise<Playlist> {
  const newPl: Playlist = {
    ...playlist,
    trackCount: 0,
    duration: 0,
  };
  memoryStore.playlists.set(playlist.id, newPl);
  memoryStore.playlistTracks.set(playlist.id, []);
  return newPl;
}

export async function addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
  const list = memoryStore.playlistTracks.get(playlistId) || [];
  if (!list.includes(trackId)) {
    list.push(trackId);
    memoryStore.playlistTracks.set(playlistId, list);
  }
  const pl = memoryStore.playlists.get(playlistId);
  if (pl) pl.trackCount = list.length;
}

export async function getPlaylistTracks(playlistId: string): Promise<Track[]> {
  const trackIds = memoryStore.playlistTracks.get(playlistId) || [];
  return trackIds.map((id) => memoryStore.tracks.get(id)).filter((t): t is Track => !!t);
}

export async function deletePlaylist(playlistId: string): Promise<void> {
  memoryStore.playlists.delete(playlistId);
  memoryStore.playlistTracks.delete(playlistId);
}

export async function getListeningStats() {
  const allTracks = Array.from(memoryStore.tracks.values());
  const artists = new Set(allTracks.map((t) => t.artist)).size;
  const albums = new Set(allTracks.map((t) => t.album)).size;
  return {
    totalSongs: allTracks.length,
    totalArtists: artists,
    totalAlbums: albums,
    topArtist: allTracks[0]?.artist || 'The Weeknd',
  };
}
