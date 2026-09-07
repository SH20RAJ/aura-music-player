import { useMemo } from 'react';
import { usePlayerStore } from '../features/player/player-store';
import { PalettePresets } from '../constants/theme';

export function useAtmosphereColor() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  const colors = useMemo(() => {
    if (!currentTrack) {
      return {
        dominant: '#7952FC',
        glow: 'rgba(121, 82, 252, 0.35)',
        secondary: '#00D2FF',
        gradient: ['#120C24', '#08080B'] as [string, string],
      };
    }

    const dominant = currentTrack.dominantColor || '#7952FC';
    const secondary = currentTrack.secondaryColor || '#00D2FF';

    // Map common color shades to rich dark atmospheres
    let glow = 'rgba(121, 82, 252, 0.4)';
    let bgDeep = '#08080B';

    if (dominant.startsWith('#')) {
      // Calculate rgb components
      const hex = dominant.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 121;
      const g = parseInt(hex.substring(2, 4), 16) || 82;
      const b = parseInt(hex.substring(4, 6), 16) || 252;

      glow = `rgba(${r}, ${g}, ${b}, 0.38)`;
      bgDeep = `rgba(${Math.round(r * 0.12)}, ${Math.round(g * 0.12)}, ${Math.round(b * 0.12)}, 1)`;
    }

    return {
      dominant,
      glow,
      secondary,
      gradient: [bgDeep, '#08080B'] as [string, string],
    };
  }, [currentTrack?.dominantColor, currentTrack?.secondaryColor, currentTrack?.id]);

  return colors;
}
