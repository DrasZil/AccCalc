# AccCalc v10.5.0 Release Notes

AccCalc `10.5.0` is the Student Reliability + Workpaper 2.0 release. It does not try to inflate the catalog; it hardens the broad app students already have.

## Reliability Hardening

- Workpaper sheet dimensions are now clamped through shared workpaper utilities so blank sheets, templates, saved workbooks, imported files, and calculator transfers stay inside the supported student-editing size.
- Saved workpaper state is sanitized before rendering. Malformed cells, out-of-bounds cells, and unsafe freeze values are discarded or clamped instead of being trusted blindly.
- Regression coverage now verifies that oversized workpaper sheets are bounded.
- Existing confidence interval and capital-rationing assumptions remain visible: z/t method selection is explicit, and exact capital-rationing search remains capped for responsiveness.

## Workpaper 2.0

- Workpaper Studio now shows a workbook-health strip for formula errors, empty sheets, and row/column limit pressure.
- Oversized spreadsheet imports are truncated to the supported workpaper shape with a sheet note explaining that the original file should remain the archival source.
- Calculator transfers that would exceed the workpaper cap skip out-of-bounds rows and columns rather than silently creating a huge render surface.
- Searchable/topic-filtered templates, deferred live preview, idle autosave, and narrow-screen edit guidance from v10.1 remain in place.

## OCR And Smart Solver Safety

- Smart Solver now requires one extra review click before opening a route when confidence is low, prompt warnings exist, extracted values need review, or the selected route score is weak.
- Scan & Check now opens the advanced review surface first when OCR confidence is low, parse confidence is weak, structured fields need review, or review flags are present.
- These guards intentionally prefer correction over blind autofill. Students can still continue after checking the risky values.

## Performance

- The heavy `xlsx` dependency is dynamically imported only when a student imports or exports workpaper files.
- The Workpaper Studio route chunk is much lighter after the split, while spreadsheet import/export remains available on demand.

## Documentation

The README, release notes, system overview, maintenance playbook, HTML documentation, and PDF documentation were updated for `10.5.0`.

## Validation

Final validation uses `npm test`, `npm run build`, and a bounded `npm run dev` probe.
