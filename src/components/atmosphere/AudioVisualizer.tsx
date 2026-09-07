import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { Colors, BorderRadius } from '../../constants/theme';
import { usePlayerStore } from '../../features/player/player-store';

const { width } = Dimensions.get('window');
const VISUALIZER_SIZE = Math.min(width * 0.82, 340);
const NUM_BARS = 24;

interface AudioVisualizerProps {
  color?: string;
  secondaryColor?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  color = '#7952FC',
  secondaryColor = '#00D2FF',
}) => {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const barAnims = useRef<Animated.Value[]>(
    Array.from({ length: NUM_BARS }, () => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    let isCancelled = false;

    const animateBars = () => {
      if (!isPlaying || isCancelled) return;

      const animations = barAnims.map((anim, i) => {
        // Organic pseudo-EQ curve: middle bars have higher variance
        const centerFactor = 1 - Math.abs(i - NUM_BARS / 2) / (NUM_BARS / 2);
        const randomTarget = Math.random() * 0.75 * (0.4 + centerFactor * 0.6) + 0.15;
        const randomDuration = 140 + Math.random() * 180;

        return Animated.sequence([
          Animated.timing(anim, {
            toValue: randomTarget,
            duration: randomDuration,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: Math.max(0.12, randomTarget * 0.4),
            duration: randomDuration,
            useNativeDriver: false,
          }),
        ]);
      });

      Animated.parallel(animations).start(() => {
        if (!isCancelled && isPlaying) {
          animateBars();
        }
      });
    };

    if (isPlaying) {
      animateBars();
    } else {
      barAnims.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 0.15,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      <View style={[styles.card, { borderColor: color + '40' }]}>
        <View style={styles.barsRow}>
          {barAnims.map((anim, idx) => {
            const barHeight = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [12, VISUALIZER_SIZE * 0.68],
            });

            // Alternate colors across frequency spectrum
            const barColor = idx % 2 === 0 ? color : secondaryColor;

            return (
              <Animated.View
                key={idx}
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: barColor,
                    shadowColor: barColor,
                    shadowOpacity: 0.8,
                    shadowRadius: 6,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  card: {
    width: VISUALIZER_SIZE,
    height: VISUALIZER_SIZE,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(18, 18, 23, 0.8)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: VISUALIZER_SIZE * 0.75,
    width: '90%',
    gap: 4,
  },
  bar: {
    width: 6,
    borderRadius: 3,
  },
});
