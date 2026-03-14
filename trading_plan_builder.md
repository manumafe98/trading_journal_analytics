# Trading Plan Page Builder — Implementation Plan
> Target model: **Claude Opus 4.6** · Feature scope: Page Builder with PDF export styled after `trading_plan_v2_0.html`

---

## 0. Prerequisite: Design Audit (Do This First)

**Before writing a single line of builder UI, you must analyze the existing app's visual language.**

The builder must be invisible — it should feel like a native part of the app, not a third-party tool dropped in. Instruct Claude to:

1. **Read all existing CSS files** and extract:
   - Color tokens (backgrounds, borders, text, accents)
   - Typography (font families, weights, sizes, line heights)
   - Spacing scale (padding, margin, gap units)
   - Border radius values
   - Shadow styles
   - Component patterns (buttons, inputs, modals, sidebars)

2. **Read all existing component files** and catalogue:
   - How cards/panels are structured
   - How navigation and toolbars are built
   - How modals/drawers open and close
   - How drag interactions are currently used (if any)
   - How dark/light themes are toggled (if applicable)

3. **Document a design token map** before proceeding:
   ```
   --color-bg-primary: [extracted value]
   --color-bg-card: [extracted value]
   --color-border: [extracted value]
   --color-accent: [extracted value]
   --font-primary: [extracted value]
   --radius-card: [extracted value]
   ```

4. **Only after this audit**, begin building. Every new component must reference these extracted tokens — never introduce new CSS variables or hardcoded values that diverge from what already exists.

---

## 0.5. Navigation Audit & Wiring (Do This Second)

**The builder does not exist in the app yet — it needs a home. Before any builder component is built, find the navigation and add the new route.**

This must happen immediately after the design audit (Section 0) and before any builder UI is written. The reason: the navigation component dictates the page structure, route naming convention, and potentially the layout wrapper that every page — including the builder — must live inside.

### Step 1 — Locate the Navigation

Instruct Claude to search the codebase for the navigation component. Common locations and patterns to look for:

```
# Search patterns (run these to find it)
- src/components/Navigation.*
- src/components/Sidebar.*
- src/components/Nav.*
- src/layout/
- src/components/Layout.*
- Look for <nav>, <aside>, or a component that renders a list of route links
- Look for a router config file: routes.ts, router.ts, App.tsx, main.tsx
```

### Step 2 — Understand How Navigation Works

Once found, Claude must read the navigation component fully and answer:

1. **What is the nav type?** Sidebar (vertical) / top bar (horizontal) / hybrid?
2. **How are nav items defined?** Hard-coded JSX, a config array (`routes[]`), or dynamic?
3. **How does routing work?** React Router `<Link>`, Next.js `<Link>`, or custom?
4. **How is the active state communicated?** `useLocation()`, `pathname`, class toggle?
5. **What data does a nav item carry?** At minimum: `{ label, path, icon }` — note the exact shape.
6. **Is there grouping or sections?** (e.g., a "Tools" group or a divider before certain items)
7. **Does the nav use icons?** If so, what icon library (Lucide, Heroicons, Phosphor, etc.)? Note the import pattern.
8. **What wraps the page content?** Identify the layout shell component — the builder page must be rendered inside the same wrapper as all other pages.

### Step 3 — Add the New Nav Item

After understanding the nav's structure, add the Trading Plan Builder entry following **the exact same pattern** as existing items. Do not invent a new pattern.

Example — if nav items are defined as a config array:
```typescript
// Before (existing pattern — read from actual file)
const navItems = [
  { label: 'Dashboard',  path: '/dashboard',  icon: LayoutDashboard },
  { label: 'Journal',    path: '/journal',     icon: BookOpen },
  // ...
];

// After — add the new item in the most logical position
// (likely grouped with other planning/analysis tools)
const navItems = [
  { label: 'Dashboard',     path: '/dashboard',      icon: LayoutDashboard },
  { label: 'Journal',       path: '/journal',         icon: BookOpen },
  { label: 'Plan Builder',  path: '/plan-builder',    icon: LayoutTemplate }, // ← new
  // ...
];
```

