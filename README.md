# Expo 54 + Gluestack UI v3 + NativeWind v4 + Reanimated v3

A modern React Native starter template with Expo 54, featuring Gluestack UI v3 for components, NativeWind v4 for Tailwind CSS styling, and Reanimated v3 for smooth animations.

## Features

- **Expo 54** - Latest Expo SDK with new architecture support
- **Gluestack UI v3** - Beautiful, accessible, and customizable UI components
- **NativeWind v4** - Tailwind CSS for React Native
- **Reanimated v3** - 60fps animations powered by the native thread
- **Expo Router** - File-based routing with typed routes
- **TypeScript** - Full type safety

## Prerequisites

- Node.js 18+
- iOS Simulator (macOS only) or Android Emulator
- Expo CLI (will be installed with dependencies)

## Getting Started

### 1. Install Dependencies

```bash
yarn install
# or
npm install
```

### 2. Start the Development Server

```bash
yarn start
# or
npm start
```

This will start the Expo development server. You can then:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your physical device

### 3. Run on Specific Platforms

```bash
# iOS
yarn ios
# or npm run ios

# Android
yarn android
# or npm run android

# Web
yarn web
# or npm run web
```

## Project Structure

```
.
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Home screen
├── assets/                 # Images, fonts, and other assets
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration (includes Reanimated plugin)
├── metro.config.js        # Metro bundler configuration
├── tailwind.config.js     # Tailwind/NativeWind configuration
├── gluestack-ui.config.ts # Gluestack UI theme configuration
├── global.css             # Global Tailwind styles
├── nativewind-env.d.ts    # NativeWind type definitions
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Configuration Details

### Babel Configuration

The `babel.config.js` includes both NativeWind and Reanimated plugins:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      "nativewind/babel",
      // Reanimated plugin must be listed last
      "react-native-reanimated/plugin",
    ],
  };
};
```

**Important:** The Reanimated plugin must always be listed last in the plugins array.

### Metro Configuration

Metro is configured to work with NativeWind v4:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### App Configuration

The `app.json` includes the Reanimated plugin:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "react-native-reanimated/plugin"
    ]
  }
}
```

## Known Issues & Fixes

### Reanimated v3 Issues

#### 1. Web Platform Issues

Reanimated v3 may have issues on web. The fix is included in `app/_layout.tsx`:

```typescript
// Fix for Reanimated v3 on web
if (typeof window !== "undefined") {
  // @ts-ignore
  window._frameTimestamp = null;
}
```

#### 2. "Cannot find module 'react-native-reanimated/plugin'"

**Solution:** Clear cache and reinstall:

```bash
rm -rf node_modules
yarn install
# or npm install
npx expo start --clear
```

#### 3. Animations Not Working

**Solution:** Make sure you import from `react-native-reanimated`, not `react-native`:

```typescript
// ✅ Correct
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// ❌ Wrong
import { Animated } from 'react-native';
```

### NativeWind v4 / Tailwind Issues

#### 1. Styles Not Applying

**Solutions:**
- Make sure `global.css` is imported in `app/_layout.tsx`
- Clear Metro cache: `npx expo start --clear`
- Ensure `nativewind-env.d.ts` exists for TypeScript support

#### 2. Custom Colors Not Working

Make sure CSS variables are defined in `global.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... other colors */
}
```

#### 3. className IntelliSense Not Working

Add `nativewind-env.d.ts` to your project root:

```typescript
/// <reference types="nativewind/types" />
```

### Gluestack UI v3 Issues

#### 1. "Cannot resolve @gluestack-ui/config"

**Solution:**

```bash
yarn add @gluestack-ui/config
# or
npm install @gluestack-ui/config --save
```

#### 2. Type Errors with Gluestack Components

Make sure your TypeScript is configured correctly:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler"
  }
}
```

### General Expo 54 Issues

#### 1. iOS Build Issues

```bash
# Clear CocoaPods cache
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### 2. Android Build Issues

```bash
# Clear Android build cache
cd android
./gradlew clean
cd ..
```

## Clearing All Caches

If you encounter any issues, try clearing all caches:

```bash
# Clear watchman
watchman watch-del-all

# Clear Metro bundler cache
npx expo start --clear

# Clear package manager cache
yarn cache clean
# or npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
yarn install
# or npm install
```

## Styling Approaches

This template supports multiple styling approaches:

### 1. NativeWind (Tailwind CSS)

```tsx
<View className="flex-1 bg-background p-4">
  <Text className="text-2xl font-bold text-foreground">
    Hello World
  </Text>
</View>
```

### 2. Gluestack UI Props

```tsx
<Box bg="$primary500" p="$4" borderRadius="$lg">
  <Heading color="$white">Hello World</Heading>
</Box>
```

### 3. Mixed Approach

```tsx
<Box className="flex-1 bg-card" p="$4">
  <Heading className="text-foreground">Best of Both</Heading>
</Box>
```

## Using Reanimated v3

Basic animation example:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

function MyComponent() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(scale.value === 1 ? 1.5 : 1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Button onPress={handlePress}>
        <ButtonText>Animate</ButtonText>
      </Button>
    </Animated.View>
  );
}
```

## Customizing the Theme

### Gluestack Theme

Edit `gluestack-ui.config.ts`:

```typescript
import { config as defaultConfig } from "@gluestack-ui/config";

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      primary500: "#your-color",
    },
  },
};
```

### Tailwind Theme

Edit `tailwind.config.js` and `global.css`:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
      },
    },
  },
}
```

```css
/* global.css */
:root {
  --primary: 222.2 47.4% 11.2%;
}
```

## Scripts

- `yarn start` / `npm start` - Start Expo development server
- `yarn ios` / `npm run ios` - Run on iOS simulator
- `yarn android` / `npm run android` - Run on Android emulator
- `yarn web` / `npm run web` - Run on web
- `yarn lint` / `npm run lint` - Run ESLint
- `yarn type-check` / `npm run type-check` - Run TypeScript type checking

## Troubleshooting

### Metro Bundler Won't Start

1. Kill all Node processes: `killall node`
2. Clear cache: `npx expo start --clear`
3. Restart: `yarn start` or `npm start`

### Changes Not Reflecting

1. Clear cache: `npx expo start --clear`
2. For iOS: Rebuild the app (Cmd+R in simulator)
3. For Android: Rebuild the app (RR in emulator)

### Type Errors

Run type check to see all errors:

```bash
yarn type-check
# or
npm run type-check
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Gluestack UI Documentation](https://ui.gluestack.io/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
