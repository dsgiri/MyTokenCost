<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🤖 MyTokenCost - AI Agent Coding Guidelines

Welcome, AI Coding Assistant! You are collaborating with human developers to build MyTokenCost.com. To maintain a simple, stable, and highly-scalable codebase, you must always adhere to the following principles.

---

## 1. Single Source of Truth (SSOT) Rates & Calculations
*   **The Matrix:** All LLM pricing definitions, provider name tags, and token calculation loops must query the centralized rate card at `src/lib/shared/rates.ts` (`LLM_RATE_CARD`).
*   **Provider Naming Conventions:** Unify provider keys strictly to: `"openai"`, `"anthropic"`, `"google"`, and `"openrouter"`. Do not create conflicting keys like `"gemini"` at the state or API layer.
*   **Types:** All metrics, log ledgers, and settings schemas must import their types from `src/lib/shared/types.ts`.

---

## 2. Chrome Extension & Manifest V3 Rules
*   **Declarative Blockings:** Under Manifest V3, blocking outbound HTTP requests via `chrome.webRequest` is strictly deprecated. Any budget-ceiling enforcement must utilize dynamic rules inside the **`chrome.declarativeNetRequest` (DNR)** API.
*   **Offline-First & Local Computing:** Data privacy is our core value proposition. You must execute all calculations locally in the browser, storing active telemetry values inside `chrome.storage.local`. Never post prompts, keys, or logs to external cloud storage.

---

## 3. UI/UX & Tailwind Conventions
*   **aesthetics:** Follow a modern slate-gray dark mode palette. Base foundations should be Slate-950 (`bg-slate-950`). Standardize emerald green (`text-emerald-500`) for costs, tokens, and active telemetry stats.
*   **Clean DOM Previews:** When mocking up interfaces (e.g. browser mockups or tool extensions on the web app), always use 100% Tailwind-styled DOM structures. Never draw simulated screens using raw HTML5 `<canvas>` elements.
*   **Transitions:** Implement smooth micro-interactions, responsive scaling, hover effects, and beautiful slide-in notifications.

---

## 4. Code Quality & Integration Standards
*   **No Placeholders:** Generate complete, robust, ready-to-use code files. Never write placeholders like `// TODO` or truncate lists.
*   **Imports:** Always reference paths using standard `@/*` aliases (e.g. `@/lib/shared/rates`). Do not write deep relative imports.
*   **Strict Types:** Do not utilize `any` types. Ensure all interfaces are fully type-safe and validated.

---

## 5. Work Boundaries & Safety Controls (No Accidental Changes)
*   **The Sandbox Rule (Safe Prototyping):** When developing experimental screens, proposed UI/UX changes, or multi-step workflows, do NOT write directly to production routes (e.g., `src/app/(public)/page.tsx`). Always create a staging route under the `/sandbox/ui-ux/` namespace first (e.g., `/sandbox/ui-ux/homepage`). Promote to production only after explicit human approval.
*   **Locked Core Files:** Central infrastructure files—including `src/lib/shared/rates.ts` and `src/lib/shared/types.ts`—are locked Single Source of Truth (SSOT) foundations. AI agents must NEVER alter their signatures, models, or core structures unless explicitly instructed.
*   **Scope Isolation (Work Boundaries):** Strictly limit edits to the specific files directly relevant to the user request. Do not perform "accidental cleanups," reformat unrelated files, or touch adjacent files outside the task scope, as this introduces regression risks and unnecessary merge conflicts.
*   **Secrets & Env Safety:** Never add, modify, or leak sensitive API keys or local configurations inside `.env`, `.env.local`, or related workspace files.
*   **Verification Gate:** Every file modification must pass compilation checks. Always run `npx tsc --noEmit` as a post-write verification gate to ensure exactly 0 compilation errors and 0 type warnings are introduced.

---

## 6. Unified Test, Build, Push, Deploy & PII Protocol
*   **Execution Sequence**: Always follow the exact sequential deployment plan documented in [deployment_workflow.md](file:///c:/Users/z00545fp/Documents/MYTOKENCOST/docs/deployment_workflow.md) before pushing code:
    1.  **Test**: Run `npm run lint` and `npx tsc --noEmit` (ensure exactly 0 warnings/errors).
    2.  **Build**: Run `npm run build` locally to verify full static/dynamic page generation.
    3.  **Push**: Double-check `git status` to ensure no sensitive files are tracked, then commit and push.
    4.  **Deploy**: Confirm Vercel finishes building successfully with the Next.js framework preset.
*   **PII & Secrets Prevention**: Actively maintain `.gitignore` to prevent any leak of Personally Identifiable Information (PII) or keys. Never commit logs (`*.log`), local developer files (`/.vscode/`, `/.idea/`), environment files (`.env*`), temp caches (`.system_generated/`), or real client names/identities.
*   **Keep Docs Updated**: When changing layouts, analytics, or middleware, immediately update relevant docs (`docs/security.md`, `docs/architecture.md`, etc.) to match implementation reality.
