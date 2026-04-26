# AccCalc System Overview v12.5.0

## Release Positioning

Version `12.5.0` is a focused shell release. Its main architectural point is that mobile navigation and settings now own the viewport when open instead of being sized as cards inside the remaining page chrome.

## Mobile Overlay Contract

Core files:

- `src/features/layout/AppLayout.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/index.css`

Small-screen overlays follow these rules:

- mount through `ViewportPortal`
- use `--app-mobile-panel-height` for full-panel height
- apply safe-area top and bottom spacing inside the panel
- keep panel body content scrollable
- lock background page scrolling with `useBodyScrollLock`
- close competing transient surfaces before opening a new one

## Mobile Navigation

The bottom-nav Menu action opens a full-screen panel below the desktop breakpoint. It no longer uses drawer width caps or shell overlay height, so it is not clipped by the sticky header, bottom navigation, or parent containers.

## Mobile Settings

The header Settings action now opens a full-screen settings panel on mobile and tablet shell widths. Desktop still keeps the existing side-panel settings behavior because it fits the larger workspace.

## Related Overlay Behavior

Phone page menus and mobile search now use the same viewport-owned model. Larger contextual page menus remain contained panels to avoid over-expanding secondary page help on desktop.

## Known Limitations

- The release focuses on shell and overlay behavior, not a broad redesign of Settings content.
- Browser safe-area behavior still depends on platform support for `env(safe-area-inset-*)`.
- Dev-server visual checks should still be repeated on physical mobile browsers before public deployment when possible.
