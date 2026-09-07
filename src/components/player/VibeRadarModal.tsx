import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../constants/theme';
import { VibeRadarEngine, VibePoint } from '../../features/recommendations/vibe-radar';
import { useLibraryStore } from '../../features/library/library-store';
import { usePlayerStore } from '../../features/player/player-store';
import { useHaptics } from '../../hooks/useHaptics';

const { width } = Dimensions.get('window');
const RADAR_SIZE = Math.min(width - 56, 320);

interface VibeRadarModalProps {
  visible: boolean;
  onClose: () => void;
  accentColor?: string;
}

export const VibeRadarModal: React.FC<VibeRadarModalProps> = ({
  visible,
  onClose,
  accentColor = '#7952FC',
}) => {
  const [point, setPoint] = useState<VibePoint>({ x: 0.1, y: -0.4 });
  const tracks = useLibraryStore((state) => state.tracks);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const haptics = useHaptics();

  const vibeInfo = VibeRadarEngine.getVibeDescription(point);

  // Convert -1..1 coordinates to pixels
  const orbPixelX = ((point.x + 1) / 2) * RADAR_SIZE;
  const orbPixelY = ((1 - point.y) / 2) * RADAR_SIZE;

  const updateCoordinates = (locX: number, locY: number) => {
    const clampedX = Math.max(0, Math.min(RADAR_SIZE, locX));
    const clampedY = Math.max(0, Math.min(RADAR_SIZE, locY));

    const newX = (clampedX / RADAR_SIZE) * 2 - 1;
    const newY = 1 - (clampedY / RADAR_SIZE) * 2;

    setPoint({ x: newX, y: newY });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        haptics.selection();
        updateCoordinates(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderMove: (evt) => {
        updateCoordinates(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderRelease: () => {
        haptics.medium();
      },
    })
  ).current;

  const handleApplyVibe = async () => {
    haptics.medium();
    const matched = VibeRadarEngine.matchTracks(point, tracks);
    if (matched.length > 0) {
      await setQueue(matched, 0, true);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <View style={[styles.iconCircle, { backgroundColor: accentColor + '20' }]}>
                  <Ionicons name="compass" size={24} color={accentColor} />
                </View>
                <View>
                  <Text style={styles.title}>Vibe Radar</Text>
                  <Text style={styles.subtitle}>Drag anywhere to steer your atmosphere</Text>
                </View>
              </View>

              {/* 2D Interactive Radar Canvas */}
              <View style={styles.radarWrapper}>
                <View style={styles.radarCanvas} {...panResponder.panHandlers}>
                  {/* Axis Crosshairs */}
                  <View style={styles.crosshairH} />
                  <View style={styles.crosshairV} />

                  {/* Concentric rings */}
                  <View style={[styles.ring, { width: RADAR_SIZE * 0.75, height: RADAR_SIZE * 0.75 }]} />
                  <View style={[styles.ring, { width: RADAR_SIZE * 0.45, height: RADAR_SIZE * 0.45 }]} />

                  {/* Corner Quadrant Labels */}
                  <Text style={[styles.quadrantLabel, { top: 10, left: 12 }]}>☀️ Focus</Text>
                  <Text style={[styles.quadrantLabel, { top: 10, right: 12 }]}>⚡ Energy</Text>
                  <Text style={[styles.quadrantLabel, { bottom: 10, left: 12 }]}>🌙 Late Night</Text>
                  <Text style={[styles.quadrantLabel, { bottom: 10, right: 12 }]}>🚗 Drive</Text>

                  {/* Glowing Radar Orb */}
                  <View
                    style={[
                      styles.orb,
                      {
                        left: orbPixelX - 18,
                        top: orbPixelY - 18,
                        backgroundColor: '#FFFFFF',
                        shadowColor: accentColor,
                      },
                    ]}
                  >
                    <View style={[styles.orbInner, { backgroundColor: accentColor }]} />
                  </View>
                </View>
              </View>

              {/* Live Vibe Card */}
              <View style={styles.vibeResultCard}>
                <View>
                  <Text style={styles.vibeEyebrow}>DETECTED ATMOSPHERE</Text>
                  <Text style={styles.vibeTitle}>{vibeInfo.label}</Text>
                </View>
                <View style={[styles.vibeBadge, { backgroundColor: accentColor + '25', borderColor: accentColor }]}>
                  <Text style={[styles.vibeBadgeText, { color: accentColor }]}>{vibeInfo.vibeBadge}</Text>
                </View>
              </View>

              {/* Start Vibe Flow CTA */}
              <TouchableOpacity activeOpacity={0.85} onPress={handleApplyVibe} style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Start Vibe Flow ▶</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#14141B',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  radarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  radarCanvas: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(18, 18, 23, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairH: {
    position: 'absolute',
    top: RADAR_SIZE / 2,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  crosshairV: {
    position: 'absolute',
    left: RADAR_SIZE / 2,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  quadrantLabel: {
    position: 'absolute',
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  orb: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  orbInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  vibeResultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  vibeEyebrow: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  vibeTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  vibeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  vibeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  applyBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#08080B',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
