import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors, BorderRadius } from '../../constants/theme';
import { usePlayerStore } from '../../features/player/player-store';
import { useHaptics } from '../../hooks/useHaptics';

const { width } = Dimensions.get('window');
const LYRICS_SIZE = Math.min(width * 0.82, 340);

interface ParsedLyric {
  time: number;
  text: string;
}

interface LyricsViewProps {
  lyrics?: string;
  accentColor?: string;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  lyrics,
  accentColor = '#7952FC',
}) => {
  const position = usePlayerStore((state) => state.position);
  const seek = usePlayerStore((state) => state.seek);
  const haptics = useHaptics();
  const scrollViewRef = useRef<ScrollView>(null);

  // Parse LRC format or plain lines
  const parsedLyrics = useMemo<ParsedLyric[]>(() => {
    if (!lyrics) return [];

    const lines = lyrics.split('\n');
    const result: ParsedLyric[] = [];

    lines.forEach((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (match) {
        const mins = parseInt(match[1], 10);
        const secs = parseInt(match[2], 10);
        const ms = parseFloat('0.' + match[3]);
        const time = mins * 60 + secs + ms;
        const text = match[4].trim();
        if (text) {
          result.push({ time, text });
        }
      } else if (line.trim()) {
        result.push({ time: -1, text: line.trim() });
      }
    });

    return result;
  }, [lyrics]);

  // Determine current active line
  const activeIndex = useMemo(() => {
    if (parsedLyrics.length === 0 || parsedLyrics[0].time === -1) return -1;
    for (let i = parsedLyrics.length - 1; i >= 0; i--) {
      if (position >= parsedLyrics[i].time) {
        return i;
      }
    }
    return 0;
  }, [position, parsedLyrics]);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeIndex >= 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: Math.max(0, activeIndex * 46 - 80),
        animated: true,
      });
    }
  }, [activeIndex]);

  if (!lyrics || parsedLyrics.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Lyrics Unavailable</Text>
        <Text style={styles.emptySubtitle}>Immerse yourself in the sound</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { borderColor: accentColor + '30' }]}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {parsedLyrics.map((line, idx) => {
            const isActive = idx === activeIndex;

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => {
                  if (line.time >= 0) {
                    haptics.selection();
                    seek(line.time);
                  }
                }}
                style={styles.lineTouch}
              >
                <Text
                  style={[
                    styles.lyricLine,
                    isActive && [
                      styles.activeLyricLine,
                      { color: '#FFFFFF', textShadowColor: accentColor, textShadowRadius: 12 },
                    ],
                  ]}
                >
                  {line.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  container: {
    width: LYRICS_SIZE,
    height: LYRICS_SIZE,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(18, 18, 23, 0.85)',
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: 12,
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  lineTouch: {
    paddingVertical: 10,
  },
  lyricLine: {
    color: 'rgba(247, 247, 250, 0.45)',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    textAlign: 'center',
  },
  activeLyricLine: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },
  emptyContainer: {
    width: LYRICS_SIZE,
    height: LYRICS_SIZE,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(18, 18, 23, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
