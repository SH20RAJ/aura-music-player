import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface MiniWaveformProps {
  color?: string;
  isPlaying?: boolean;
}

export const MiniWaveform: React.FC<MiniWaveformProps> = ({
  color = '#00D2FF',
  isPlaying = true,
}) => {
  const bar1 = useRef(new Animated.Value(4)).current;
  const bar2 = useRef(new Animated.Value(12)).current;
  const bar3 = useRef(new Animated.Value(8)).current;
  const bar4 = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    let cancelled = false;

    const animateBar = (anim: Animated.Value, min: number, max: number, dur: number) => {
      if (cancelled || !isPlaying) return;
      Animated.sequence([
        Animated.timing(anim, { toValue: max, duration: dur, useNativeDriver: false }),
        Animated.timing(anim, { toValue: min, duration: dur, useNativeDriver: false }),
      ]).start(() => {
        if (!cancelled && isPlaying) {
          animateBar(anim, min, max, dur);
        }
      });
    };

    if (isPlaying) {
      animateBar(bar1, 4, 16, 260);
      animateBar(bar2, 6, 20, 340);
      animateBar(bar3, 3, 14, 290);
      animateBar(bar4, 5, 18, 380);
    } else {
      Animated.parallel([
        Animated.timing(bar1, { toValue: 4, duration: 200, useNativeDriver: false }),
        Animated.timing(bar2, { toValue: 4, duration: 200, useNativeDriver: false }),
        Animated.timing(bar3, { toValue: 4, duration: 200, useNativeDriver: false }),
        Animated.timing(bar4, { toValue: 4, duration: 200, useNativeDriver: false }),
      ]).start();
    }

    return () => {
      cancelled = true;
    };
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { height: bar1, backgroundColor: color }]} />
      <Animated.View style={[styles.bar, { height: bar2, backgroundColor: color }]} />
      <Animated.View style={[styles.bar, { height: bar3, backgroundColor: color }]} />
      <Animated.View style={[styles.bar, { height: bar4, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 22,
    gap: 2.5,
    justifyContent: 'center',
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
  },
});
