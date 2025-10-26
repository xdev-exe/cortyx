# Cortyx AI-Driven ERP: Design Guidelines

## Design Approach
**Selected Approach:** Custom Design System with Material Design influences
**Justification:** Enterprise ERP requires stability, consistency, and data-density handling. The AI-driven nature demands a futuristic aesthetic while maintaining professional credibility.

## Core Design Principles
- **Minimalist Professionalism:** Clean, uncluttered interfaces that prioritize function
- **Futuristic Intelligence:** Subtle tech-forward elements suggesting AI capability
- **Data Clarity:** Information-dense layouts with excellent readability
- **Modular Consistency:** Reusable patterns across dynamic content

## Color Palette

### Light Mode
- **Background Base:** 0 0% 100% (pure white)
- **Background Secondary:** 60 5% 96% (stone-50)
- **Background Tertiary:** 60 5% 90% (stone-100)
- **Text Primary:** 24 10% 10% (stone-900)
- **Text Secondary:** 60 5% 35% (stone-600)
- **Border Default:** 60 5% 85% (stone-200)
- **Primary Accent:** 262 83% 58% (sharp purple/violet for CTAs)
- **Success:** 142 71% 45%
- **Error:** 0 84% 60%

### Dark Mode
- **Background Base:** 24 10% 8% (near-black stone)
- **Background Secondary:** 24 10% 12% (stone-900)
- **Background Tertiary:** 60 5% 18% (stone-800)
- **Text Primary:** 60 9% 98% (stone-50)
- **Text Secondary:** 60 5% 65% (stone-400)
- **Border Default:** 60 5% 25% (stone-700)
- **Primary Accent:** 262 83% 65% (brighter purple for dark mode)
- **Success:** 142 71% 55%
- **Error:** 0 84% 70%

## Typography

### Font Families
- **Primary:** Inter (Google Fonts) - UI, body text, data tables
- **Display:** Space Grotesk (Google Fonts) - Headers, landing page hero

### Type Scale
- **Hero Display:** 3.5rem (56px), font-weight 700, tracking-tight
- **Page Headers (H1):** 2rem (32px), font-weight 600
- **Section Headers (H2):** 1.5rem (24px), font-weight 600
- **Subsection Headers (H3):** 1.125rem (18px), font-weight 600
- **Body Text:** 0.875rem (14px), font-weight 400, line-height 1.5
- **Small/Meta Text:** 0.75rem (12px), font-weight 400
- **Data Tables:** 0.8125rem (13px), font-weight 400, tabular-nums

## Layout System

### Spacing Units
**Primary Units:** 2, 4, 6, 8, 12, 16, 24, 32 (Tailwind spacing)
- **Micro spacing:** p-2, gap-2 (form field gaps, button padding)
- **Component spacing:** p-4, p-6 (card padding, modal padding)
- **Section spacing:** p-8, p-12 (page sections, major layout areas)
- **Page spacing:** p-16, p-24 (top-level page padding)

### Grid & Containers
- **Max Content Width:** max-w-7xl (1280px) for main application content
- **Table Container:** Full-width with horizontal scroll
- **Form Container:** max-w-4xl (896px) for optimal form readability
- **Sidebar Width:** 16rem (256px) expanded, 4rem (64px) collapsed

## Component Library

### Navigation Components
**Main Sidebar:**
- Collapsible accordion structure for modules
- Module headers: font-weight 600, text-sm, tracking-wide, uppercase
- DocType links: font-weight 400, text-sm, with hover background transition
- Active state: Primary accent left border (4px), subtle background tint
- Collapse icon: Heroicons chevron-right/chevron-down

**Top Header:**
- Height: h-16 (64px)
- User dropdown: Avatar circle (32px), name truncated, Heroicons user-circle
- Settings icon: Heroicons cog-6-tooth
- Theme toggle: Sun/moon icons, smooth transition

### Data Display Components
**DataTable:**
- Header row: Background secondary, text-xs uppercase, font-weight 600, tracking-wide
- Data rows: Alternating subtle backgrounds, hover state with background change
- Cell padding: px-6 py-4
- Borders: 1px border-b on each row
- Action icons: Heroicons pencil-square (edit), trash (delete), sized 18px
- Pagination: Number buttons, prev/next arrows, active state highlighted

**Card Components:**
- Border: 1px solid border-default
- Border radius: rounded-lg (8px)
- Shadow: Minimal (shadow-sm), increase on hover (shadow-md)
- Padding: p-6 for content cards

### Form Components
**Input Fields:**
- Height: h-10 (40px) for text inputs
- Border: 1px solid border-default, focus ring with primary accent
- Border radius: rounded-md (6px)
- Padding: px-3 py-2
- Label: text-sm font-weight 500, mb-2 spacing

**Select Dropdowns:**
- Chevron-down icon from Heroicons
- Same styling as text inputs
- Dropdown menu: shadow-lg, border, max-h-60 with scroll