**Icon choice:** Use whatever icon best represents a page/document builder from the app's existing icon library. Prefer `LayoutTemplate`, `FileText`, `PanelLeft`, or `Blocks` (Lucide names). Match the import style already used in the file.

**Label language:** If the rest of the nav uses Spanish labels, use `Plan Builder` or `Constructor de Plan`. Match the language convention of the app.

### Step 4 — Register the Route

Find where routes are declared (usually `App.tsx`, `router.ts`, or a routes config) and add:

```typescript
// Match the existing pattern exactly. Examples:

// React Router v6 pattern:
<Route path="/plan-builder" element={<PlanBuilderPage />} />

// Or if using a routes array:
{ path: '/plan-builder', component: PlanBuilderPage, label: 'Plan Builder' }
```

Create the `PlanBuilderPage` file as an **empty shell** that just renders `<div>Plan Builder — Coming Soon</div>` inside the app's standard layout wrapper. Confirm the route loads and the nav item highlights correctly before writing any builder code.

### Step 5 — Verify Before Proceeding

Before moving to the actual builder implementation, confirm:
- [ ] Nav item appears in the navigation at the correct position
- [ ] Clicking the nav item navigates to `/plan-builder` (or equivalent path)
- [ ] Active state highlights correctly when on that route
- [ ] The page renders inside the same layout shell as all other pages (header, sidebar, etc. all present)
- [ ] No existing routes or nav items were broken

Only after this checklist passes, proceed to Section 1 and begin building the builder itself.

---

## 1. Overview

A grid-based drag-and-drop page builder where users compose a trading plan from pre-built content blocks, fill them out interactively, and export the result as a **PDF styled exactly like `trading_plan_v2_0.html`** — the same dark theme, JetBrains Mono font, card system, bullet types, badges, section headers, and layout.

The blocks are seeded with real content from the user's actual Trading Plan v2.0 so there is no blank-page paralysis.

---

## 2. Design System Reference: `trading_plan_v2_0.html`

The exported PDF must match this reference document precisely. Document these elements for use in the PDF renderer:

### 2.1 Color Tokens
```css
--bg:            #0d0d0d
--bg2:           #111111
--bg3:           #161616
--card:          #1a1a1a
--card2:         #1e1e1e
--border:        #2a2a2a
--border2:       #333333
--text:          #d4d4d4
--text-dim:      #888888
--text-faint:    #555555
--accent-blue:   #3b7dd8
--accent-red:    #c0392b
--accent-green:  #27ae60
--accent-yellow: #d4ac0d
--accent-cyan:   #17a589
--white:         #f0f0f0
```

### 2.2 Typography
- **Primary font:** `JetBrains Mono` (weights 300–700)
- **Display font:** `Space Mono` (weights 400, 700) — used for cover title and large stat values
- **Base size:** 8.5pt / body; scale down to 6pt for labels, up to 28pt for cover title

### 2.3 Component Vocabulary (replicate in PDF output)
| Component | Visual rule |
|---|---|
| `.page` | 210mm × 297mm, `--bg` background, `--margin: 14mm` padding |
| `.page-header` | flex row, `border-bottom: 1px solid --border2`, 4px padding |
| `.page-footer` | flex row, `border-top: 1px solid --border`, auto margin-top |
| `.section-title` | flex row with icon + UPPERCASE h2 + flex-1 line (`--border`) |
| `.card` | `--card` bg, `1px solid --border`, `border-radius: 4px`, 8px/10px padding |
| `.card-label` | 6pt, `--text-faint`, `letter-spacing: 0.14em`, UPPERCASE |
| `.list-item` | flex row, bullet + text, `border-bottom: 1px solid --border` |
| `.bullet-arrow` | color `--accent-blue`, char `→` |
| `.bullet-x` | color `--accent-red`, char `✗` |
| `.bullet-check` | color `--accent-green`, char `✓` |
| `.bullet-warn` | color `--accent-yellow`, char `⚠` |
| `.badge-blue` | bg `#1a3557`, text `#6baed6` |
| `.badge-red` | bg `#4a1010`, text `#e07070` |
| `.badge-green` | bg `#0e2e1a`, text `#52b870` |
| `.stat-block` | centered card, large Space Mono number, small label |
| `.check-item` | flex row, 12×12px checkbox outline + text |
| `.q-item` | flex row, dimmed number prefix + question text |
| `.two-col` | `grid-template-columns: 1fr 1fr; gap: 8px` |
| `.alert` | `border-left: 3px solid --accent-yellow`, bg `#1c1a0f` |
| `.alert-info` | `border-left-color: --accent-blue`, bg `#0e1a2b` |

