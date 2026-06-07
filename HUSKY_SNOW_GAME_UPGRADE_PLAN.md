# HUSKY'S SNOW (D&D RPG) — "WILD FACTOR" UPGRADE PLAN
**Handoff spec for: Antigravity (or Claude Code / Codex)**
**Repo:** `github.com/matthewdholtkamp/husky-snow` · local `Desktop/Research AI/Quinn/huskys-snow`
**Project owner:** LTC Matthew D. Holtkamp · **For:** Quinn Holtkamp (author)
**Goal:** Deepen this AI-powered multiplayer text RPG into a true, juicy, addictive-in-a-good-way Dungeons & Dragons–style adventure for ages 8–14 — on Quinn's book world — without breaking the React/Firebase/Worker architecture, Quinn's canon, or kid-safety.

---

## 0. BLUF (read first)
The game is already impressive: a Gemini "dungeon master," 4 playable pups, D20 rolls, inventory, badges, multiplayer via Firestore, framer-motion, screen shake, and snowfall. But it stops short of being a real RPG in five specific ways, and those are the bang-for-buck targets:

1. **Stats don't do anything.** STR/AGI/INT/SPI are displayed but rolls are pure random 1–20. → Make rolls **stat-modified** with visible math. This single change makes character choice matter and turns it into real D&D.
2. **No stakes.** There's no HP, no way to lose, no tension. → Add **HP + damage/heal**, downed/revive (co-op), win/lose screens.
3. **No goals.** It's open-ended AI improv. → Overlay a **chapter/objective system** (the book's arc) so kids feel progress and always know what to do.
4. **Abilities & items are flavor only.** → Make each pup's **magic ability actionable** (the marquee "wild factor") and items **usable**.
5. **Juice gaps.** No sound, no typewriter (the dev even left a TODO for it), the cube isn't a real d20, and the atmospheric scene-switcher is built but never fires. → Close all of these.

Do the work in **shippable tiers (0→4)**. Preserve everything below.

---

## 1. WHAT ALREADY EXISTS — DO NOT REBUILD
- **Stack:** Vite 6 + React 19 + TypeScript 5.8; Tailwind (CDN) + `clsx` + `tailwind-merge`; **Framer Motion 12**; **Lucide** icons; **Firebase 12** (anonymous Auth + **Firestore** multiplayer); **Cloudflare Worker** (`worker.js`) proxy → **Gemini 3.1 flash-lite**, key stored only as a Worker secret. GitHub Actions deploy (Pages + Worker).
- **Game flow** (`App.tsx`, a state machine): `intro → lobby → selection → playing`. Host creates a game; others join by Game ID; **host-only** triggers AI turns; Firestore syncs messages + state live. **Local fallback mode** (localStorage + `storage` events, `local-…` IDs) keeps it playable when Firestore rejects writes — *every persistence path is dual-coded (Firestore + local). Keep that pattern for all new state.*
- **AI dungeon master** (`services/geminiService.ts` → `buildSystemInstruction`): persona **"Quinn the storyteller,"** "Frostglass Fantasy" tone, ≤5-sentence turns, **D20 resolution** (1 = crit fail, 2–10 = fail, 11–15 = success, 16–20 = crit success), **hidden commands** `[[ADD_ITEM: Player | id]]` and `[[AWARD_BADGE: Player | id]]`, 3–4 clickable suggestions ending "What do you do?", history summarization at 20 messages, temp 0.8 / 900 max tokens. **The Worker is a pure relay — it forwards `systemInstruction` to Gemini and injects nothing. ALL prompt changes go in `geminiService.ts`, not `worker.js`.**
- **Content** (`src/constants.ts`): 4 playable pups — **Shiver** (Crafter/Telepathy), **Oak** (Hunter/Traps), **Glacier** (Fighter/Protective Strike), **Flurry** (Healer/Soothing Herbs); each with stats `{strength, agility, smart, spirit}`, an `ability` string, `loreContext` (fed to the AI), `startingScene`, and `visuals`. 7 items (aloe, spiderweb, berry, net, crystal, trap, moss). 4 badges (catch_fish, save_pup, brave_stand, legend_pack).
- **Types** (`src/types.ts`): `Character`, `Badge` (small/medium/large), `InventoryItem`, `Player`, `Message` (`isRoll`, `rollOutcome`, `suggestions`), `GameSession`, `GameState`.
- **Play surface** (`src/components/GameScreen.tsx` + subcomponents): `BackgroundLayer` (CSS scene gradients **but scene is hardcoded 'default' — never switches**), `ScreenShake` (shake + red flash on roll ≤5), `CharacterSheet` (stats + badges; has an unused `health` prop defaulting to 100), `InventoryGrid` (9 slots, tooltips, **items not usable**), `MessageLog` (framer fade-in; **dev TODO: char-by-char typewriter wanted, not built**), `ActionBar` (suggestion buttons + custom input), `Dice3D` (**a CSS cube, not a real d20 — dev comment says so**), `FrostContainer`. `components/StatBar.tsx` and `components/Snowfall.tsx` exist but **StatBar is unused on the play screen.** Mobile hides the sheet/inventory (only 3 tiny stat cards).

