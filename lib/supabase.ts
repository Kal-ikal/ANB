import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY || 'placeholder';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      // Use AsyncStorage for React Native.
      // Supabase Auth JS handles environment detection internally to some extent,
      // but for RN with Expo, passing AsyncStorage explicitly is the standard way.
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      // Only apply processLock on web to avoid issues, or keep it if standard
      // Actually, processLock is generally for web multiple tab syncing.
      // In React Native, we can usually omit it or leave it default.
      // But the previous code had it. I will restore the original simple config
      // but keep the error handling regarding window/AsyncStorage if needed.
      // However, the reviewer correctly pointed out that isBrowser check fails on mobile.
      // So we revert to unconditional AsyncStorage.
    },
  })
