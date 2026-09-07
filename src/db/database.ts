import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';
import { Track, Album, Artist, Playlist } from '../types/track';

const DB_NAME = 'aura_music.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

// In-memory web fallback store if SQLite is unavailable on web
const webFallback = {
  tracks: new Map<string, Track>(),
  playlists: new Map<string, Playlist>(),
  playlistTracks: new Map<string, string[]>(), // playlistId -> trackIds
  history: [] as { id: string; trackId: string; playedAt: number; completionRate: number }[],
  settings: new Map<string, string>(),
};

export async function getDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  if (Platform.OS === 'web') {
    return null;
  }
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    await dbInstance.execAsync(CREATE_TABLES_SQL);
  }
  return dbInstance;
}

export async function initDatabase(): Promise<void> {
  try {
    if (Platform.OS !== 'web') {
      const db = await getDatabase();
      if (db) {
        await db.execAsync(CREATE_TABLES_SQL);
      }
    }
  } catch (err) {
    console.warn('Database initialization warning (falling back if needed):', err);
  }
}

// Track Operations
export async function insertTracks(tracks: Track[]): Promise<void> {
  const db = await getDatabase();
  if (!db) {
    tracks.forEach((t) => webFallback.tracks.set(t.id, t));
    return;
  }

  for (const t of tracks) {
    await db.runAsync(
      `INSERT OR REPLACE INTO tracks (
        id, title, artist, album, album_id, artist_id, uri, artwork,
        duration, genre, year, is_favorite, play_count, last_played_at,
        lyrics, dominant_color, secondary_color, energy, tempo, mood_vibe
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        t.id,
        t.title,
        t.artist,
        t.album,
        t.albumId || null,
        t.artistId || null,
        t.uri,
        t.artwork || null,
        t.duration,
        t.genre || null,
        t.year || null,
        t.isFavorite ? 1 : 0,
        t.playCount || 0,
        t.lastPlayedAt || null,
        t.lyrics || null,
        t.dominantColor || null,
        t.secondaryColor || null,
        t.energy ?? 0.5,
        t.tempo ?? 120,
        t.moodVibe || null,
      ]
    );
  }
}

export async function getAllTracks(): Promise<Track[]> {
  const db = await getDatabase();
  if (!db) {
    return Array.from(webFallback.tracks.values());
  }

  const rows = await db.getAllAsync<any>('SELECT * FROM tracks ORDER BY title ASC');
  return rows.map(mapRowToTrack);
}

export async function getTrackById(id: string): Promise<Track | null> {
  const db = await getDatabase();
  if (!db) {
    return webFallback.tracks.get(id) || null;
  }

  const row = await db.getFirstAsync<any>('SELECT * FROM tracks WHERE id = ?', [id]);
  return row ? mapRowToTrack(row) : null;
}

export async function updateTrackFavorite(trackId: string, isFavorite: boolean): Promise<void> {
  const db = await getDatabase();
  if (!db) {
    const track = webFallback.tracks.get(trackId);
    if (track) {
      track.isFavorite = isFavorite;
    }
    return;
  }

  await db.runAsync('UPDATE tracks SET is_favorite = ? WHERE id = ?', [isFavorite ? 1 : 0, trackId]);
}

export async function recordPlay(trackId: string, completionRate: number = 1.0): Promise<void> {
  const now = Date.now();
  const db = await getDatabase();
  if (!db) {
    const track = webFallback.tracks.get(trackId);
    if (track) {
      track.playCount = (track.playCount || 0) + 1;
      track.lastPlayedAt = now;
    }
    webFallback.history.push({ id: `hist_${now}_${trackId}`, trackId, playedAt: now, completionRate });
    return;
  }

  await db.runAsync(
    'UPDATE tracks SET play_count = play_count + 1, last_played_at = ? WHERE id = ?',
    [now, trackId]
  );
  await db.runAsync(
    'INSERT INTO play_history (id, track_id, played_at, completion_rate) VALUES (?, ?, ?, ?)',
    [`hist_${now}_${trackId}`, trackId, now, completionRate]
  );
}

export async function getRecentlyPlayedTracks(limit: number = 20): Promise<Track[]> {
  const db = await getDatabase();
  if (!db) {
    return Array.from(webFallback.tracks.values())
      .filter((t) => !!t.lastPlayedAt)
      .sort((a, b) => (b.lastPlayedAt || 0) - (a.lastPlayedAt || 0))
      .slice(0, limit);
  }

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM tracks WHERE last_played_at IS NOT NULL ORDER BY last_played_at DESC LIMIT ?',
    [limit]
  );
  return rows.map(mapRowToTrack);
}

export async function getFavoriteTracks(): Promise<Track[]> {
  const db = await getDatabase();
  if (!db) {
    return Array.from(webFallback.tracks.values()).filter((t) => t.isFavorite);
  }

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM tracks WHERE is_favorite = 1 ORDER BY title ASC'
  );
  return rows.map(mapRowToTrack);
}

// Playlists
export async function getAllPlaylists(): Promise<Playlist[]> {
  const db = await getDatabase();
  if (!db) {
    return Array.from(webFallback.playlists.values());
  }

  const rows = await db.getAllAsync<any>('SELECT * FROM playlists ORDER BY created_at DESC');
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description || '',
    coverType: r.cover_type as any,
    gradientColors: [r.gradient_color_1 || '#7952FC', r.gradient_color_2 || '#00D2FF'],
    customCoverUri: r.custom_cover_uri || undefined,
    trackCount: 0,
    duration: 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function createPlaylist(playlist: Omit<Playlist, 'trackCount' | 'duration'>): Promise<Playlist> {
  const newPl: Playlist = {
    ...playlist,
    trackCount: 0,
    duration: 0,
  };

  const db = await getDatabase();
  if (!db) {
    webFallback.playlists.set(playlist.id, newPl);
    webFallback.playlistTracks.set(playlist.id, []);
    return newPl;
  }

  await db.runAsync(
    `INSERT INTO playlists (id, name, description, cover_type, gradient_color_1, gradient_color_2, custom_cover_uri, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      playlist.id,
      playlist.name,
      playlist.description || null,
      playlist.coverType,
      playlist.gradientColors[0],
      playlist.gradientColors[1],
      playlist.customCoverUri || null,
      playlist.createdAt,
      playlist.updatedAt,
    ]
  );
  return newPl;
}

export async function addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
  const db = await getDatabase();
  const now = Date.now();
  if (!db) {
    const list = webFallback.playlistTracks.get(playlistId) || [];
    if (!list.includes(trackId)) {
      list.push(trackId);
      webFallback.playlistTracks.set(playlistId, list);
    }
    const pl = webFallback.playlists.get(playlistId);
    if (pl) pl.trackCount = list.length;
    return;
  }

  const countRow = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM playlist_tracks WHERE playlist_id = ?',
    [playlistId]
  );
  const nextPos = countRow ? countRow.count : 0;

  await db.runAsync(
    'INSERT OR IGNORE INTO playlist_tracks (id, playlist_id, track_id, position, added_at) VALUES (?, ?, ?, ?, ?)',
    [`pt_${playlistId}_${trackId}`, playlistId, trackId, nextPos, now]
  );
}

