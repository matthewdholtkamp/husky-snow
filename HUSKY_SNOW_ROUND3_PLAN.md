# HUSKY'S SNOW — ROUND 3 PLAN: "The Living Book" (v1.0)

**Handoff spec for: Claude Code (execute ONE PHASE AT A TIME — see EXECUTION PROTOCOL below)**
**Repo:** `github.com/matthewdholtkamp/husky-snow` · local `Desktop/Research AI/Quinn/huskys-snow`
**Owner:** LTC Matthew D. Holtkamp · **Author / canon authority:** Quinn Holtkamp ("Moonlit")
**Round 1 status:** DONE (T0–T4). **Round 2 status:** PREREQUISITE — R2-A (state/memory), R2-B (turns + synced per-pup suggestions), and R2-C (episodes + checkpoints) MUST be shipped and QA'd before starting Round 3. R2-E (Pack Heart) is required for R3-F rewards; if it isn't shipped yet, use the fallback noted in §10.

> **⚠️ EXECUTION PROTOCOL (READ FIRST):** Execute ONE phase per session, in the §15 build order. Before starting a phase: verify prerequisites, read the touched files, and state your plan in one short paragraph. After finishing a phase: run `npm run build` and `node --check` on touched JS, report what changed file-by-file, update the STATUS LOG at the bottom of this document, and STOP. Do not begin the next phase without explicit approval from the owner. Do not push; the owner reviews and pushes.

> **⚠️ #1 RULE, UNCHANGED: absolute fidelity to Quinn's book.** The Round 2 §4 Character Bible remains the canonical source of truth — do not restate it, do not modify it, obey it. Round 3 adds almost no new game mechanics. It changes what the game *is*: from "an RPG based on a book" to **a living companion to a book that is still being written — by its author, who reviews every asset.**
>
> **THE ROUND 3 THESIS:** no commercial studio can ship (1) a game that grows chapter-by-chapter as the manuscript grows, (2) unlockable notes from the actual author, (3) an archive of the players' adventures that feeds back into the author's writing, and (4) a keepsake storybook page at the end of every session. This family can. That is the stand-out.

---

## 0. BLUF

Round 2 makes it a real game. Round 3 makes it the only game like it. Six jobs:

1. **Storybook presentation (R3-A)** — retire the chat-log look; narrative renders as pages of a book (serif display type, chapter ornaments, drop caps, frost-glass frame). Pure CSS/JSX, zero mechanics risk.
2. **The Tale Page keepsake (R3-B)** — every episode checkpoint produces an illustrated, printable storybook page recapping the party's adventure, and saves it to a **"Tales of the Pack"** library that Quinn can read for writing inspiration.
3. **Install like an app (R3-C)** — PWA manifest + service worker so the game installs to the iPad home screen with a Husky's Snow icon and runs offline in local mode.
4. **One art identity (R3-D)** — port the pup portraits from the Husky's Snow website repo (layered-SVG builder / illustration PNGs) and add one painted backdrop per `[[SCENE]]` id. Quinn approves every asset.
5. **The Living Book (R3-E)** — chapters version-tagged to the manuscript, a "Quinn is still writing this part…" frontier card, and unlockable **"From the Author"** cards written by Quinn herself.
6. **Pack signature mechanics (R3-F)** — **Pack Howl**, a synchronized all-players-tap-together moment at episode climaxes, and **Shiver's Dictionary**, a collectible log of every made-up word Shiver corrects.

Ship in phases (R3-A … R3-F). Keep everything from Rounds 1–2 working.

---

## 1. THIS ROUND'S DECISIONS (locked with owner)

- **Presentation over mechanics:** Round 3 adds exactly one interactive mechanic (Pack Howl) and one collectible (Dictionary). Everything else is presentation, persistence, and identity. Do not invent additional systems.
- **The keepsake is the hero feature:** a session must end with something a kid can hold — the Tale Page, printable via CSS print styles. No screenshot/canvas libraries.
- **Quinn is a content owner, not just an approver:** Author Cards and chapter statuses are HER deliverables (§4). Ship the machinery with clearly marked placeholders; never invent her words.
- **Private by design:** Tales, dictionaries, and author cards live inside the family's Firestore/local storage. **No public sharing endpoints, no social buttons, no accounts, no analytics on the kids.** "Sharing" = printing the Tale Page or showing a screen.
- **Cost guardrail:** the Tale Page adds exactly ONE Gemini call per episode end (reusing the `summarizeHistory` pathway). Pack Howl and Dictionary add ZERO AI calls. Stay on the current flash-tier model; do not upgrade the model as part of this round.

