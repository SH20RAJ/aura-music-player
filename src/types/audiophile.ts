export type SoundProfile =
  | 'natural'
  | 'bass_boost'
  | 'vocal_clarity'
  | 'electronic'
  | 'acoustic';

export interface SoundProfileMeta {
  id: SoundProfile;
  name: string;
  description: string;
  emoji: string;
  color: string;
}

export const SOUND_PROFILES: SoundProfileMeta[] = [
  {
    id: 'natural',
    name: 'AURA Reference',
    description: 'Flat, transparent studio mastering curve',
    emoji: '🎵',
    color: '#7952FC',
  },
  {
    id: 'bass_boost',
    name: 'Sub-Bass Boost',
    description: 'Deep low-end rumble for late night & synthwave',
    emoji: '🔊',
    color: '#00D2FF',
  },
  {
    id: 'vocal_clarity',
    name: 'Vocal Presence',
    description: 'Crisp mid-range emphasis for soulful ballads',
    emoji: '🎙️',
    color: '#EC4899',
  },
  {
    id: 'electronic',
    name: 'Electronic Pulse',
    description: 'Punchy transients & sharp highs for dance',
    emoji: '⚡',
    color: '#EF4444',
  },
  {
    id: 'acoustic',
    name: 'Acoustic Air',
    description: 'Warm, airy separation for guitars and piano',
    emoji: '☁️',
    color: '#10B981',
  },
];