---

## 3. Block Library

Each block is a draggable preset with default content sourced from Trading Plan v2.0. Content is short, instructional, and editable.

### 3.1 Block Definitions

---

#### BLOCK 01 — Perfil del Trader
**Size:** 2×1 | **Type:** key-value pairs

```
Estilo:        Conservador · Moderado
Tipo Actual:   Day Trader
Objetivo:      Day + Scalping
Mercado:       Forex — Cripto incorporando
Precision:     100%
```
*Prompt hint: "Define tu estilo de trading. ¿Eres conservador, moderado o agresivo? ¿Qué mercados operas?"*

---

#### BLOCK 02 — Metas Principales
**Size:** 2×1 | **Type:** bullet list (arrow)

```
→ Fondeo: [nombre cuenta] + [mercado objetivo]
→ Consistencia: rentabilidad y libertad horaria
→ Futuro: [meta personal a largo plazo]
```
*Prompt hint: "¿Cuáles son tus 2-3 metas más importantes como trader? Sé específico."*

---

#### BLOCK 03 — Gestión Monetaria
**Size:** 4×1 (full-width) | **Type:** table

| Modalidad | Riesgo/Trade | Simultáneos | Observación |
|---|---|---|---|
| Day Trading | 1% | Máx. 2 globales | Total entre modalidades ≤ 2 |
| Swing Trading | 1.5% | Máx. 2 globales | Si hay swing sin cierre: +1 Day/Scalping |
| Scalping | 0.5% | Máx. 2 globales | Ej: 1 Day + 1 Scalping |

*Alert:* `⚠ Regla Global: El máximo global de trades simultáneos es 2.`
*Prompt hint: "¿Cuánto arriesgas por operación en cada modalidad? ¿Cuántos trades simultáneos te permites?"*

---

#### BLOCK 04 — Estrategias Activas
**Size:** 4×1 (full-width) | **Type:** table with badges

| Estrategia | Modalidad | Estado | TP Target | Notas |
|---|---|---|---|---|
| BLUE | Day Trading | ✓ ACTIVA | Máx/mín anterior (cuerpo) | Mejor estrategia |
| RED | Day Trading | ✓ ACTIVA | Máx/mín anterior (cuerpo) | — |
| RED Scalping | Scalping | ↻ INCORPORANDO | — | Requiere backtesting |

*Prompt hint: "Lista tus estrategias. ¿Cuáles están activas? ¿Cuáles estás incorporando?"*

---

#### BLOCK 05 — Gestión del Trade
**Size:** 2×1 | **Type:** bullet list

```
→ Estado actual: Sin gestión de posición activa.
→ Requisito para cambio: Tras 1-2 revisiones, si se detecta patrón en contra, analizar e implementar de forma controlada.
```
*Prompt hint: "¿Gestionas tu posición durante el trade (mover SL, cierre parcial)? ¿Qué reglas tienes?"*

---

#### BLOCK 06 — Sesiones
**Size:** 1×2 | **Type:** session cards

```
Day Trading:  Toda sesión EEUU + Cierre de Londres
Scalping:     Primeras 2hs EEUU — dejar al terminar
```
*Prompt hint: "¿En qué horarios operas? ¿Hay momentos en que NO operas?"*

---

#### BLOCK 07 — Entradas
**Size:** 2×1 | **Type:** bullet list

```
→ Estado actual: Solo entradas a mercado.
→ Incorporación de Limit: 25 trades en backtesting + reglas claras antes de live.
→ Monitoreo: Tras 1-2 revisiones, si hay patrón beneficioso, backtestearlo antes de implementar.
```
*Prompt hint: "¿Entras a mercado o con límite? ¿Qué reglas tienes para tus entradas?"*

