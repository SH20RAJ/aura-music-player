import { Track } from '../../types/track';

export const DEMO_TRACKS: Track[] = [
  {
    id: 'track_midnight_city',
    title: 'Midnight City Lights',
    artist: 'The Weeknd',
    album: 'After Hours Aura',
    albumId: 'album_after_hours',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    uri: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    duration: 162,
    genre: 'Synthwave',
    year: 2024,
    isFavorite: true,
    playCount: 42,
    dominantColor: '#8B0000', // Burgundy red
    secondaryColor: '#FF4D4D',
    energy: 0.72,
    tempo: 125,
    moodVibe: 'latenight',
    lyrics: `[00:04.00] City streetlights flickering through rain
[00:12.00] In the midnight glow we escape the pain
[00:22.00] Fast cars, slow motion in the haze
[00:32.00] Lost together in a velvet maze
[00:44.00] Neon shadows dancing on the glass
[00:56.00] Hoping that this night will never pass
[01:08.00] Turn the music up until the dawn
[01:20.00] When everything we know is gone
[01:34.00] Midnight rhythm holding steady beat
[01:46.00] Pure vibration under sleepless feet`,
  },
  {
    id: 'track_ocean_breeze',
    title: 'Lost in the Atlantic',
    artist: 'Frank Ocean',
    album: 'Channel Solitude',
    albumId: 'album_channel_solitude',
    artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    uri: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    duration: 185,
    genre: 'R&B / Soul',
    year: 2023,
    isFavorite: true,
    playCount: 38,
    dominantColor: '#0055D4', // Deep Atlantic Blue
    secondaryColor: '#00D2FF',
    energy: 0.45,
    tempo: 84,
    moodVibe: 'feels',
    lyrics: `[00:05.00] Waves crash upon the empty shore
[00:15.00] Whispers of what came before
[00:27.00] Sun sank low below the tide
[00:39.00] Nowhere left for us to hide
[00:52.00] Sweet summer memories softly play
[01:04.00] Drifting further through the bay
[01:18.00] Blue horizons in your eyes
[01:30.00] Underneath the violet skies`,
  },
  {
    id: 'track_neon_drive',
    title: 'Cyber Highway 84',
    artist: 'Kavinsky & Daft Sound',
    album: 'Outrun Dreams',
    albumId: 'album_outrun',
    artwork: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    uri: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77cb7.mp3?filename=electronic-future-beats-117997.mp3',
    duration: 210,
    genre: 'Synth-Pop',
    year: 2024,
    isFavorite: false,
    playCount: 19,
    dominantColor: '#7928CA', // Electric Purple
    secondaryColor: '#FF0080',
    energy: 0.85,
    tempo: 128,
    moodVibe: 'drive',
    lyrics: `[00:08.00] Speedometer climbs past eighty-five
[00:18.00] This is what it means to feel alive
[00:30.00] Tail lights streak the midnight air
[00:42.00] Wind rushing wild through our hair
[00:58.00] Synth bass pumping through the floor
[01:12.00] Pushing engine straight for more
[01:30.00] Gridlines bending toward the sun
[01:45.00] The night has only just begun`,
  },
  {
    id: 'track_deep_focus',
    title: 'Raindrop Sanctuary',
    artist: 'AURA Ambient Flow',
    album: 'Binaural Drift',
    albumId: 'album_binaural',
    artwork: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    uri: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    duration: 195,
    genre: 'Ambient / Lo-Fi',
    year: 2025,
    isFavorite: false,
    playCount: 54,
    dominantColor: '#0D9488', // Emerald teal
    secondaryColor: '#2DD4BF',
    energy: 0.28,
    tempo: 75,
    moodVibe: 'focus',
    lyrics: `[00:10.00] (Instrumental serene raindrops)
[00:30.00] Gentle keystrokes in the afternoon light
[00:50.00] Thoughts arranging calm and bright
[01:20.00] Deep stillness settling within
[01:45.00] Where peaceful journeys softly begin`,
  },
  {
    id: 'track_tum_hi_ho',
    title: 'Tum Hi Aana (Aura Acoustic)',
    artist: 'Arijit Singh',
    album: 'Midnight Acoustic Melodies',
    albumId: 'album_midnight_acoustic',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    uri: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=acoustic-guitars-ambient-uplifting-6353.mp3',
    duration: 220,
    genre: 'Acoustic / Soul',
    year: 2023,
    isFavorite: true,
    playCount: 65,
    dominantColor: '#D97706', // Amber gold
    secondaryColor: '#F59E0B',
    energy: 0.42,
    tempo: 80,
    moodVibe: 'feels',
    lyrics: `[00:12.00] Tere bina zindigi se koi shikwa to nahi
[00:28.00] Shikwa nahi tere bina zindigi bhi lekin
[00:44.00] Zindigi to nahi
[01:05.00] Har pal teri yaad aati hai
[01:25.00] Dil ko chho ke guzar jaati hai
[01:45.00] Tum hi aana jab bhi aana`,
  },
  {
    id: 'track_electro_pulse',
    title: 'Overdrive Hyperbeat',
    artist: 'Skrillex & Fred',
    album: 'Rumble Underground',
    albumId: 'album_rumble',
    artwork: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    uri: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_03d29a5937.mp3?filename=powerful-beat-121791.mp3',
    duration: 178,
    genre: 'Electronic / Bass',
    year: 2024,
    isFavorite: false,
    playCount: 27,
    dominantColor: '#DC2626', // Crimson
    secondaryColor: '#EA580C',
    energy: 0.94,
    tempo: 140,
    moodVibe: 'energy',
    lyrics: `[00:06.00] Bass drops down to the concrete
[00:15.00] Heavy pressure moving our feet
[00:25.00] Pulse accelerating fast
[00:36.00] Nothing is built to last
[00:50.00] 3 - 2 - 1 - Ignition!
[01:10.00] High voltage sonic transmission`,
  },
  {
    id: 'track_chill_cloud',
    title: 'Sunset Velvet Breeze',
    artist: 'Tom Misch & Yussef',
    album: 'What Kinda Music',
    albumId: 'album_velvet_breeze',
    artwork: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    uri: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_d14e1f7259.mp3?filename=lazy-day-112185.mp3',
    duration: 198,
    genre: 'Neo-Soul / Chill',
    year: 2024,
    isFavorite: true,
    playCount: 48,
    dominantColor: '#059669', // Emerald
    secondaryColor: '#10B981',
    energy: 0.35,
    tempo: 88,
    moodVibe: 'chill',
    lyrics: `[00:10.00] Golden light falling on the floor
[00:22.00] Open window, open door
[00:36.00] Guitar chords warmly ringing out
[00:48.00] Quiet whispers without a doubt
[01:05.00] Let the afternoon simply fade away
[01:25.00] Nothing else that we need to say`,
  },
];
