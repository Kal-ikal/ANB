// lib/navigation.ts
import { CommonActions } from "@react-navigation/native";

let isNavigating = false;

export async function pushThenReset(
  router: any,
  navigation: any,
  path: string,
  routeName: string,
  animationMs = 380
) {
  if (isNavigating) return;
  isNavigating = true;

  try {
    router.push(path);
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName }],
        })
      );
      isNavigating = false;
    }, animationMs);
  } catch {
    router.replace(path);
    isNavigating = false;
  }
}
