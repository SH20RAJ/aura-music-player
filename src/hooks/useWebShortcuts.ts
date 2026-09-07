import { useEffect } from 'react';
import { Platform } from 'react-native';
import { usePlayerStore } from '../features/player/player-store';

export function useWebShortcuts() {
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const next = usePlayerStore((state) => state.next);
  const previous = usePlayerStore((state) => state.previous);
  const seek = usePlayerStore((state) => state.seek);
  const position = usePlayerStore((state) => state.position);
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const cyclePlayerView = usePlayerStore((state) => state.cyclePlayerView);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const toggleFavorite = usePlayerStore((state) => state.toggleFavorite);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in an input
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, position - 5));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(position + 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyL':
          cyclePlayerView();
          break;
        case 'KeyN':
          next();
          break;
        case 'KeyP':
          previous();
          break;
        case 'KeyF':
          if (currentTrack) toggleFavorite(currentTrack.id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, volume, currentTrack?.id]);
}