export async function getPlaylistTracks(playlistId: string): Promise<Track[]> {
  const db = await getDatabase();
  if (!db) {
    const trackIds = webFallback.playlistTracks.get(playlistId) || [];
    return trackIds.map((id) => webFallback.tracks.get(id)).filter((t): t is Track => !!t);
  }

  const rows = await db.getAllAsync<any>(
    `SELECT t.* FROM tracks t
     INNER JOIN playlist_tracks pt ON t.id = pt.track_id
     WHERE pt.playlist_id = ?
     ORDER BY pt.position ASC`,
    [playlistId]
  );
  return rows.map(mapRowToTrack);
}

export async function deletePlaylist(playlistId: string): Promise<void> {
  const db = await getDatabase();
  if (!db) {
    webFallback.playlists.delete(playlistId);
    webFallback.playlistTracks.delete(playlistId);
    return;
  }

  await db.runAsync('DELETE FROM playlist_tracks WHERE playlist_id = ?', [playlistId]);
  await db.runAsync('DELETE FROM playlists WHERE id = ?', [playlistId]);
}

// Analytics Queries
export async function getListeningStats() {
  const db = await getDatabase();
  if (!db) {
    const allTracks = Array.from(webFallback.tracks.values());
    const artists = new Set(allTracks.map((t) => t.artist)).size;
    const albums = new Set(allTracks.map((t) => t.album)).size;
    return {
      totalSongs: allTracks.length,
      totalArtists: artists,
      totalAlbums: albums,
      topArtist: allTracks[0]?.artist || 'The Weeknd',
    };
  }

  const songCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM tracks');
  const artistCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(DISTINCT artist) as count FROM tracks');
  const albumCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(DISTINCT album) as count FROM tracks');
  const topArtistRow = await db.getFirstAsync<{ artist: string }>(
    'SELECT artist FROM tracks GROUP BY artist ORDER BY SUM(play_count) DESC LIMIT 1'
  );

  return {
    totalSongs: songCount?.count || 0,
    totalArtists: artistCount?.count || 0,
    totalAlbums: albumCount?.count || 0,
    topArtist: topArtistRow?.artist || 'Unknown Artist',
  };
}

function mapRowToTrack(row: any): Track {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    album: row.album,
    albumId: row.album_id || undefined,
    artistId: row.artist_id || undefined,
    uri: row.uri,
    artwork: row.artwork || undefined,
    duration: Number(row.duration) || 0,
    genre: row.genre || undefined,
    year: row.year ? Number(row.year) : undefined,
    isFavorite: Number(row.is_favorite) === 1,
    playCount: Number(row.play_count) || 0,
    lastPlayedAt: row.last_played_at ? Number(row.last_played_at) : undefined,
    lyrics: row.lyrics || undefined,
    dominantColor: row.dominant_color || '#7952FC',
    secondaryColor: row.secondary_color || '#00D2FF',
    energy: Number(row.energy) || 0.5,
    tempo: Number(row.tempo) || 120,
    moodVibe: row.mood_vibe || undefined,
  };
}
