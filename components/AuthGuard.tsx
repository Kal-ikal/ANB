import { useEffect, useState } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function AuthGuard() {
  const { session, loading } = useAuth();
  const { isDarkMode } = useTheme();
  const segments = useSegments() as string[];
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';
    const isLanding = segments.length === 0 || (segments.length === 1 && segments[0] === 'index');

    console.log("AuthGuard Check:", {
      hasSession: !!session,
      segments,
      inAuthGroup,
      inAppGroup,
      isLanding
    });

    if (session) {
      // User is logged in
      // Redirect to home if on landing or auth screens
      if (inAuthGroup || isLanding) {
        console.log("Redirecting to /(app)/home");
        router.replace('/(app)/home');
      }
    } else {
      // User is NOT logged in
      // Allow access to landing (index) and auth group
      // Redirect from protected app group to landing
      if (inAppGroup) {
        console.log("Redirecting to / (Landing)");
        router.replace('/');
      }
    }
  }, [session, loading, segments, isMounted, router]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDarkMode ? '#111827' : '#F7F7F7',
        }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return null; // Render nothing, just handle side effects
}
