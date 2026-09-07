import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../constants/theme';
import { sleepTimer } from '../../features/player/sleep-timer';
import { useHaptics } from '../../hooks/useHaptics';

interface SleepTimerModalProps {
  visible: boolean;
  onClose: () => void;
  accentColor?: string;
}

const PRESETS = [
  { label: '15 Minutes', minutes: 15 },
  { label: '30 Minutes', minutes: 30 },
  { label: '45 Minutes', minutes: 45 },
  { label: '1 Hour', minutes: 60 },
];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  visible,
  onClose,
  accentColor = '#7952FC',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const haptics = useHaptics();

  useEffect(() => {
    const unsubscribe = sleepTimer.onTick((remaining, active) => {
      setSecondsRemaining(remaining);
      setIsActive(active);
    });
    return unsubscribe;
  }, []);

  const handleSelectPreset = (mins: number) => {
    haptics.medium();
    sleepTimer.startTimer(mins);
    onClose();
  };

  const handleEndOfTrack = () => {
    haptics.medium();
    sleepTimer.startEndOfTrackTimer();
    onClose();
  };

  const handleCancel = () => {
    haptics.light();
    sleepTimer.cancelTimer();
    onClose();
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons name="moon" size={22} color="#00D2FF" />
                </View>
                <View>
                  <Text style={styles.title}>Sleep Timer</Text>
                  <Text style={styles.subtitle}>Gently fades audio to stillness</Text>
                </View>
              </View>

              {/* Active Timer Status */}
              {isActive && (
                <View style={[styles.activeCard, { borderColor: accentColor }]}>
                  <View>
                    <Text style={styles.activeLabel}>TIMER RUNNING</Text>
                    <Text style={styles.countdownText}>{formatCountdown(secondsRemaining)}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} onPress={handleCancel} style={styles.stopBtn}>
                    <Text style={styles.stopBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Presets */}
              <View style={styles.presetList}>
                {PRESETS.map((p) => (
                  <TouchableOpacity
                    key={p.minutes}
                    activeOpacity={0.75}
                    onPress={() => handleSelectPreset(p.minutes)}
                    style={styles.presetItem}
                  >
                    <Text style={styles.presetText}>{p.label}</Text>
                    <Ionicons name="timer-outline" size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                ))}

                {/* End of Track Option */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={handleEndOfTrack}
                  style={[styles.presetItem, styles.endOfTrackItem]}
                >
                  <Text style={[styles.presetText, { color: '#00D2FF', fontWeight: '700' }]}>
                    End of Current Track
                  </Text>
                  <Ionicons name="play-skip-forward-outline" size={18} color="#00D2FF" />
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
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
  activeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 16,
  },
  activeLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  stopBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  stopBtnText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  presetList: {
    gap: 8,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
  },
  endOfTrackItem: {
    backgroundColor: 'rgba(0, 210, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.25)',
  },
  presetText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
