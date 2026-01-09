# Rainfall Tracking App - Design Guidelines

## Design Approach
**System**: Material Design / Clean Data Application Pattern  
**Rationale**: Utility-focused data application prioritizing efficiency and clarity. References: Linear's clean data presentation + Notion's simple forms + GitHub's tab navigation.

## Core Design Principles
1. **Data-First**: Information hierarchy optimized for quick scanning and entry
2. **Focused Workflow**: Tab-based organization reduces cognitive load
3. **Efficiency**: Entry form always accessible, immediate data visibility

## Layout System

**Container Structure**:
- Main container: `max-w-5xl mx-auto px-4` for optimal data density
- Consistent vertical rhythm: `py-8` sections, `py-12` page padding
- Card-based components with subtle elevation

**Spacing Scale**: Tailwind units of 2, 4, 6, and 8
- Gaps: `gap-4` forms, `gap-6` sections
- Padding: `p-6` cards, `p-4` compact elements
- Margins: `mb-6` between components

## Typography

**Font Stack**: Inter via Google Fonts  
**Hierarchy**:
- Page title: `text-2xl font-semibold`
- Section headers: `text-lg font-medium`
- Tab labels: `text-sm font-medium`
- Body text: `text-base`
- Data values: `font-mono text-sm` (rainfall amounts)
- Meta info: `text-sm text-gray-600`

## Component Library

### Primary Layout Structure
Three-tier vertical organization:

**1. Header Section**
- App title with rain icon (Heroicons)
- Quick stats bar: Total entries count, Average monthly rainfall, Highest month
- Stats displayed as inline pills with icon + value pairs
- Compact height: `py-4`

**2. Entry Form Card** (Always visible, top priority)
- Prominent card with distinct border treatment
- Horizontal layout on desktop: Date picker | Rainfall input | Submit button
- Date defaults to today, rainfall input auto-focused
- Inline validation messages below inputs
- Success feedback: Subtle toast notification (top-right corner)
- Clear visual separation from tabs below using `mb-8`

**3. Tabbed Data Section**
Two tabs for organized content viewing:

**Tab Navigation Bar**:
- Horizontal tabs with underline indicator pattern
- Active tab: Bold text + bottom border accent (3px)
- Inactive tabs: Regular weight, hover state with slight opacity change
- Clean, minimal styling aligned with Material Design tabs
- Full-width bar with tabs left-aligned: `border-b` separating from content

**Tab Content Panels**:

**Monthly Totals Tab** (Default active):
- Grid layout: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
- Cards showing: Month/Year header + Large total value
- Current month card: Distinctive border treatment
- Typography: `text-3xl font-bold` for totals, `text-sm` for month labels
- Include year context: "Jan 2024", "Feb 2024"
- Empty state message when no data
- Sorted chronologically (most recent first)

**All Records Tab**:
- Clean table layout with alternating row backgrounds
- Columns: Date | Rainfall (mm) | Actions (delete icon)
- Table header: `font-medium text-sm`
- Monospace font for rainfall values
- Sort indicator in Date column header
- Pagination footer if >20 entries: Simple prev/next buttons
- Mobile responsive: Stacks to card list format
- Each record card on mobile: Date header, rainfall value emphasized, delete button top-right

### Additional Components

**Empty States**:
- Centered illustration placeholder icon (Heroicons cloud-rain)
- Helpful message: "No rainfall recorded yet. Add your first entry above!"
- Typography: `text-base text-gray-600`

**Action Buttons**:
- Primary (Submit): Solid fill, `px-6 py-2 rounded-md font-medium`
- Secondary (Delete): Icon-only ghost button in table rows
- Export button: Outlined style in header area (CSV download)

## Interaction Patterns

**Form Flow**:
- Auto-focus rainfall input on page load
- Enter key submits
- Form clears after submission
- Toast appears for 3 seconds confirming entry
- Relevant tab auto-updates instantly

**Tab Behavior**:
- Click to switch tabs
- Smooth content transition (subtle fade)
- URL hash updates (#monthly-totals, #all-records)
- Active tab state persists on page refresh

**Table Interactions**:
- Hover state on rows (subtle background change)
- Delete confirmation: Inline modal/dialog
- Click date column header to toggle sort order

## Responsive Behavior

**Desktop (lg:)**:
- Horizontal form, 4-column totals grid, full table
- Stats bar: All stats inline
- Tab content uses full container width

**Tablet (md:)**:
- Horizontal form maintained, 3-column grid
- Stats bar: Wraps to 2 rows if needed
- Table remains full width

**Mobile (sm:)**:
- Stacked form inputs (vertical)
- 2-column totals grid
- Stats bar: Stacked vertically
- Table becomes card list
- Tabs: Full-width labels

## Visual Hierarchy

**Priority Order**:
1. Entry form (top, prominent card)
2. Tab navigation (clear, accessible)
3. Active tab content (Monthly Totals default)
4. Header stats (subtle, informative)

**Emphasis Techniques**:
- Elevation: `shadow-sm` for cards, `shadow-md` for form card
- Active states: Border weight and opacity changes
- Typography scale: Larger = more important
- Strategic whitespace creates breathing room

## No Images Required
Pure data application—functional clarity over decorative elements.

**Icons**: Use Heroicons via CDN throughout
- Header: cloud-rain
- Stats: chart-bar, calculator, trophy
- Actions: trash, download, plus-circle
- Empty states: cloud