---

#### BLOCK 08 — Reglas Generales
**Size:** 2×1 | **Type:** bullet list (mix de ✗ y →)

```
✗ No ejecutar trades antes de noticias de alto impacto.
✗ Cerca del cierre de viernes: no operar salvo certeza de cierre previo.
✗ No operar si estás enfermo, desmotivado o con problemas personales.
→ Máximo 2 trades simultáneos globales.
```
*Prompt hint: "¿Qué reglas absolutas tienes? Las de tipo NO HACER son tan importantes como las de hacer."*

---

#### BLOCK 09 — Proceso de Revisión
**Size:** 2×1 | **Type:** table

| Tipo | Frecuencia | Actividad |
|---|---|---|
| Trades | Cada 10 trades o 1 mes | Revisar ejecuciones, conclusiones y mejoras |
| Backtesting | Cada 30–45 días | Pulir operativas, testear activos/temporalidades |
| Livetesting | Cada 45 días | Revisar trades no ejecutados en journal |

*Prompt hint: "¿Con qué frecuencia revisas tus resultados? ¿Qué analizas en cada revisión?"*

---

#### BLOCK 10 — Objetivos
**Size:** 2×1 | **Type:** bullet list (→)

```
→ Preparar trades de especialización cripto
→ Aprobar examen de especialización cripto
→ Seguir puliendo operativas de Green, Red y Blue
→ Ganar experiencia con riesgo del 1%
→ Integrar herramientas de AI al trading
→ Explorar oportunidades en DeFi
```
*Prompt hint: "¿Cuáles son tus objetivos concretos para este trimestre/año?"*

---

#### BLOCK 11 — Reglas de Estrategia (Configurable por Estrategia)
**Size:** 2×2 | **Type:** structured sections + bullet list

Sub-secciones:
- **Condiciones de Entrada** (arrow bullets)
- **HTF / Descartes Automáticos** (✗ bullets)
- **Parámetros Clave** (key-value: EMA, Fibo, RR mínimo)
- **Gestión específica** (arrow bullets)

*Prompt hint: "Define las reglas completas de esta estrategia. ¿Qué condiciones deben cumplirse para entrar? ¿Qué te hace descartar el setup?"*

---

#### BLOCK 12 — Checklist Pre-Sesión (Psicológico)
**Size:** 2×1 | **Type:** checklist

```
☐ Lista de seguimiento completada durante sesión de Londres, previo a apertura EEUU.
☐ Alarmas configuradas en puntos clave.
☐ Setup dibujado: entrada, SL y TP marcados — orden preparada en MT5.
☐ Estado emocional anotado en el journal antes de operar.
☐ ¿Enfermo, desmotivado o con problemas personales? → SI: NO OPERAR.
```
*Prompt hint: "¿Qué haces antes de cada sesión para prepararte psicológicamente?"*

---

#### BLOCK 13 — Learning / Backtesting
**Size:** 2×1 | **Type:** two-col cards + table

```
Backtesting:
→ 4 días a la semana mínimo
→ 6 sesiones por semana (1.5 por día)
→ Alternar backtesting VISTO y OCULTO

Formación:
→ Progresar en curso principal
→ Aprender QuantConnect / algo trading
→ Implementar herramientas de AI
```
*Prompt hint: "¿Cuánto tiempo dedicas a aprender? ¿Qué métodos usas para mejorar?"*

---

#### BLOCK 14 — Preguntas para Próximas Iteraciones
**Size:** 4×1 (full-width) | **Type:** two-col numbered question list

Questions pre-filled from Trading Plan v2.0 (all 18):

