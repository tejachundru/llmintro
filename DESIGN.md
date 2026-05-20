---
name: "LLMs Made Simple"
description: "A single-page educational site explaining large language models to beginners through 6 interactive sessions."
colors:
  deep-space: "#0a0c0f"
  carbon-panel: "#12151a"
  graphite-card: "#1a1f28"
  ghost-border: "#ffffff14"
  mist-border: "#ffffff22"
  silver-text: "#e8eaf0"
  slate-muted: "#7a8099"
  electric-blue: "#4f9eff"
  soft-violet: "#a78bfa"
  mint-teal: "#34d399"
  tangerine: "#fb923c"
  rose-quartz: "#f472b6"
  seafoam: "#63dcb4"
typography:
  display:
    fontFamily: "'DM Serif Display', Georgia, serif"
    fontSize: "clamp(2.5rem, 7vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  hero:
    fontFamily: "'DM Serif Display', Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.2
  heading:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
  caption:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'DM Mono', 'SF Mono', 'Fira Code', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.06em"
  micro:
    fontFamily: "'DM Mono', 'SF Mono', 'Fira Code', monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "16px"
  pill: "100px"
spacing:
  2xs: "4px"
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
components:
  card-default:
    backgroundColor: "{colors.carbon-panel}"
    rounded: "{rounded.lg}"
    padding: "20px"
  card-hover:
    backgroundColor: "{colors.carbon-panel}"
    rounded: "{rounded.lg}"
    padding: "20px"
  demo-card:
    backgroundColor: "{colors.carbon-panel}"
    rounded: "16px"
    padding: "24px"
---

# Design System: LLMs Made Simple

## 1. Overview

**Creative North Star: "The Neon Classroom"**

A vivid, playful learning environment that feels more like a neon-lit arcade than a classroom. The dark canvas (Deep Space) creates the focus of a planetarium; each session injects a saturated accent color like a different neon sign lighting a new topic. The result is immersive, energetic, and a little theatrical without becoming kitschy.

The aestheticrejects the sterile white-canvas educational norm and the generic SaaS landing page template (blue gradients, stock photos, identical card grids). It also avoids being childish or cartoonish despite the playful energy. The typographic pairing of DM Serif Display for display headings and Outfit for body text grounds the vividness in editorial sophistication. DM Mono handles labels and metadata with a technical precision that signals credibility.

Density is moderate: generous vertical spacing between sections (64px dividers), compact within cards. Content is written for both technical and non-technical readers with progressive complexity across 6 sessions.

**Key Characteristics:**
- Dark-first environment where color is used deliberately and sparingly per session
- Each session owns one accent color; no color bleeds across sessions
- Flat at rest, subtle motion on interaction (translateY hover lifts, fade-in reveals)
- Monospace labels and metadata contrast with serif display headings for visual tension
- No gradients on UI surfaces; the exception is a hero gradient used on the "Made Simple" italic

## 2. Colors

A dark palette with six session-specific accent colors and a neutral scale that uses blue-tinted grays.

