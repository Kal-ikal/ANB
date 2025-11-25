import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { usePathname, router } from 'expo-router';
import { useSmartNavigation } from './useSmartNavigation';

export function useCustomBackHandler() {
  const pathname = usePathname();
  const { backToRoot, navigateToRoot } = useSmartNavigation();

  const backHandler = useCallback(() => {
    // ✅ Case 1: Jika di landing page (root) - exit app
    if (pathname === '/' || pathname === '/index') {
      BackHandler.exitApp();
      return true;
    }

    // ✅ Case 2: Jika di login page - selalu kembali ke root
    if (pathname === '/(auth)/login') {
      backToRoot();
      return true;
    }

    // ✅ Case 3: Jika di forgot-password - back ke login
    if (pathname === '/(auth)/forgot-password') {
      if (router.canGoBack()) {
        router.back();
      } else {
        navigateToRoot();
      }
      return true;
    }

    // ✅ Case 4: Jika di app tabs (home, profile, dll)
    // REMOVED explicit exitApp logic here to allow screens (like home.tsx) to handle it themselves via useFocusEffect.
    // If the screen handles it, this listener won't be called (LIFO).
    // If the screen doesn't handle it (e.g. profile), we fall through to default behavior.
    // Note: If we want consistent exit from any tab root, we might need it, but user specifically wants double-tap on Home.
    // Other tabs will likely fall through to 'router.back()' which might pop the stack or do nothing if at top of stack.

    // ✅ Case 5: Jika di modal - dismiss
    if (pathname.startsWith('/(modals)/')) {
      if (router.canGoBack()) {
        router.back();
      } else {
        navigateToRoot();
      }
      return true;
    }

    // ✅ Default: Normal back behavior
    if (router.canGoBack()) {
      router.back();
      return true;
    } else {
      // Fallback: ke root
      navigateToRoot();
      return true;
    }
  }, [pathname, backToRoot, navigateToRoot]);

  useEffect(() => {
    // Add event listener - returns subscription object
    const subscription = BackHandler.addEventListener('hardwareBackPress', backHandler);

    // Cleanup - remove subscription
    return () => {
      subscription.remove();
    };
  }, [backHandler]);

  return { backHandler };
}