```
01. ¿Cuánto tiempo real puedo dedicar cada día sin que afecte mi vida personal?
02. ¿Me siento más cómodo con más o menos oportunidades para ejecutar cada semana?
03. ¿Prefiero tomar decisiones rápido o tener más tiempo?
04. ¿Tolero períodos largos en operación o prefiero trades cortos y decisivos?
05. ¿Busco excusas para entrar o para no entrar?
06. ¿Qué condiciones del mercado me generan más duda? ¿Cuáles más claridad?
07. ¿Qué estrategia me da mayor % de acierto según mis datos? ¿Y la peor?
08. ¿En qué estrategia me siento más seguro? ¿Y más rentable?
09. ¿Tengo identificada alguna situación técnica donde mayormente tenga pérdidas?
10. ¿Tengo identificada alguna situación psicológica donde mayormente tenga pérdidas?
11. ¿Qué R:R es más realista para mi estilo?
12. ¿Qué R:R me haría sentir más cómodo durante la gestión de la posición?
13. ¿Qué condiciones previas se repiten en mis mejores resultados en HTF?
14. ¿En qué estrategia me dominan más las emociones? ¿Cómo corregirlo?
15. ¿Qué tipo de entrada me da más control emocional: limit o mercado?
16. ¿Me siento cómodo buscando la reversión o prefiero unirme a la continuación?
17. ¿Estoy perdiendo oportunidades por ser demasiado exigente, o perdiendo trades por no serlo?
18. Si solo pudiera quedarme con 1 o 2 setups que me funcionen, ¿cuáles serían?
```
*These are editable — user can replace, add, or reorder questions.*

---

#### BLOCK 15 — Cover / Portada
**Size:** 4×2 (full-width, tall) | **Type:** cover page

```
[TITULO grande, Space Mono, 28pt]
TRADING PLAN

VERSION [x.x] · ÚLTIMA REVISIÓN: [MES AÑO]

[Stat blocks x4]:
P&L Total: +$XX.XX
Ratio de Acierto: XX%
Promedio R:R: X.X
Mejor Estrategia: [NAME]
```
*Prompt hint: "Esta es la portada de tu plan. Rellena tus métricas reales y el título de tu versión."*

---

#### BLOCK 16 — Watchlist
**Size:** 2×1 | **Type:** reorderable list

```
[Ticker] — [Rationale corto] — [Alerta: ON/OFF]
EURUSD    — Setup BLUE en 4H consolidado     — 🔔
BTCUSD    — Incorporando cripto, observando  — 🔕
```

---

#### BLOCK 17 — Post-Trade Journal Entry
**Size:** 2×2 | **Type:** structured form

```
Fecha:          [date]
Par / Activo:   [ticker]
Estrategia:     [BLUE / RED / GREEN]
Entrada:        [price]
SL:             [price]
TP:             [price]
Resultado:      [+/- $] [R:R real]
Estado emocional (1-10): [ ]
Qué salió bien:   [textarea]
Qué mejorar:      [textarea]
Notas:            [textarea]
```

---

## 4. Data Model

```typescript
interface Block {
  id: string;
  type: BlockType;
  grid: {
    col: number;   // 1-indexed
    row: number;   // 1-indexed
    cols: number;  // span
    rows: number;  // span
  };
  data: Record<string, any>;  // block-type-specific content
  settings: {
    accentColor?: string;   // override badge/bullet color
    label?: string;         // custom card-label override
    showInPDF?: boolean;    // toggle visibility in export
  };
}

interface Canvas {
  id: string;
  name: string;
  version: string;
  gridCols: 4 | 6;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  author?: string;
}
```

---

## 5. Architecture

### 5.1 Component Tree
```
<BuilderPage>
  ├── <BuilderToolbar>          # undo/redo, save, export, grid toggle
  ├── <BlockLibrary>            # left/right panel: draggable block presets
  │   ├── <LibrarySection>      # groups: Perfil, Estrategia, Psicología, etc.
  │   └── <LibraryBlockCard>    # draggable item
  ├── <Canvas>                  # main grid
  │   ├── <GridOverlay>         # visual grid lines (toggleable)
  │   └── <BlockContainer>      # per block
  │       ├── <BlockRenderer>   # renders content based on type
  │       ├── <ResizeHandle>    # corner/edge drag handles
  │       └── <BlockToolbar>    # hover: edit, settings, duplicate, delete
  ├── <BlockEditor>             # slide-in panel or modal for inline editing
  └── <ExportModal>             # PDF preview + download
```

### 5.2 State Management
- Use **Zustand** (or Redux Toolkit) for:
  - Canvas blocks array (source of truth)
  - Undo/redo stack (store snapshots of blocks array)
  - UI state (selected block, drag state, panel open/closed)
