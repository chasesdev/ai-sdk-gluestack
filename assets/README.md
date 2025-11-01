# Assets Directory

This directory should contain your app's static assets.

## Required Assets

Before running the app, you'll need to add the following assets referenced in `app.json`:

### Images

- `icon.png` - App icon (1024x1024 recommended)
- `splash.png` - Splash screen image
- `adaptive-icon.png` - Android adaptive icon (foreground, 1024x1024)
- `favicon.png` - Web favicon (48x48 or larger)

### Fonts (Optional)

If you want to use custom fonts, add them to the `assets/fonts/` directory:

- `Inter-Regular.ttf`
- `Inter-Medium.ttf`
- `Inter-SemiBold.ttf`
- `Inter-Bold.ttf`

Or remove the font configuration from `app.json` if you don't need custom fonts.

## Temporary Solution

For development purposes, you can:

1. Download placeholder images from https://placeholder.com
2. Or comment out the asset references in `app.json`
3. Or use Expo's default assets by removing those lines

## Adding Custom Assets

To add custom assets:

1. Place your image files in this directory
2. Import them in your components:

```tsx
import icon from '../assets/icon.png';

<Image source={icon} />
```

Or use them with require:

```tsx
<Image source={require('../assets/icon.png')} />
```
