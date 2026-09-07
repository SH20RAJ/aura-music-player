import { Track, Album, Artist } from '../../types/track';

export async function requestMediaPermissions(): Promise<boolean> {
  return true;
}

export async function scanDeviceAudio(): Promise<{
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
}> {
  // On web, device local filesystem indexing via media-library is unavailable
  return { tracks: [], albums: [], artists: [] };
}