---

## 2. NON-NEGOTIABLE CONSTRAINTS (carried forward + two additions)

1. **Canon first.** Round 2 §4 Character Bible is law. The ending remains a placeholder until Quinn finishes the book.
2. **Keep the stack:** React 19 + TS + Vite + Firebase (anon auth + Firestore) + Cloudflare Worker → Gemini. `worker.js` stays a pure relay; all prompt changes in `services/geminiService.ts`. No Gemini key in the browser.
3. **Allowed additions THIS ROUND ONLY:** `vite-plugin-pwa` (build-time) and ONE self-hosted serif display font (single woff2 in `src/assets/fonts/`, or `@fontsource` package). Nothing else. No three.js, no html2canvas, no chart libs.
4. **Dual persistence:** every new field (tales, dictionary, howl, authorCardsUnlocked, contentVersion) round-trips in BOTH Firestore and local-fallback modes, processed host-only in `handleProcessCommands`, then synced via `onSnapshot`.
5. **Never cache dynamic data:** the service worker precaches the app shell, fonts, and art ONLY. Worker (`/generate`) and Firestore traffic are network-only. Never serve a stale AI response.
6. **Kid-safe:** anonymous auth, safetySettings, Husky-Snow-only persona unchanged. Tales store pup names, not real names.
7. **Mobile-first (iPads):** big tap targets, BottomSheet patterns, reduced-motion honored — including the Pack Howl overlay and Tale Page.
8. **Ethical:** Pack Howl NEVER punishes. Success rewards; failure is narrated warmly and costs nothing. No timers that pressure, no FOMO.

---

## 3. WHERE THE CODE STANDS (edit the right place)

- **Story/state machine:** `App.tsx` — `handleProcessCommands` routes `[[ADD_ITEM]] [[AWARD_BADGE]] [[DAMAGE]] [[HEAL]] [[SCENE]] [[COMPLETE_OBJECTIVE]]` plus Round 2's `[[SUGGESTIONS:]]` and `[[HEART:]]`. `parseAIText` is where new command grammar lands.
- **Storyteller:** `services/geminiService.ts` → `buildSystemInstruction(players)`; `summarizeHistory` exists and is reused by the R2-C resume recap — the Tale Page piggybacks on this machinery.
- **Content:** `src/game/chapters.ts` (post-R2: intro/beats/minBeats/climax per chapter), `src/game/magic.ts`, `src/game/rolls.ts`, `src/constants.ts` (6 playables, NPCS registry, Lunarprie).
- **Episode checkpoint (R2-C):** the "Episode Complete — rest your paws" flow is the insertion point for the Tale Page (R3-B) and Author Card reveal (R3-E).
- **Deploy target:** GitHub Pages at `matthewdholtkamp.github.io/husky-snow/` — the PWA `base`, `scope`, and `start_url` must all be `/husky-snow/`.
- **Sibling repo:** the Husky's Snow **website** repo holds the layered-SVG husky builder and the real illustration PNGs. R3-D ports/adapts those assets — same faces on the book site and in the game.

---

## 4. QUINN'S DELIVERABLES (author tasks — the game waits for her, never invents for her)

| # | Deliverable | Consumed by | Fallback until delivered |
|---|-------------|-------------|--------------------------|
| Q1 | Approve/veto each ported pup portrait (all 6 playables + Mist) | R3-D | Keep R2 tinted-SVG portraits |
| Q2 | Approve/veto each scene backdrop (AI-assisted drafts allowed, her eye is canon) | R3-D | Keep gradient backgrounds per scene |
| Q3 | Write "From the Author" card text per chapter (2–5 sentences each, signed "— Moonlit") | R3-E | Card slot hidden entirely (never show placeholder text to players) |
| Q4 | Mark each chapter `manuscriptStatus: 'published' \| 'writing'` as she writes | R3-E | All current chapters `'published'`, finale `'writing'` |
| Q5 | (Optional) Name the Tale Page footer line and pick the page ornament | R3-B | Default: "from the world of *Husky's Snow* by Moonlit" |
| Q6 | (Optional) Read the Tales of the Pack archive for writing inspiration | R3-B | — |