---

## 2. NON-NEGOTIABLE CONSTRAINTS
1. **Keep the stack.** React/TS/Vite/Firebase/Worker/Gemini. No swapping frameworks, no new heavy deps. Framer Motion + Lucide are available; **do NOT add three.js** (the d20 must be SVG/CSS, not WebGL).
2. **No Gemini key in the browser, ever.** All AI calls stay routed through the Worker. If a new model is ever needed, add it to the Worker's `ALLOWED_MODELS` allowlist; otherwise the Worker needs no changes.
3. **COPPA / kid-safe:** keep anonymous auth, no PII collection, no ads, no third-party trackers. Keep the existing Gemini `safetySettings` and the "stay in Husky Snow world; no Band-Aid six / military / hospital persona" guardrail in the prompt.
4. **Dual persistence.** Any new stored state (HP, XP, chapter, scene, cooldowns) must be written in **both** Firestore mode **and** local-fallback mode, and processed in the **host-only** `handleProcessCommands` path, then synced.
5. **AI-driven, not hardcoded.** This game's story is generated. Improve it by **upgrading the system prompt + adding structured commands + a thin client-side objective/HP layer** — do NOT replace the DM with a fixed node graph.
6. **Quinn's canon & voice.** Keep her characters, spirits, and magic exactly. The **manuscript is unfinished (ends mid-Ch 39)** — the crystal finale is a **co-author sandbox**; do not fabricate a canonical ending. Tag invented flavor `// NON-CANON FLAVOR — Quinn to approve`.
7. **Mobile-first & accessible.** Phone/tablet parity (sheet + inventory reachable), ≥44px targets, keyboard operable, ARIA live region for narrative, and **all motion (shake, dice spin, particles, typewriter) gated behind `prefers-reduced-motion` + an in-game Motion toggle.**
8. **Ethical engagement — "addictive in a good way":** mastery, story, collection, co-op. **No loot boxes, no purchases, no punishing timers, no FOMO.** Streaks/ranks are cosmetic and never shaming.

---

## 3. THE "WHY KIDS KEEP PLAYING" PHILOSOPHY
- **Juice:** every action gets instant feedback — sound, particle burst, popping number, animated bar, tiny shake. Nothing dead.
- **Choices matter:** stats and abilities change outcomes; kids replay to try another pup/path.
- **Clear goals + visible progress:** an objective tracker, chapter completions, HP, rank, and a collection grid always show "what's next."
- **Show, don't tell:** narrative beats arrive with motion/VFX, not walls of static text.
- **Surprise & delight:** spirits appear, crits explode, secrets unlock.
- **Mastery, never a wall:** failure costs HP/Hope or opens an alternate path; younger kids never hit a hard dead-end.
- **Collect everything:** badges, spirit cards, ranks — a proven middle-grade hook.
- **Co-op belonging (multiplayer):** clear turns, shared stakes, reviving a downed packmate.

---

## 4. PRIORITY ROADMAP (each tier ships independently)
| Tier | Theme | Why it's the bang-for-buck |
|---|---|---|
| **T0** | Make it real D&D | Stat-modified rolls with visible math + a real spinning d20 + crit juice. Smallest change, biggest "this is an actual RPG now." |
| **T1** | Stakes & structure | HP + damage/heal + downed/revive, and a chapter/objective system over the book's arc, with win/lose screens. |
| **T2** | The magic system | Actionable per-pup spirit abilities with element VFX + the crystal finale. The marquee wild factor. |
| **T3** | Juice & polish | Sound, typewriter, dynamic scenes + snowfall, usable items, mobile parity, multiplayer turn/party HUD, accessibility. |
| **T4** | Retention & delight | XP/Pack Rank, spirit-card collection, Mist hint system, onboarding tutorial, easter eggs. |

