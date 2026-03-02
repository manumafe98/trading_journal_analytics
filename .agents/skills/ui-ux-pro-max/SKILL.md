---
name: ui-ux-pro-max
description: "Design intelligence for building professional UI/UX. Generates complete design systems (colors, typography, patterns, effects) using 67 styles, 96 palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 13 stacks. Activates for UI/UX actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor. Covers: websites, landing pages, dashboards, admin panels, e-commerce, SaaS, portfolios, mobile apps. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode. Topics: color palette, accessibility, animation, layout, typography, font pairing, spacing, hover, shadow, gradient."
---

# UI/UX Pro Max - Design Intelligence

Searchable design database with BM25-ranked recommendations. Generates complete, tailored design systems from project requirements.

## When to Apply

Reference when designing UI components, choosing palettes/typography, reviewing UX, building landing pages/dashboards, or implementing accessibility.

## Rule Categories by Priority

| Priority | Category | Impact | Domain |
|----------|----------|--------|--------|
| 1 | Accessibility | CRITICAL | `ux` |
| 2 | Touch & Interaction | CRITICAL | `ux` |
| 3 | Performance | HIGH | `ux` |
| 4 | Layout & Responsive | HIGH | `ux` |
| 5 | Typography & Color | MEDIUM | `typography`, `color` |
| 6 | Animation | MEDIUM | `ux` |
| 7 | Style Selection | MEDIUM | `style`, `product` |
| 8 | Charts & Data | LOW | `chart` |

## Prerequisites

Python 3.x required (no external dependencies). Verify with:

```bash
python3 --version || python --version
```

## Workflow

When the user requests UI/UX work (design, build, create, implement, review, fix, improve):

### Step 1: Analyze Requirements

Extract from user request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page
- **Style keywords**: minimal, playful, professional, elegant, dark mode
- **Industry**: healthcare, fintech, gaming, education
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`

### Step 2: Generate Design System (REQUIRED)

**Always start with `--design-system`** for comprehensive recommendations:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

This searches 5 domains in parallel (product, style, color, landing, typography), applies reasoning rules from `ui-reasoning.csv`, and returns: pattern, style, colors, typography, effects, and anti-patterns.

**Example:**
```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "fintech dashboard analytics" --design-system -p "TradeView"
```

### Step 2b: Persist Design System (Optional)

Save for hierarchical retrieval across sessions with `--persist`:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

Creates `design-system/MASTER.md` (global rules) and optional `--page "dashboard"` overrides.

### Step 3: Supplement with Detailed Searches

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

| Need | Domain | Example |
|------|--------|---------|
| More style options | `style` | `"glassmorphism dark"` |
| Chart recommendations | `chart` | `"real-time dashboard"` |
| UX best practices | `ux` | `"animation accessibility"` |
| Alternative fonts | `typography` | `"elegant luxury"` |
| Landing structure | `landing` | `"hero social-proof"` |

### Step 4: Stack Guidelines

Default to `html-tailwind` if not specified:

```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

Stacks: `html-tailwind`, `react`, `nextjs`, `vue`, `nuxtjs`, `nuxt-ui`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`, `astro`

## Search Domains Reference

| Domain | Use For | Example Keywords |
|--------|---------|------------------|
| `product` | Product type recommendations | SaaS, e-commerce, portfolio, healthcare |
| `style` | UI styles, colors, effects | glassmorphism, minimalism, dark mode |
| `typography` | Font pairings, Google Fonts | elegant, playful, professional |
| `color` | Color palettes by product type | saas, ecommerce, fintech, beauty |
| `landing` | Page structure, CTA strategies | hero, testimonial, pricing |
| `chart` | Chart types, library recommendations | trend, comparison, funnel |
| `ux` | Best practices, anti-patterns | animation, accessibility, z-index |
| `react` | React/Next.js performance | waterfall, suspense, memo |
| `web` | Web interface guidelines | aria, focus, keyboard |

## Output Formats

```bash
# ASCII box (default)
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system

# Markdown
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system -f markdown
```

## Common UI Rules & Pre-Delivery

**Detailed rules**: See [COMMON_RULES.md](references/COMMON_RULES.md) for do/don't tables on icons, interactions, contrast, and layout.

**Pre-delivery checklist**: See [PRE_DELIVERY.md](references/PRE_DELIVERY.md) for validation before shipping UI code.

## Tips

1. Be specific: "healthcare SaaS dashboard" > "app"
2. Search multiple times with different keywords
3. Always check UX domain for accessibility and animation issues
4. Use `--design-system` first, then supplement with domain searches
