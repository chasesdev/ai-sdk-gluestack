# Quick Start Guide

Get up and running with Expo 54 + Gluestack v3 in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

**Note:** If you encounter any errors during installation, try:

```bash
npm install --legacy-peer-deps
```

## Step 2: Start the Development Server

```bash
npm start
```

This opens the Expo development tools in your terminal.

## Step 3: Run on a Platform

Choose one of the following:

### iOS (macOS only)
Press `i` in the terminal, or run:
```bash
npm run ios
```

### Android
Press `a` in the terminal, or run:
```bash
npm run android
```

### Web
Press `w` in the terminal, or run:
```bash
npm run web
```

### Physical Device
1. Install "Expo Go" app from App Store or Play Store
2. Scan the QR code shown in terminal

## Common Issues

### Issue: Metro bundler fails to start

**Solution:**
```bash
npx expo start --clear
```

### Issue: "Unable to resolve module react-native-reanimated"

**Solution:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: Changes not reflecting

**Solution:**
1. In the Expo terminal, press `r` to reload
2. Or press `Shift + r` to reload and clear cache

### Issue: Type errors

**Solution:**
```bash
npm run type-check
```

This will show all TypeScript errors. Most can be fixed by ensuring proper imports.

## What's Included

The demo app (`app/index.tsx`) shows:

- ✅ NativeWind v4 (Tailwind CSS) working
- ✅ Gluestack UI v3 components working
- ✅ Reanimated v4 animations working
- ✅ Mixed styling approaches (NativeWind + Gluestack)

## Next Steps

1. Edit `app/index.tsx` to customize the home screen
2. Add new screens in the `app/` directory
3. Customize the theme in `gluestack-ui.config.ts` and `global.css`
4. Check the full README.md for detailed documentation

## Testing All Features

The default screen includes interactive demos of:

1. **NativeWind**: Tap any feature card to see Tailwind classes in action
2. **Gluestack UI**: The buttons and cards use Gluestack components
3. **Reanimated v4**: Tap "Tap to Animate" button to test animations

If all three work, your setup is complete! 🎉

## Additional Help

- Full documentation: See `README.md`
- Expo issues: https://docs.expo.dev/
- Gluestack issues: https://ui.gluestack.io/
- NativeWind issues: https://www.nativewind.dev/
- Reanimated issues: https://docs.swmansion.com/react-native-reanimated/