- **localStorage** auto-draft on every meaningful change (debounced 500ms)
- **JSON export/import** for sharing and versioning

### 5.3 Grid Engine
- 4-column grid (configurable to 6)
- Fixed row height: **80px** (or `minmax(80px, auto)`)
- CSS Grid for layout: `grid-column: col / span cols; grid-row: row / span rows`
- On drag: compute target cell from pointer position, show ghost preview
- On collision: offer "push down" or "swap" animation

### 5.4 Drag & Drop
- Use **`@dnd-kit/core`** (recommended over `react-beautiful-dnd` for grid use cases)
  - `DndContext` wraps canvas + library
  - `useDraggable` on library cards and existing blocks
  - `useDroppable` on canvas cells
- Ghost element: translucent copy of block with blue highlighted cell target
- Snap to grid: compute `Math.floor(pointerX / cellWidth)` for column

---

## 6. PDF Export Engine

This is the most critical and technically complex part. The PDF must look **identical** to `trading_plan_v2_0.html`.

### 6.1 Strategy: HTML-to-PDF via Headless Render

Do **not** use `jsPDF` text APIs — they cannot reproduce the design fidelity needed.

**Recommended approach:**
1. Build a **hidden `<div id="pdf-render-target">`** that contains the PDF HTML
2. Inject the exact CSS from `trading_plan_v2_0.html` into it (the full `:root` token set, all component classes)
3. Populate it dynamically from the current canvas `blocks[]` state
4. Use **`html2canvas`** (with `scale: 2` for retina sharpness, `useCORS: true`, `backgroundColor: '#0d0d0d'`) to capture each page as a canvas
5. Use **`jsPDF`** to assemble the page images into an A4 PDF

```javascript
// Pseudocode
async function exportPDF(blocks: Block[]) {
  const pages = groupBlocksIntoPages(blocks); // split by page breaks
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

  for (let i = 0; i < pages.length; i++) {
    const el = renderPageToDOM(pages[i]);     // inject into hidden div
    document.body.appendChild(el);
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0d0d0d',
      width: 794,    // 210mm at 96dpi
      height: 1123,  // 297mm at 96dpi
    });
    document.body.removeChild(el);

    if (i > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
  }

  pdf.save('trading-plan.pdf');
}
```

### 6.2 Page Layout Rules for PDF
- Each PDF page = one "page group" of blocks
- User can add **page breaks** between block groups in the builder
- Each page renders with:
  - `.page-header`: document label + section label (auto-generated from block types on page)
  - `.page-footer`: "Trading Plan vX.X" · section summary · "N / total"
- Cover page block always renders as page 1 if present
- Blocks overflow to next page if combined height > 269mm (297mm - 2×14mm margin)

### 6.3 Block → HTML Mapping
Each `BlockType` has a corresponding `renderBlockHTML(block: Block): string` function that outputs the exact `.card`, `.list-item`, `.badge`, `.check-item`, `.q-item` HTML patterns from the reference document.

---

## 7. Implementation Roadmap

### Sprint 1 — Foundation
**Goal:** Canvas works, blocks can be added and edited, auto-save.

- [ ] Run design audit on existing app (see Section 0)
- [ ] Create CSS token map and verify it matches `trading_plan_v2_0.html` tokens
- [ ] Locate, read, and fully understand the navigation component (see Section 0.5)
- [ ] Add `Plan Builder` nav item following the exact existing nav pattern
- [ ] Register `/plan-builder` route in the router config
- [ ] Create `PlanBuilderPage` as an empty shell inside the app's layout wrapper
- [ ] Verify nav item appears, highlights on active route, and layout is intact — **do not proceed until this passes**
- [ ] Set up Zustand store: `blocks[]`, `history[]`, `ui` slice
- [ ] Implement `<Canvas>` with 4-col CSS grid
- [ ] Implement `<BlockLibrary>` panel with 6 blocks (01–06)
- [ ] Implement drag from library → drop onto canvas (using @dnd-kit)
- [ ] Implement `<BlockRenderer>` for: bullet list, key-value, checklist types
- [ ] Implement inline editing (contenteditable fields per block)
- [ ] Implement undo/redo (Ctrl/Cmd+Z / Shift+Ctrl+Z)
- [ ] Implement localStorage auto-draft (debounced)
- [ ] Implement JSON export / import

