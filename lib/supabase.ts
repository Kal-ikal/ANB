// lib/supabase.ts
import 'react-native-url-polyfill/auto'; // Wajib untuk Supabase di React Native
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Adapter untuk SecureStore agar Supabase bisa menyimpan session
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Placeholder URLs
const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseAnonKey = 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Gunakan SecureStore hanya jika BUKAN web
    storage: Platform.OS === 'web' ? undefined : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