---

## 5. JOB 1 — STORYBOOK PRESENTATION (phase R3-A)

- **Typography:** add ONE self-hosted serif display font for narrative text (headers + story paragraphs); keep the existing UI font for buttons/HUD. Minimum 18px story text on iPad, generous line-height (~1.7).
- **Message log → book pages:** narrative (storyteller) messages render as book paragraphs inside a frost-glass "page" frame. On every `[[SCENE]]` change, insert a **chapter ornament divider** (snowflake/paw motif SVG) and give the first paragraph a **drop cap**. Player actions render as italic margin-note interjections; system messages stay compact chips.
- **Mist's telepathy** gets a distinct visual voice: violet, slightly translucent, no quotation marks — a whisper style consistent with her Bible entry.
- **Keep** the typewriter effect, reduced-motion behavior, light/dark support, and auto-scroll. This phase is CSS/JSX only — zero changes to state, commands, or prompts.

## 6. JOB 2 — THE TALE PAGE + TALES OF THE PACK (phase R3-B)

- **Generate:** at the R2-C episode checkpoint, make one Gemini call (via a `generateTale` sibling of `summarizeHistory`): *"Retell this episode as a single storybook page in the voice of Husky's Snow: past tense, warm, 150–220 words, kid-safe, name each pup who played, no commands, no meta."* Host-only trigger, both persistence modes.
- **Compose the tale object:** `{ id, gameId, chapterId, chapterTitle, title, text, date, pups: string[], badges: string[], values: Record<value, number>, newDictionaryWords: string[], packHeartEarned: number, contentVersion }`.
- **Render `<TalePage>`:** a full-screen storybook page — chapter ornament, drop cap, serif display, the party's pup portraits in a footer row, badges as small icons, "Values you showed" line (reuses R2-E reflection data), and the footer *"from the world of Husky's Snow by Moonlit."*
- **Print/save:** a dedicated `@media print` stylesheet that outputs exactly one clean page (hide app chrome, white background, black text). The Print/Save button calls `window.print()`. No canvas/screenshot deps.
- **Persist:** write to a root `tales` collection (keyed by gameId) AND local storage. Add rules to `firestore.rules`.
- **Tales of the Pack library:** a screen reachable from the main menu listing every saved tale (newest first, chapter + date + pups), opening into the full TalePage view. This is the archive Quinn reads (Q6).

## 7. JOB 3 — PWA INSTALL + OFFLINE (phase R3-C)

- **Add `vite-plugin-pwa`:** manifest with `name: "Husky's Snow"`, `short_name: "Husky Snow"`, `start_url`/`scope`/`base` = `/husky-snow/`, `display: standalone`, theme/background colors matching the frost palette; 192px + 512px maskable icons plus `apple-touch-icon` (iPad Safari). Icon art comes from the ported portrait set (Q1); a tinted-SVG placeholder icon is acceptable to ship first.
- **Service worker strategy:** precache app shell, fonts, portraits, scene art, ornaments. **Network-only** for the Cloudflare Worker and all Firestore traffic (see §2.5). Cache-busting on deploy via the plugin's revisioning.
- **Offline behavior:** app opens offline and local-fallback games (`local-…` IDs) are fully playable *except* AI turns; when offline mid-game, show a gentle "The storyteller is resting — reconnect to continue the tale" banner instead of an error. Tales and dictionary remain readable offline from local storage.
- **Verify on iPad:** Add-to-Home-Screen installs with the icon, launches standalone, survives offline relaunch.

## 8. JOB 4 — ART UNIFICATION (phase R3-D) *(asset-gated by Quinn — Q1/Q2)*

- **Portraits:** port the website repo's layered-SVG husky builder output / illustration PNGs into `src/assets/pups/` — one portrait per playable pup + Mistyfeather. Every distinguishing feature from the Bible must be present (Oak's missing back-left leg, Shiver's mixed iris + glowing leg-scar, Storm's black armor, Flurry's small frame, Glacier solid white, Spruce dark brown/white underside). Use them in CharacterSelectionScreen, PartyStatus, the turn banner, and the TalePage footer.
- **Scene backdrops:** audit the `[[SCENE]]` ids actually emitted/configured (expect roughly one per chapter plus camp/dreamlands); produce one painted backdrop per id. AI-assisted drafts are fine **as drafts** — Quinn's approval makes them canon. Rejected art keeps the existing gradient for that scene.
- **Performance:** webp, target ≤150KB per backdrop and ≤60KB per portrait; lazy-load backdrops; add the approved set to the SW precache list. Subtle cross-fade on scene change, disabled under reduced-motion.