### Sprint 2 — Full Block Library + PDF
**Goal:** All 17 blocks available; PDF export produces a styled dark-theme document.

- [ ] Implement all remaining blocks (07–17)
- [ ] Implement `<BlockRenderer>` for: table, stat-block, cover, question-list, session-card types
- [ ] Implement block resize with drag handles (snap to grid)
- [ ] Implement block settings panel (accent color, label override, show/hide in PDF)
- [ ] Implement page break logic (user-placed + auto overflow)
- [ ] Build `renderBlockHTML()` functions for all 17 block types
- [ ] Implement `exportPDF()` using html2canvas + jsPDF
- [ ] Test PDF output fidelity against `trading_plan_v2_0.html` reference
- [ ] Implement `<ExportModal>` with PDF preview iframe + download button

### Sprint 3 — Polish + Advanced
**Goal:** Production-ready, delightful to use.

- [ ] Implement block duplication ("Duplicate + fill date" for journal blocks)
- [ ] Implement quick-add hotbar (keyboard shortcuts: `T` = Trade Idea, `C` = Checklist, etc.)
- [ ] Implement mobile stacked preview mode
- [ ] Add animated block placement (soft lift on hover, animated drop)
- [ ] Add grid guide overlay toggle (ruler lines)
- [ ] Implement template wizard: guided flow that asks questions and auto-places blocks
- [ ] Implement version history (saved JSON snapshots with timestamps)
- [ ] Implement inline formula fields for risk/reward calculation in Gestión Monetaria block
- [ ] Accessibility: keyboard nav for all controls, ARIA labels, color contrast check

---

## 8. Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Drag & drop | `@dnd-kit/core` | Headless, accessible, good grid support |
| State + history | Zustand | Lightweight, easy undo/redo with snapshots |
| PDF strategy | html2canvas + jsPDF | Only way to preserve dark theme fidelity |
| Rich text | `TipTap` (minimal config) | For textarea blocks that need bold/italic |
| Font in PDF | Embed via `@font-face` in render target | JetBrains Mono + Space Mono must load before capture |
| Grid | CSS Grid (not a library) | Full control, matches existing layout patterns |
| Persistence | localStorage + JSON export | Simple, no backend needed for MVP |

---

## 9. Critical Implementation Notes for Claude Opus 4.6

1. **Font loading before PDF capture:** `html2canvas` captures what the browser renders. Ensure fonts are fully loaded before calling it. Use `document.fonts.ready` before capturing.

2. **Color accuracy in canvas:** `html2canvas` doesn't always render CSS variables correctly. Resolve all CSS variables to their actual hex values in the render target's inline styles before capturing.

3. **Print vs screen rendering:** The reference HTML has `@media print` rules. The render target should use a `class="page"` wrapper at exactly 794×1123px (A4 at 96dpi) with `position: absolute; left: -9999px` to avoid affecting layout.

4. **Collision detection during drag:** When a block is dragged over cells already occupied, show a red ghost and offer "push" (shift blocks down) rather than silently blocking the drop.

5. **Block content defaults:** Every block ships with pre-filled content from the user's Trading Plan v2.0 (as specified in Section 3.1). This is not placeholder text — it is real, useful starting content. The user edits it, not replaces it from scratch.

6. **Design token compliance:** After extracting the app's design tokens (Section 0), if a conflict exists between the app's tokens and the PDF reference tokens (e.g., different background colors), use the app's tokens for the builder UI but use the PDF reference tokens exclusively in the hidden render target. Never mix them.

7. **`Preguntas para Próximas Iteraciones`** is a high-value block. When rendered in the PDF, it must use the two-column `.q-item` layout with numbered `.q-num` prefixes exactly as in the reference document. Users can add/remove/edit questions freely in the builder.

---

## 10. File Structure Suggestion

