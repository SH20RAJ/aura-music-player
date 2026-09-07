import React, { useEffect } from 'react';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { useLibraryStore } from '../features/library/library-store';
import { useWebShortcuts } from '../hooks/useWebShortcuts';

export default function RootLayout() {
  const initializeLibrary = useLibraryStore((state) => state.initialize);
  const pathname = usePathname();
  useWebShortcuts();

  useEffect(() => {
    initializeLibrary();
  }, []);

  // Hide MiniPlayer when inside the Full Player modal or Onboarding
  const hideMiniPlayer = pathname === '/player' || pathname === '/onboarding';

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="player"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
          <Stack.Screen name="album/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="artist/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>

        {!hideMiniPlayer && <MiniPlayer />}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
