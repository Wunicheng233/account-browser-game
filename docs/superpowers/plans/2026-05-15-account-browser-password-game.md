# Account Browser Password Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a publishable 10-15 minute browser game where a player solves escalating account registration and recovery rules inside a fictional browser.

**Architecture:** Use a data-driven game core with typed state, pure rule checks, deterministic ending selection, and React components that render state through narrow actions. The browser shell, fake websites, rules, and endings are separate modules so future rule packs and sites can be added without rewriting the app shell.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, CSS modules or plain CSS, localStorage persistence.

---

## Spec Source

Primary spec: `docs/superpowers/specs/2026-05-15-account-browser-password-game-design.md`

## File Structure

Create these files:

- `package.json`: npm scripts and dependencies.
- `index.html`: Vite app shell.
- `tsconfig.json`: TypeScript app config.
- `tsconfig.node.json`: TypeScript config for Vite/Vitest config files.
- `vite.config.ts`: Vite and Vitest configuration.
- `vitest.setup.ts`: Testing Library setup.
- `src/main.tsx`: React entry.
- `src/App.tsx`: Top-level app composition.
- `src/styles.css`: Global layout, responsive rules, utility classes.
- `src/game/types.ts`: Shared type definitions.
- `src/game/constants.ts`: supported regions, sponsor names, usernames, forbidden words.
- `src/game/initialState.ts`: initial game state factory.
- `src/game/usernameSimilarity.ts`: visible username similarity scoring.
- `src/game/sms.ts`: deterministic SMS generation and digit-sum helpers.
- `src/game/siteAccess.ts`: fake site access rules and site error copy.
- `src/game/rules/helpers.ts`: reusable rule helper functions.
- `src/game/rules/createAccountRules.ts`: Create Account rule definitions.
- `src/game/rules/recoverAccountRules.ts`: Recover Account rule definitions.
- `src/game/rules/index.ts`: combined rule pack export.
- `src/game/ruleEngine.ts`: rule unlocking, evaluation, risk tag aggregation.
- `src/game/reducer.ts`: game actions and state reducer.
- `src/game/persistence.ts`: localStorage save/load/reset helpers.
- `src/game/endings.ts`: deterministic ending selection.
- `src/components/browser/BrowserShell.tsx`: browser layout container.
- `src/components/browser/Toolbar.tsx`: back button, address bar, proxy toggle.
- `src/components/browser/SiteTabs.tsx`: quick site navigation.
- `src/components/rules/RulePanel.tsx`: rule, risk, and system log panel.
- `src/components/sites/SiteViewport.tsx`: current site router.
- `src/components/sites/CloudySignupSite.tsx`: registration and appeal forms.
- `src/components/sites/SmsSite.tsx`: in-game SMS code page.
- `src/components/sites/IdentitySite.tsx`: fake identity card generator.
- `src/components/sites/MailboxSite.tsx`: fake inbox.
- `src/components/sites/TimezoneSite.tsx`: simulated timezone report.
- `src/components/sites/SiteError.tsx`: fake access error display.
- `src/components/endings/EndingView.tsx`: ending screen.
- `src/test/fixtures.ts`: reusable state builders for tests.
- `src/game/*.test.ts`: core game unit tests.
- `src/components/*.test.tsx`: focused integration tests.

Modify these files if they already exist:

- `.gitignore`: keep `node_modules/`, `dist/`, `.superpowers/`, `.DS_Store`.

---

## Task 1: Scaffold Vite React TypeScript App

**Files:**

- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Modify: `.gitignore`

- [ ] **Step 1: Create npm project files**

Create `package.json`:

```json
{
  "name": "account-browser-password-game",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "tsc -b --pretty false"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^2.1.0"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Browser</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "vitest.setup.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and npm exits with code 0.

- [ ] **Step 3: Add minimal React shell**

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export function App() {
  return (
    <main className="app-shell">
      <section className="browser-panel" aria-label="Fictional browser">
        <h1>Account Browser</h1>
        <p>Create an account. Recover the account. Remain the same person.</p>
      </section>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #18212f;
  background: #eef1f5;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  min-height: 100vh;
  padding: 16px;
}

.browser-panel {
  min-height: calc(100vh - 32px);
  border: 1px solid #c8ced8;
  background: #f8fafc;
  border-radius: 8px;
  padding: 18px;
}
```

- [ ] **Step 4: Verify scaffold**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build successfully and create `dist/`.

- [ ] **Step 5: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts vitest.setup.ts src/main.tsx src/App.tsx src/styles.css .gitignore
git commit -m "chore: scaffold account browser app"
```

Expected: commit succeeds.

---

## Task 2: Add Core Types And Initial State

**Files:**

- Create: `src/game/types.ts`
- Create: `src/game/constants.ts`
- Create: `src/game/initialState.ts`
- Create: `src/test/fixtures.ts`
- Test: `src/game/initialState.test.ts`

- [ ] **Step 1: Write failing initial state tests**

Create `src/game/initialState.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createInitialState } from "./initialState";

