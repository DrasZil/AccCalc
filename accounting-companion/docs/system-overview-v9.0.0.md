# AccCalc v9.0.0 System Overview

## Project Purpose

AccCalc is a curriculum-oriented accounting companion that combines:

- calculators
- workspaces
- OCR-assisted scan review
- Smart Solver prompt routing
- Study Hub lessons and quizzes
- workpaper templates

The `9.0.0` release expands the educational layer and restructures the learning UX so the app feels more like a digital accounting module than a collection of isolated tools.

## Main Architecture

### 1. Route Layer

- `src/App.tsx`

This is the route registry. It lazy-loads feature pages and wraps them in route-shell error boundaries and loading fallbacks.

### 2. Catalog And Discovery Layer

- `src/utils/appCatalog.ts`
- `src/utils/appSearch.ts`

`appCatalog.ts` is the route metadata source of truth:

- route labels
- descriptions
- aliases
- curriculum grouping
- subtopics
- offline support labels

`appSearch.ts` builds a precomputed search index from the catalog.

### 3. Calculation Layer

- `src/utils/calculatorMath.ts`
- `src/utils/formulaSolveDefinitions.ts`
- `src/utils/formulaStudyContent.tsx`

`calculatorMath.ts` holds shared formulas and should remain the source of truth for computations. `formulaSolveDefinitions.ts` wraps those helpers for multi-target solve flows and UI-facing explanation output.

### 4. Study Layer

- `src/features/study/studyContent.ts`
- `src/features/study/studyExpansion450.ts`
- `src/features/study/StudyHubPage.tsx`
- `src/features/study/StudyTopicPage.tsx`
- `src/features/study/components/StudyLessonLayout.tsx`
- `src/utils/studyProgress.ts`

This is the biggest area changed in `9.0.0`.

The study layer now has:

- richer lesson scaffolding
- track grouping
- progress persistence
- resume state
- section anchors
- module context

`studyContent.ts` contains richer topic structures and the helper functions that power:

- topic lookup
- related topics
- track grouping
- OCR lesson recommendation

`studyExpansion450.ts` is the curriculum-scale seed-based lesson expansion file used for broader reviewer coverage.

### 5. Smart Solver Layer

- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/smart/smartSolver.types.ts`

Smart Solver ranks likely routes from natural-language prompts. In `9.0.0`, it now uses a safer shared number parser so complex prompts with:

- commas
- parentheses
- percentages
- currency markers

are less likely to lose meaningful numeric inputs.

### 6. OCR / Scan Layer

- `src/features/scan-check/pages/ScanCheckPage.tsx`
- `src/features/scan-check/services/ocr/ocrMathCleanup.ts`
- `src/features/scan-check/services/ocr/ocrParser.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/scan-check/services/accounting/accountingFieldExtractor.ts`
- `src/features/scan-check/services/accounting/accountingProblemSession.ts`
- `src/features/scan-check/components/ScanStructuredFieldsEditor.tsx`
- `src/features/scan-check/services/scanSessionStore.ts`

The OCR flow now works like this:

1. image preprocessing improves readability
2. OCR extracts raw text
3. `ocrMathCleanup.ts` normalizes spacing, operators, currencies, and common OCR number mistakes
4. `ocrParser.ts` classifies the text, extracts values, creates structured field candidates, and ranks likely routes
5. structured fields are reviewed in the UI before handoff
6. accounting-specific extraction can build a process-costing session when enough worksheet signals are present

### 7. Theme And Shell Layer

- `src/features/layout/AppLayout.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/utils/appSettings.ts`
- `src/utils/themePreferences.ts`
- `src/index.css`

The theme system introduced in `8.0.0` remains intact. `9.0.0` does not change the model, but the new lesson layout and scan review surfaces are built to inherit the saved theme correctly.

## New v9.0.0 Lesson Architecture

`StudyLessonLayout.tsx` is now the reusable reader shell for present and future lessons.

It provides:

- breadcrumb path
- lesson header metadata
- lesson outline
- active section highlight
- progress bar
- sticky sidebar
- sidebar extension slots

`StudyTopicPage.tsx` maps the stored lesson topic structure into textbook-like sections:

- overview
- formulas and glossary
- procedure
- worked example
- checkpoint
- mistakes and interpretation
- practice next

## New Shared Parser Layer

`src/utils/numberParsing.ts` centralizes low-level number recognition.

This file now helps both Smart Solver and OCR handle:

- `₱1,250.50`
- `(4,500)`
- `35%`
- values with units

Centralizing this logic reduces divergence between route recommendation and scan review.

## Data Persistence

### Study Progress

- `src/utils/studyProgress.ts`

Stores:

- opened topics
- bookmarks
- completed sections
- last section visited
- quiz attempts
- lesson notes

### Scan Sessions

- `src/features/scan-check/services/scanSessionStore.ts`

Stores:

- scan queue items
- OCR results
- parsed results
- structured fields
- processing metadata

## How To Trace A Feature

For calculators:

1. route in `src/App.tsx`
2. page in `src/features/...`
3. shared math in `src/utils/calculatorMath.ts`
4. optional solve definition in `src/utils/formulaSolveDefinitions.ts`
5. discovery wiring in `src/utils/appCatalog.ts`
6. Smart Solver and OCR mapping
7. tests in `tests/calculatorMath.test.ts`

For lessons:

1. topic data in `studyContent.ts` or `studyExpansion450.ts`
2. lesson lookup helpers in `studyContent.ts`
3. hub browsing in `StudyHubPage.tsx`
4. lesson rendering in `StudyTopicPage.tsx`
5. progress persistence in `studyProgress.ts`

For OCR:

1. queue and worker hooks
2. text cleanup
3. parse and structured-field extraction
4. route recommendation
5. editor review
6. calculator or study handoff
