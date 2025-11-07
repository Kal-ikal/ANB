import { useCallback } from 'react';
import { router } from 'expo-router';
import type { Href } from 'expo-router';

export function useSmartNavigation() {
  const navigate = useCallback((
    path: string | Href, // ← PERBAIKAN: ganti ke string | Href
    options: { 
      replace?: boolean; 
      reset?: boolean;
      dismissAll?: boolean;
    } = {}
  ) => {
    const { replace = false, reset = false, dismissAll = false } = options;
    
    if (dismissAll) {
      // ✅ Untuk dismiss semua modal dan kembali ke root
      router.dismissAll();
      router.replace(path as any);
      return;
    }
    
    if (reset) {
      // ✅ Reset navigation stack lengkap
      router.replace(path as any);
      return;
    }
    
    if (replace) {
      router.replace(path as any);
    } else {
      router.push(path as any);
    }
  }, []);
  
  // ✅ Navigasi dengan reset stack - untuk auth -> app
  const navigateWithReset = useCallback((path: string | Href) => {
    router.replace(path as any);
  }, []);
  
  // ✅ Navigasi untuk dismiss semua dan ke root
  const navigateToRoot = useCallback(() => {
    router.dismissAll();
    router.replace('/');
  }, []);
  
  // ✅ Navigasi untuk back ke root (landing page)
  const backToRoot = useCallback(() => {
    if (router.canGoBack()) {
      router.dismissAll();
      router.replace('/');
    } else {
      router.replace('/');
    }
  }, []);
  
  // ✅ Untuk navigasi antar tab - gunakan replace
  const navigateToTab = useCallback((tabName: string) => {
    navigate(`/(app)/${tabName}`, { replace: true });
  }, [navigate]);
  
  // ✅ Untuk navigasi ke detail - gunakan push (bisa back)
  const navigateToDetail = useCallback((path: string | Href) => {
    navigate(path, { replace: false });
  }, [navigate]);
  
  // ✅ Untuk auth -> app transition - reset stack
  const navigateToApp = useCallback(() => {
    navigate('/(app)/home', { reset: true });
  }, [navigate]);
  
  // ✅ Untuk app -> auth transition - reset stack  
  const navigateToAuth = useCallback(() => {
    navigate('/(auth)/login', { reset: true });
  }, [navigate]);
  
  return {
    navigate,
    navigateToTab,
    navigateToDetail,
    navigateToApp,
    navigateToAuth,
    navigateToRoot,
    backToRoot,
    navigateWithReset,
    back: router.back,
    canGoBack: router.canGoBack
  };
}