**Link Field Modal:**
- Overlay: backdrop-blur-sm with bg-black/50
- Modal container: max-w-4xl, rounded-lg, shadow-2xl
- Header: "Select [DocType Name]", close icon (Heroicons x-mark)
- Embedded DataTable with search bar
- "Configure Columns" button in modal header (secondary style)

**Text Editor:**
- Toolbar: Background secondary, border-b
- Editor area: min-h-40, border-t
- Use Tiptap or similar for rich text

**Buttons:**
- **Primary CTA:** Background primary accent, text white, px-6 py-2.5, rounded-md, shadow-sm, hover:brightness-110
- **Secondary:** Border 1px, background transparent, text primary, hover:background-secondary
- **Outline on Images:** backdrop-blur-md, bg-white/10 dark:bg-black/20, border white/30, text white
- **Icon Buttons:** p-2, rounded, hover:background-secondary
- **"New" Button:** Primary style, with Heroicons plus icon

### Status & Feedback
**Status Badges:**
- Small pill shape: rounded-full, px-2.5 py-0.5, text-xs font-weight 500
- Success: bg-green-100 dark:bg-green-900/30, text-green-700 dark:text-green-300
- Warning: bg-yellow-100 dark:bg-yellow-900/30, text-yellow-700 dark:text-yellow-300
- Error: bg-red-100 dark:bg-red-900/30, text-red-700 dark:text-red-300

## Landing Page Specific Design

### Hero Section
- **Layout:** Full viewport height (min-h-screen), centered content
- **Background:** Animated neural network visualization - subtle, slow-moving connections between nodes, low opacity (20-30%), primary accent color with gradients
- **Headline:** "Cortyx: The Self-Operating ERP" - Display font, 3.5rem, font-weight 700, with subtle text gradient from white to stone-200
- **Subheadline:** 1.25rem, stone-300, max-w-2xl, explaining AI-driven automation
- **CTA Button:** Large primary button "Login" or "Explore Demo", px-8 py-4, text-lg
- **Visual Treatment:** Dark background (stone-950), content overlaid with subtle blur backdrop

### Navigation Bar
- **Position:** Fixed top, backdrop-blur-md, bg-white/80 dark:bg-stone-900/80
- **Links:** "Features", "Pricing", "About" - text-sm, font-weight 500, hover:text-primary-accent
- **Login Button:** Primary accent, smaller than hero CTA

### Features Section
- **Layout:** 3-column grid (grid-cols-1 md:grid-cols-3)
- **Cards:** Each feature in a card with icon (64px), title (h3), description
- **Icons:** Use Heroicons - cpu-chip (AI), chart-bar (Analytics), shield-check (Security)
- **Spacing:** py-24 section padding

### Login Page
- **Container:** Centered, max-w-md, card styling
- **Form:** Email and password inputs with labels, primary CTA button "Sign In"
- **Background:** Subtle gradient from stone-50 to stone-100 (light mode), stone-900 to stone-950 (dark)

## Application Layout Pages

### List View (/[doctype])
- **Page Header:** DocType name as H1, "New" button on right, search bar below
- **DataTable:** Full-width container, responsive horizontal scroll
- **Empty State:** Centered icon (Heroicons folder-open), message, "Create First" button

### Form View (Create/Edit)
- **Layout:** Two-column grid on desktop (grid-cols-2 gap-6), single column on mobile
- **Field Groups:** Optional section headers for logical grouping
- **Submit Bar:** Sticky bottom or top-right, "Save" primary button, "Cancel" secondary

### Document View
- **Layout:** Two-column read-only display, labels font-weight 500, values regular
- **Header:** Document name/ID as H1, "Edit" button top-right
- **Link Fields:** Clickable, styled as links with hover underline

## Animation Guidelines
- **Transitions:** All hover states use transition-colors duration-200
- **Sidebar Collapse:** transition-all duration-300 ease-in-out
- **Modal Entry:** fade-in with scale-95 to scale-100, duration-200
- **Hero Background:** Subtle continuous animation (3-5s cycle), GPU-accelerated

## Accessibility
- All interactive elements have focus states with visible ring
- Color contrast meets WCAG AA standards
- Form labels properly associated with inputs
- Keyboard navigation fully supported
- Dark mode maintains readability and contrast

## Responsive Breakpoints
- **Mobile:** < 768px - Single column, collapsed sidebar becomes drawer
- **Tablet:** 768px - 1024px - Sidebar visible, two-column forms become single
- **Desktop:** > 1024px - Full layout with sidebar, multi-column grids

## Images
**Hero Section Background:** Abstract neural network visualization - interconnected nodes with glowing lines, primarily in primary accent color with gradients. Dark background with nodes appearing as subtle glowing points. Animated but subtle - nodes pulse gently, connections fade in/out. Creates sense of AI intelligence and data flow.