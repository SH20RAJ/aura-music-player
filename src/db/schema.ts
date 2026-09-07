export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS tracks (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT NOT NULL,
  album_id TEXT,
  artist_id TEXT,
  uri TEXT NOT NULL,
  artwork TEXT,
  duration REAL NOT NULL DEFAULT 0,
  genre TEXT,
  year INTEGER,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  play_count INTEGER NOT NULL DEFAULT 0,
  last_played_at INTEGER,
  lyrics TEXT,
  dominant_color TEXT,
  secondary_color TEXT,
  energy REAL DEFAULT 0.5,
  tempo REAL DEFAULT 120,
  mood_vibe TEXT
);

CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  artwork TEXT,
  year INTEGER,
  track_count INTEGER DEFAULT 0,
  dominant_color TEXT
);

CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  track_count INTEGER DEFAULT 0,
  album_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS playlists (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_type TEXT DEFAULT 'gradient',
  gradient_color_1 TEXT DEFAULT '#7952FC',
  gradient_color_2 TEXT DEFAULT '#00D2FF',
  custom_cover_uri TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS playlist_tracks (
  id TEXT PRIMARY KEY NOT NULL,
  playlist_id TEXT NOT NULL,
  track_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  added_at INTEGER NOT NULL,
  FOREIGN KEY (playlist_id) REFERENCES playlists (id) ON DELETE CASCADE,
  FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS play_history (
  id TEXT PRIMARY KEY NOT NULL,
  track_id TEXT NOT NULL,
  played_at INTEGER NOT NULL,
  completion_rate REAL DEFAULT 1.0,
  FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist);
CREATE INDEX IF NOT EXISTS idx_tracks_album ON tracks(album);
CREATE INDEX IF NOT EXISTS idx_tracks_favorite ON tracks(is_favorite);
CREATE INDEX IF NOT EXISTS idx_tracks_last_played ON tracks(last_played_at);
CREATE INDEX IF NOT EXISTS idx_history_played_at ON play_history(played_at);
`;
