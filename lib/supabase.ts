// lib/supabase.ts
import 'react-native-url-polyfill/auto'; // Wajib untuk Supabase di React Native
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

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

const supabaseUrl = 'URL_SUPABASE_ANDA';
const supabaseAnonKey = 'ANON_KEY_ANDA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});