```
src/
├── features/
│   └── plan-builder/
│       ├── components/
│       │   ├── Canvas.tsx
│       │   ├── BlockLibrary.tsx
│       │   ├── BlockRenderer.tsx
│       │   ├── BlockEditor.tsx
│       │   ├── BlockToolbar.tsx
│       │   ├── ResizeHandle.tsx
│       │   ├── ExportModal.tsx
│       │   └── GridOverlay.tsx
│       ├── blocks/
│       │   ├── definitions/        # block type schemas + defaults
│       │   │   ├── perfilTrader.ts
│       │   │   ├── metas.ts
│       │   │   ├── gestionMonetaria.ts
│       │   │   ├── estrategias.ts
│       │   │   ├── gestionTrade.ts
│       │   │   ├── sesiones.ts
│       │   │   ├── entradas.ts
│       │   │   ├── reglasGenerales.ts
│       │   │   ├── procesoRevision.ts
│       │   │   ├── objetivos.ts
│       │   │   ├── reglaEstrategia.ts
│       │   │   ├── checklistPreSesion.ts
│       │   │   ├── learning.ts
│       │   │   ├── preguntasIteraciones.ts
│       │   │   ├── cover.ts
│       │   │   ├── watchlist.ts
│       │   │   └── journalEntry.ts
│       │   └── renderers/          # block → HTML string for PDF
│       │       └── [same files, .html.ts extension]
│       ├── store/
│       │   ├── canvasStore.ts      # Zustand: blocks, history, ui
│       │   └── selectors.ts
│       ├── export/
│       │   ├── pdfExport.ts        # html2canvas + jsPDF orchestration
│       │   ├── pageLayout.ts       # groupBlocksIntoPages, page breaks
│       │   └── pdfStyles.css       # exact copy of trading_plan_v2_0.html styles
│       ├── hooks/
│       │   ├── useDragDrop.ts
│       │   ├── useBlockResize.ts
│       │   └── useUndoRedo.ts
│       └── BuilderPage.tsx         # entry point
```

---

## Appendix: Sample Canvas JSON (Starting Template)

```json
{
  "name": "Mi Trading Plan v1.0",
  "gridCols": 4,
  "blocks": [
    {
      "id": "cover",
      "type": "cover",
      "grid": { "col": 1, "row": 1, "cols": 4, "rows": 2 },
      "data": {
        "title": "TRADING PLAN",
        "version": "1.0",
        "date": "2026",
        "stats": [
          { "label": "P&L Total", "value": "+$0.00", "variant": "positive" },
          { "label": "Ratio de Acierto", "value": "0%", "variant": "neutral" },
          { "label": "Promedio R:R", "value": "0.0", "variant": "default" },
          { "label": "Mejor Estrategia", "value": "—", "variant": "default" }
        ]
      }
    },
    {
      "id": "perfil",
      "type": "perfilTrader",
      "grid": { "col": 1, "row": 3, "cols": 2, "rows": 1 },
      "data": {
        "rows": [
          { "key": "Estilo", "value": "Conservador · Moderado" },
          { "key": "Tipo Actual", "value": "Day Trader" },
          { "key": "Mercado", "value": "Forex" }
        ]
      }
    },
    {
      "id": "metas",
      "type": "metas",
      "grid": { "col": 3, "row": 3, "cols": 2, "rows": 1 },
      "data": {
        "items": [
          { "text": "Fondeo: [nombre cuenta]", "bullet": "arrow" },
          { "text": "Consistencia y libertad horaria", "bullet": "arrow" }
        ]
      }
    },
    {
      "id": "preguntas",
      "type": "preguntasIteraciones",
      "grid": { "col": 1, "row": 4, "cols": 4, "rows": 1 },
      "data": {
        "questions": [
          "¿Cuánto tiempo real puedo dedicar cada día sin que afecte mi vida personal?",
          "¿Me siento más cómodo con más o menos oportunidades para ejecutar cada semana?",
          "¿Prefiero tomar decisiones rápido o tener más tiempo?",
          "¿Qué estrategia me da mayor % de acierto según mis datos?",
          "¿Tengo identificada alguna situación psicológica donde mayormente tenga pérdidas?",
          "¿Qué R:R es más realista para mi estilo?"
        ]
      }
    }
  ]
}
```