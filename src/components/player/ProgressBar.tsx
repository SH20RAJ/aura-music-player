import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { usePlayerStore } from '../../features/player/player-store';
import { useHaptics } from '../../hooks/useHaptics';

interface ProgressBarProps {
  accentColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ accentColor = '#7952FC' }) => {
  const position = usePlayerStore((state) => state.position);
  const duration = usePlayerStore((state) => state.duration);
  const seek = usePlayerStore((state) => state.seek);
  const haptics = useHaptics();

  const [barWidth, setBarWidth] = useState(1);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);

  const activePos = isScrubbing ? scrubPosition : position;
  const progressPercent = duration > 0 ? Math.min(1, Math.max(0, activePos / duration)) : 0;

  const handleLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsScrubbing(true);
        haptics.selection();
        const locationX = evt.nativeEvent.locationX;
        const newPct = Math.min(1, Math.max(0, locationX / barWidth));
        setScrubPosition(newPct * duration);
      },
      onPanResponderMove: (evt) => {
        const locationX = evt.nativeEvent.locationX;
        const newPct = Math.min(1, Math.max(0, locationX / barWidth));
        setScrubPosition(newPct * duration);
      },
      onPanResponderRelease: async () => {
        setIsScrubbing(false);
        haptics.medium();
        await seek(scrubPosition);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Track Bar with scrub touch target */}
      <View
        style={styles.touchArea}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View style={styles.trackBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercent * 100}%`,
                backgroundColor: accentColor,
              },
            ]}
          />
        </View>

        {/* Scrubber Knob */}
        <View
          style={[
            styles.knob,
            {
              left: `${progressPercent * 100}%`,
              backgroundColor: '#FFFFFF',
              borderColor: accentColor,
              transform: [{ scale: isScrubbing ? 1.4 : 1 }],
            },
          ]}
        />
      </View>

      {/* Timestamps */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(activePos)}</Text>
        <Text style={styles.timeText}>
          {duration > 0 ? `-${formatTime(Math.max(0, duration - activePos))}` : '0:00'}
        </Text>
      </View>
    </View>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 4,
    marginVertical: 12,
  },
  touchArea: {
    height: 36,
    justifyContent: 'center',
  },
  trackBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  knob: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    marginLeft: -7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  timeText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});
