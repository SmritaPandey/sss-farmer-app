# Multicolored Agriculture Icons (Iconfinder) – Integration Guide

Use full-color icon images where they add clarity. This app supports both vector fonts (Ionicons/MCI) and full-color image icons in tiles.

## Licensing checklist
- Verify each icon’s license on Iconfinder (commercial use + modifications allowed).
- Prefer collections under MIT, Apache, CC BY. Avoid CC BY-SA/NC if distribution terms conflict.
- Store license/attribution in `docs/ATTRIBUTIONS.md` with icon names and authors.

## Recommended formats
- PNG (1x,2x,3x) in `assets/icons/` for quick integration.
- SVG for web; for React Native, use `react-native-svg` + `react-native-svg-transformer` if needed. PNG is simpler for Expo Go.

## Add a new icon (PNG)
1. Save files: `assets/icons/<name>.png` (512px is fine; we scale down).
2. Import and pass to `Tile`:

```tsx
import WheatIcon from '@/assets/icons/wheat.png';

<Tile title={t('sell_produce')} onPress={...} image={WheatIcon} imageSize={56} />
```

- If you also want a tiny badge, pass both `icon` (vector) and `image`; the image will appear as a small corner thumb by default. To show only image, omit `icon` and the image renders centered at `imageSize`.

## Optional: SVG setup
- Install: `npm i react-native-svg` and configure transformer (outside Expo Go, or with custom metro config).
- Use `<SvgUri />` or inline `<Svg>` for crisp scaling.

## Theming tips
- When using full-color icons, the Tile will remove the green background shape and show a clean white center to avoid color clash.
- Keep primary accents saffron; per-feature tiles can use agri tones in titles or borders if desired.