---

## 5. DETAILED FEATURE SPECS

### T0 — Real D&D dice (do this first)
- **Stat-modified rolls.** Add `src/game/rolls.ts`: `modifier(stat) = Math.floor((stat - 10) / 2)` (D&D-style, ≈ −2…+4). When the AI requests a roll it must name the governing stat (see §8). The client rolls d20, adds that pup's stat modifier, computes `total`, maps `total` to outcome (use the same 1/≤10/≤15/≥16 bands but on the **total**, and a natural-20/natural-1 always crit/fumble), and sends a roll message like `*Rolls D20: 14 +AGI(3) = 17 → Success!*` with new `Message` fields `rollStat`, `rollRaw`, `rollModifier`, `rollTotal`. The AI then interprets the **total/outcome** (§8), not the raw die.
- **Real d20.** Replace the cube in `Dice3D.tsx` with an **SVG/CSS icosahedron** (or a clean 2D d20 silhouette) that tumbles via framer-motion, then **slams the number in** with a scale-punch. Show the modifier math overlaid (`14 + 3 = 17`). Keep the existing 2s roll / 1.5s reveal cadence; honor reduced motion (skip spin, show result).
- **Crit juice.** Natural 20 / crit success → gold `MagicBurst` + chime + "CRITICAL!" stamp + brief flash. Natural 1 / crit fail → the existing shake + red flash + thud. Wire to the sound + VFX systems (T2/T3).

### T1 — Stakes & structure
- **HP + Pack Warmth.** Add `hp`/`maxHp` per `Player` and surface the existing **`StatBar`** on the play screen (desktop column + mobile sheet). Optional shared **Pack Warmth** meter for co-op tension (echoes the book's cold). New AI commands `[[DAMAGE: Player | N]]` and `[[HEAL: Player | N]]` (process in `handleProcessCommands`, dual-path persist). Healing items apply locally too.
- **Downed & revive (co-op).** At 0 HP a pup is **downed** (not dead): a packmate spends their turn to revive (multiplayer warmth moment), or in solo play the pup gets up with a setback (lose an item / Warmth). Never a hard game-over for a young player; instead → fail screen with "try this chapter again."
- **Chapter / objective system.** Add `src/game/chapters.ts`: an ordered list of chapters `{ id, title, objective, sceneHint }` mapped to the book arc — **1) The Warning of Mist** (sick river), **2) The Prophecy & The Seven**, **3) Escaping the Pack**, **4) The Human Road**, **5) The Amberwood Coyotes**, **6) The Dreamlands** (unlock magic), **7) The Crystal** (finale / co-author). Store `chapterId` + current `objective` on `GameSession`. Render an **ObjectiveTracker** HUD chip ("Chapter 1 — Find out what's wrong with the river"). The AI is told the current objective and emits `[[COMPLETE_OBJECTIVE: chapterId]]` when met → celebratory interstitial ("✦ Chapter 1 Complete ✦") + advance + award XP/badge. This gives dopamine + direction without removing AI freedom.
- **Win / lose screens.** Victory (reach + ignite the crystal) → **Pack Legend** badge, confetti, "share your tale" summary. Fail → gentle "the pack turned back" with a one-tap retry of the current chapter.

### T2 — Spirit magic (marquee wild factor)
- **Actionable abilities (`src/components/game/AbilityBar.tsx`).** Each pup gets one signature **"Spirit Surge,"** usable once per chapter (cooldown stored per `Player`, refreshes on `COMPLETE_OBJECTIVE`):
  - **Shiver — Mind's Eye** (Telepathy): grant **advantage** on a Smart/INT roll (roll twice, keep higher) *or* ask Mist for a hint. VFX: blue light orbs.
  - **Oak — Hunter's Dash** (Trap Mastery): **auto-succeed** an Agility catch/escape *or* deploy a trap. VFX: wind streaks.
  - **Glacier — Ice Guard** (Protective Strike): **shield** a packmate from the next damage *or* advantage on a Strength roll. VFX: ice shards.
  - **Flurry — Soothing Light** (Soothing Herbs): **heal** a packmate (+HP). VFX: gold motes.
  - On use: fire `MagicBurst` + sound, then send a **structured prompt** to the AI ("Shiver channels her crafting magic — a blue orb of light blooms…") so the narrative reflects the cast, and apply the mechanical effect (advantage/heal/shield) client-side.
