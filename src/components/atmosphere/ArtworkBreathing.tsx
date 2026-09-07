import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Colors, BorderRadius } from '../../constants/theme';
import { usePlayerStore } from '../../features/player/player-store';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = Math.min(width * 0.82, 340);

interface ArtworkBreathingProps {
  uri?: string;
  glowColor?: string;
}

export const ArtworkBreathing: React.FC<ArtworkBreathingProps> = ({ uri, glowColor = '#7952FC' }) => {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const breathAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.35)).current;
  const animLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isPlaying) {
      animLoop.current = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(breathAnim, {
              toValue: 1.035,
              duration: 2800,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(glowAnim, {
              toValue: 0.65,
              duration: 2800,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]),
          Animated.parallel([
            Animated.timing(breathAnim, {
              toValue: 1.0,
              duration: 2800,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(glowAnim, {
              toValue: 0.35,
              duration: 2800,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]),
        ])
      );
      animLoop.current.start();
    } else {
      if (animLoop.current) {
        animLoop.current.stop();
      }
      Animated.parallel([
        Animated.spring(breathAnim, {
          toValue: 1.0,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(glowAnim, {
          toValue: 0.25,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }

    return () => {
      if (animLoop.current) animLoop.current.stop();
    };
  }, [isPlaying]);

  return (
    <View style={styles.wrapper}>
      {/* Dynamic breathing back-glow */}
      <Animated.View
        style={[
          styles.glowBackdrop,
          {
            backgroundColor: glowColor,
            opacity: glowAnim,
            transform: [{ scale: breathAnim }],
          },
        ]}
      />

      {/* Main Album Artwork */}
      <Animated.View
        style={[
          styles.artworkContainer,
          {
            transform: [{ scale: breathAnim }],
          },
        ]}
      >
        <Image
          source={
            uri
              ? { uri }
              : require('../../../assets/images/icon.png')
          }
          style={styles.image}
          contentFit="cover"
          transition={400}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  glowBackdrop: {
    position: 'absolute',
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: BorderRadius.xl,
    filter: 'blur(32px)',
  } as any,
  artworkContainer: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.65,
    shadowRadius: 28,
    elevation: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
