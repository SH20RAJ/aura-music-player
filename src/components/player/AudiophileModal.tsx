import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../constants/theme';
import { SOUND_PROFILES, SoundProfile } from '../../types/audiophile';
import { usePlayerStore } from '../../features/player/player-store';
import { useHaptics } from '../../hooks/useHaptics';

interface AudiophileModalProps {
  visible: boolean;
  onClose: () => void;
  accentColor?: string;
}

const SPEED_OPTIONS = [0.5, 0.8, 1.0, 1.2, 1.5, 2.0];

export const AudiophileModal: React.FC<AudiophileModalProps> = ({
  visible,
  onClose,
  accentColor = '#7952FC',
}) => {
  const playbackRate = usePlayerStore((state) => state.playbackRate);
  const soundProfile = usePlayerStore((state) => state.soundProfile);
  const setPlaybackRate = usePlayerStore((state) => state.setPlaybackRate);
  const setSoundProfile = usePlayerStore((state) => state.setSoundProfile);
  const haptics = useHaptics();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <View style={[styles.iconCircle, { backgroundColor: accentColor + '20' }]}>
                  <Ionicons name="hardware-chip" size={22} color={accentColor} />
                </View>
                <View>
                  <Text style={styles.title}>Audiophile Lab</Text>
                  <Text style={styles.subtitle}>Speed calibration & sound profiles</Text>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Playback Speed Section */}
                <Text style={styles.sectionTitle}>PLAYBACK TEMPO</Text>
                <View style={styles.speedRow}>
                  {SPEED_OPTIONS.map((speed) => {
                    const isSelected = playbackRate === speed;
                    return (
                      <TouchableOpacity
                        key={speed}
                        activeOpacity={0.8}
                        onPress={() => {
                          haptics.selection();
                          setPlaybackRate(speed);
                        }}
                        style={[
                          styles.speedPill,
                          isSelected && [styles.activeSpeedPill, { borderColor: accentColor }],
                        ]}
                      >
                        <Text
                          style={[
                            styles.speedText,
                            isSelected && { color: '#FFFFFF', fontWeight: '800' },
                          ]}
                        >
                          {speed}x
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Sound Profiles / EQ Presets */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>SOUND ATMOSPHERE PROFILES</Text>
                <View style={styles.profilesList}>
                  {SOUND_PROFILES.map((profile) => {
                    const isSelected = soundProfile === profile.id;

                    return (
                      <TouchableOpacity
                        key={profile.id}
                        activeOpacity={0.75}
                        onPress={() => {
                          haptics.medium();
                          setSoundProfile(profile.id as SoundProfile);
                        }}
                        style={[
                          styles.profileCard,
                          isSelected && [
                            styles.activeProfileCard,
                            { borderColor: profile.color },
                          ],
                        ]}
                      >
                        <View style={[styles.profileEmojiCircle, { backgroundColor: profile.color + '20' }]}>
                          <Text style={styles.profileEmoji}>{profile.emoji}</Text>
                        </View>

                        <View style={styles.profileInfo}>
                          <Text
                            style={[
                              styles.profileName,
                              isSelected && { color: profile.color, fontWeight: '800' },
                            ]}
                          >
                            {profile.name}
                          </Text>
                          <Text style={styles.profileDesc}>{profile.description}</Text>
                        </View>

                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={22} color={profile.color} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
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
    maxHeight: '80%',
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
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  speedPill: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeSpeedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
  },
  speedText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  profilesList: {
    gap: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeProfileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileEmojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileEmoji: {
    fontSize: 20,
  },
  profileInfo: {
    flex: 1,
    marginRight: 8,
  },
  profileName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileDesc: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
