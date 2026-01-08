# Rainfall Tracking App - Design Guidelines

## Design Approach
**System**: Material Design / Clean Data Application Pattern
**Rationale**: Utility-focused productivity tool prioritizing efficiency, clarity, and data readability over visual flair. Reference: Linear's clean data presentation + Notion's simple form design.

## Core Design Principles
1. **Data-First**: Information hierarchy optimized for quick scanning and entry
2. **Efficiency**: Minimal clicks from landing to data entry completion
3. **Clarity**: Clear visual separation between entry, records, and summaries

## Layout System

**Container Structure**:
- Main container: `max-w-4xl mx-auto` - optimal width for forms and tables
- Consistent vertical spacing: `py-8` for sections, `py-16` for page padding
- Card-based layout with subtle elevation for distinct sections

**Spacing Scale**: Use Tailwind units of 2, 4, 6, and 8 for consistency
- Gaps: `gap-4` for form fields, `gap-6` between sections
- Padding: `p-6` for cards, `p-4` for compact elements
- Margins: `mb-8` between major sections

## Typography

**Font Stack**: Inter or System UI fonts via Google Fonts
- Headings: `text-2xl font-semibold` (page title), `text-lg font-medium` (section headers)
- Body: `text-base` for labels and data, `text-sm` for meta information
- Data tables: `font-mono text-sm` for numerical values (rainfall amounts)

## Component Library

**Primary Layout**:
Single-column layout with three stacked sections:
1. **Entry Form Card** (top priority - always visible)
2. **Monthly Totals Summary** (prominent cards grid)
3. **Records Table** (chronological list below)

**Entry Form**:
- Compact horizontal form layout on desktop (`flex gap-4`)
- Two inputs side-by-side: Date picker + Rainfall input
- Submit button aligned right
- Validation messages beneath inputs
- Input styling: Border-based with focus states, rounded corners (`rounded-md`)

**Monthly Totals Display**:
- Grid of cards: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
- Each card shows: Month/Year + Total rainfall
- Highlight current month with subtle border treatment
- Large, prominent numbers for totals (`text-3xl font-bold`)
- Month labels in smaller text (`text-sm text-gray-600`)

**Records Table**:
- Clean table with alternating row background for scannability
- Three columns: Date | Rainfall (mm) | (future: actions)
- Monospace font for rainfall values
- Sort by date descending (most recent first)
- Responsive: Stack to cards on mobile with date as header

**Navigation/Header**:
- Minimal header with app title and icon
- No complex navigation needed
- Optional: Export/Settings icons on right

## Interaction Patterns

**Form Behavior**:
- Auto-focus date input on page load
- Enter key submits form
- Clear form after successful submission
- Show success feedback (toast or inline message)

**Data Display**:
- Instant update of monthly totals and table after new entry
- Smooth transitions when data appears (subtle fade-in)
- No loading spinners for in-memory operations

## Responsive Behavior

**Desktop** (lg:):
- Horizontal form layout
- 4-column totals grid
- Full table view

**Tablet** (md:):
- Horizontal form maintained
- 3-column totals grid
- Full table view

**Mobile**:
- Stacked form inputs
- 2-column totals grid
- Card-based record list (not table)

## Visual Hierarchy

**Priority Order**:
1. Entry form (most prominent, top position)
2. Current month total (visual emphasis)
3. Other monthly totals
4. Historical records table

**Emphasis Techniques**:
- Elevation: Subtle shadow on cards (`shadow-sm`)
- Border weight: Thicker border on focused elements
- Spacing: Generous padding creates importance
- Typography scale: Larger text = higher priority

## No Images Required
This is a pure data application - no hero images, illustrations, or decorative graphics needed. Focus remains on functional clarity.

---

**Implementation Note**: Maintain consistent card pattern throughout - all major sections (form, totals, table) use same card styling with `bg-white rounded-lg shadow-sm p-6` for visual cohesion.