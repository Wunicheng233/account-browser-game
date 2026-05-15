# Account Browser Password Game Design

## Goal

Build a 10-15 minute publishable web game inspired by the core rule escalation of *The Password Game*, but themed around absurd account registration, suspension, and appeal flows.

The player edits one account profile package while a corporate account system keeps unlocking new rules. The main gameplay is rule-solving: every unlocked rule must remain valid at the same time, and new requirements can break old solutions. The narrative wrapper is a fake browser with multiple in-game websites that provide verification codes, identity documents, mailbox messages, timezone checks, and account pages.

The tone is absurd comedy. The game should feel like a very serious product system that keeps asking the player to prove increasingly impossible things.

## Product Shape

The first version is a static web game built for release as a browser-playable experience. It should have:

- A responsive game UI.
- Local progress persistence.
- Lightweight sound and motion feedback.
- A complete ending screen.
- A data-driven rule pack that leaves room for future companies, websites, rules, and endings.

The first version does not include a content editor. Future content should be added through structured code or data modules.

## Core Gameplay

The player maintains an account profile package:

- Email.
- Username.
- Password.
- Account region.
- Phone number.
- Birthday.
- Recovery email.
- Registration statement.
- Appeal letter.
- SMS code.
- Identity card.
- Mailbox ticket.
- Final identity phrase.

The right side of the screen shows rules. Rules unlock gradually, and old rules stay active. The player edits profile fields, visits in-game websites, toggles the proxy, collects generated materials, and keeps all unlocked rules satisfied.

The game has two chapters:

1. Create Account.
2. Recover Account.

The chapter change is a punchline: when the player finally creates the account, the system immediately suspends it and moves into the appeal chapter.

## Browser Shell

The game looks like a small fictional browser. It does not access real websites or send real messages.

The browser shell contains:

- Back button.
- Address bar.
- Proxy ON/OFF switch.
- Site tabs.
- Main page viewport.
- Persistent rule and status panel.

The proxy is an environment mechanic, not a displayed rule. Some sites only load when Proxy is ON; others only load when Proxy is OFF. The rule list should not say which proxy state each site needs. Players discover it through site error pages.

Example site errors:

- `This service is unavailable from your current network.`
- `Government identity services cannot be accessed through anonymized connections.`
- `SMS center rejected this route. Please reconnect from a local network.`

## In-Game Websites

### `cloudyai.signup.fake`

The main account site. It hosts registration fields in the first chapter and appeal fields in the second chapter. It is the main place where the account profile package is edited.

### `sms.local`

Shows the current SMS verification code. Codes are generated in-game, refresh on a timer, and are never sent externally.

The first successful SMS code is saved to history and can be referenced in the appeal chapter.

### `identity.gov.fake`

Generates a fictional identity card. It is not a real government document and should use obviously fake branding and fake data labels.

Generated card fields:

- Name.
- Birthday.
- Region.
- Identity number.

The card becomes evidence in the appeal chapter and creates rule conflicts around region, birthday, and identity number digits.

### `mailbox.local`

Shows fake inbox messages:

- Magic link.
- Recovery email.
- Appeal ticket.
- System notices.

Messages can arrive after in-game actions and may include text that rules require or forbid.

### `timezone-checker.net`

Displays the current simulated network region, timezone, and browser language based on the proxy and browser state. Account rules can compare this output to the account region.

## Rule Types

Rules are data-driven objects with independent checks.

Rule categories:

- Hard rules: must pass before the chapter can complete.
- Soft risk rules: may allow progress but add risk tags.
- Reflective rules: refer to player history, such as region changes or failed verification attempts.
- Absurd conflict rules: individually reasonable, collectively unreasonable.

Rules have:

- `id`.
- `chapter`.
- `unlockCondition`.
- `check`.
- `passMessage`.
- `failMessage`.
- `riskTags`.
- `severity`.

## Rule Pack v1

The first version should include 32 main rules.

### Create Account Rules

1. Email must be valid.
2. Password must be at least 12 characters and include an uppercase letter, a number, and a symbol.
3. All submitted text must be English only.
4. Username must not be taken, and similarity to taken usernames must be below 70%.
5. Age must be over 18.
6. Recovery email must be valid and use a different domain from the main email.
7. Account region must be a supported region.
8. Phone country code must match the account region.
9. SMS code must match the current 6-digit code shown on `sms.local`.
10. SMS code digits must sum to the current required total, such as 25.
11. Username must include any two consecutive digits from the current SMS code.
12. Password must include one sponsor name: `Gloogle`, `CloudyAI`, or `PearHub`.
13. Registration statement must be 80-140 characters.
14. Registration statement must include `ordinary user`.
15. Registration statement must not include `need`, `urgent`, `VPN`, `proxy`, or `mainland`.
16. Registration statement must include one approved romanized neutrality word: `nihao`, `xiexie`, or `meiyou`.
17. Timezone shown on `timezone-checker.net` must match the account region.
18. A fictional identity card must be generated on `identity.gov.fake`.
19. Identity card region must match the account region.
20. All unlocked Create Account rules must pass. The account is created, then immediately suspended.

### Recover Account Rules