### Primary
- **Electric Blue** (#4f9eff): Session 1 (Tokenizer). The entry point color, anchoring the hero gradient with Soft Violet.

### Secondary
- **Soft Violet** (#a78bfa): Session 2 (Attention). Paired with Electric Blue in the hero gradient. Used in the brand's primary gradient: `linear-gradient(135deg, Electric Blue, Soft Violet)`.
- **Mint Teal** (#34d399): Session 3 (Context). A grounding warmth after the cool first two sessions.
- **Tangerine** (#fb923c): Session 4 (RAG). The warmest color, marking a shift toward practical application.
- **Rose Quartz** (#f472b6): Session 5 (Prompting). Playful energy for the most immediately applicable session.
- **Seafoam** (#63dcb4): Session 6 (MCP & Tools). A fresh, forward-looking closer.

### Neutral
- **Deep Space** (#0a0c0f): Page background. Near-black with faint blue undertone.
- **Carbon Panel** (#12151a): Card and surface background. Slightly lifted from Deep Space.
- **Graphite Card** (#1a1f28): Elevated surfaces (table headers, code blocks).
- **Ghost Border** (#ffffff14 / white at 8%): Default card and divider borders. Barely visible, creates structure without weight.
- **Mist Border** (#ffffff22 / white at 13%): Hover-state borders. Slightly stronger to signal interactivity.
- **Silver Text** (#e8eaf0): Primary body and heading text. Off-white with cool undertone.
- **Slate Muted** (#7a8099): Secondary text, captions, labels. Cool desaturated blue-gray.

### Named Rules
**The One-Session-One-Color Rule.** Each of the 6 sessions uses exactly one accent color for its section. No session borrows another's color. The accent appears in the SectionHeader badge, ConceptBlock borders, KeyPoint number badges, FlowDiagram steps, RecapBox labels, and interactive demo highlights.

**The Tint Only Rule.** Accent colors are never used at full opacity on backgrounds. They appear at reduced opacity: `08` (3%), `0a` (4%), `1e` (12%), `22` (13%), `44` (27%). This keeps the dark canvas dominant.

**The No-Gradient-Surfaces Rule.** UI surfaces (cards, boxes, tables) never use gradients. The sole gradient exception is the hero's "Made Simple" italic text: `linear-gradient(135deg, Electric Blue, Soft Violet)` via `background-clip: text`.

## 3. Typography

**Display Font:** DM Serif Display (Georgia, serif fallback)
**Body Font:** Outfit (system-ui, -apple-system, sans-serif fallback)
**Label/Mono Font:** DM Mono (SF Mono, Fira Code, monospace fallback)

A three-font system that creates strong visual roles: DM Serif Display commands attention as the editorial voice for session titles and the hero. Outfit handles the readable, approachable body text. DM Mono signals technical content (labels, tags, code, metadata) with uniform letter-spacing.

### Hierarchy
- **Display** (400, clamp(2.5rem, 7vw, 5rem), 1.1): Hero title only. DM Serif Display. Maximum visual impact with responsive scaling.
- **Hero / Section Title** (400, 32px / 26px, 1.2): Session titles within SectionHeader. DM Serif Display. Smaller than the hero but maintains serif grandeur.
- **Heading** (500, 22px, 1.4): Sub-section titles via SubSection component. Outfit. Serif-free to contrast with session titles.
- **Sub-Heading** (400, 18px, 1.4): Card titles (DemoCard), in-content emphases. Outfit.
- **Body** (400, 15px, 1.75): Paragraph text, descriptions. Outfit with relaxed line-height for comfortable reading on dark backgrounds.
- **Body Large** (400, 16px, 1.6): Demo descriptions and slightly emphasized prose. Outfit.
- **Caption** (400, 13px, 1.6): Secondary content: card descriptions, table cells, recap items. Outfit.
- **Label** (400, 12px, mono, 0.06em): Monospace labels for tags, metadata, tags.
- **Micro** (400, 11px, mono, 0.1em uppercase): Smallest text: SectionHeader tags, table headers, RecapBox label. DM Mono, wide letter-spacing, always uppercase.

### Named Rules
**The Serif Headline Rule.** DM Serif Display is reserved for the hero title and session section titles (via SectionHeader). It never appears on body text, buttons, or inline labels.

**The Mono Metadata Rule.** DM Mono is used exclusively for structural metadata: tags, labels, micro-copy that categorizes or identifies. Never for flowing prose.

## 4. Elevation

The system is primarily flat and tonal. Depth is conveyed through bg shade steps (Deep Space → Carbon Panel → Graphite Card) rather than shadows. Interactive elements gain hover shadows for tactile feedback.

### Shadow Vocabulary
- **Hover lift** (`transform: translateY(-2px)`, border brightens from Ghost to Mist): Cards on hover. A 2px upward translation with border brightening creates subtle elevation without visible box-shadow.
- **No ambient shadows.** At-rest state is always shadowless. Depth comes from background shade transitions only.

### Named Rules
**The Tonal-First Rule.** Three background shades handle all depth: Deep Space (base), Carbon Panel (raised surfaces), Graphite Card (highest emphasis surfaces like code blocks and table headers). Shadows are reserved for hover interaction only.

## 5. Components

Components use inline styles with CSS variable tokens. Each component accepts an `accent` prop that ties it to the current session's color.

### SectionHeader
The session entry point. Displays a numbered badge (mono, rounded square) alongside the session tag (micro, uppercase) and serif title.
- **Badge:** 42×42px, rounded 12px, accent-tinted background at 12% opacity, accent border, mono text
- **Tag:** Micro, DM Mono, uppercase, wide letter-spacing, slate-muted color
- **Title:** Serif, 32px hero size, tight line-height

### AnalogyCard / AnalogyGrid
Grid cards for analogies and comparisons. The grid uses `repeat(auto-fit, minmax(200px, 1fr))` for responsive columns.
- **Card:** Carbon Panel background, Ghost border, 14px radius, 20px padding. Hover: border brightens to Mist, 2px translateY lift.
- **Emoji:** 28px, above the title.
- **Title:** Body-large, weight 500. **Description:** Caption, slate-muted.

### DemoCard
Container for interactive demos within a session.
- **Label:** Micro, uppercase, DM Mono, slate-muted (e.g. "Interactive Demo").
- **Title:** Body, weight 500.
- **Container:** Carbon Panel, Ghost border, 16px radius, 24px padding.

### ConceptBlock
Side-bordered block for key concept callouts.
- **Border:** 3px left border in session accent color.
- **Background:** Accent at 4% opacity.
- **Title:** Serif, body-large, accent color.
- **Body:** Body-large, slate-muted.

### KeyPoint
Numbered takeaway point with a small badge.
- **Badge:** 28×28px, rounded 8px, accent tint at 12%, accent border, mono font.
- **Title:** Body-large, weight 500. **Description:** Caption, slate-muted.

### FlowDiagram
Horizontal stepped flow with arrow connectors.
- **Step nodes:** 10px radius, accent-tinted background, accent border. Label (caption, weight 500) + sub (micro, muted).
- **Connectors:** Accent color, decreased opacity, `→` character.

### SubSection
Content group with a ruled heading.
- **Heading:** Serif, sub-heading size, with a 1px accent-tinted bottom border.

### RecapBox
End-of-session summary list.
- **Container:** Accent-tinted background (3%), accent border (13% opacity), 12px radius.
- **Label:** Micro, uppercase, DM Mono, accent color.
- **Items:** Caption, slate-muted, with accent `→` prefix.

### CodeExample
Styled code block.
- **Background:** Graphite Card, 10px radius, accent-tinted border (13% opacity).
- **Font:** DM Mono, label size, relaxed line-height.

### BeforeAfter
Two-column comparison (before/after).
- **Before column:** Red-tinted background (5%), red border (30%), red mono label.
- **After column:** Accent-tinted background (4%), accent border (27%), accent mono label.
- **Structure:** `grid-template-columns: 1fr 1fr`, 12px radius.

### ComparisonTable
Data table with accent-colored column headers.
- **Header row:** Graphite Card background, Ghost border bottom. First column: silver text. Remaining columns: accent color.
- **Body rows:** Ghost borders between rows. First column: silver, weight 500. Other columns: slate-muted, weight 400.

### InfoBox / WarningBox
Tinted callout boxes for supplementary info and warnings.
- **InfoBox:** Accent at 3% background, 13% border, 12px radius, body-large text, slate-muted.
- **WarningBox:** Accent at 4% background, 27% border, 10px radius, caption text, accent color.

### StepReveal / AnimatedFlow
Animated components using CSS keyframes (`fadeUp`, `fadeIn`, `chipIn`).
- **StepReveal:** Sequential text reveal with `translateX` transitions and accent highlight on the latest step.
- **AnimatedFlow:** Chip-style items appearing with `chipIn` animation, connected by an animated `→` arrow.

### Divider
Minimal horizontal rule. 1px Ghost border, max-width 900px, centered.

## 6. Do's and Don'ts

**Do:**
- Use accent colors at reduced opacity for backgrounds and tints (08, 0a, 1e, 22, 44 hex suffix).
- Keep surfaces flat at rest; reserve hover transforms (translateY -2px + border brighten) for interactive elements.
- Use DM Serif Display only for the hero title and session section titles.
- Use DM Mono only for structural metadata (tags, labels, micro-copy).
- Rely on the three-shade tonal system (Deep Space → Carbon Panel → Graphite Card) for depth.
- Keep the max content width implicit via card and divider constraints (~900px).
- Use Outfit for all body text and UI copy.

**Don't:**
- Never use gradients on UI surfaces (cards, boxes, buttons, backgrounds). The hero text gradient is the sole exception.
- Never use an accent color from one session inside another session's section.
- Never use box-shadows on resting elements. Hover states use translateY, not shadow.
- Never apply DM Serif Display to body text, labels, or buttons.
- Never use `#000` or `#fff` as raw values. Use the CSS variables (tinted neutrals) instead.
- Never nest cards (a card containing another card).
- Never use side-stripe borders wider than 3px. ConceptBlock's 3px left border is the maximum.
