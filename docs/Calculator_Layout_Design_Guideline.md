# MyTokenCost — Calculator Layout & UX Design Guidelines
## The Feed-Post Analogy for Cognitive Consistency

When building a suite of specialized tools with the same primary objective, **visual and structural consistency takes absolute priority over individual design novelty**. 

Think of platforms like **Facebook** or **LinkedIn**:
*   A post on your feed can house completely different payload types: a text-only status, an inline video player, a multi-image carousel, an iframe document, or a poll.
*   However, the **outer container remains 100% identical**: the avatar is always top-left, the timestamp is always next to the name, the text block is always above the media payload, and the Like/Comment/Share bar is always anchored at the very bottom.
*   Because the wrapper is identical, the user experiences **zero cognitive load** when parsing a new post. They do not have to "re-learn" how to interact with a video vs. an image.

For MyTokenCost calculators, we enforce this exact **Feed-Post consistency model**. While the math, sliders, and charts inside a calculator change, the structural shell surrounding them must remain completely uniform.

---

## 📐 The 7-Zone Calculator Layout Framework

Every dynamic calculator in our ecosystem is structurally partitioned into **7 distinct, predictable zones**. No calculator may deviate from this zoning sequence.

```
+-------------------------------------------------------------+
| ZONE 1: Global App Header (Header.tsx)                      |
+-------------------------------------------------------------+
| ZONE 2: Standardized Title Block & Metadata Taglines        |
+-------------------------------------------------------------+
| ZONE 3: 4-Tab Navigation Deck (Calc | About | Rules | Arch) |
+-------------------------------------------------------------+
| ZONE 4: Modular Grid Container (Core Calculator Payload)     |
| +-------------------------+ +-----------------------------+ |
| | Left: Input Sidebar     | | Right: Output Workspace     | |
| | (col-span-4)            | | (col-span-8)                | |
| | - Labels & Sliders      | | - Responsive SVG Graphic   | |
| | - Nominal Node Info     | | - Metric Scorecards         | |
| +-------------------------+ +-----------------------------+ |
+-------------------------------------------------------------+
| ZONE 5: Active Metrology Programmer Terminal Console        |
+-------------------------------------------------------------+
| ZONE 6: Value-Add B2B Leads Consultation Intake             |
+-------------------------------------------------------------+
| ZONE 7: Global Share, Like/Dislike, & Subreddit Bug Console |
+-------------------------------------------------------------+
```

---

## ⚡ Core UX Rules

### 1. Above-the-Fold Density (No Scroll Ingestion)
The primary objective of a calculator is utility: **Input → Immediate Visual Feedback**. 
*   **Rule**: The interactive sliders and their numerical/graphic results **must sit in the same viewport**.
*   **Implementation**: By utilizing a 2-column grid layout (Zone 4) where inputs are housed in the left sidebar and calculations/charts are nested in the right workspace, we avoid vertical stacking. The user can adjust parameters and watch output curves adjust simultaneously, with zero scrolling required.

### 2. The 4-Tab Predictable Payload
To keep the primary calculator workspace clean and functional, secondary information is strictly segregated into a standard, horizontal **4-tab deck** (Zone 3):
1.  **`Actual Calculator` (`calc`)**: The core slider-and-graph dual-column interface.
2.  **`About Calc` (`about`)**: Plain-English context explaining the business and strategic impact of the tool.
3.  **`Its Rules` (`rules`)**: Clear, mathematically-sound formulas showing exactly how the calculation is generated, paired with the B2B Intake Form.
4.  **`Its Architecture` (`architecture`)**: An interactive SVG pipeline diagram showing the technical flow of data.

### 3. Unified Color Tokens
To maintain our Slate-and-Emerald slate theme, all tools must strictly reference our standardized Tailwind palette tokens:
*   **Primary Background**: Absolute slate/black foundations (`bg-slate-950` or `bg-black`).
*   **Elevated Panels (Inputs/Sidebar)**: Solid Slate-900 surface (`bg-slate-900 border-slate-800`).
*   **Recessed Cards (Outputs/Scorecards)**: Crisp Pitch-Black surface (`bg-black border-slate-800`).
*   **Active Accent (B2C Viral)**: Emerald Green (`text-emerald-500` / `bg-emerald-500/20` / `accent-emerald-500`).
*   **Active Accent (B2B Compliance)**: Cyan / Geothermal Blue (`text-cyanNeon` / `accent-cyanNeon`).
*   **Warning Accent (Risk/Deficits)**: High-contrast Amber/Red (`text-redNeon` / `text-amber-500`).

---

## 💻 Technical Code Standards

### State Synchronization
Whenever user inputs are adjusted, the component must sync and execute three automated procedures:
1.  **Metric Recalculation**: Run pure, side-effect-free math loops to update local state hooks.
2.  **Telemetry Console Stream (Zone 5)**: Push custom, structured standard output (`stdout`) logs detailing the parameter adjustments directly to the inline logger:
    ```typescript
    const stamp = new Date().toLocaleTimeString();
    const newLogs = [
      { timestamp: stamp, type: "init", message: "Metrics synchronized." },
      { timestamp: stamp, type: "config", message: `MODIFIERS - Parameter modified: ${value}` }
    ];
    setLogs(newLogs);
    ```
3.  **Query Parameter Sync**: Automatically update browser search queries (`?slug=...&spend=...`) using `window.history.replaceState` to allow immediate, shareable copy-pasting of exact calculator state configurations.

### Asset Safety
Never import static image files for diagrams or draw grids using heavy canvas components. Diagrams (such as Zone 4 charts or Zone 3 architectures) **must be modeled as 100% inline, responsive, lightweight, CSS-styled SVG vectors** to ensure instant compilation, zero asset footprint, and perfect dynamic responsiveness on high-resolution screens.
