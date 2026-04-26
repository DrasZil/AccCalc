# AccCalc System Overview v12.6.0

## Release Positioning

Version `12.6.0` broadens the overlay system so substantial support surfaces are no longer styled like generic floating cards. The release keeps the app shell intact while making page menus, settings, and preview-style support panels fit the viewport more intentionally.

## Overlay Surface Categories

### Full-Screen Mobile Panels

Used for:

- mobile menu
- mobile settings
- phone page menus
- phone media/support previews

Rules:

- mount through `ViewportPortal`
- use `--app-mobile-panel-height`
- apply safe-area padding inside the panel
- keep content in an internal scroll region
- lock background scrolling with `useBodyScrollLock`

### Full-Height Side Sheets

Used for:

- tablet/laptop/desktop page menus
- desktop settings

Rules:

- use full available overlay height
- avoid narrow fixed-card widths
- keep readable internal content spacing
- preserve a clear header and close action

### Large Preview Panels

Used for:

- support QR previews
- scan image previews
- other image/media review surfaces using `MediaViewerModal`

Rules:

- full-screen on mobile
- large full-height centered panel on wider screens
- shared scroll lock
- image area and helper/actions area split on larger screens

## Main Files

- `src/features/layout/AppLayout.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/components/media/MediaViewerModal.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/index.css`

## Known Limitations

- Lightweight prompts such as feedback reminders remain dialog-like by design.
- Physical-device safe-area testing is still recommended before public deployment because browser handling of `env(safe-area-inset-*)` varies.
