# AccCalc v12.6.0 Release Notes

AccCalc `12.6.0` is a focused overlay and viewport-fit release. It extends the earlier mobile menu and settings work across shared page menus, contextual support panels, media previews, scan image previews, support QR views, and desktop settings.

## Main Product Changes

- Kept mobile page menus as true full-screen support panels.
- Widened tablet, laptop, and desktop page menus into full-height side sheets instead of cramped narrow cards.
- Upgraded the shared media viewer used by support QR and scan image previews to use `ViewportPortal`, shared scroll locking, and safe-area-aware panel sizing.
- Made media/support previews full-screen on phones and large full-height panels on wider screens.
- Increased desktop Settings width with a responsive clamp so dense settings groups have more room.
- Preserved lightweight dialog behavior for short prompt-style overlays where a full panel would be excessive.

## Root Cause

Several support surfaces had inherited generic modal/card sizing:

- narrow desktop page-menu width caps
- inset padding on mobile previews
- manual `body.overflow` scroll locking in media modals
- one-off fixed overlays mounted in component position rather than the shared viewport portal
- desktop settings width that remained too narrow for denser groups

The release fixes the shared sizing contracts instead of patching one calculator page.

## Surface Behavior

- Phones: substantial support surfaces are full-screen panels using `--app-mobile-panel-height` and internal safe-area padding.
- Tablets and laptops: page menus become wider full-height side sheets.
- Desktops: support sheets and media previews use large, intentional panel widths and full-height layouts while preserving readable content regions.
- Short-height screens: panel bodies scroll internally instead of clipping content.

## Validation

Final validation for `12.6.0` uses:

- `npm test`
- `npm run build`
- a bounded `npm run dev -- --host 127.0.0.1` probe when practical

Manual checks should include:

- page menu on a phone-width viewport
- page menu on laptop and desktop widths
- Settings on mobile, tablet, and desktop widths
- support QR preview
- scan image preview
- background scroll lock while long panels are open
