# AccCalc Maintenance Playbook v12.6.0

## First Read

This version is maintained around the support-surface principle:

- substantial support surfaces should feel like app panels
- lightweight prompts may stay compact dialogs
- mobile panels should be full-screen when the user is navigating, configuring, or reviewing substantial support content
- desktop panels should use full height and enough width to avoid cramped help content

## Main Files To Know

- `src/features/layout/AppLayout.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/components/media/MediaViewerModal.tsx`
- `src/components/ViewportPortal.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/index.css`
- `src/utils/appRelease.ts`

## Implementation Rules

1. Use `ViewportPortal` for support overlays that must escape page clipping and shell stacking contexts.
2. Use `--app-mobile-panel-height` for mobile full-screen panels.
3. Put safe-area handling inside the panel, not as awkward outer margins.
4. Use full-height side sheets for page menus on tablet/laptop/desktop.
5. Keep media and QR previews full-screen on mobile and large enough on desktop for real inspection.
6. Use `useBodyScrollLock` rather than one-off `document.body.style.overflow` changes.
7. Keep close actions in the panel header and keep panel bodies internally scrollable.

## Validation Checklist

- `npm test`
- `npm run build`
- bounded `npm run dev -- --host 127.0.0.1` probe
- phone page-menu check
- laptop/desktop page-menu check
- mobile and desktop settings check
- support QR preview check
- scan image preview check
- background scroll lock check
