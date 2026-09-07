import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius } from '../../constants/theme';
import { Track } from '../../types/track';
import { usePlayerStore } from '../../features/player/player-store';
import { useHaptics } from '../../hooks/useHaptics';

interface SongActionSheetProps {
  visible: boolean;
  track: Track | null;
  onClose: () => void;
  onAddToPlaylist?: () => void;
}

export const SongActionSheet: React.FC<SongActionSheetProps> = ({
  visible,
  track,
  onClose,
  onAddToPlaylist,
}) => {
  const router = useRouter();
  const toggleFavorite = usePlayerStore((state) => state.toggleFavorite);
  const playNext = usePlayerStore((state) => state.playNext);
  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const haptics = useHaptics();

  if (!track) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Listening to "${track.title}" by ${track.artist} on AURA 🎧`,
      });
    } catch {}
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              {/* Track Header */}
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>
                  {track.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {track.artist} • {track.album}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Actions */}
              <ActionItem
                icon="list"
                label="Add to Playlist"
                onPress={() => {
                  haptics.selection();
                  onClose();
                  onAddToPlaylist?.();
                }}
              />

              <ActionItem
                icon={track.isFavorite ? 'heart' : 'heart-outline'}
                label={track.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                iconColor={track.isFavorite ? Colors.danger : undefined}
                onPress={async () => {
                  haptics.selection();
                  await toggleFavorite(track.id);
                  onClose();
                }}
              />

              <ActionItem
                icon="arrow-redo-outline"
                label="Play Next"
                onPress={() => {
                  haptics.selection();
                  playNext(track);
                  onClose();
                }}
              />

              <ActionItem
                icon="layers-outline"
                label="Add to Queue"
                onPress={() => {
                  haptics.selection();
                  addToQueue(track);
                  onClose();
                }}
              />

              <ActionItem
                icon="share-outline"
                label="Share"
                onPress={handleShare}
              />

              <ActionItem
                icon="person-outline"
                label={`View Artist: ${track.artist}`}
                onPress={() => {
                  haptics.selection();
                  onClose();
                  router.push(`/artist/${encodeURIComponent(track.artist)}` as any);
                }}
              />

              <ActionItem
                icon="disc-outline"
                label={`View Album: ${track.album}`}
                onPress={() => {
                  haptics.selection();
                  onClose();
                  router.push(`/album/${encodeURIComponent(track.album)}` as any);
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

interface ActionItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  iconColor?: string;
  onPress: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon, label, iconColor, onPress }) => (
  <TouchableOpacity style={styles.actionRow} activeOpacity={0.7} onPress={onPress}>
    <Ionicons name={icon} size={22} color={iconColor || Colors.text} style={styles.actionIcon} />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#16161D',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: 12,
    paddingBottom: 36,
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
    marginBottom: 16,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  artist: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  actionIcon: {
    marginRight: 16,
    width: 24,
  },
  actionLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
