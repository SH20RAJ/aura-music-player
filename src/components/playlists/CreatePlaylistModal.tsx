import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius } from '../../constants/theme';
import { useLibraryStore } from '../../features/library/library-store';
import { useHaptics } from '../../hooks/useHaptics';

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (playlistId: string) => void;
}

const GRADIENT_PALETTES: [string, string][] = [
  ['#7928CA', '#FF0080'], // Violet / Pink
  ['#007CF0', '#00DFD8'], // Blue / Cyan
  ['#7928CA', '#4338CA'], // Deep Indigo
  ['#F59E0B', '#EF4444'], // Sunrise Amber
  ['#10B981', '#064E3B'], // Emerald
  ['#EC4899', '#8B5CF6'], // Rose / Purple
];

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [selectedGradient, setSelectedGradient] = useState<[string, string]>(GRADIENT_PALETTES[0]);
  const [coverType, setCoverType] = useState<'gradient' | 'artwork' | 'custom'>('gradient');
  const createPlaylist = useLibraryStore((state) => state.createPlaylist);
  const haptics = useHaptics();

  const handleCreate = async () => {
    if (!name.trim()) return;
    haptics.medium();
    const created = await createPlaylist(name.trim(), '', selectedGradient, coverType as any);
    setName('');
    onClose();
    onCreated?.(created.id);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <Text style={styles.eyebrow}>CREATE YOUR AURA</Text>
              <Text style={styles.title}>Name your playlist</Text>

              {/* Dynamic Gradient Cover Preview */}
              <View style={styles.previewContainer}>
                <LinearGradient
                  colors={selectedGradient}
                  style={styles.coverPreview}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.previewName} numberOfLines={2}>
                    {name.trim() || 'Midnight Thoughts'}
                  </Text>
                  <Text style={styles.previewTag}>AURA MIX</Text>
                </LinearGradient>
              </View>

              {/* Name Input */}
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Midnight Thoughts, Highway Rush..."
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                autoFocus
              />

              {/* Choose Cover Color */}
              <Text style={styles.sectionLabel}>CHOOSE ATMOSPHERE</Text>
              <View style={styles.paletteRow}>
                {GRADIENT_PALETTES.map((palette, idx) => {
                  const isSelected =
                    selectedGradient[0] === palette[0] && selectedGradient[1] === palette[1];

                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.8}
                      onPress={() => {
                        haptics.selection();
                        setSelectedGradient(palette);
                        setCoverType('gradient');
                      }}
                      style={[
                        styles.paletteCircleWrapper,
                        isSelected && { borderColor: '#FFFFFF', borderWidth: 2 },
                      ]}
                    >
                      <LinearGradient
                        colors={palette}
                        style={styles.paletteCircle}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Submit CTA */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCreate}
                disabled={!name.trim()}
                style={[
                  styles.createBtn,
                  {
                    backgroundColor: name.trim() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                  },
                ]}
              >
                <Text style={[styles.createBtnText, { color: name.trim() ? '#08080B' : Colors.textMuted }]}>
                  CREATE
                </Text>
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
    paddingHorizontal: 24,
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
  eyebrow: {
    color: '#00D2FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverPreview: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  previewTag: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  paletteCircleWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 2,
    borderColor: 'transparent',
  },
  paletteCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  createBtn: {
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
