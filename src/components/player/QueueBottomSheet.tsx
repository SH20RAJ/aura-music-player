import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Colors, BorderRadius } from '../../constants/theme';
import { usePlayerStore } from '../../features/player/player-store';
import { useLibraryStore } from '../../features/library/library-store';
import { AuraEngine } from '../../features/recommendations/aura-engine';
import { useHaptics } from '../../hooks/useHaptics';

const { height } = Dimensions.get('window');

interface QueueBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  accentColor?: string;
}

export const QueueBottomSheet: React.FC<QueueBottomSheetProps> = ({
  visible,
  onClose,
  accentColor = '#7952FC',
}) => {
  const queue = usePlayerStore((state) => state.queue);
  const queueIndex = usePlayerStore((state) => state.queueIndex);
  const isAuraQueue = usePlayerStore((state) => state.isAuraQueue);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue);
  const reorderQueue = usePlayerStore((state) => state.reorderQueue);
  const libraryTracks = useLibraryStore((state) => state.tracks);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const haptics = useHaptics();

  const handleTriggerAura = async () => {
    if (!currentTrack) return;
    haptics.medium();
    const auraSuggestions = AuraEngine.generateAuraContinuation(currentTrack, libraryTracks, 6);
    const updated = [...queue, ...auraSuggestions];
    await setQueue(updated, queueIndex, true);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Header Handle */}
              <View style={styles.handle} />

              {/* Title & Aura Badge */}
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.headerTitle}>UP NEXT</Text>
                  <Text style={styles.headerSubtitle}>
                    {queue.length} {queue.length === 1 ? 'track' : 'tracks'} queued
                  </Text>
                </View>

                {isAuraQueue ? (
                  <View style={[styles.auraBadge, { backgroundColor: accentColor + '25', borderColor: accentColor }]}>
                    <Text style={[styles.auraBadgeText, { color: accentColor }]}>✨ AURA QUEUE</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.auraGenerateBtn, { borderColor: accentColor }]}
                    activeOpacity={0.7}
                    onPress={handleTriggerAura}
                  >
                    <Text style={[styles.auraGenerateText, { color: accentColor }]}>+ ✨ Flow</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Queue List */}
              <ScrollView
                style={styles.queueList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.queueContent}
              >
                {queue.map((track, idx) => {
                  const isCurrent = idx === queueIndex;
                  const formattedNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

                  return (
                    <View
                      key={`${track.id}_${idx}`}
                      style={[
                        styles.queueRow,
                        isCurrent && [styles.currentQueueRow, { borderColor: accentColor + '60' }],
                      ]}
                    >
                      {/* Track Number / Indicator */}
                      <Text
                        style={[
                          styles.trackNumber,
                          isCurrent && { color: accentColor, fontWeight: '800' },
                        ]}
                      >
                        {isCurrent ? '▶' : formattedNum}
                      </Text>

                      {/* Artwork */}
                      <Image
                        source={{ uri: track.artwork || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300' }}
                        style={styles.artwork}
                        contentFit="cover"
                      />

                      {/* Info */}
                      <TouchableOpacity
                        style={styles.infoCol}
                        activeOpacity={0.7}
                        onPress={async () => {
                          haptics.selection();
                          await setQueue(queue, idx, isAuraQueue);
                        }}
                      >
                        <Text
                          style={[
                            styles.trackTitle,
                            isCurrent && { color: accentColor, fontWeight: '700' },
                          ]}
                          numberOfLines={1}
                        >
                          {track.title}
                        </Text>
                        <Text style={styles.trackArtist} numberOfLines={1}>
                          {track.artist}
                        </Text>
                      </TouchableOpacity>

                      {/* Reorder Buttons */}
                      <View style={styles.actionButtons}>
                        {idx > 0 && (
                          <TouchableOpacity
                            style={styles.reorderBtn}
                            onPress={() => {
                              haptics.light();
                              reorderQueue(idx, idx - 1);
                            }}
                          >
                            <Ionicons name="chevron-up" size={18} color={Colors.textMuted} />
                          </TouchableOpacity>
                        )}

                        {idx < queue.length - 1 && (
                          <TouchableOpacity
                            style={styles.reorderBtn}
                            onPress={() => {
                              haptics.light();
                              reorderQueue(idx, idx + 1);
                            }}
                          >
                            <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
                          </TouchableOpacity>
                        )}

                        {/* Remove */}
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => {
                            haptics.light();
                            removeFromQueue(idx);
                          }}
                        >
                          <Ionicons name="close" size={18} color={Colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    height: height * 0.75,
    backgroundColor: '#121217',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  auraBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  auraBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  auraGenerateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  auraGenerateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  queueList: {
    flex: 1,
  },
  queueContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.md,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  currentQueueRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
  },
  trackNumber: {
    width: 24,
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 10,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    marginRight: 8,
  },
  trackTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackArtist: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reorderBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
