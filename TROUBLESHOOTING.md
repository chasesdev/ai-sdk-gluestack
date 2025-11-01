# Troubleshooting: Reanimated v4 & NativeWind v4

This guide addresses common issues with Reanimated v4 and NativeWind v4 (Tailwind) in Expo 54.

## Reanimated v4 Issues

### Issue #1: "Cannot find module 'react-native-reanimated/plugin'"

**Symptoms:**

- Babel crashes during metro bundling
- Error mentions missing Reanimated plugin

**Solution:**

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

**Why it happens:** Reanimated plugin wasn't installed properly or node_modules is corrupted.

---

### Issue #2: Animations Don't Work

**Symptoms:**

- No errors, but animations don't run
- Components don't animate on interaction

**Solution 1 - Check Babel Configuration:**

Verify `babel.config.js` has Reanimated plugin as the **last** plugin:

```javascript
module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // ← MUST BE LAST
    ],
  }
}
```

**Solution 2 - Restart Metro with Cache Clear:**

```bash
# Kill metro
killall node

# Start with cleared cache
npx expo start --clear
```

**Solution 3 - Check Imports:**

Make sure you're importing from `react-native-reanimated`, NOT `react-native`:

```typescript
// ✅ CORRECT
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'

// ❌ WRONG
import { Animated } from 'react-native'
```

---

### Issue #3: Web Platform Crashes with Reanimated

**Symptoms:**

- App works on iOS/Android but crashes on web
- Error: "\_frameTimestamp is not defined"

**Solution:**

Add this fix to `app/_layout.tsx` (already included):

```typescript
// Fix for Reanimated v4 on web
if (typeof window !== 'undefined') {
  // @ts-ignore
  window._frameTimestamp = null
}
```

**Alternative:** Use platform-specific code:

```typescript
import { Platform } from 'react-native'

// Only use Reanimated on native
const AnimatedComponent = Platform.OS === 'web' ? View : Animated.View
```

---

### Issue #4: "react-native-reanimated has been initialized with incorrect jsEngine"

**Symptoms:**

- Error on app startup mentioning jsEngine
- App crashes immediately

**Solution:**

```bash
# iOS
cd ios && pod install && cd ..
npx expo run:ios

# Android
cd android && ./gradlew clean && cd ..
npx expo run:android
```

---

### Issue #5: Animations Lag or Stutter

**Symptoms:**

- Animations run but not smoothly
- FPS drops during animation

**Solution 1 - Use runOnJS correctly:**

```typescript
import { runOnJS } from 'react-native-reanimated'

const animatedStyle = useAnimatedStyle(() => {
  // ✅ CORRECT - Use runOnJS for JS callbacks
  if (someCondition) {
    runOnJS(myJsFunction)()
  }

  return {
    transform: [{ scale: scale.value }],
  }
})
```

**Solution 2 - Avoid heavy computations in animations:**

```typescript
// ❌ WRONG - Heavy computation in animation
const animatedStyle = useAnimatedStyle(() => {
  const heavy = expensiveCalculation()
  return { opacity: heavy }
})

// ✅ CORRECT - Pre-calculate
const preCalculated = useMemo(() => expensiveCalculation(), [])
const animatedStyle = useAnimatedStyle(() => {
  return { opacity: preCalculated }
})
```

---

## NativeWind v4 (Tailwind) Issues

### Issue #1: Styles Not Applying

**Symptoms:**

- className is used but no styles appear
- Components render without styling

**Solution 1 - Verify global.css Import:**

Check `app/_layout.tsx` imports global.css:

```typescript
import '../global.css' // ← Must be present
```

**Solution 2 - Clear Metro Cache:**

```bash
npx expo start --clear
```

**Solution 3 - Check Metro Config:**

Verify `metro.config.js` includes NativeWind:

```javascript
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './global.css' })
```

**Solution 4 - Verify Babel Config:**

Check `babel.config.js` has NativeWind plugin:

```javascript
plugins: [
  "nativewind/babel", // ← Must be present
  "react-native-reanimated/plugin",
],
```

---

### Issue #2: TypeScript Errors on className

**Symptoms:**

- TypeScript error: "Property 'className' does not exist"
- Red squiggly lines under className

**Solution:**

Ensure `nativewind-env.d.ts` exists in project root:

```typescript
/// <reference types="nativewind/types" />
```

Then restart TypeScript server:

- VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
- Or restart your editor

---

### Issue #3: Custom Colors Not Working

**Symptoms:**

- Predefined colors work (bg-red-500) but custom colors don't
- CSS variables not applied

**Solution 1 - Check global.css:**

