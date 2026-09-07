import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Track, Album, Artist } from '../../types/track';
import { insertTracks } from '../../db/database';

export async function requestMediaPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return true;
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch (err) {
    console.warn('Permission request error:', err);
    return false;
  }
}

export async function scanDeviceAudio(): Promise<{
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
}> {
  if (Platform.OS === 'web') {
    return { tracks: [], albums: [], artists: [] };
  }

  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) {
    throw new Error('Media permission not granted');
  }

  const media = await MediaLibrary.getAssetsAsync({
    mediaType: 'audio',
    first: 300,
  });

  const tracks: Track[] = media.assets.map((asset) => {
    // Generate simple deterministic color palette based on filename
    const hash = asset.filename.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const hues = ['#0066FF', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
    const dominantColor = hues[hash % hues.length];

    const cleanTitle = asset.filename.replace(/\.(mp3|m4a|wav|flac|aac|ogg)$/i, '');
    const parts = cleanTitle.split(' - ');
    const artist = parts.length > 1 ? parts[0].trim() : 'Unknown Artist';
    const title = parts.length > 1 ? parts.slice(1).join(' - ').trim() : cleanTitle;

    return {
      id: asset.id,
      title,
      artist,
      album: 'Local Music',
      uri: asset.uri,
      duration: asset.duration || 180,
      isFavorite: false,
      playCount: 0,
      dominantColor,
      secondaryColor: '#FFFFFF',
      energy: 0.5,
      tempo: 120,
      moodVibe: 'chill',
    };
  });

  // Extract unique albums and artists
  const albumMap = new Map<string, Album>();
  const artistMap = new Map<string, Artist>();

  tracks.forEach((t) => {
    // Album
    if (!albumMap.has(t.album)) {
      albumMap.set(t.album, {
        id: `album_${t.album}`,
        title: t.album,
        artist: t.artist,
        trackCount: 1,
        dominantColor: t.dominantColor,
      });
    } else {
      const alb = albumMap.get(t.album)!;
      alb.trackCount++;
    }

    // Artist
    if (!artistMap.has(t.artist)) {
      artistMap.set(t.artist, {
        id: `artist_${t.artist}`,
        name: t.artist,
        trackCount: 1,
        albumCount: 1,
      });
    } else {
      const art = artistMap.get(t.artist)!;
      art.trackCount++;
    }
  });

  // Insert scanned tracks to SQLite
  if (tracks.length > 0) {
    await insertTracks(tracks);
  }

  return {
    tracks,
    albums: Array.from(albumMap.values()),
    artists: Array.from(artistMap.values()),
  };
}