## 9. JOB 5 — THE LIVING BOOK (phase R3-E) *(content-gated by Quinn — Q3/Q4)*

- **Manuscript linkage:** add `manuscriptStatus: 'published' | 'writing'` per chapter in `chapters.ts` and a repo-level `CONTENT_VERSION` constant. Stamp every save/checkpoint with `contentVersion`; on resuming an older save after content grows, show *"The story has grown since you last played…"* alongside the R2-C recap.
- **Frontier card:** when the party reaches the first `'writing'` chapter, render a special card: *"Quinn is still writing this part of the story…"* with a paw-print trail marker — the game's edge IS the manuscript's edge. The R2 rule stands: never fabricate the ending; the crystal choice stays the Light/Dark placeholder.
- **"From the Author" cards:** `src/game/authorCards.ts` — `{ chapterId, title, body, signature: "— Moonlit" }`, content exclusively from Q3 (entries without Quinn's text are omitted, never placeholder-filled). Unlock on `[[COMPLETE_OBJECTIVE]]`; reveal AFTER the Tale Page as a distinct "note from the author" card (different paper texture, her signature). Collected cards live in a gallery alongside the spirit collection. Persist `authorCardsUnlocked: string[]` in both modes.
- **Chapter-drop moment:** when `CONTENT_VERSION` increases and a chapter flips `writing → published`, the main menu shows a one-time *"A new chapter has been written!"* card. This is the flywheel made visible.

## 10. JOB 6 — PACK SIGNATURE MECHANICS (phase R3-F)

**Pack Howl** *(requires R2-B turn/session sync; rewards require R2-E Pack Heart)*
- **Trigger:** storyteller may emit `[[PACK_HOWL: reason]]` at a climactic beat — prompt-limited to **at most one per episode**, only at fiction-appropriate moments (pre-climax rally, victory, farewell).
- **Sync:** host writes `howl: { active: true, startedAt: serverTimestamp, windowMs: 10000, responses: {} }` to the game doc. Every client shows a full-screen frost overlay with one giant **HOWL** button; each tap writes `responses[userId] = timestamp`. Downed pups may still howl (it's spirit, not combat).
- **Resolve (host, authoritative client math):** if ALL active players respond within the window → success: apply Pack Heart `+3 | teamwork | "the whole pack howled as one"` via the existing `[[HEART:]]` pipeline (fallback if R2-E absent: party-wide `[[HEAL: 2]]`), play layered howl SFX + `navigator.vibrate` where supported, and pass a `PACK HOWL: succeeded` note in the next STATE block so the storyteller narrates it. If not everyone taps → narrate warmly ("the mountains carried a smaller chorus tonight"), **zero penalty**.
- **Local mode:** one device — each pup's howl button lights in sequence; all taps within the window counts as success. Reduced-motion: static overlay, no screen shake.

**Shiver's Dictionary** *(pairs with her Round 2 word-correction trait)*
- **New command:** whenever Shiver corrects a made-up word, the storyteller ALSO emits `[[FAKEWORD: word | speaker]]`. Client dedupes (case-insensitive) and appends `{ word, speaker, chapterId, correction }` to `dictionary` on the game doc + local.
- **UI:** a "Shiver's Dictionary" tab in the BottomSheet — each entry shows the fake word, who said it, and Shiver's deadpan correction; running count badge on the tab.
- **Rewards:** at 5 and 10 unique words, award badges via the existing `[[AWARD_BADGE]]` pipeline (suggested: "Word Warden" / "Keeper of Real Words"). New words earned this episode appear on the Tale Page.

---

## 11. TYPE / DATA ADDITIONS

- `GameSession`: `howl?: { active: boolean; startedAt: Timestamp; windowMs: number; responses: Record<string, number> }`, `dictionary: DictionaryEntry[]`, `authorCardsUnlocked: string[]`, `contentVersion: number`.
- New root collection `tales` (see §6 object shape); rules: readable/writable by the household's anon-auth pattern, consistent with existing game-doc rules.
- `Chapter`: `manuscriptStatus: 'published' | 'writing'`.
- New files: `src/game/authorCards.ts`, `components/TalePage.tsx`, `components/TalesLibrary.tsx`, `components/PackHowlOverlay.tsx`, `components/AuthorCard.tsx`, `src/assets/pups/`, `src/assets/scenes/`, `src/assets/fonts/`.
- `firestore.rules`: cover `howl`, `dictionary`, `authorCardsUnlocked`, `contentVersion`, and the `tales` collection.
- `vite.config.ts`: `vite-plugin-pwa` with `/husky-snow/` base/scope; `index.html`: manifest + apple-touch-icon links.

## 12. STORYTELLER PROMPT UPGRADES (`geminiService.ts` → `buildSystemInstruction`)

Keep everything from Rounds 1–2 (persona, safety, dice, STATE block, per-pup suggestions, beats/pacing, NPC voices, Shiver's trait, values, canon guardrail). Add:

1. **Pack Howl:** *"At most once per episode, at a truly climactic and fiction-appropriate moment, you may emit `[[PACK_HOWL: reason]]` to call the whole pack to howl together. Never emit it in the first two beats. If the STATE block says the howl succeeded, narrate the pack's unity warmly; if it says it fell short, narrate gently and positively — never as failure."*
2. **Dictionary:** *"Whenever Shiver corrects a word that isn't real, also emit `[[FAKEWORD: word | speaker]]` on its own line."*
3. **Tale voice (separate `generateTale` instruction, not the live-play prompt):** the §6 retelling instruction.
4. Route `[[PACK_HOWL:]]` and `[[FAKEWORD:]]` in `parseAIText` → `handleProcessCommands`; unknown/malformed commands still log-and-skip safely (R2-A rule).

---

## 13. CANON CHECKLIST & WHAT NOT TO DO

- ✅ Character Bible (Round 2 §4) obeyed verbatim; portraits/scenes match every listed feature; Quinn approves all art.
- ✅ Author Cards contain ONLY Quinn's words; empty cards are hidden, never invented.
- ✅ Finale stays the Light/Dark placeholder; the frontier card marks the manuscript's edge.
- ✅ Tale Page voice = the book's voice; pup names only.
- 🚫 Do NOT write Quinn's author-card text, the ending, or any manuscript content — machinery only.
- 🚫 No public sharing, social buttons, accounts, leaderboards, or analytics. Print/local only.
- 🚫 No SW caching of Worker or Firestore responses; never serve a stale AI turn.
- 🚫 No new deps beyond `vite-plugin-pwa` + one bundled font. No html2canvas, no three.js.
- 🚫 Don't let Pack Howl punish, pressure, or repeat more than once per episode.
- 🚫 Don't break Rounds 1–2 (turns, suggestions sync, checkpoints, Pack Heart, local mode) or ship a phase that leaves the game unplayable.
- 🚫 Don't upgrade the Gemini model tier as part of this round.

## 14. QA / ACCEPTANCE

- [ ] Narrative renders as storybook pages: serif display, drop caps on scene openings, chapter ornaments on `[[SCENE]]` change; Mist's whisper style distinct; typewriter + reduced-motion intact.
- [ ] Episode checkpoint produces a Tale Page (one extra Gemini call, host-only, both persistence modes); it lists correct pups/badges/values/new dictionary words.
- [ ] `window.print()` on the Tale Page outputs one clean page (verified from iPad Safari share-sheet print).
- [ ] Tales of the Pack library lists all tales across sessions and survives refresh in Firestore AND local modes.
- [ ] App installs to iPad home screen with icon, launches standalone, opens offline; local-mode game playable offline; graceful "storyteller is resting" banner when AI is unreachable; NO cached AI/Firestore responses.
- [ ] Ported portraits appear in selection, party HUD, turn banner, Tale Page; every Bible feature visible (verify Oak's leg, Shiver's iris + scar, Storm's armor). Approved scene backdrops load lazily; rejected scenes keep gradients.
- [ ] Frontier card appears at the first `'writing'` chapter; version bump on resume shows "The story has grown…"; publishing a chapter shows the one-time "A new chapter has been written!" card.
- [ ] Author cards unlock only on chapter completion, show only Quinn-authored entries, persist in both modes, and appear in the gallery.
- [ ] Pack Howl: `[[PACK_HOWL:]]` triggers the overlay on ALL devices via `onSnapshot`; all-tap within window → Pack Heart +3 (or fallback heal) + narration; partial → warm narration, zero penalty; ≤1 per episode; works in local mode; reduced-motion respected.
- [ ] `[[FAKEWORD:]]` entries dedupe, persist, render in the Dictionary tab, and award badges at 5/10 words.
- [ ] Full regression: Round 1 features + R2 turns/suggestions/checkpoints/Pack Heart all pass on two devices via Game ID.
- [ ] `npm run build` clean; `npx wrangler deploy --dry-run` clean; no Gemini key in bundle; Lighthouse PWA installability passes on the Pages URL.

## 15. SUGGESTED BUILD ORDER (commit-sized — ONE PHASE PER SESSION)

1. **R3-A** Storybook presentation (CSS/JSX only — lowest risk, biggest visible win; ship first).
2. **R3-C** PWA (independent of everything; placeholder icon acceptable).
3. **R3-B** `generateTale` + TalePage + print stylesheet + `tales` persistence + library.
4. **R3-F** `[[PACK_HOWL:]]` + `[[FAKEWORD:]]` grammar, overlay, dictionary tab, badges.
5. **R3-D** Art port behind Quinn's approvals (Q1/Q2); swap icons/portraits/scenes as approved.
6. **R3-E** `manuscriptStatus` + `CONTENT_VERSION` + frontier card + author-card machinery (content lands whenever Q3/Q4 arrive).
7. Full QA (§14) + deploy.

---

## STATUS LOG (Claude Code: update after every phase, then STOP for owner approval)

| Phase | Status | Date | Files touched | Build clean? | Notes |
|-------|--------|------|---------------|--------------|-------|
| R2 prerequisites verified | ✅ done | 2026-07-09 | (read-only audit) | n/a | R2-A: LIVE PARTY STATE block (`geminiService.ts`), alias-safe resolver + HP clamping (`App.tsx`), rules cover turnOrder/phase/packHeart/suggestionsByPup. R2-B: First Howl initiative, round-robin w/ downed-skip, `[[SUGGESTIONS: Pup\|…]]` parsed + persisted on game doc. R2-C: chapters have intro/beats/minBeats/climax + pacing rule; "Episode Complete!" reflection modal + "Previously on Husky's Snow…" resume recap via `summarizeHistory` (`GameScreen.tsx`). Note: 3 pre-existing `tsc --noEmit` errors (AIResponse.suggestionsByPup typing, summarizeHistory not exported) — don't block `vite build`; flagged for cleanup. |
| R3-A Storybook presentation | ✅ done — awaiting owner approval | 2026-07-09 | `src/components/game/MessageLog.tsx` (rewrite), `src/components/effects/Typewriter.tsx` (optional `render` prop), `index.html` (drop-cap + page-frame CSS; Libre Baskerville off CDN), `index.tsx` (@fontsource imports), `package.json`/`package-lock.json` (+`@fontsource/libre-baskerville`) | ✅ `npm run build` clean; `tsc --noEmit` shows only the 3 pre-existing R2 errors (verified via stash) | CSS/JSX only — zero state/command/prompt changes. Narrative = book paragraphs (Libre Baskerville 18px, lh 1.7, max-w-prose, no bubbles); snowflake/paw ornament divider on `[[SCENE]]` shifts; drop caps on story opening + first paragraph after each scene change; player actions = italic margin notes; Mist quote-lines = violet translucent whisper, quotes stripped; `*italic*`/`**bold**` markdown now rendered; typewriter/reduced-motion/auto-scroll intact. Not tested in-browser on iPad yet. |
| R3-C PWA install + offline | ☐ not started | | | | |
| R3-B Tale Page + library | ☐ not started | | | | |
| R3-F Pack Howl + Dictionary | ☐ not started | | | | |
| R3-D Art unification | ☐ not started | | | | Gated on Q1/Q2 |
| R3-E Living Book | ☐ not started | | | | Gated on Q3/Q4 |
| Full QA (§14) | ☐ not started | | | | |

---

*End of Round 3 (v1.0 — "The Living Book"). Round 2 made it play like a game. Round 3 makes it Quinn's book, alive.*