- **Magic VFX (`src/components/effects/MagicBurst.tsx`).** A framer-motion particle/flash burst driven by an **element registry** (`src/game/magic.ts`) matching the book (Ch 23): Shiver = icy blue, Flurry = gold, Oak = wind-white, Glacier = silver/ice, (future Storm = red, Spruce = fire, Mistyfeather = shadow). Reused by crits and casts.
- **Crystal finale.** When the **Frost Crystal** is held and Chapter 7 reached, an **"Ignite the Crystal — Light or Dark"** choice triggers a spectacular VFX + branching ending (book's "restore or destroy"). Because the book is unfinished, present the actual ending as a **co-author card** inviting Quinn to write it (save her text to Firestore/local; exportable).

### T3 — Juice & polish
- **Sound (`services/audioService.ts`).** Web Audio–generated SFX (or tiny bundled clips): dice clatter, crit chime, fail thud, element magic whooshes, badge fanfare, item pickup, button click, plus an ambient winter-wind loop and soft music bed. **Muted by default**, persistent toggle, respects reduced-motion/`Save-Data`.
- **Typewriter (`src/components/effects/Typewriter.tsx`).** The dev explicitly wanted this. Reveal Quinn's narrative char-by-char (optional soft tick), **tap/Enter to skip to full**, instant under reduced motion. Use it for `model` messages in `MessageLog`.
- **Dynamic scenes.** Make `BackgroundLayer` actually switch: add `[[SCENE: cave|forest|river|snowfield|ravine|road|coyote_camp|dreamland]]` to the AI command set (most reliable) *and* a keyword fallback parser, store `scene` on `GameSession`, and crossfade (the transition is already built). Render **`Snowfall`** over gameplay for ambient life.
- **Usable inventory.** Tap an item → **Use** → sends "`<Pup>` uses `<Item>`" to the AI + plays SFX; healing items also apply HP locally. Closes the collection loop.
- **Multiplayer turn/party HUD (`src/components/game/PartyStatus.tsx`).** Show party HP at a glance, whose action the DM is waiting on, and a gentle "your turn" cue so kids know when to act.
- **Mobile parity.** A bottom **drawer/tabs** for CharacterSheet + InventoryGrid + AbilityBar so phone players get full info; ensure dice/abilities are reachable.
- **Accessibility pass.** Gate all motion behind `useReducedMotion` + Motion toggle; ARIA live region announcing new narrative; keyboard access to suggestions, abilities, item-use, and the dice; focus management across screens.

### T4 — Retention & delight
- **XP + Pack Rank.** Earn XP from won rolls, objectives, and badges; ranks **Pup → Trainee → Apprentice → Pack Hero**; level-up overlay with a spirit cameo. Persist per device + in Firestore. Cosmetic/title only.
- **Spirit-card collection.** A viewable grid of the book's spirits (locked silhouettes → revealed sigil + lore in that spirit's voice), unlocked by story/lore. Original SVG sigils in element colors — no copyrighted art.
- **Mist hint system.** Idle ~30s with no action → Mist offers a gentle telepathic nudge (canned or AI), reducing frustration for younger kids.
- **Onboarding tutorial.** A skippable ~30s first-run overlay: what a d20 is, what stats/abilities do, the goal, and one practice roll.
- **Surprise & delight.** Spirit cameo overlays on big moments; tap your pup's icon → happy animation; subtle seasonal ambience.

---

