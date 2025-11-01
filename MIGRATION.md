# Migration Summary: Next.js → Expo 54

This repository has been migrated from Next.js to Expo 54 with Gluestack UI v3.

## What Changed

### ✅ New Configuration Files

- `app.json` - Expo configuration
- `babel.config.js` - Babel with Reanimated v4 & NativeWind v4 plugins
- `metro.config.js` - Metro bundler with NativeWind support
- `gluestack-ui.config.ts` - Gluestack UI theme configuration
- `nativewind-env.d.ts` - NativeWind TypeScript support
- `global.css` - Tailwind base styles with CSS variables

### ✅ New App Structure

- `app/_layout.tsx` - Root layout with GluestackUIProvider
- `app/index.tsx` - Demo home screen showing all features

### ✅ Updated Configuration

- `package.json` - New dependencies for Expo, Gluestack, NativeWind, Reanimated
- `tsconfig.json` - Updated for Expo
- `tailwind.config.js` - Configured for NativeWind v4

## Old Files (Can Be Removed)

The following Next.js files are no longer needed and can be safely deleted:

### Old Next.js App Directory
```
src/app/
├── api/
├── layout.tsx
├── page.tsx
└── globals.css
```

### Old UI Components (Shadcn/Radix)
```
src/components/ui/
├── All Radix UI components (*.tsx)
└── (Replace with Gluestack UI components as needed)
```

### Old Utilities
```
src/lib/
src/hooks/
```

### Old Examples
```
examples/
```

### Old Configs
```
tailwind.config.ts (superseded by tailwind.config.js)
eslint.config.mjs (optional cleanup)
```

## Cleanup Commands

To remove old Next.js files:

```bash
# Remove old app directory
rm -rf src/app

# Remove old Shadcn components (if not migrating them)
rm -rf src/components

# Remove old lib and hooks
rm -rf src/lib src/hooks

# Remove examples
rm -rf examples

# Remove old public directory (Next.js specific)
rm -rf public

# Remove old tailwind config
rm tailwind.config.ts

# Remove old Next.js specific files
rm -f next-env.d.ts
rm -rf .next
```

## Tech Stack Comparison

### Before (Next.js)
- Next.js 15.3.5
- React 19
- Shadcn UI (Radix UI components)
- Tailwind CSS v4
- Next.js App Router

### After (Expo)
- Expo 54
- React Native 0.76.7
- Gluestack UI v3
- NativeWind v4 (Tailwind for React Native)
- Reanimated v4
- Expo Router

## Key Differences

### Routing
- **Before:** Next.js App Router (`src/app/`)
- **After:** Expo Router (`app/`)

### Styling
- **Before:** Regular Tailwind CSS, Radix UI primitives
- **After:** NativeWind (Tailwind), Gluestack UI components

### Components
- **Before:** HTML elements (`div`, `button`, etc.)
- **After:** React Native components (`View`, `Pressable`, etc.)

### Animations
- **Before:** Framer Motion
- **After:** Reanimated v4 (native thread animations)

## Migration Guide for Components

When migrating old components, replace web elements with React Native equivalents:

```tsx
// Before (Next.js/Web)
<div className="flex flex-col">
  <button onClick={...}>Click me</button>
</div>

// After (Expo/React Native)
<View className="flex flex-col">
  <Pressable onPress={...}>
    <Text>Click me</Text>
  </Pressable>
</View>
```

Or use Gluestack UI:

```tsx
<VStack space="md">
  <Button onPress={...}>
    <ButtonText>Click me</ButtonText>
  </Button>
</VStack>
```

## Recommended Next Steps

1. **Clean up old files** (see commands above)
2. **Install dependencies:** `npm install`
3. **Test the setup:** `npm start`
4. **Migrate custom components** from `src/components/ui/` to Gluestack equivalents
5. **Migrate custom logic** from `src/lib/` and `src/hooks/`
6. **Update imports** in any custom code

## Important Notes

### Reanimated v4 Plugin Order
The Reanimated plugin MUST be last in `babel.config.js`:

```javascript
plugins: [
  "nativewind/babel",
  "react-native-reanimated/plugin", // Must be last!
]
```

### NativeWind Setup
Make sure `global.css` is imported in `app/_layout.tsx`:

```typescript
import "../global.css";
```

### Web Support
This Expo setup supports web via Metro bundler. Run with:
```bash
npm run web
```

## Getting Help

- See `README.md` for full documentation
- See `QUICKSTART.md` for quick setup guide
- Check the demo in `app/index.tsx` for working examples

## Known Migration Issues

1. **Database (Prisma):** Not included in new setup. Add back if needed.
2. **Socket.io:** Not included. Use React Native compatible WebSocket solutions.
3. **MDX:** Not included. Use React Native markdown renderers instead.
4. **Next-Auth:** Use Expo AuthSession or other React Native auth solutions.

Add these back individually as needed for your use case.