Verify CSS variables are defined:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... other colors */
}
```

**Solution 2 - Check tailwind.config.js:**

Verify colors reference CSS variables:

```javascript
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
    },
  },
}
```

**Solution 3 - Use Direct Values (Workaround):**

```tsx
// If CSS variables don't work, use direct colors
<View className="bg-[#ffffff]">
```

---

### Issue #4: Dark Mode Not Working

**Symptoms:**

- .dark classes defined but not applying
- Theme doesn't change

**Solution 1 - Use NativeWind's Color Scheme:**

```typescript
import { useColorScheme } from 'nativewind';

function MyComponent() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <Button onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}>
      <ButtonText>Toggle Theme</ButtonText>
    </Button>
  );
}
```

**Solution 2 - Configure in tailwind.config.js:**

```javascript
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}
```

---

### Issue #5: Arbitrary Values Not Working

**Symptoms:**

- Can't use values like `w-[37px]` or `bg-[#ff0000]`

**Solution:**

This should work in NativeWind v4. If not:

```bash
# Reinstall NativeWind
npm uninstall nativewind
npm install nativewind@^4.1.23
npx expo start --clear
```

---

### Issue #6: Some Tailwind Classes Don't Work

**Symptoms:**

- Common classes like `grid`, `backdrop-blur` don't work
- No error, just no effect

**Reason:** React Native doesn't support all CSS properties. Some Tailwind classes won't work.

**Unsupported Features:**

- Grid layout (use `flex` instead)
- Backdrop filters
- Some advanced CSS features

**Solution - Use Flex Instead:**

```tsx
// ❌ Won't work in React Native
<View className="grid grid-cols-2">

// ✅ Use flex
<View className="flex flex-row flex-wrap">
  <View className="w-1/2" />
  <View className="w-1/2" />
</View>
```

---

## Combined Issues (Reanimated + NativeWind)

### Issue: Animated Component with className Doesn't Style

**Symptoms:**

- Using `<Animated.View className="...">` but no styles apply

**Solution:**

NativeWind's className works with Animated components, but you may need to restart:

```bash
npx expo start --clear
```

If still not working, use style prop:

```typescript
import { useAnimatedStyle } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

// Combine className (static) + style (animated)
<Animated.View className="bg-primary p-4" style={animatedStyle}>
  <Text>Animated with styles</Text>
</Animated.View>
```

---

## Nuclear Option: Complete Reset

If nothing works, try a complete reset:

```bash
# 1. Clear all caches
rm -rf node_modules
rm -rf .expo
rm package-lock.json
watchman watch-del-all

# 2. Reinstall
npm install

# 3. Start fresh
npx expo start --clear

# 4. If still broken, try
npx expo start --clear --reset-cache
```

---

## Verification Checklist

Use this checklist to verify your setup:

### Reanimated v4

- [ ] `react-native-reanimated` installed
- [ ] Reanimated plugin in `babel.config.js` (last position)
- [ ] Metro cache cleared after babel changes
- [ ] Importing from `react-native-reanimated`, not `react-native`
- [ ] Web fix applied in `_layout.tsx` (if targeting web)

### NativeWind v4

- [ ] `nativewind` and `tailwindcss` installed
- [ ] `global.css` imported in `_layout.tsx`
- [ ] `nativewind/babel` plugin in `babel.config.js`
- [ ] `withNativeWind` in `metro.config.js`
- [ ] `nativewind-env.d.ts` exists
- [ ] Metro cache cleared after config changes

### Both

- [ ] All config files use `.js` extension (not `.ts`)
- [ ] TypeScript server restarted
- [ ] App fully rebuilt (not just refreshed)

---

## Still Having Issues?

1. Check the demo in `app/index.tsx` - does it work?
   - If yes: Issue is in your custom code
   - If no: Setup issue, revisit configs

2. Check Expo logs:

```bash
npx expo start
# Look for red errors in terminal
```

3. Check Metro bundler logs for warnings

4. Create a minimal reproduction:

```typescript
// Test Reanimated
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
const scale = useSharedValue(1);
scale.value = withSpring(2);

// Test NativeWind
<View className="bg-red-500 p-4">
  <Text className="text-white">Test</Text>
</View>
```

5. Check versions match:

```bash
npm list react-native-reanimated
npm list nativewind
```

Should show:

- react-native-reanimated: ~3.16.5
- nativewind: ^4.1.23

## Community Resources

- Reanimated: https://docs.swmansion.com/react-native-reanimated/
- NativeWind: https://www.nativewind.dev/
- Expo: https://docs.expo.dev/
- GitHub Issues: Check existing issues for your specific error