## 6. NEW FILE / ARCHITECTURE MAP (keep it modular)
```
services/
  audioService.ts            # SFX + ambient (T3)
src/game/
  rolls.ts                   # stat -> modifier, outcome bands (T0)
  chapters.ts                # chapter/objective data (T1)
  magic.ts                   # element registry + ability defs (T2)
src/hooks/
  useReducedMotion.ts  useSound.ts                     # (T3)
src/components/effects/
  D20.tsx (upgrade/replace Dice3D)  MagicBurst.tsx  Typewriter.tsx
src/components/game/
  AbilityBar.tsx  PartyStatus.tsx  ObjectiveTracker.tsx  ItemUseMenu.tsx  (mobile) BottomSheet.tsx
EDIT:
  services/geminiService.ts  # buildSystemInstruction: stat-tagged rolls + new commands + chapter awareness (§8)
  App.tsx                    # thread HP/chapter/scene/cooldown state; handle new commands; dual-path persist
  src/types.ts, src/constants.ts  # additions in §7
  src/components/GameScreen.tsx, MessageLog.tsx, CharacterSheet.tsx, InventoryGrid.tsx, BackgroundLayer.tsx
  worker.js                  # NO prompt change; only touch ALLOWED_MODELS if a new model is introduced
```

---

## 7. TYPE & DATA ADDITIONS (schemas)
- `Player`: add `hp:number; maxHp:number; xp?:number; rank?:string; abilityCooldownChapter?:string` (chapter id when last used).
- `GameSession`: add `chapterId:string; objective:string; scene:string; packWarmth?:number`.
- `Message`: add `rollStat?:'strength'|'agility'|'smart'|'spirit'; rollRaw?:number; rollModifier?:number; rollTotal?:number`.
- `src/constants.ts`: add `ABILITIES` (id, name, element, type: advantage|autosucceed|heal|shield, prompt template), `CHAPTERS`, `MAGIC` element registry, and (T4) `SPIRIT_CARDS`. Optionally add more items/badges as chapters need them.

---

## 8. AI DUNGEON-MASTER PROMPT UPGRADE (edit `geminiService.ts` → `buildSystemInstruction`)
Add/extend these rules (keep all existing persona, tone, safety, and suggestion rules):
1. **Stat-tagged rolls:** *"When an action is uncertain, command exactly: `**Roll the D20 + [STAT] to [action].**` where [STAT] is one of STR, AGI, INT, or SPI — choose the stat that best fits the action. Do not resolve until the player's roll TOTAL is provided. Interpret the TOTAL (not the raw die): ≤1 or natural-1 = critical fail; 2–10 = fail; 11–15 = success; 16+ or natural-20 = critical success."*
2. **HP commands:** *"When a pup is hurt, end with `[[DAMAGE: PupName | N]]` (small numbers, 5–20). When healed, `[[HEAL: PupName | N]]`. Only after a fiction-justified cause."*
3. **Objectives/chapters:** include the current chapter title + objective in context; *"When the party clearly accomplishes the current objective, append `[[COMPLETE_OBJECTIVE: <chapterId>]]`. Then set up the next beat."* (optionally `[[SET_OBJECTIVE: text]]`).
4. **Scenes:** *"Begin major location changes with `[[SCENE: <id>]]` (cave, forest, river, snowfield, ravine, road, coyote_camp, dreamland)."*
5. **Abilities:** *"Players may channel a once-per-chapter Spirit Surge (Shiver: telepathic insight/blue light; Oak: wind dash/traps; Glacier: ice guard; Flurry: healing light). When they do, honor it dramatically and reflect the mechanical effect already applied."*
6. Keep `[[ADD_ITEM]]`/`[[AWARD_BADGE]]` (ids unchanged), the 3–4 suggestions, "What do you do?", and ≤5-sentence pacing. **Reminder the parser only splits lines starting with `[[ … ]]` and `-`; keep commands on their own trailing lines.**
> Also update the **`INITIATE SESSION`** prompt in `App.tsx` to set Chapter 1 + its objective + the opening `[[SCENE:]]`.

---

## 9. CANON & CONTENT CHECKLIST
- Keep stat names as shown to kids: **STR / AGI / INT (smart) / SPI (spirit)**.
- Keep the 4 pups; Spruce/Storm/Mistyfeather are good future additions (their magic colors: red, fire, shadow — Ch 23).
- **Magic colors (Ch 23):** Shiver = icy blue; Flurry = gold; Oak = wind-white; Glacier = silver/ice. Use verbatim.
- **Book unfinished (ends Ch 39):** Chapter 7 finale is a **co-author sandbox** — do not invent the canonical ending.
- **Reconcile with Quinn:** the manuscript spells the moon spirit both **"Lunaprie"** and **"Lunarprie"** — pick one before any spirit card surfaces it.
- **Persona stays Husky-Snow-only** (no Band-Aid six / military / hospital identity) — already in the prompt; keep it (the Worker secret can fall back to the `Neurology_API` key name, but the persona must not).
- Pull character flavor from existing `loreContext`; tag any new lore `// NON-CANON FLAVOR — Quinn to approve`.