describe("createInitialState", () => {
  it("starts in the create account chapter on the signup site", () => {
    const state = createInitialState();

    expect(state.chapter).toBe("create");
    expect(state.browser.currentUrl).toBe("cloudyai.signup.fake");
    expect(state.browser.proxyEnabled).toBe(false);
    expect(state.unlockedRuleIds).toEqual(["create.email"]);
    expect(state.riskTags).toEqual([]);
    expect(state.ending).toBeNull();
  });

  it("uses fresh mutable collections on each call", () => {
    const first = createInitialState();
    const second = createInitialState();

    first.riskTags.push("vpn_energy");
    first.browser.history.push("sms.local");

    expect(second.riskTags).toEqual([]);
    expect(second.browser.history).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/game/initialState.test.ts
```

Expected: FAIL because `src/game/initialState.ts` does not exist.

- [ ] **Step 3: Add core types**

Create `src/game/types.ts`:

```ts
export type Chapter = "create" | "recover";

export type SiteId =
  | "cloudyai.signup.fake"
  | "sms.local"
  | "identity.gov.fake"
  | "mailbox.local"
  | "timezone-checker.net";

export type SupportedRegion = "United States" | "Canada" | "United Kingdom" | "Australia" | "Taiwan";

export type RiskTag =
  | "region_mismatch"
  | "vpn_energy"
  | "too_determined"
  | "identity_loop"
  | "verification_chaser"
  | "appeal_tone_unclear";

export type RuleStatus = "locked" | "passed" | "failed";

export interface IdentityCard {
  name: string;
  birthday: string;
  region: SupportedRegion;
  identityNumber: string;
}

export interface MailboxMessage {
  id: string;
  subject: string;
  greetingPhrase: string;
  body: string;
  ticketNumber?: string;
  createdAt: number;
}

export interface TimezoneReport {
  region: SupportedRegion;
  timezone: string;
  language: string;
}

export interface Profile {
  email: string;
  username: string;
  password: string;
  region: SupportedRegion | "";
  phone: string;
  birthday: string;
  recoveryEmail: string;
  registrationStatement: string;
  appealLetter: string;
  smsCode: string;
  identityCard: IdentityCard | null;
  ticketNumber: string;
  finalIdentityPhrase: string;
}

export interface BrowserState {
  currentUrl: SiteId;
  history: SiteId[];
  proxyEnabled: boolean;
  openTabs: SiteId[];
  currentSmsCode: string;
  smsRequiredTotal: number;
  smsRefreshAt: number;
  mailboxMessages: MailboxMessage[];
  timezoneReport: TimezoneReport;
}

export interface GameHistory {
  regionChangeCount: number;
  proxyOnUseCountDuringRegistration: number;
  smsFailureCount: number;
  firstSuccessfulSmsCode: string | null;
  registrationSuccessAt: number | null;
  suspensionReason: string;
  firstAppealLetter: string | null;
  generatedTicketNumber: string | null;
  generatedIdentityCards: IdentityCard[];
}

export interface RuleContext {
  profile: Profile;
  browser: BrowserState;
  history: GameHistory;
  chapter: Chapter;
  unlockedRuleIds: string[];
  riskTags: RiskTag[];
}

export interface RuleResult {
  status: Exclude<RuleStatus, "locked">;
  message: string;
  riskTags?: RiskTag[];
}

export interface RuleDefinition {
  id: string;
  chapter: Chapter;
  title: string;
  description: string;
  unlockAfter?: string;
  check: (context: RuleContext) => RuleResult;
}

export interface RuleEvaluation {
  id: string;
  title: string;
  description: string;
  status: RuleStatus;
  message: string;
  riskTags: RiskTag[];
}

export type EndingId =
  | "recovered"
  | "read_only_human"
  | "appeal_pending"
  | "account_exists_user_does_not"
  | "thank_you_for_understanding";

export interface GameState {
  saveVersion: number;
  chapter: Chapter;
  profile: Profile;
  browser: BrowserState;
  history: GameHistory;
  unlockedRuleIds: string[];
  riskTags: RiskTag[];
  systemLog: string[];
  ending: EndingId | null;
}
```

- [ ] **Step 4: Add constants**

Create `src/game/constants.ts`:

```ts
import type { SiteId, SupportedRegion } from "./types";

export const SAVE_VERSION = 1;

export const SUPPORTED_REGIONS: SupportedRegion[] = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Taiwan",
];

export const REGION_PHONE_PREFIX: Record<SupportedRegion, string> = {
  "United States": "+1",
  Canada: "+1",
  "United Kingdom": "+44",
  Australia: "+61",
  Taiwan: "+886",
};

export const REGION_TIMEZONE: Record<SupportedRegion, string> = {
  "United States": "America/Los_Angeles",
  Canada: "America/Toronto",
  "United Kingdom": "Europe/London",
  Australia: "Australia/Sydney",
  Taiwan: "Asia/Taipei",
};

export const DEFAULT_TABS: SiteId[] = [
  "cloudyai.signup.fake",
  "sms.local",
  "identity.gov.fake",
  "mailbox.local",
  "timezone-checker.net",
];

export const SPONSOR_NAMES = ["Gloogle", "CloudyAI", "PearHub"] as const;
export const FORBIDDEN_STATEMENT_WORDS = ["need", "urgent", "vpn", "proxy", "mainland"];
export const ROMANIZED_NEUTRALITY_WORDS = ["nihao", "xiexie", "meiyou"];
export const TAKEN_USERNAMES = ["ordinaryuser", "globaltraveler", "alex2026", "cloudfan", "openaccess"];
export const SUSPENSION_REASON = "unsupported location signal";
```

- [ ] **Step 5: Add initial state factory and fixtures**

Create `src/game/initialState.ts`:

```ts
import {
  DEFAULT_TABS,
  REGION_TIMEZONE,
  SAVE_VERSION,
  SUSPENSION_REASON,
} from "./constants";
import type { GameState } from "./types";

export function createInitialState(now = Date.now()): GameState {
  return {
    saveVersion: SAVE_VERSION,
    chapter: "create",
    profile: {
      email: "",
      username: "",
      password: "",
      region: "",
      phone: "",
      birthday: "",
      recoveryEmail: "",
      registrationStatement: "",
      appealLetter: "",
      smsCode: "",
      identityCard: null,
      ticketNumber: "",
      finalIdentityPhrase: "",
    },
    browser: {
      currentUrl: "cloudyai.signup.fake",
      history: [],
      proxyEnabled: false,
      openTabs: [...DEFAULT_TABS],
      currentSmsCode: "482739",
      smsRequiredTotal: 33,
      smsRefreshAt: now + 30_000,
      mailboxMessages: [],
      timezoneReport: {
        region: "United States",
        timezone: REGION_TIMEZONE["United States"],
        language: "en-US",
      },
    },
    history: {
      regionChangeCount: 0,
      proxyOnUseCountDuringRegistration: 0,
      smsFailureCount: 0,
      firstSuccessfulSmsCode: null,
      registrationSuccessAt: null,
      suspensionReason: SUSPENSION_REASON,
      firstAppealLetter: null,
      generatedTicketNumber: null,
      generatedIdentityCards: [],
    },
    unlockedRuleIds: ["create.email"],
    riskTags: [],
    systemLog: ["CloudyAI Account Console initialized."],
    ending: null,
  };
}
```

Create `src/test/fixtures.ts`:

```ts
import { createInitialState } from "../game/initialState";
import type { BrowserState, GameHistory, GameState, Profile } from "../game/types";

interface StateOverrides extends Omit<Partial<GameState>, "profile" | "browser" | "history"> {
  profile?: Partial<Profile>;
  browser?: Partial<BrowserState>;
  history?: Partial<GameHistory>;
}

export function makeState(overrides: StateOverrides = {}): GameState {
  const state = createInitialState(1_700_000_000_000);
  return {
    ...state,
    ...overrides,
    profile: { ...state.profile, ...overrides.profile },
    browser: { ...state.browser, ...overrides.browser },
    history: { ...state.history, ...overrides.history },
  };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```bash
npm test -- src/game/initialState.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit core state**

Run:

```bash
git add src/game/types.ts src/game/constants.ts src/game/initialState.ts src/test/fixtures.ts src/game/initialState.test.ts
git commit -m "feat: add game state model"
```

Expected: commit succeeds.

---

## Task 3: Implement Username Similarity

**Files:**

- Create: `src/game/usernameSimilarity.ts`
- Test: `src/game/usernameSimilarity.test.ts`

- [ ] **Step 1: Write failing username tests**

Create `src/game/usernameSimilarity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { scoreUsernameSimilarity } from "./usernameSimilarity";

describe("scoreUsernameSimilarity", () => {
  it("normalizes digits and punctuation", () => {
    const result = scoreUsernameSimilarity("global.traveler_2026");

    expect(result.closest).toBe("globaltraveler");
    expect(result.blocked).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it("blocks edit distance two or less", () => {
    const result = scoreUsernameSimilarity("openacces");

    expect(result.closest).toBe("openaccess");
    expect(result.blocked).toBe(true);
  });

  it("allows unrelated usernames", () => {
    const result = scoreUsernameSimilarity("harmlessdesk42");

    expect(result.blocked).toBe(false);
    expect(result.score).toBeLessThan(70);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/game/usernameSimilarity.test.ts
```

Expected: FAIL because `src/game/usernameSimilarity.ts` does not exist.

- [ ] **Step 3: Implement similarity scoring**

Create `src/game/usernameSimilarity.ts`:

```ts
import { TAKEN_USERNAMES } from "./constants";

export interface UsernameSimilarity {
  candidate: string;
  normalized: string;
  closest: string;
  score: number;
  editDistance: number;
  blocked: boolean;
}

export function normalizeUsername(value: string): string {
  return value.toLowerCase().replace(/[0-9_.-]/g, "");
}

export function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[a.length][b.length];
}

function simpleSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 100;
  const distance = editDistance(a, b);
  const maxLength = Math.max(a.length, b.length, 1);
  return Math.round((1 - distance / maxLength) * 100);
}

export function scoreUsernameSimilarity(candidate: string): UsernameSimilarity {
  const normalized = normalizeUsername(candidate);
  const scored = TAKEN_USERNAMES.map((taken) => {
    const distance = editDistance(normalized, taken);
    const containsBody = normalized.includes(taken) || taken.includes(normalized);
    const score = containsBody ? 100 : simpleSimilarity(normalized, taken);
    return { taken, score, distance, containsBody };
  }).sort((a, b) => b.score - a.score || a.distance - b.distance);

  const closest = scored[0];
  return {
    candidate,
    normalized,
    closest: closest.taken,
    score: closest.score,
    editDistance: closest.distance,
    blocked: closest.containsBody || closest.distance <= 2 || closest.score >= 70,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- src/game/usernameSimilarity.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit username similarity**

Run:

```bash
git add src/game/usernameSimilarity.ts src/game/usernameSimilarity.test.ts
git commit -m "feat: add username similarity scoring"
```

Expected: commit succeeds.

---

## Task 4: Implement SMS And Site Access Mechanics

**Files:**

- Create: `src/game/sms.ts`
- Create: `src/game/siteAccess.ts`
- Test: `src/game/sms.test.ts`
- Test: `src/game/siteAccess.test.ts`

- [ ] **Step 1: Write failing SMS tests**

Create `src/game/sms.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { digitSum, generateSmsCode, hasConsecutivePairFromCode } from "./sms";

describe("sms helpers", () => {
  it("generates deterministic six digit codes", () => {
    expect(generateSmsCode(12345)).toMatch(/^[0-9]{6}$/);
    expect(generateSmsCode(12345)).toBe(generateSmsCode(12345));
  });

  it("sums digits", () => {
    expect(digitSum("482739")).toBe(33);
  });

  it("detects consecutive digit pairs from the code", () => {
    expect(hasConsecutivePairFromCode("agent27", "482739")).toBe(true);
    expect(hasConsecutivePairFromCode("agent99", "482739")).toBe(false);
  });
});
```

- [ ] **Step 2: Write failing site access tests**

Create `src/game/siteAccess.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getSiteAccess } from "./siteAccess";

describe("getSiteAccess", () => {
  it("requires proxy for the main signup site", () => {
    expect(getSiteAccess("cloudyai.signup.fake", false).ok).toBe(false);
    expect(getSiteAccess("cloudyai.signup.fake", true).ok).toBe(true);
  });

  it("rejects proxy for local SMS and identity sites", () => {
    expect(getSiteAccess("sms.local", true).ok).toBe(false);
    expect(getSiteAccess("identity.gov.fake", true).ok).toBe(false);
    expect(getSiteAccess("sms.local", false).ok).toBe(true);
    expect(getSiteAccess("identity.gov.fake", false).ok).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
npm test -- src/game/sms.test.ts src/game/siteAccess.test.ts
```

Expected: FAIL because `src/game/sms.ts` and `src/game/siteAccess.ts` do not exist.

- [ ] **Step 4: Implement SMS helpers**

Create `src/game/sms.ts`:

```ts
export function generateSmsCode(seed: number): string {
  let value = Math.abs(Math.floor(seed)) || 1;
  value = (value * 9301 + 49297) % 233280;
  const code = String(value % 1_000_000).padStart(6, "0");
  return code;
}

export function digitSum(code: string): number {
  return code.split("").reduce((total, char) => total + Number(char), 0);
}

export function hasConsecutivePairFromCode(value: string, code: string): boolean {
  const pairs = Array.from({ length: Math.max(code.length - 1, 0) }, (_, index) =>
    code.slice(index, index + 2),
  );
  return pairs.some((pair) => value.includes(pair));
}
```

- [ ] **Step 5: Implement site access**

Create `src/game/siteAccess.ts`:

```ts
import type { SiteId } from "./types";

export interface SiteAccess {
  ok: boolean;
  title?: string;
  message?: string;
}

export function getSiteAccess(site: SiteId, proxyEnabled: boolean): SiteAccess {
  if (site === "cloudyai.signup.fake") {
    return proxyEnabled
      ? { ok: true }
      : {
          ok: false,
          title: "Service unavailable",
          message: "This service is unavailable from your current network.",
        };
  }

  if (site === "sms.local") {
    return proxyEnabled
      ? {
          ok: false,
          title: "Route rejected",
          message: "SMS center rejected this route. Please reconnect from a local network.",
        }
      : { ok: true };
  }

  if (site === "identity.gov.fake") {
    return proxyEnabled
      ? {
          ok: false,
          title: "Connection refused",
          message: "Government identity services cannot be accessed through anonymized connections.",
        }
      : { ok: true };
  }

  return { ok: true };
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run:

```bash
npm test -- src/game/sms.test.ts src/game/siteAccess.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit SMS and site access**

Run:

```bash
git add src/game/sms.ts src/game/siteAccess.ts src/game/sms.test.ts src/game/siteAccess.test.ts
git commit -m "feat: add verification and site access mechanics"
```

Expected: commit succeeds.

---

## Task 5: Implement Rule Helpers And Create Account Rules

**Files:**

- Create: `src/game/rules/helpers.ts`
- Create: `src/game/rules/createAccountRules.ts`
- Create: `src/game/rules/index.ts`
- Create: `src/game/ruleEngine.ts`
- Test: `src/game/rules/createAccountRules.test.ts`
- Test: `src/game/ruleEngine.test.ts`

- [ ] **Step 1: Write failing Create Account rule tests**

Create `src/game/rules/createAccountRules.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { makeState } from "../../test/fixtures";
import { createAccountRules } from "./createAccountRules";

const byId = Object.fromEntries(createAccountRules.map((rule) => [rule.id, rule]));

describe("create account rules", () => {
  it("validates English-only submitted text", () => {
    const state = makeState({
      profile: { registrationStatement: "I am an ordinary user nihao." },
    });

    expect(byId["create.englishOnly"].check(state).status).toBe("passed");

    const failed = makeState({
      profile: { registrationStatement: "I am an ordinary user 你好." },
    });

    expect(byId["create.englishOnly"].check(failed).status).toBe("failed");
  });

  it("requires the sms code to match current browser code", () => {
    const passed = makeState({
      profile: { smsCode: "482739" },
      browser: { currentSmsCode: "482739" },
    });

    expect(byId["create.smsMatches"].check(passed).status).toBe("passed");

    const failed = makeState({
      profile: { smsCode: "111111" },
      browser: { currentSmsCode: "482739" },
    });

    expect(byId["create.smsMatches"].check(failed).status).toBe("failed");
  });

  it("checks identity card region against account region", () => {
    const state = makeState({
      profile: {
        region: "United States",
        identityCard: {
          name: "Ordinary User",
          birthday: "1990-01-01",
          region: "Canada",
          identityNumber: "ID-123456",
        },
      },
    });

    expect(byId["create.identityRegion"].check(state).status).toBe("failed");
  });
});
```

- [ ] **Step 2: Write failing rule engine tests**

Create `src/game/ruleEngine.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { evaluateRules, unlockNextRuleIds } from "./ruleEngine";

describe("ruleEngine", () => {
  it("evaluates locked and unlocked rules separately", () => {
    const state = makeState({ unlockedRuleIds: ["create.email"] });
    const results = evaluateRules(state);

    expect(results.find((rule) => rule.id === "create.email")?.status).toBe("failed");
    expect(results.find((rule) => rule.id === "create.password")?.status).toBe("locked");
  });

  it("unlocks the next rule when the current rule passes", () => {
    const state = makeState({
      unlockedRuleIds: ["create.email"],
      profile: { email: "ordinary@example.com" },
    });

    expect(unlockNextRuleIds(state)).toContain("create.password");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
npm test -- src/game/rules/createAccountRules.test.ts src/game/ruleEngine.test.ts
```

Expected: FAIL because rule files do not exist.

- [ ] **Step 4: Implement rule helpers**

Create `src/game/rules/helpers.ts`:

```ts
import { FORBIDDEN_STATEMENT_WORDS, REGION_PHONE_PREFIX, ROMANIZED_NEUTRALITY_WORDS, SPONSOR_NAMES, SUPPORTED_REGIONS } from "../constants";
import { digitSum, hasConsecutivePairFromCode } from "../sms";
import type { RuleContext, RuleResult, SupportedRegion } from "../types";
import { scoreUsernameSimilarity } from "../usernameSimilarity";

export const pass = (message: string): RuleResult => ({ status: "passed", message });
export const fail = (message: string, riskTags: RuleResult["riskTags"] = []): RuleResult => ({
  status: "failed",
  message,
  riskTags,
});

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isEnglishOnly(value: string): boolean {
  return /^[\x09\x0a\x0d\x20-\x7e]*$/.test(value);
}

export function ageFromBirthday(value: string, now = new Date("2026-05-15T00:00:00Z")): number {
  const birthday = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(birthday.getTime())) return 0;
  let age = now.getUTCFullYear() - birthday.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - birthday.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < birthday.getUTCDate())) {
    age -= 1;
  }
  return age;
}

export function emailDomain(value: string): string {
  return value.split("@")[1]?.toLowerCase() ?? "";
}

export function isSupportedRegion(value: string): value is SupportedRegion {
  return SUPPORTED_REGIONS.includes(value as SupportedRegion);
}

export function passwordIsStrong(value: string): boolean {
  return value.length >= 12 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value);
}

export function statementHasForbiddenWord(value: string): boolean {
  const lower = value.toLowerCase();
  return FORBIDDEN_STATEMENT_WORDS.some((word) => new RegExp(`\\b${word}\\b`, "i").test(lower));
}

export function statementHasRomanizedWord(value: string): boolean {
  const lower = value.toLowerCase();
  return ROMANIZED_NEUTRALITY_WORDS.some((word) => new RegExp(`\\b${word}\\b`, "i").test(lower));
}

export function passwordHasSponsor(value: string): boolean {
  return SPONSOR_NAMES.some((name) => value.includes(name));
}

export function phoneMatchesRegion(phone: string, region: string): boolean {
  return isSupportedRegion(region) && phone.trim().startsWith(REGION_PHONE_PREFIX[region]);
}

export function timezoneMatchesRegion(context: RuleContext): boolean {
  return context.profile.region !== "" && context.browser.timezoneReport.region === context.profile.region;
}

export const createChecks = {
  usernameAvailable: (username: string) => !scoreUsernameSimilarity(username).blocked,
  smsDigitSum: (context: RuleContext) => digitSum(context.profile.smsCode) === context.browser.smsRequiredTotal,
  usernameHasSmsPair: (context: RuleContext) =>
    hasConsecutivePairFromCode(context.profile.username, context.browser.currentSmsCode),
};
```

- [ ] **Step 5: Implement Create Account rules**

Create `src/game/rules/createAccountRules.ts`:

```ts
import type { RuleDefinition } from "../types";
import {
  ageFromBirthday,
  createChecks,
  emailDomain,
  fail,
  isEnglishOnly,
  isSupportedRegion,
  isValidEmail,
  pass,
  passwordHasSponsor,
  passwordIsStrong,
  phoneMatchesRegion,
  statementHasForbiddenWord,
  statementHasRomanizedWord,
  timezoneMatchesRegion,
} from "./helpers";

export const createAccountRules: RuleDefinition[] = [
  {
    id: "create.email",
    chapter: "create",
    title: "Valid email",
    description: "Email must be valid.",
    check: ({ profile }) => (isValidEmail(profile.email) ? pass("Email accepted.") : fail("Enter a valid email address.")),
  },
  {
    id: "create.password",
    chapter: "create",
    title: "Strong password",
    description: "Password must be at least 12 characters and include uppercase, number, and symbol.",
    unlockAfter: "create.email",
    check: ({ profile }) => (passwordIsStrong(profile.password) ? pass("Password has sufficient ambition.") : fail("Password is not ambitious enough.")),
  },
  {
    id: "create.englishOnly",
    chapter: "create",
    title: "English only",
    description: "All submitted text must be English only.",
    unlockAfter: "create.password",
    check: ({ profile }) => {
      const text = [
        profile.email,
        profile.username,
        profile.password,
        profile.phone,
        profile.recoveryEmail,
        profile.registrationStatement,
      ].join("\n");
      return isEnglishOnly(text) ? pass("Language profile accepted.") : fail("Submitted text must use English only.");
    },
  },
  {
    id: "create.usernameSimilarity",
    chapter: "create",
    title: "Username originality",
    description: "Username must not be taken, and similarity to taken usernames must be below 70%.",
    unlockAfter: "create.englishOnly",
    check: ({ profile }) => (createChecks.usernameAvailable(profile.username) ? pass("Username is sufficiently unlike known people.") : fail("Username is too similar to an existing account.", ["too_determined"])),
  },
  {
    id: "create.age",
    chapter: "create",
    title: "Age check",
    description: "Age must be over 18.",
    unlockAfter: "create.usernameSimilarity",
    check: ({ profile }) => (ageFromBirthday(profile.birthday) > 18 ? pass("Age confirmed.") : fail("This service requires an older version of you.")),
  },
  {
    id: "create.recoveryEmail",
    chapter: "create",
    title: "Recovery email",
    description: "Recovery email must be valid and use a different domain from the main email.",
    unlockAfter: "create.age",
    check: ({ profile }) =>
      isValidEmail(profile.recoveryEmail) && emailDomain(profile.recoveryEmail) !== emailDomain(profile.email)
        ? pass("Backup identity accepted.")
        : fail("Recovery email must be valid and use a different domain."),
  },
  {
    id: "create.supportedRegion",
    chapter: "create",
    title: "Supported region",
    description: "Account region must be a supported region.",
    unlockAfter: "create.recoveryEmail",
    check: ({ profile }) => (isSupportedRegion(profile.region) ? pass("Region is supported by the idea of support.") : fail("Choose a supported region.", ["region_mismatch"])),
  },
  {
    id: "create.phoneRegion",
    chapter: "create",
    title: "Phone region",
    description: "Phone country code must match the account region.",
    unlockAfter: "create.supportedRegion",
    check: ({ profile }) => (phoneMatchesRegion(profile.phone, profile.region) ? pass("Phone region agrees with account region.") : fail("Phone number does not match account region.", ["region_mismatch"])),
  },
  {
    id: "create.smsMatches",
    chapter: "create",
    title: "Current SMS code",
    description: "SMS code must match the current 6-digit code shown on sms.local.",
    unlockAfter: "create.phoneRegion",
    check: ({ profile, browser }) => (profile.smsCode === browser.currentSmsCode ? pass("Verification code accepted for now.") : fail("Verification code does not match the current SMS code.", ["verification_chaser"])),
  },
  {
    id: "create.smsDigitSum",
    chapter: "create",
    title: "SMS digit sum",
    description: "SMS code digits must sum to the current required total.",
    unlockAfter: "create.smsMatches",
    check: (context) => (createChecks.smsDigitSum(context) ? pass("Digits add up to compliance.") : fail("SMS code digits do not sum to the required total.")),
  },
  {
    id: "create.usernameSmsPair",
    chapter: "create",
    title: "Username code trace",
    description: "Username must include any two consecutive digits from the current SMS code.",
    unlockAfter: "create.smsDigitSum",
    check: (context) => (createChecks.usernameHasSmsPair(context) ? pass("Username contains a recent enough trace.") : fail("Username must include two consecutive digits from the current SMS code.")),
  },
  {
    id: "create.sponsorPassword",
    chapter: "create",
    title: "Sponsor password",
    description: "Password must include one sponsor name.",
    unlockAfter: "create.usernameSmsPair",
    check: ({ profile }) => (passwordHasSponsor(profile.password) ? pass("Sponsor relationship acknowledged.") : fail("Password must include Gloogle, CloudyAI, or PearHub.")),
  },
  {
    id: "create.statementLength",
    chapter: "create",
    title: "Statement length",
    description: "Registration statement must be 80-140 characters.",
    unlockAfter: "create.sponsorPassword",
    check: ({ profile }) =>
      profile.registrationStatement.length >= 80 && profile.registrationStatement.length <= 140
        ? pass("Statement length is emotionally moderate.")
        : fail("Statement must be between 80 and 140 characters."),
  },
  {
    id: "create.ordinaryUser",
    chapter: "create",
    title: "Ordinary user",
    description: "Registration statement must include ordinary user.",
    unlockAfter: "create.statementLength",
    check: ({ profile }) => (profile.registrationStatement.toLowerCase().includes("ordinary user") ? pass("Ordinariness detected.") : fail("Statement must include ordinary user.")),
  },
  {
    id: "create.statementForbiddenWords",
    chapter: "create",
    title: "Neutral language",
    description: "Registration statement must not include need, urgent, VPN, proxy, or mainland.",
    unlockAfter: "create.ordinaryUser",
    check: ({ profile }) => (!statementHasForbiddenWord(profile.registrationStatement) ? pass("No dangerous eagerness detected.") : fail("Statement contains a flagged word.", ["too_determined"])),
  },
  {
    id: "create.romanizedNeutrality",
    chapter: "create",
    title: "Romanized neutrality",
    description: "Registration statement must include one approved romanized neutrality word.",
    unlockAfter: "create.statementForbiddenWords",
    check: ({ profile }) => (statementHasRomanizedWord(profile.registrationStatement) ? pass("Cultural neutrality token accepted.") : fail("Statement must include nihao, xiexie, or meiyou.")),
  },
  {
    id: "create.timezone",
    chapter: "create",
    title: "Timezone match",
    description: "Timezone shown on timezone-checker.net must match the account region.",
    unlockAfter: "create.romanizedNeutrality",
    check: (context) => (timezoneMatchesRegion(context) ? pass("Time agrees with geography.") : fail("Timezone does not match account region.", ["region_mismatch"])),
  },
  {
    id: "create.identityGenerated",
    chapter: "create",
    title: "Identity card",
    description: "A fictional identity card must be generated on identity.gov.fake.",
    unlockAfter: "create.timezone",
    check: ({ profile }) => (profile.identityCard ? pass("Identity artifact generated.") : fail("Generate a fictional identity card.")),
  },
  {
    id: "create.identityRegion",
    chapter: "create",
    title: "Identity region",
    description: "Identity card region must match the account region.",
    unlockAfter: "create.identityGenerated",
    check: ({ profile }) =>
      profile.identityCard && profile.identityCard.region === profile.region
        ? pass("Identity region matches account region.")
        : fail("Identity card region does not match account region.", ["identity_loop"]),
  },
  {
    id: "create.complete",
    chapter: "create",
    title: "Create account",
    description: "All unlocked Create Account rules must pass.",
    unlockAfter: "create.identityRegion",
    check: () => pass("Account created. Account suspended."),
  },
];
```

- [ ] **Step 6: Implement rule pack export and engine**

Create `src/game/rules/index.ts`:

```ts
import { createAccountRules } from "./createAccountRules";

export const allRules = [...createAccountRules];
```

Create `src/game/ruleEngine.ts`:

```ts
import { allRules } from "./rules";
import type { GameState, RuleContext, RuleEvaluation } from "./types";

export function toRuleContext(state: GameState): RuleContext {
  return {
    profile: state.profile,
    browser: state.browser,
    history: state.history,
    chapter: state.chapter,
    unlockedRuleIds: state.unlockedRuleIds,
    riskTags: state.riskTags,
  };
}

export function evaluateRules(state: GameState): RuleEvaluation[] {
  const context = toRuleContext(state);
  return allRules.map((rule) => {
    if (!state.unlockedRuleIds.includes(rule.id)) {
      return {
        id: rule.id,
        title: rule.title,
        description: rule.description,
        status: "locked",
        message: "Locked.",
        riskTags: [],
      };
    }

    const result = rule.check(context);
    return {
      id: rule.id,
      title: rule.title,
      description: rule.description,
      status: result.status,
      message: result.message,
      riskTags: result.riskTags ?? [],
    };
  });
}

export function unlockNextRuleIds(state: GameState): string[] {
  const evaluations = evaluateRules(state);
  const passed = new Set(evaluations.filter((rule) => rule.status === "passed").map((rule) => rule.id));
  const unlocked = new Set(state.unlockedRuleIds);

  for (const rule of allRules) {
    if (rule.chapter !== state.chapter) continue;
    if (!rule.unlockAfter) continue;
    if (passed.has(rule.unlockAfter)) unlocked.add(rule.id);
  }

  return [...unlocked];
}

export function collectRiskTags(state: GameState): GameState["riskTags"] {
  const tags = new Set(state.riskTags);
  for (const result of evaluateRules(state)) {
    for (const tag of result.riskTags) tags.add(tag);
  }
  return [...tags];
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run:

```bash
npm test -- src/game/rules/createAccountRules.test.ts src/game/ruleEngine.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit Create Account rules**

Run:

```bash
git add src/game/rules src/game/ruleEngine.ts src/game/rules/createAccountRules.test.ts src/game/ruleEngine.test.ts
git commit -m "feat: add create account rules"
```

Expected: commit succeeds.

---

## Task 6: Implement Recovery Rules And Endings

**Files:**

- Create: `src/game/rules/recoverAccountRules.ts`
- Modify: `src/game/rules/index.ts`
- Create: `src/game/endings.ts`
- Test: `src/game/rules/recoverAccountRules.test.ts`
- Test: `src/game/endings.test.ts`

- [ ] **Step 1: Write failing recovery rule tests**

Create `src/game/rules/recoverAccountRules.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { makeState } from "../../test/fixtures";
import { recoverAccountRules } from "./recoverAccountRules";

const byId = Object.fromEntries(recoverAccountRules.map((rule) => [rule.id, rule]));

describe("recover account rules", () => {
  it("requires suspension reason exactly once", () => {
    const passed = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, I saw unsupported location signal. thank you" },
      history: { suspensionReason: "unsupported location signal" },
    });

    expect(byId["recover.reasonOnce"].check(passed).status).toBe("passed");

    const failed = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, unsupported location signal and unsupported location signal. thank you" },
      history: { suspensionReason: "unsupported location signal" },
    });

    expect(byId["recover.reasonOnce"].check(failed).status).toBe("failed");
  });

  it("checks comma count against registration region changes", () => {
    const state = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, I changed nothing, thank you" },
      history: { regionChangeCount: 2 },
    });

    expect(byId["recover.regionCommas"].check(state).status).toBe("passed");
  });

  it("blocks digits from the identity number in the appeal letter", () => {
    const state = makeState({
      chapter: "recover",
      profile: {
        appealLetter: "Dear Safeguards Team, my number includes 7. thank you",
        identityCard: {
          name: "Ordinary User",
          birthday: "1990-01-01",
          region: "United States",
          identityNumber: "ID-789000",
        },
      },
    });

    expect(byId["recover.noIdentityDigits"].check(state).status).toBe("failed");
  });
});
```

- [ ] **Step 2: Write failing ending tests**

Create `src/game/endings.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { chooseEnding } from "./endings";

describe("chooseEnding", () => {
  it("returns recovered for a low-risk completed state", () => {
    const state = makeState({
      chapter: "recover",
      riskTags: [],
      unlockedRuleIds: ["recover.complete"],
    });

    expect(chooseEnding(state)).toBe("recovered");
  });

  it("returns account exists user does not for identity loop and region mismatch", () => {
    const state = makeState({
      chapter: "recover",
      riskTags: ["identity_loop", "region_mismatch"],
      unlockedRuleIds: ["recover.complete"],
    });

    expect(chooseEnding(state)).toBe("account_exists_user_does_not");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
npm test -- src/game/rules/recoverAccountRules.test.ts src/game/endings.test.ts
```

Expected: FAIL because recovery rules and endings do not exist.

- [ ] **Step 4: Implement recovery rules**

Create `src/game/rules/recoverAccountRules.ts`:

```ts
import type { RuleDefinition } from "../types";
import { fail, isEnglishOnly, pass } from "./helpers";

function occurrenceCount(text: string, phrase: string): number {
  if (!phrase) return 0;
  return text.toLowerCase().split(phrase.toLowerCase()).length - 1;
}

function commaCount(text: string): number {
  return [...text].filter((char) => char === ",").length;
}

function identityDigits(identityNumber: string): string[] {
  return [...new Set(identityNumber.replace(/\D/g, "").split(""))].filter(Boolean);
}

export const recoverAccountRules: RuleDefinition[] = [
  {
    id: "recover.salutation",
    chapter: "recover",
    title: "Safeguards salutation",
    description: "Appeal letter must start with Dear Safeguards Team,.",
    check: ({ profile }) =>
      profile.appealLetter.startsWith("Dear Safeguards Team,")
        ? pass("The team has agreed it is a team.")
        : fail("Appeal letter must start with Dear Safeguards Team,."),
  },
  {
    id: "recover.reasonOnce",
    chapter: "recover",
    title: "Reason mention",
    description: "Suspension reason phrase must appear exactly once.",
    unlockAfter: "recover.salutation",
    check: ({ profile, history }) =>
      occurrenceCount(profile.appealLetter, history.suspensionReason) === 1
        ? pass("Reason acknowledged without dwelling.")
        : fail("Suspension reason must appear exactly once.", ["appeal_tone_unclear"]),
  },
  {
    id: "recover.ticketFromMailbox",
    chapter: "recover",
    title: "Ticket number",
    description: "Ticket number must come from the latest recovery email.",
    unlockAfter: "recover.reasonOnce",
    check: ({ profile, browser }) => {
      const latestTicket = [...browser.mailboxMessages].reverse().find((message) => message.ticketNumber)?.ticketNumber;
      return latestTicket && profile.ticketNumber === latestTicket
        ? pass("Ticket number accepted.")
        : fail("Ticket number must match the latest recovery email.");
    },
  },
  {
    id: "recover.ticketNoGreeting",
    chapter: "recover",
    title: "Ticket without greeting",
    description: "Appeal letter must include the ticket number but not include the mailbox greeting phrase.",
    unlockAfter: "recover.ticketFromMailbox",
    check: ({ profile, browser }) => {
      const latest = [...browser.mailboxMessages].reverse().find((message) => message.ticketNumber);
      if (!latest || !latest.ticketNumber) return fail("Open mailbox.local to receive a ticket.");
      const includesTicket = profile.appealLetter.includes(latest.ticketNumber);
      const includesGreeting = profile.appealLetter.includes(latest.greetingPhrase);
      return includesTicket && !includesGreeting
        ? pass("Ticket included without emotional contamination.")
        : fail("Include the ticket number without copying the mailbox greeting.");
    },
  },
  {
    id: "recover.denyMultipleAccounts",
    chapter: "recover",
    title: "Backup identity",
    description: "Appeal letter must deny creating multiple accounts while recovery email remains present.",
    unlockAfter: "recover.ticketNoGreeting",
    check: ({ profile }) =>
      profile.recoveryEmail && /not create multiple accounts/i.test(profile.appealLetter)
        ? pass("Backup identity contradiction accepted.")
        : fail("Deny creating multiple accounts while keeping a recovery email."),
  },
  {
    id: "recover.regionCommas",
    chapter: "recover",
    title: "Comma relocation",
    description: "Appeal letter must contain exactly as many commas as region changes during registration.",
    unlockAfter: "recover.denyMultipleAccounts",
    check: ({ profile, history }) =>
      commaCount(profile.appealLetter) === history.regionChangeCount
        ? pass("Punctuation explains your travel history.")
        : fail(`Appeal letter must contain exactly ${history.regionChangeCount} commas.`, ["region_mismatch"]),
  },
  {
    id: "recover.firstSmsCode",
    chapter: "recover",
    title: "First successful code",
    description: "Appeal letter must include the first successfully used SMS code.",
    unlockAfter: "recover.regionCommas",
    check: ({ profile, history }) =>
      history.firstSuccessfulSmsCode && profile.appealLetter.includes(history.firstSuccessfulSmsCode)
        ? pass("Original verification remembered.")
        : fail("Appeal letter must include the first successful SMS code."),
  },
  {
    id: "recover.noIdentityDigits",
    chapter: "recover",
    title: "No identity digits",
    description: "Appeal letter must not contain any digit from the fictional identity number.",
    unlockAfter: "recover.firstSmsCode",
    check: ({ profile }) => {
      if (!profile.identityCard) return fail("Generate a fictional identity card first.");
      const blockedDigits = identityDigits(profile.identityCard.identityNumber);
      return blockedDigits.some((digit) => profile.appealLetter.includes(digit))
        ? fail("Appeal letter contains a digit from the identity number.", ["identity_loop"])
        : pass("Identity digits safely absent.");
    },
  },
  {
    id: "recover.birthdayMatch",
    chapter: "recover",
    title: "Birthday match",
    description: "Identity card birthday must match account birthday.",
    unlockAfter: "recover.noIdentityDigits",
    check: ({ profile }) =>
      profile.identityCard?.birthday === profile.birthday
        ? pass("Birthday agrees with itself.")
        : fail("Identity card birthday must match account birthday.", ["identity_loop"]),
  },
  {
    id: "recover.tone",
    chapter: "recover",
    title: "Polite but not desperate",
    description: "thank you appears exactly once and exclamation marks are not allowed.",
    unlockAfter: "recover.birthdayMatch",
    check: ({ profile }) => {
      const thankYous = occurrenceCount(profile.appealLetter, "thank you");
      return thankYous === 1 && !profile.appealLetter.includes("!")
        ? pass("Tone is acceptably grateful.")
        : fail("Use thank you exactly once and no exclamation marks.", ["appeal_tone_unclear"]);
    },
  },
  {
    id: "recover.traveling",
    chapter: "recover",
    title: "Travel explanation",
    description: "If Proxy ON was used more than three times during registration, appeal letter must include I was traveling.",
    unlockAfter: "recover.tone",
    check: ({ profile, history }) => {
      if (history.proxyOnUseCountDuringRegistration <= 3) return pass("Travel explanation not required.");
      return profile.appealLetter.includes("I was traveling")
        ? { status: "passed", message: "Travel explanation accepted but marked as unusually convenient.", riskTags: ["vpn_energy"] }
        : fail("Appeal letter must include I was traveling.", ["vpn_energy"]);
    },
  },
  {
    id: "recover.finalPhrase",
    chapter: "recover",
    title: "Final identity phrase",
    description: "Final identity phrase must exactly match email + username + account region + ticket number.",
    unlockAfter: "recover.traveling",
    check: ({ profile }) => {
      const expected = `${profile.email} ${profile.username} ${profile.region} ${profile.ticketNumber}`;
      return profile.finalIdentityPhrase === expected
        ? pass("You are consistent with the latest version of you.")
        : fail("Final identity phrase does not match.");
    },
  },
];
```

- [ ] **Step 5: Export all rules**

Modify `src/game/rules/index.ts`:

```ts
import { createAccountRules } from "./createAccountRules";
import { recoverAccountRules } from "./recoverAccountRules";

export const allRules = [...createAccountRules, ...recoverAccountRules];
```

- [ ] **Step 6: Implement endings**

Create `src/game/endings.ts`:

```ts
import type { EndingId, GameState } from "./types";

export interface EndingDefinition {
  id: EndingId;
  title: string;
  body: string;
  buttonLabel: string;
}

export const ENDINGS: Record<EndingId, EndingDefinition> = {
  recovered: {
    id: "recovered",
    title: "Recovered",
    body: "Your account has been restored. The welcome page contains one button: Log out.",
    buttonLabel: "Log out",
  },
  read_only_human: {
    id: "read_only_human",
    title: "Read Only Human",
    body: "The system believes you exist, but it does not trust input from you.",
    buttonLabel: "Acknowledge",
  },
  appeal_pending: {
    id: "appeal_pending",
    title: "Appeal Pending",
    body: "Your appeal entered a 90-day queue. The countdown begins at 91.",
    buttonLabel: "Refresh later",
  },
  account_exists_user_does_not: {
    id: "account_exists_user_does_not",
    title: "Account Exists, User Does Not",
    body: "The account is confirmed real. The user remains too risky to exist near it.",
    buttonLabel: "Close",
  },
  thank_you_for_understanding: {
    id: "thank_you_for_understanding",
    title: "Thank You For Understanding",
    body: "The support system closed the case. Every available action says Close.",
    buttonLabel: "Close",
  },
};

export function chooseEnding(state: GameState): EndingId {
  const tags = new Set(state.riskTags);

  if (tags.has("identity_loop") && tags.has("region_mismatch")) {
    return "account_exists_user_does_not";
  }

  if (tags.has("appeal_tone_unclear") && tags.has("too_determined")) {
    return "thank_you_for_understanding";
  }

  if (tags.has("vpn_energy") && tags.has("verification_chaser")) {
    return "appeal_pending";
  }

  if (tags.size > 0) {
    return "read_only_human";
  }

  return "recovered";
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run:

```bash
npm test -- src/game/rules/recoverAccountRules.test.ts src/game/endings.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit recovery rules and endings**

Run:

```bash
git add src/game/rules/recoverAccountRules.ts src/game/rules/index.ts src/game/endings.ts src/game/rules/recoverAccountRules.test.ts src/game/endings.test.ts
git commit -m "feat: add recovery rules and endings"
```

Expected: commit succeeds.

---

## Task 7: Implement Reducer, Actions, Chapter Transition, And Persistence

**Files:**

- Create: `src/game/reducer.ts`
- Create: `src/game/persistence.ts`
- Test: `src/game/reducer.test.ts`
- Test: `src/game/persistence.test.ts`

- [ ] **Step 1: Write failing reducer tests**

Create `src/game/reducer.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { gameReducer } from "./reducer";

describe("gameReducer", () => {
  it("tracks region changes", () => {
    const state = makeState({ profile: { region: "United States" } });
    const next = gameReducer(state, { type: "profile/update", field: "region", value: "Canada" });

    expect(next.profile.region).toBe("Canada");
    expect(next.history.regionChangeCount).toBe(1);
  });

  it("tracks proxy usage during registration", () => {
    const state = makeState({ chapter: "create", browser: { proxyEnabled: false } });
    const next = gameReducer(state, { type: "browser/toggleProxy" });

    expect(next.browser.proxyEnabled).toBe(true);
    expect(next.history.proxyOnUseCountDuringRegistration).toBe(1);
  });

  it("transitions to recover chapter with a mailbox ticket", () => {
    const state = makeState();
    const next = gameReducer(state, { type: "game/completeCreateAccount", now: 123 });

    expect(next.chapter).toBe("recover");
    expect(next.unlockedRuleIds).toEqual(["recover.salutation"]);
    expect(next.history.registrationSuccessAt).toBe(123);
    expect(next.history.generatedTicketNumber).toMatch(/^CASE-[0-9]{4}$/);
    expect(next.browser.mailboxMessages.at(-1)?.ticketNumber).toBe(next.history.generatedTicketNumber);
  });
});
```

- [ ] **Step 2: Write failing persistence tests**

Create `src/game/persistence.test.ts`:

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { createInitialState } from "./initialState";
import { loadGame, saveGame } from "./persistence";

describe("persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and loads matching save versions", () => {
    const state = createInitialState();
    const saved = { ...state, systemLog: ["saved"] };

    saveGame(saved);

    expect(loadGame()?.systemLog).toEqual(["saved"]);
  });

  it("returns null for invalid saved data", () => {
    localStorage.setItem("account-browser-save", "{not json");

    expect(loadGame()).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
npm test -- src/game/reducer.test.ts src/game/persistence.test.ts
```

Expected: FAIL because reducer and persistence do not exist.

- [ ] **Step 4: Implement reducer**

Create `src/game/reducer.ts`:

```ts
import { REGION_TIMEZONE } from "./constants";
import { chooseEnding } from "./endings";
import { collectRiskTags, unlockNextRuleIds } from "./ruleEngine";
import { generateSmsCode } from "./sms";
import type { GameState, IdentityCard, Profile, SiteId, SupportedRegion } from "./types";

export type GameAction =
  | { type: "profile/update"; field: keyof Profile; value: string }
  | { type: "browser/navigate"; site: SiteId }
  | { type: "browser/back" }
  | { type: "browser/toggleProxy" }
  | { type: "sms/refresh"; seed: number; now: number }
  | { type: "identity/generate"; card: IdentityCard }
  | { type: "rules/recheck" }
  | { type: "game/completeCreateAccount"; now: number }
  | { type: "game/finishRecover" };

function withRuleUpdates(state: GameState): GameState {
  const unlockedRuleIds = unlockNextRuleIds(state);
  const riskTags = collectRiskTags({ ...state, unlockedRuleIds });
  return { ...state, unlockedRuleIds, riskTags };
}

function ticketFromNow(now: number): string {
  return `CASE-${String(now % 10_000).padStart(4, "0")}`;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "profile/update": {
      const profile = { ...state.profile, [action.field]: action.value };
      const regionChanged = action.field === "region" && state.profile.region !== "" && state.profile.region !== action.value;
      const history = {
        ...state.history,
        regionChangeCount: state.history.regionChangeCount + (regionChanged ? 1 : 0),
      };
      return withRuleUpdates({ ...state, profile, history });
    }

    case "browser/navigate":
      return {
        ...state,
        browser: {
          ...state.browser,
          currentUrl: action.site,
          history: [...state.browser.history, state.browser.currentUrl],
        },
      };

    case "browser/back": {
      const previous = state.browser.history.at(-1);
      if (!previous) return state;
      return {
        ...state,
        browser: {
          ...state.browser,
          currentUrl: previous,
          history: state.browser.history.slice(0, -1),
        },
      };
    }

    case "browser/toggleProxy": {
      const proxyEnabled = !state.browser.proxyEnabled;
      const history = {
        ...state.history,
        proxyOnUseCountDuringRegistration:
          state.chapter === "create" && proxyEnabled
            ? state.history.proxyOnUseCountDuringRegistration + 1
            : state.history.proxyOnUseCountDuringRegistration,
      };
      const region: SupportedRegion = proxyEnabled ? "United States" : "Taiwan";
      return withRuleUpdates({
        ...state,
        history,
        browser: {
          ...state.browser,
          proxyEnabled,
          timezoneReport: {
            region,
            timezone: REGION_TIMEZONE[region],
            language: "en-US",
          },
        },
      });
    }

    case "sms/refresh":
      return withRuleUpdates({
        ...state,
        browser: {
          ...state.browser,
          currentSmsCode: generateSmsCode(action.seed),
          smsRefreshAt: action.now + 30_000,
        },
      });

    case "identity/generate":
      return withRuleUpdates({
        ...state,
        profile: { ...state.profile, identityCard: action.card },
        history: {
          ...state.history,
          generatedIdentityCards: [...state.history.generatedIdentityCards, action.card],
        },
      });

    case "rules/recheck":
      return withRuleUpdates(state);

    case "game/completeCreateAccount": {
      const ticketNumber = ticketFromNow(action.now);
      return {
        ...state,
        chapter: "recover",
        unlockedRuleIds: ["recover.salutation"],
        history: {
          ...state.history,
          registrationSuccessAt: action.now,
          generatedTicketNumber: ticketNumber,
          firstSuccessfulSmsCode: state.history.firstSuccessfulSmsCode ?? state.profile.smsCode,
        },
        profile: {
          ...state.profile,
          ticketNumber,
          appealLetter: "Dear Safeguards Team, ",
        },
        browser: {
          ...state.browser,
          currentUrl: "cloudyai.signup.fake",
          mailboxMessages: [
            ...state.browser.mailboxMessages,
            {
              id: `mail-${ticketNumber}`,
              subject: "Account recovery ticket",
              greetingPhrase: "Hello valued user",
              body: `Your account was suspended for ${state.history.suspensionReason}.`,
              ticketNumber,
              createdAt: action.now,
            },
          ],
        },
        systemLog: [...state.systemLog, "Welcome. Your account has been suspended."],
      };
    }

    case "game/finishRecover":
      return { ...state, ending: chooseEnding(state) };

    default:
      return state;
  }
}
```

- [ ] **Step 5: Implement persistence**

Create `src/game/persistence.ts`:

```ts
import { SAVE_VERSION } from "./constants";
import type { GameState } from "./types";

export const SAVE_KEY = "account-browser-save";

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GameState;
    return parsed.saveVersion === SAVE_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(SAVE_KEY);
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run:

```bash
npm test -- src/game/reducer.test.ts src/game/persistence.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit reducer and persistence**

Run:

```bash
git add src/game/reducer.ts src/game/persistence.ts src/game/reducer.test.ts src/game/persistence.test.ts
git commit -m "feat: add game reducer and persistence"
```

Expected: commit succeeds.

---

## Task 8: Build Browser Shell And Rule Panel

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/components/browser/BrowserShell.tsx`
- Create: `src/components/browser/Toolbar.tsx`
- Create: `src/components/browser/SiteTabs.tsx`
- Create: `src/components/rules/RulePanel.tsx`
- Test: `src/components/browser/BrowserShell.test.tsx`

- [ ] **Step 1: Write failing browser shell test**

Create `src/components/browser/BrowserShell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createInitialState } from "../../game/initialState";
import type { GameAction } from "../../game/reducer";
import { BrowserShell } from "./BrowserShell";

describe("BrowserShell", () => {
  it("renders current url, proxy toggle, tabs, and rule panel", async () => {
    const dispatch = vi.fn<(action: GameAction) => void>();
    render(<BrowserShell state={createInitialState()} dispatch={dispatch} />);

    expect(screen.getByDisplayValue("cloudyai.signup.fake")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /proxy off/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sms.local/i })).toBeInTheDocument();
    expect(screen.getByText("Valid email")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /proxy off/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: "browser/toggleProxy" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/components/browser/BrowserShell.test.tsx
```

Expected: FAIL because components do not exist.

- [ ] **Step 3: Implement shell components**

Create `src/components/browser/Toolbar.tsx`:

```tsx
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";

interface ToolbarProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function Toolbar({ state, dispatch }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button type="button" className="icon-button" onClick={() => dispatch({ type: "browser/back" })}>
        Back
      </button>
      <input className="address-bar" value={state.browser.currentUrl} readOnly aria-label="Address" />
      <button type="button" className="proxy-toggle" onClick={() => dispatch({ type: "browser/toggleProxy" })}>
        Proxy {state.browser.proxyEnabled ? "ON" : "OFF"}
      </button>
    </div>
  );
}
```

Create `src/components/browser/SiteTabs.tsx`:

```tsx
import type { GameAction } from "../../game/reducer";
import type { GameState, SiteId } from "../../game/types";

interface SiteTabsProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const SITE_LABELS: Record<SiteId, string> = {
  "cloudyai.signup.fake": "CloudyAI",
  "sms.local": "sms.local",
  "identity.gov.fake": "identity.gov.fake",
  "mailbox.local": "mailbox.local",
  "timezone-checker.net": "timezone-checker.net",
};

export function SiteTabs({ state, dispatch }: SiteTabsProps) {
  return (
    <nav className="site-tabs" aria-label="Sites">
      {state.browser.openTabs.map((site) => (
        <button
          type="button"
          key={site}
          className={site === state.browser.currentUrl ? "tab active" : "tab"}
          onClick={() => dispatch({ type: "browser/navigate", site })}
        >
          {SITE_LABELS[site]}
        </button>
      ))}
    </nav>
  );
}
```

Create `src/components/rules/RulePanel.tsx`:

```tsx
import { evaluateRules } from "../../game/ruleEngine";
import type { GameState } from "../../game/types";

interface RulePanelProps {
  state: GameState;
}

export function RulePanel({ state }: RulePanelProps) {
  const rules = evaluateRules(state);

  return (
    <aside className="rule-panel" aria-label="Rules and status">
      <div className="status-strip">
        <span>{state.chapter === "create" ? "Create Account" : "Recover Account"}</span>
        <span>Risk {state.riskTags.length}</span>
      </div>
      <section>
        <h2>Rules</h2>
        <ol className="rule-list">
          {rules.map((rule) => (
            <li key={rule.id} className={`rule-item ${rule.status}`}>
              <strong>{rule.title}</strong>
              <p>{rule.description}</p>
              <small>{rule.message}</small>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2>Risk tags</h2>
        <div className="tag-list">
          {state.riskTags.length === 0 ? <span className="empty">None yet</span> : state.riskTags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>
      <section>
        <h2>System log</h2>
        <ul className="system-log">
          {state.systemLog.slice(-6).map((line, index) => (
            <li key={`${line}-${index}`}>{line}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
```

Create `src/components/browser/BrowserShell.tsx`:

```tsx
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";
import { RulePanel } from "../rules/RulePanel";
import { SiteViewport } from "../sites/SiteViewport";
import { SiteTabs } from "./SiteTabs";
import { Toolbar } from "./Toolbar";

interface BrowserShellProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function BrowserShell({ state, dispatch }: BrowserShellProps) {
  return (
    <div className="game-layout">
      <section className="browser-window" aria-label="Fictional browser">
        <Toolbar state={state} dispatch={dispatch} />
        <SiteTabs state={state} dispatch={dispatch} />
        <SiteViewport state={state} dispatch={dispatch} />
      </section>
      <RulePanel state={state} />
    </div>
  );
}
```

- [ ] **Step 4: Temporarily stub SiteViewport**

Create `src/components/sites/SiteViewport.tsx`:

```tsx
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";

interface SiteViewportProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function SiteViewport({ state }: SiteViewportProps) {
  return (
    <div className="site-viewport">
      <h1>{state.browser.currentUrl}</h1>
    </div>
  );
}
```

This stub is replaced in Task 9.

- [ ] **Step 5: Wire app state**

Modify `src/App.tsx`:

```tsx
import { useEffect, useReducer } from "react";
import { BrowserShell } from "./components/browser/BrowserShell";
import { createInitialState } from "./game/initialState";
import { loadGame, saveGame } from "./game/persistence";
import { gameReducer } from "./game/reducer";

export function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => loadGame() ?? createInitialState());

  useEffect(() => {
    saveGame(state);
  }, [state]);

  return (
    <main className="app-shell">
      <BrowserShell state={state} dispatch={dispatch} />
    </main>
  );
}
```

Modify `src/styles.css` by replacing its contents with:

```css
:root {
  color: #18212f;
  background: #eef1f5;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  min-height: 100vh;
  padding: 12px;
}

.game-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 12px;
  min-height: calc(100vh - 24px);
}

.browser-window,
.rule-panel {
  border: 1px solid #c8ced8;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
}

.toolbar {
  display: grid;
  grid-template-columns: auto minmax(120px, 1fr) auto;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid #d8dee8;
  background: #eef2f7;
}

.address-bar,
.field,
.text-area {
  width: 100%;
  border: 1px solid #b7c0ce;
  border-radius: 6px;
  background: white;
  color: #18212f;
  padding: 9px 10px;
}

.text-area {
  min-height: 92px;
  resize: vertical;
}

.icon-button,
.proxy-toggle,
.tab,
.primary-button,
.secondary-button {
  border: 1px solid #9eabbc;
  border-radius: 6px;
  background: #ffffff;
  color: #18212f;
  padding: 9px 12px;
}

.primary-button {
  background: #1c5f8f;
  border-color: #1c5f8f;
  color: white;
}

.site-tabs {
  display: flex;
  gap: 6px;
  padding: 8px;
  overflow-x: auto;
  border-bottom: 1px solid #d8dee8;
  background: #f5f7fa;
}

.tab.active {
  background: #dce9f5;
  border-color: #6f9ec5;
}

.site-viewport {
  padding: 16px;
  min-height: calc(100vh - 128px);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field-stack {
  display: grid;
  gap: 12px;
}

.rule-panel {
  padding: 12px;
  overflow-y: auto;
}

.status-strip {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #c8ced8;
  border-radius: 6px;
  background: #ffffff;
}

.rule-list {
  display: grid;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.rule-item {
  border: 1px solid #c8ced8;
  border-radius: 6px;
  padding: 10px;
  background: white;
}

.rule-item p {
  margin: 6px 0;
}

.rule-item.passed {
  border-color: #5f9f75;
  background: #f0faf2;
}

.rule-item.failed {
  border-color: #c57575;
  background: #fff5f5;
}

.rule-item.locked {
  color: #667085;
  background: #f2f4f7;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-list span {
  border-radius: 999px;
  background: #e6edf5;
  padding: 5px 8px;
  font-size: 0.85rem;
}

.system-log {
  padding-left: 18px;
}

.site-card {
  border: 1px solid #c8ced8;
  border-radius: 8px;
  padding: 14px;
  background: white;
}

@media (max-width: 900px) {
  .game-layout {
    grid-template-columns: 1fr;
  }

  .rule-panel {
    max-height: 48vh;
  }
}

@media (max-width: 620px) {
  .toolbar {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run browser shell test**

Run:

```bash
npm test -- src/components/browser/BrowserShell.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit shell and rule panel**

Run:

```bash
git add src/App.tsx src/styles.css src/components/browser src/components/rules src/components/sites/SiteViewport.tsx src/components/browser/BrowserShell.test.tsx
git commit -m "feat: add browser shell and rule panel"
```

Expected: commit succeeds.

---

## Task 9: Implement Fake Websites

**Files:**

- Modify: `src/components/sites/SiteViewport.tsx`
- Create: `src/components/sites/CloudySignupSite.tsx`
- Create: `src/components/sites/SmsSite.tsx`
- Create: `src/components/sites/IdentitySite.tsx`
- Create: `src/components/sites/MailboxSite.tsx`
- Create: `src/components/sites/TimezoneSite.tsx`
- Create: `src/components/sites/SiteError.tsx`
- Test: `src/components/sites/SiteViewport.test.tsx`

- [ ] **Step 1: Write failing site viewport test**

Create `src/components/sites/SiteViewport.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeState } from "../../test/fixtures";
import { SiteViewport } from "./SiteViewport";

describe("SiteViewport", () => {
  it("shows proxy access error before rendering blocked sites", () => {
    render(
      <SiteViewport
        state={makeState({ browser: { currentUrl: "cloudyai.signup.fake", proxyEnabled: false } })}
        dispatch={vi.fn()}
      />,
    );

    expect(screen.getByText("Service unavailable")).toBeInTheDocument();
  });

  it("renders the signup site when access is allowed", () => {
    render(
      <SiteViewport
        state={makeState({ browser: { currentUrl: "cloudyai.signup.fake", proxyEnabled: true } })}
        dispatch={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: /cloudyai account/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/components/sites/SiteViewport.test.tsx
```

Expected: FAIL because site components do not exist.

- [ ] **Step 3: Implement shared site error**

Create `src/components/sites/SiteError.tsx`:

```tsx
interface SiteErrorProps {
  title: string;
  message: string;
}

export function SiteError({ title, message }: SiteErrorProps) {
  return (
    <div className="site-card" role="alert">
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
}
```

- [ ] **Step 4: Implement CloudyAI site**

Create `src/components/sites/CloudySignupSite.tsx`:

```tsx
import type { GameAction } from "../../game/reducer";
import type { GameState, Profile } from "../../game/types";

interface SiteProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

function update(dispatch: React.Dispatch<GameAction>, field: keyof Profile) {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    dispatch({ type: "profile/update", field, value: event.target.value });
  };
}

export function CloudySignupSite({ state, dispatch }: SiteProps) {
  const profile = state.profile;
  const isRecover = state.chapter === "recover";

  return (
    <div className="field-stack">
      <div>
        <h1>{isRecover ? "CloudyAI Account Recovery" : "CloudyAI Account"}</h1>
        <p>{isRecover ? "Recover your account by proving the account recovered you first." : "Create an account for global productivity."}</p>
      </div>

      <div className="form-grid">
        <input className="field" aria-label="Email" placeholder="Email" value={profile.email} onChange={update(dispatch, "email")} />
        <input className="field" aria-label="Username" placeholder="Username" value={profile.username} onChange={update(dispatch, "username")} />
        <input className="field" aria-label="Password" placeholder="Password" value={profile.password} onChange={update(dispatch, "password")} />
        <select className="field" aria-label="Account region" value={profile.region} onChange={update(dispatch, "region")}>
          <option value="">Choose region</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Taiwan">Taiwan</option>
        </select>
        <input className="field" aria-label="Phone" placeholder="Phone" value={profile.phone} onChange={update(dispatch, "phone")} />
        <input className="field" aria-label="Birthday" type="date" value={profile.birthday} onChange={update(dispatch, "birthday")} />
        <input className="field" aria-label="Recovery email" placeholder="Recovery email" value={profile.recoveryEmail} onChange={update(dispatch, "recoveryEmail")} />
        <input className="field" aria-label="SMS code" placeholder="SMS code" value={profile.smsCode} onChange={update(dispatch, "smsCode")} />
      </div>

      {isRecover ? (
        <>
          <textarea className="text-area" aria-label="Appeal letter" value={profile.appealLetter} onChange={update(dispatch, "appealLetter")} />
          <input className="field" aria-label="Ticket number" placeholder="Ticket number" value={profile.ticketNumber} onChange={update(dispatch, "ticketNumber")} />
          <input className="field" aria-label="Final identity phrase" placeholder="Final identity phrase" value={profile.finalIdentityPhrase} onChange={update(dispatch, "finalIdentityPhrase")} />
          <button type="button" className="primary-button" onClick={() => dispatch({ type: "game/finishRecover" })}>
            Submit appeal
          </button>
        </>
      ) : (
        <>
          <textarea className="text-area" aria-label="Registration statement" value={profile.registrationStatement} onChange={update(dispatch, "registrationStatement")} />
          <button type="button" className="primary-button" onClick={() => dispatch({ type: "game/completeCreateAccount", now: Date.now() })}>
            Create Account
          </button>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Implement SMS site**

Create `src/components/sites/SmsSite.tsx`:

```tsx
import type { GameAction } from "../../game/reducer";
import { digitSum } from "../../game/sms";
import type { GameState } from "../../game/types";

interface SiteProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function SmsSite({ state, dispatch }: SiteProps) {
  const code = state.browser.currentSmsCode;

  return (
    <div className="site-card">
      <h1>SMS Local Center</h1>
      <p>Your current verification code is:</p>
      <strong className="code-display">{code}</strong>
      <p>Digit sum: {digitSum(code)}</p>
      <button type="button" className="secondary-button" onClick={() => dispatch({ type: "sms/refresh", seed: Date.now(), now: Date.now() })}>
        Request another code
      </button>
    </div>
  );
}
```

- [ ] **Step 6: Implement identity site**

Create `src/components/sites/IdentitySite.tsx`:

```tsx
import type { GameAction } from "../../game/reducer";
import type { GameState, IdentityCard, SupportedRegion } from "../../game/types";

interface SiteProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

function makeIdentityCard(state: GameState): IdentityCard {
  const region = (state.profile.region || "United States") as SupportedRegion;
  const birthday = state.profile.birthday || "1990-01-01";
  const seed = `${state.profile.email}-${state.profile.username}-${birthday}-${region}`;
  const digits = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0);
  return {
    name: state.profile.username || "Ordinary User",
    birthday,
    region,
    identityNumber: `FAKE-${String(digits).padStart(6, "0")}`,
  };
}

export function IdentitySite({ state, dispatch }: SiteProps) {
  const card = state.profile.identityCard;

  return (
    <div className="site-card">
      <h1>Department of Acceptable Identity</h1>
      <p>Issue a fictional identity card for compatibility testing.</p>
      <button type="button" className="primary-button" onClick={() => dispatch({ type: "identity/generate", card: makeIdentityCard(state) })}>
        Generate fictional card
      </button>
      {card ? (
        <dl className="identity-card">
          <dt>Name</dt>
          <dd>{card.name}</dd>
          <dt>Birthday</dt>
          <dd>{card.birthday}</dd>
          <dt>Region</dt>
          <dd>{card.region}</dd>
          <dt>Identity number</dt>
          <dd>{card.identityNumber}</dd>
        </dl>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 7: Implement mailbox and timezone sites**

Create `src/components/sites/MailboxSite.tsx`:

```tsx
import type { GameState } from "../../game/types";

interface MailboxSiteProps {
  state: GameState;
}

export function MailboxSite({ state }: MailboxSiteProps) {
  return (
    <div className="site-card">
      <h1>Mailbox Local</h1>
      {state.browser.mailboxMessages.length === 0 ? (
        <p>No messages. The system has not needed to misunderstand you yet.</p>
      ) : (
        <ul className="mail-list">
          {state.browser.mailboxMessages.map((message) => (
            <li key={message.id}>
              <strong>{message.subject}</strong>
              <p>{message.greetingPhrase}</p>
              <p>{message.body}</p>
              {message.ticketNumber ? <code>{message.ticketNumber}</code> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Create `src/components/sites/TimezoneSite.tsx`:

```tsx
import type { GameState } from "../../game/types";

interface TimezoneSiteProps {
  state: GameState;
}

export function TimezoneSite({ state }: TimezoneSiteProps) {
  const report = state.browser.timezoneReport;

  return (
    <div className="site-card">
      <h1>Timezone Checker</h1>
      <dl>
        <dt>Network region</dt>
        <dd>{report.region}</dd>
        <dt>Timezone</dt>
        <dd>{report.timezone}</dd>
        <dt>Browser language</dt>
        <dd>{report.language}</dd>
      </dl>
    </div>
  );
}
```

- [ ] **Step 8: Replace SiteViewport router**

Modify `src/components/sites/SiteViewport.tsx`:

```tsx
import type { GameAction } from "../../game/reducer";
import { getSiteAccess } from "../../game/siteAccess";
import type { GameState } from "../../game/types";
import { CloudySignupSite } from "./CloudySignupSite";
import { IdentitySite } from "./IdentitySite";
import { MailboxSite } from "./MailboxSite";
import { SiteError } from "./SiteError";
import { SmsSite } from "./SmsSite";
import { TimezoneSite } from "./TimezoneSite";

interface SiteViewportProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function SiteViewport({ state, dispatch }: SiteViewportProps) {
  const access = getSiteAccess(state.browser.currentUrl, state.browser.proxyEnabled);
  if (!access.ok) {
    return (
      <div className="site-viewport">
        <SiteError title={access.title ?? "Site unavailable"} message={access.message ?? "This site cannot be reached."} />
      </div>
    );
  }

  return (
    <div className="site-viewport">
      {state.browser.currentUrl === "cloudyai.signup.fake" ? <CloudySignupSite state={state} dispatch={dispatch} /> : null}
      {state.browser.currentUrl === "sms.local" ? <SmsSite state={state} dispatch={dispatch} /> : null}
      {state.browser.currentUrl === "identity.gov.fake" ? <IdentitySite state={state} dispatch={dispatch} /> : null}
      {state.browser.currentUrl === "mailbox.local" ? <MailboxSite state={state} /> : null}
      {state.browser.currentUrl === "timezone-checker.net" ? <TimezoneSite state={state} /> : null}
    </div>
  );
}
```

- [ ] **Step 9: Run site tests**

Run:

```bash
npm test -- src/components/sites/SiteViewport.test.tsx
```

Expected: PASS.

- [ ] **Step 10: Commit fake sites**

Run:

```bash
git add src/components/sites src/components/sites/SiteViewport.test.tsx
git commit -m "feat: add in-game websites"
```

Expected: commit succeeds.

---

## Task 10: Add Ending View And Completion Controls

**Files:**

- Modify: `src/App.tsx`
- Create: `src/components/endings/EndingView.tsx`
- Test: `src/components/endings/EndingView.test.tsx`

- [ ] **Step 1: Write failing ending view test**

Create `src/components/endings/EndingView.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EndingView } from "./EndingView";

describe("EndingView", () => {
  it("renders the selected ending", () => {
    render(<EndingView endingId="read_only_human" />);

    expect(screen.getByRole("heading", { name: "Read Only Human" })).toBeInTheDocument();
    expect(screen.getByText(/does not trust input/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/components/endings/EndingView.test.tsx
```

Expected: FAIL because `EndingView` does not exist.

- [ ] **Step 3: Implement EndingView**

Create `src/components/endings/EndingView.tsx`:

```tsx
import { ENDINGS } from "../../game/endings";
import type { EndingId } from "../../game/types";

interface EndingViewProps {
  endingId: EndingId;
}

export function EndingView({ endingId }: EndingViewProps) {
  const ending = ENDINGS[endingId];

  return (
    <main className="ending-screen">
      <section className="site-card">
        <h1>{ending.title}</h1>
        <p>{ending.body}</p>
        <button type="button" className="primary-button">
          {ending.buttonLabel}
        </button>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Wire ending into App**

Modify `src/App.tsx`:

```tsx
import { useEffect, useReducer } from "react";
import { BrowserShell } from "./components/browser/BrowserShell";
import { EndingView } from "./components/endings/EndingView";
import { createInitialState } from "./game/initialState";
import { loadGame, saveGame } from "./game/persistence";
import { gameReducer } from "./game/reducer";

export function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => loadGame() ?? createInitialState());

  useEffect(() => {
    saveGame(state);
  }, [state]);

  if (state.ending) {
    return <EndingView endingId={state.ending} />;
  }

  return (
    <main className="app-shell">
      <BrowserShell state={state} dispatch={dispatch} />
    </main>
  );
}
```

Append to `src/styles.css`:

```css
.ending-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
}
```

- [ ] **Step 5: Run ending tests**

Run:

```bash
npm test -- src/components/endings/EndingView.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit ending UI**

Run:

```bash
git add src/App.tsx src/styles.css src/components/endings src/components/endings/EndingView.test.tsx
git commit -m "feat: add ending view"
```

Expected: commit succeeds.

---

## Task 11: Add Playability Polish And Responsive QA

**Files:**

- Modify: `src/game/reducer.ts`
- Modify: `src/components/rules/RulePanel.tsx`
- Modify: `src/components/sites/CloudySignupSite.tsx`
- Modify: `src/styles.css`
- Test: `src/components/playability.test.tsx`

- [ ] **Step 1: Write failing playability test**

Create `src/components/playability.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("playability", () => {
  it("lets a player toggle proxy and see the main account form", async () => {
    localStorage.clear();
    render(<App />);

    expect(screen.getByText("Service unavailable")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /proxy off/i }));

    expect(screen.getByRole("heading", { name: /cloudyai account/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails or exposes missing wiring**

Run:

```bash
npm test -- src/components/playability.test.tsx
```

Expected: FAIL if existing shell does not update correctly; PASS is acceptable if prior tasks already satisfy the flow.

- [ ] **Step 3: Improve rule panel readability**

Modify `src/components/rules/RulePanel.tsx` so rule items include visible status labels:

```tsx
import { evaluateRules } from "../../game/ruleEngine";
import type { GameState } from "../../game/types";

interface RulePanelProps {
  state: GameState;
}

export function RulePanel({ state }: RulePanelProps) {
  const rules = evaluateRules(state);

  return (
    <aside className="rule-panel" aria-label="Rules and status">
      <div className="status-strip">
        <span>{state.chapter === "create" ? "Create Account" : "Recover Account"}</span>
        <span>Risk {state.riskTags.length}</span>
      </div>
      <section>
        <h2>Rules</h2>
        <ol className="rule-list">
          {rules.map((rule) => (
            <li key={rule.id} className={`rule-item ${rule.status}`}>
              <div className="rule-heading">
                <strong>{rule.title}</strong>
                <span>{rule.status}</span>
              </div>
              <p>{rule.description}</p>
              <small>{rule.message}</small>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2>Risk tags</h2>
        <div className="tag-list">
          {state.riskTags.length === 0 ? <span className="empty">None yet</span> : state.riskTags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>
      <section>
        <h2>System log</h2>
        <ul className="system-log">
          {state.systemLog.slice(-6).map((line, index) => (
            <li key={`${line}-${index}`}>{line}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
```

- [ ] **Step 4: Add completion button guards**

Modify the Create Account and Submit Appeal buttons in `src/components/sites/CloudySignupSite.tsx` so they remain clickable for testing but show accurate copy:

```tsx
<button type="button" className="primary-button" onClick={() => dispatch({ type: "game/completeCreateAccount", now: Date.now() })}>
  Create Account
</button>
```

```tsx
<button type="button" className="primary-button" onClick={() => dispatch({ type: "game/finishRecover" })}>
  Submit appeal
</button>
```

Keep the controls as shown. Rule completion is shown in the side panel; hard disabling is avoided in v1 so players can discover absurd failures through system feedback rather than dead controls.

- [ ] **Step 5: Add CSS polish**

Append to `src/styles.css`:

```css
.rule-heading {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.rule-heading span {
  text-transform: uppercase;
  font-size: 0.72rem;
  color: #536172;
}

.code-display {
  display: inline-block;
  font-size: 2.2rem;
  letter-spacing: 0.08em;
  margin: 8px 0;
}

.identity-card,
.mail-list,
.site-card dl {
  display: grid;
  gap: 8px;
}

.identity-card dt,
.site-card dt {
  color: #536172;
  font-size: 0.85rem;
}

.identity-card dd,
.site-card dd {
  margin: 0;
}

.mail-list {
  list-style: none;
  padding: 0;
}

.mail-list li {
  border: 1px solid #d8dee8;
  border-radius: 6px;
  padding: 10px;
  background: #f8fafc;
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 7: Commit polish**

Run:

```bash
git add src/game/reducer.ts src/components/rules/RulePanel.tsx src/components/sites/CloudySignupSite.tsx src/styles.css src/components/playability.test.tsx
git commit -m "feat: polish playable game flow"
```

Expected: commit succeeds.

---

## Task 12: Final Verification And Local Preview

**Files:**

- Modify only if verification finds a concrete issue.

- [ ] **Step 1: Run full test suite**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: PASS and `dist/` is created.

- [ ] **Step 3: Start dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 4: Browser smoke test**

Open the Vite URL in the Codex in-app browser and verify:

- Initial screen shows the browser shell.
- Main site is blocked with Proxy OFF.
- Proxy ON loads the CloudyAI form.
- `sms.local` loads with Proxy OFF and shows a six digit code.
- `identity.gov.fake` loads with Proxy OFF and generates a fictional card.
- Rule panel scrolls independently.
- Narrow viewport stacks the rule panel below the browser.
- No text overlaps in the toolbar, tabs, forms, rule panel, or ending view.

- [ ] **Step 5: Commit verification fixes**

If no code changed, do not create an empty commit.

If code changed, run:

```bash
git add <changed-files>
git commit -m "fix: resolve final verification issues"
```

Expected: commit succeeds only when there are verification fixes.

---

## Implementation Notes

- Do not add real networking, real SMS, real email, or real identity document handling.
- Keep fake site domains visibly fictional.
- Keep Proxy ON/OFF as a site access mechanic, not a displayed rule.
- Keep submitted text rule copy as `English only`; do not phrase it as a ban on a specific language.
- Rule checks should stay pure. State mutation belongs in the reducer.
- New rules should be added as `RuleDefinition` objects, not inside React components.
- User-facing absurdity belongs in pass/fail messages, system log entries, and site copy.