21. Appeal letter must start with `Dear Safeguards Team,`.
22. Suspension reason phrase must appear in the appeal letter exactly once.
23. Ticket number must come from the latest recovery email in `mailbox.local`.
24. Appeal letter must include the ticket number but not include the mailbox greeting phrase.
25. Appeal letter must deny creating multiple accounts while the recovery email remains present as a backup identity.
26. Appeal letter must contain exactly as many commas as the number of account region changes made during registration.
27. Appeal letter must include the first successfully used SMS code.
28. Appeal letter must not contain any digit from the fictional identity number.
29. Identity card birthday must match account birthday.
30. Appeal tone must be polite but not desperate: `thank you` appears exactly once and exclamation marks are not allowed.
31. If Proxy ON was used more than three times during registration, the appeal letter must include `I was traveling`; if the identity card region already matches the account region, this adds a risk tag.
32. Final identity phrase must exactly match: `email + username + account region + ticket number`.

## Username Similarity

Username similarity must be visible and understandable to the player.

Taken username examples:

- `ordinaryuser`
- `globaltraveler`
- `alex2026`
- `cloudfan`
- `openaccess`

Normalization:

- Lowercase the candidate username.
- Remove numbers, underscores, dots, and hyphens.
- Compare against normalized taken names.

The username fails if:

- It contains a taken username body.
- It is within edit distance 2 of a taken username body.
- Its simple similarity score is 70% or higher.

The UI shows the closest match, for example:

`Too similar to globaltraveler: 78%`

## Risk Tags

Risk tags affect system logs and endings. They should not usually hard-block the player.

Initial tags:

- `region_mismatch`
- `vpn_energy`
- `too_determined`
- `identity_loop`
- `verification_chaser`
- `appeal_tone_unclear`

Risk tags are generated by repeated failed attempts, contradictory profile data, suspicious timing, or appeal wording.

## Endings

First version includes five endings:

1. `Recovered`: the account is restored, but the welcome page only has a logout button.
2. `Read Only Human`: the account is restored as read-only because the system believes the player exists but does not trust input from them.
3. `Appeal Pending`: the appeal enters a 90-day queue, with the countdown beginning at 91 days.
4. `Account Exists, User Does Not`: the account is confirmed real, but the user is judged too risky to exist near it.
5. `Thank You For Understanding`: the support system closes the case, and every button says Close.

Ending selection should be deterministic based on rule completion, risk tags, and key history values.

## State Model

### `Profile`

Stores the player-editable account package:

- `email`
- `username`
- `password`
- `region`
- `phone`
- `birthday`
- `recoveryEmail`
- `registrationStatement`
- `appealLetter`
- `smsCode`
- `identityCard`
- `ticketNumber`
- `finalIdentityPhrase`

### `BrowserState`

Stores browser mechanics:

- `currentUrl`
- `history`
- `proxyEnabled`
- `openTabs`
- `currentSiteStatus`
- `currentSmsCode`
- `smsRefreshAt`
- `mailboxMessages`
- `timezoneReport`

### `GameHistory`

Stores facts rules can reference later:

- Region change count.
- Proxy ON use count during registration.
- SMS failure count.
- First successful SMS code.
- Registration success timestamp.
- Suspension reason.
- First appeal letter.
- Generated ticket number.
- Generated identity card history.

### `GameState`

Stores overall progression:

- Current chapter.
- Unlocked rule ids.
- Rule results.
- Risk tags.
- System log entries.
- Current ending.
- Persisted save version.

## Architecture

Use Vite, React, and TypeScript.

Suggested modules:

- `src/game/types.ts`: shared data types.
- `src/game/initialState.ts`: initial state.
- `src/game/rules/`: rule definitions and helpers.
- `src/game/ruleEngine.ts`: rule evaluation and unlock logic.
- `src/game/sites/`: in-game website definitions.
- `src/game/endings.ts`: ending selection.
- `src/state/useGameStore.ts`: game state and persistence.
- `src/components/browser/`: browser shell components.
- `src/components/rules/`: rule panel components.
- `src/components/sites/`: visual site pages.
- `src/components/endings/`: ending views.

Rules should be easy to add without editing the browser shell. Site pages should read and update state through typed actions, not by reaching into unrelated components.

## Persistence

Use local storage for first version progress persistence.

Persist:

- Profile.
- Browser state.
- Game history.
- Chapter.
- Unlocked rules.
- Risk tags.
- System logs.
- Ending state.

Include a save version so future rule packs can reset or migrate incompatible saves.

## UX Notes

The first screen should be the playable browser, not a landing page.

The UI should feel like a utilitarian account product, with restrained styling and absurd text. It should not look like a marketing page.

The rule panel must make progress readable:

- Passed rules.
- Failed rules.
- Newly unlocked rule highlight.
- Risk tags.
- System log.

The player should not need real accounts, real phone numbers, real emails, or real documents.

## Testing

Minimum tests:

- Rule engine returns pass, fail, and locked states correctly.
- Old rules remain active after new rules unlock.
- Proxy state affects site access but is not displayed as a rule requirement.
- SMS generation, refresh, validation, and first successful SMS history work.
- Username similarity detects taken names and visible scores.
- Region change count persists and is used in appeal comma rule.
- Create Account completion transitions to Recover Account with profile and history preserved.
- Ending selection is deterministic for known risk tag combinations.

Manual verification:

- Desktop and mobile layouts have no overlapping text.
- Browser shell remains usable at common viewport sizes.
- Rule panel can scroll independently.
- The player can complete at least one happy path and one risk-heavy ending.

## Out of Scope For v1

- Real external websites.
- Real SMS or email sending.
- Real identity documents.
- Backend services.
- Multiplayer.
- Content editor.
- Analytics.
