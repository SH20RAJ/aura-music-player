import { create } from 'zustand';
import { Track, Album, Artist, Playlist } from '../../types/track';
import {
  initDatabase,
  getAllTracks,
  insertTracks,
  getAllPlaylists,
  createPlaylist as dbCreatePlaylist,
  addTrackToPlaylist as dbAddTrackToPlaylist,
  deletePlaylist as dbDeletePlaylist,
  getFavoriteTracks,
  getRecentlyPlayedTracks,
  getPlaylistTracks,
} from '../../db/database';
import { DEMO_TRACKS } from './demo-catalog';
import { scanDeviceAudio } from './scanner';

interface LibraryState {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  favorites: Track[];
  recentlyPlayed: Track[];
  isLoading: boolean;
  hasLoaded: boolean;

  // Actions
  initialize: () => Promise<void>;
  importDemoMusic: () => Promise<void>;
  scanDevice: () => Promise<number>;
  createPlaylist: (
    name: string,
    description?: string,
    colors?: [string, string],
    coverType?: 'gradient' | 'artwork'
  ) => Promise<Playlist>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  getPlaylistTracks: (playlistId: string) => Promise<Track[]>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  refreshRecentlyPlayed: () => Promise<void>;
  search: (query: string) => {
    tracks: Track[];
    artists: Artist[];
    albums: Album[];
  };
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  tracks: [],
  albums: [],
  artists: [],
  playlists: [],
  favorites: [],
  recentlyPlayed: [],
  isLoading: true,
  hasLoaded: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      await initDatabase();
      let tracks = await getAllTracks();

      // If empty, preload demo tracks for instant out-of-the-box delight
      if (tracks.length === 0) {
        await insertTracks(DEMO_TRACKS);
        tracks = DEMO_TRACKS;
      }

      const playlists = await getAllPlaylists();
      const favorites = await getFavoriteTracks();
      const recentlyPlayed = await getRecentlyPlayedTracks();

      // Extract albums and artists
      const { albums, artists } = deriveAlbumsAndArtists(tracks);

      set({
        tracks,
        albums,
        artists,
        playlists,
        favorites,
        recentlyPlayed,
        isLoading: false,
        hasLoaded: true,
      });
    } catch (err) {
      console.warn('Library initialization failed:', err);
      // Fallback to demo tracks
      const { albums, artists } = deriveAlbumsAndArtists(DEMO_TRACKS);
      set({
        tracks: DEMO_TRACKS,
        albums,
        artists,
        isLoading: false,
        hasLoaded: true,
      });
    }
  },

  importDemoMusic: async () => {
    set({ isLoading: true });
    await insertTracks(DEMO_TRACKS);
    const tracks = await getAllTracks();
    const { albums, artists } = deriveAlbumsAndArtists(tracks);
    set({ tracks, albums, artists, isLoading: false });
  },

  scanDevice: async () => {
    set({ isLoading: true });
    try {
      const result = await scanDeviceAudio();
      const allTracks = await getAllTracks();
      const { albums, artists } = deriveAlbumsAndArtists(allTracks);
      set({ tracks: allTracks, albums, artists, isLoading: false });
      return result.tracks.length;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  createPlaylist: async (name, description, colors = ['#7952FC', '#00D2FF'], coverType = 'gradient') => {
    const newPlaylist: Omit<Playlist, 'trackCount' | 'duration'> = {
      id: `pl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      description,
      coverType,
      gradientColors: colors,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const created = await dbCreatePlaylist(newPlaylist);
    const playlists = await getAllPlaylists();
    set({ playlists });
    return created;
  },

  addTrackToPlaylist: async (playlistId: string, trackId: string) => {
    await dbAddTrackToPlaylist(playlistId, trackId);
    const playlists = await getAllPlaylists();
    set({ playlists });
  },

  getPlaylistTracks: async (playlistId: string) => {
    return await getPlaylistTracks(playlistId);
  },

  deletePlaylist: async (playlistId: string) => {
    await dbDeletePlaylist(playlistId);
    const playlists = await getAllPlaylists();
    set({ playlists });
  },

  refreshFavorites: async () => {
    const favorites = await getFavoriteTracks();
    set({ favorites });
  },

  refreshRecentlyPlayed: async () => {
    const recentlyPlayed = await getRecentlyPlayedTracks();
    set({ recentlyPlayed });
  },

  search: (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { tracks: [], artists: [], albums: [] };
    }

    const { tracks, artists, albums } = get();

    const matchedTracks = tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        (t.genre && t.genre.toLowerCase().includes(q))
    );

    const matchedArtists = artists.filter((a) =>
      a.name.toLowerCase().includes(q)
    );

    const matchedAlbums = albums.filter(
      (alb) =>
        alb.title.toLowerCase().includes(q) ||
        alb.artist.toLowerCase().includes(q)
    );

    return {
      tracks: matchedTracks,
      artists: matchedArtists,
      albums: matchedAlbums,
    };
  },
}));

function deriveAlbumsAndArtists(tracks: Track[]): { albums: Album[]; artists: Artist[] } {
  const albumMap = new Map<string, Album>();
  const artistMap = new Map<string, Artist>();

  tracks.forEach((t) => {
    // Album
    const albKey = t.album || 'Unknown Album';
    if (!albumMap.has(albKey)) {
      albumMap.set(albKey, {
        id: t.albumId || `alb_${albKey}`,
        title: albKey,
        artist: t.artist,
        artwork: t.artwork,
        year: t.year,
        trackCount: 1,
        dominantColor: t.dominantColor || '#7952FC',
      });
    } else {
      const existing = albumMap.get(albKey)!;
      existing.trackCount++;
      if (!existing.artwork && t.artwork) {
        existing.artwork = t.artwork;
      }
    }

    // Artist
    const artKey = t.artist || 'Unknown Artist';
    if (!artistMap.has(artKey)) {
      artistMap.set(artKey, {
        id: t.artistId || `art_${artKey}`,
        name: artKey,
        avatar: t.artwork,
        trackCount: 1,
        albumCount: 1,
      });
    } else {
      const existing = artistMap.get(artKey)!;
      existing.trackCount++;
    }
  });

  return {
    albums: Array.from(albumMap.values()),
    artists: Array.from(artistMap.values()),
  };
}