---

## 10. ACCESSIBILITY · PERFORMANCE · MULTIPLAYER GUARDRAILS
- `prefers-reduced-motion` + Motion toggle disables dice spin, shake, particles, typewriter (text instant).
- Particles pooled and capped; animate `transform`/`opacity` only; pause on tab hidden.
- ARIA live region for new narrative; keyboard paths for suggestions, abilities, item-use, dice; visible focus.
- New commands processed **host-only** in `handleProcessCommands`, persisted dual-path (Firestore + local), synced to all players; guard against double-processing on re-render.
- Mobile: full sheet/inventory/abilities via drawer; ≥44px targets.

---

## 11. QA / ACCEPTANCE CHECKLIST (per tier)
- [ ] A roll shows `d20 + STAT modifier = total` and the AI interprets the **total**; nat-20/nat-1 always crit/fumble.
- [ ] The dice reads as a real d20 (not a cube); crit success = gold burst + chime, crit fail = shake + thud.
- [ ] HP bar visible (desktop + mobile); `[[DAMAGE]]`/`[[HEAL]]` work; 0 HP → downed + revive, never a hard dead-end.
- [ ] Objective chip shows; `[[COMPLETE_OBJECTIVE]]` advances the chapter with an interstitial + reward.
- [ ] Each pup's ability fires once/chapter with element VFX + sound + a narrative that reflects it + the real mechanical effect.
- [ ] Sound muted by default; Sound + Motion + text-speed toggles persist; reduced-motion fully respected.
- [ ] Narrative typewriters in with tap-to-skip; scenes crossfade via `[[SCENE]]`; snowfall over gameplay.
- [ ] Items are usable and affect the story/HP.
- [ ] Multiplayer: party HP + turn cue visible; new state syncs across two browsers; local-fallback mode still works.
- [ ] Win + lose screens present; crystal finale offers Light/Dark + a co-author note for Quinn.
- [ ] Playable end-to-end on a phone (portrait), touch-only and keyboard-only; no console errors.
- [ ] Builds (`npm run build`), deploys to GitHub Pages, Worker `GET /health` + `POST /generate` pass; **no Gemini key in the browser bundle.**

---

## 12. WHAT NOT TO DO
- Don't swap frameworks, add three.js/WebGL, or add heavy deps.
- Don't put the Gemini key in the browser or bypass the Worker.
- Don't break the Firestore↔local dual-path or the host-only AI trigger.
- Don't replace the AI DM with a hardcoded story graph (augment it instead).
- Don't rewrite Quinn's prose/voice, invent canon, or fabricate an ending.
- Don't add purchases, loot boxes, punishing timers, or FOMO.
- Don't ship a tier that leaves the game unplayable.

---

## 13. SUGGESTED BUILD ORDER (commit-sized)
1. `rolls.ts` + stat-modified rolls + roll Message fields; update AI prompt to stat-tag + interpret totals. *(T0)*
2. Real d20 in `Dice3D.tsx`/`D20.tsx` + crit juice hooks. *(T0)*
3. HP on `Player` + surface `StatBar`; `[[DAMAGE]]`/`[[HEAL]]` in `handleProcessCommands` (dual-path); downed/revive. *(T1)*
4. `chapters.ts` + `ObjectiveTracker` + `[[COMPLETE_OBJECTIVE]]` + chapter interstitials; win/lose screens. *(T1)*
5. `magic.ts` + `MagicBurst.tsx` + `AbilityBar.tsx` wired into one ability; then all four. *(T2)*
6. Crystal finale branch + co-author card. *(T2)*
7. `audioService.ts` SFX/ambient + `useSound`/Motion toggles + reduced-motion gating. *(T3)*
8. `Typewriter.tsx` in MessageLog; dynamic `[[SCENE]]` + keyword fallback + Snowfall. *(T3)*
9. Usable items + `PartyStatus` turn/HP HUD + mobile `BottomSheet`. *(T3)*
10. XP/Rank + spirit-card collection + Mist hints + onboarding + easter eggs; final QA + deploy. *(T4)*

---

*End of plan — Husky's Snow D&D Upgrade v1.0. Build for Quinn. Turn her world into a real adventure.*
