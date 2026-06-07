# HUSKY'S SNOW — ROUND 2 PLAN: "Deepen the World"  (v1.1 — Quinn's canon locked)
**Handoff spec for: Antigravity (or Claude Code / Codex)**
**Repo:** `github.com/matthewdholtkamp/husky-snow` · local `Desktop/Research AI/Quinn/huskys-snow`
**Owner:** LTC Matthew D. Holtkamp · **Author / canon authority:** Quinn Holtkamp
**Round 1 status:** DONE — T0–T4 shipped (chapters, abilities/Spirit Surge, MagicBurst, HP/damage/heal, usable items, typewriter, tutorial, spirit collection, party HUD, audio, Firestore fields).

> **⚠️ #1 RULE THIS ROUND: absolute fidelity to Quinn's book.** Every character's look, personality, relationships, and magic must match the manuscript. The §4 Character Bible below is the canonical source — implement it verbatim. Missions/encounters must be **plausible within this storyline** (no sci-fi, no out-of-world content). Quinn has answered the open canon questions; her answers are baked into this version.

> **CANON DECISIONS FROM QUINN (v1.1):**
> - **Only the seven quest pups have magic** (Shiver, Glacier, Oak, Flurry, Spruce, Storm, Mistyfeather).
> - **Playable characters = the core 6 pups:** **Shiver, Oak, Glacier, Flurry, Spruce, Storm.** **Mistyfeather** stays the telepathic-voice **NPC**. **Frostbite & Cold are background NPCs only** (not playable, no magic).
> - **Spelling is "Lunarprie"** (currently "Lunaprie" in code — rename it).
> - **Strength:** Glacier and Storm are tied strongest. **Smartest:** Shiver. **Fastest:** Spruce.
> - **Shiver's signature trait:** she **ALWAYS corrects anyone who uses a word that isn't real** (e.g., "floppedy isn't a word, Storm").
> - **Ending:** stays a **placeholder** (Light = restore / Dark = destroy) until Quinn finishes the book — do not invent the real ending.

---

## 0. BLUF
The game works but a full playthrough is ~20 minutes and the world feels thin. Five jobs this round:
1. **State integrity & AI memory** — harden who-gets-what, and feed the storyteller a live state block each turn so it never drifts. (Mostly polish; already mostly correct.)
2. **Remote multiplayer turns + per-pup suggestions** — an opening practice roll sets turn order; suggestions are **personalized per pup** and **synced to all players after every turn** (current gap: suggestions live only in the host's React state).
3. **Episodic content** — turn each thin chapter into a ~30–45 min episode (~5–6 beats), save/resume with a recap, guided spine + optional plausible free-roam.
4. **Cast** — add **2 new playable pups (Spruce, Storm)** → **6 playable total**; make **Frostbite & Cold** background NPCs; deepen all 6 playables; give key NPCs real personality + recurring presence.
5. **Educational layer** — weave **courage, empathy, teamwork, perseverance** in as mechanics, not lectures.

Ship in phases (R2-A … R2-E). Keep everything from Round 1 working.

---

## 1. THIS ROUND'S DECISIONS (locked with owner + author)
- **Educational focus:** character values only — **courage, empathy, teamwork, perseverance** (the heart of the book). Not vocabulary drills.
- **Length/shape:** **episodic**, ~30–45 min per chapter, played across multiple sittings, **save & resume**. ~5–6 meaningful beats per chapter.
- **Exploration:** **guided book spine** + the ability to **free-roam** a little (optional, plausible, never contradicts canon, never skips the spine).
- **Cast:** playable = **6 core pups (Shiver, Oak, Glacier, Flurry, Spruce, Storm)**. **Mistyfeather = telepathic NPC guide. Frostbite & Cold = background NPCs (no magic).** Deepen personality + visual identity of every character; give listed NPCs more dialogue/personality/recurrence.
- **Multiplayer:** **remote, separate devices** (four daughters on iPads + dad). **Rotate turns**; the **first practice roll assigns who goes first**. After each turn, "next things to do" update for everyone, with **different suggestions per pup based on that pup's personality**.

---

## 2. NON-NEGOTIABLE CONSTRAINTS
1. **Canon first** (see top rules). The Character Bible (§4) is law.
2. **Keep the stack:** React 19 + TS + Vite + Firebase (anon auth + Firestore) + Cloudflare Worker → Gemini. No new heavy deps; no three.js; no Gemini key in the browser.
3. **Dual persistence:** every new field written in **both** Firestore and local-fallback modes, processed host-only in `handleProcessCommands`, then synced.
4. **AI-driven, not hardcoded:** deepen via prompt + structured commands + thin client layers.
5. **Kid-safe:** keep anonymous auth, safetySettings, Husky-Snow-only persona (no Band-Aid six / military / hospital identity).
6. **Mobile-first** (iPads): big tap targets, BottomSheet for sheet/inventory/abilities, keyboard + touch, reduced-motion honored.
7. **Ethical:** mastery/story/collection/co-op only; no purchases, loot boxes, punishing timers, or FOMO.

---

## 3. WHERE THE CODE STANDS (so you edit the right place)
- **Story/state machine:** `App.tsx` (~1066 lines). Commands in `handleProcessCommands` (ADD_ITEM, AWARD_BADGE, DAMAGE, HEAL, COMPLETE_OBJECTIVE), keyed by `charName` via `findIndex`. `handleUseAbility`, `handleUseItem`, `handleUpdatePlayerHp` exist.
- **Storyteller:** `services/geminiService.ts` → `buildSystemInstruction(players)` (static `loreContext` + history + summarizer). **Worker (`worker.js`) is a pure relay — all prompt changes go HERE.**
- **Content:** `src/game/chapters.ts` (7 chapters, one objective each — too thin), `src/game/magic.ts`, `src/game/rolls.ts`. `src/constants.ts` (4 playables + NPC lore for Mist/Starwhirl/Dragonfly/Sweetbrush/**Lunaprie→rename Lunarprie**; 7 items; 4 badges).
- **Suggestions gap (confirmed):** suggestions are React state, set on the **host**, written to storage **only in local mode** — in Firestore multiplayer they never reach other players and vanish on refresh. Core of Job 2.

---

## 4. CANONICAL CHARACTER BIBLE  *(implement verbatim — source of truth)*

### Magic / element table (from the book, Ch 23) — **only the 7 questers have magic**
| Pup | Role | Element | Color | VFX | Playable? |
|---|---|---|---|---|---|
| Shiver | Crafter | Light orbs | icy blue | blue sparkle orbs | ✅ |
| Glacier | Fighter | Water/rain (Pluvia) | silver | silver droplets/liquid | ✅ |
| Oak | Hunter | Wind (Aerwinden) | wind white | swirling streaks | ✅ |
| Flurry | Healer | Sun-heal (Soliendron) | gold | gold motes, sun-pupil eyes | ✅ |
| Spruce | Hunter | Fire | orange | embers/flame on tail | ✅ |
| Storm | Fighter | Red lightning | red | crackling bolts | ✅ |
| Mistyfeather | — | Shadow | violet-black | dark wisps (ominous, not evil) | ❌ NPC guide |
| Frostbite / Cold | Hunters | **none** | — | — | ❌ background NPCs |

### PLAYABLE PUPS (the core 6)

**Shiver (Crafter) — blue light** *(exists; deepen)*
- Look: dark grey, white underbelly + lower legs; **thin fur** with random tufts on tail/paws/ears/snout-tip; **one iris that is blue AND brown mixed** (heterochromia within a single eye); a **glowing blue spirit-scar** spirals her front-left leg + paw (Ch 22). Harness: blue→brown fade + silver streak + warm cloak.
- Personality: creative, determined, a **planner**; "weakest-seeming" but sharp; kind; **stands up for others** (defends Oak); talks to herself; curious.
- **★ SIGNATURE TRAIT (Quinn): Shiver ALWAYS corrects anyone who uses a word that doesn't actually exist** ("floppedy isn't a word, Storm"; "smartifing isn't a word"). The storyteller must voice this for Shiver whenever a player, NPC, or narration uses a made-up word — gentle, matter-of-fact, a little professorial.
- Relations: daughter of **Snapper** (crafter dad) & **Mouse** (mom); sister to **Storm** (rival), **Glacier** (protector), Frostbite, Cold. Hears **Mistyfeather** in her mind. Mentored by **Asterstellar** (stars).
- Stats: STR 8 / AGI 12 / **INT 18 (smartest of all)** / SPI 16. Spirit Surge **Mind's Eye**: advantage on an INT check or a Mist hint; blue-orb VFX.

**Oak (Hunter) — wind** *(exists; deepen)*
- Look: brown coat, **white muzzle**, **white five-pointed star on forehead**, darker-pink nose, **missing back-left leg** (born that way) but very fast in short sprints. Harness: dark-brown camo with trap pouches.
- Personality: **determined to prove he isn't weak**, hates being coddled; honest, loyal; quietly brave. Caught a giant fish with a net (his feat / starter badge).
- Relations: son of **Dragonfly** (over-protective) & **Falcon** (deceased — crushed by boulders days after Oak's birth). Best friend to **Shiver**. Carries hurt about being called weak.
- Stats: STR 10 / AGI 16 / INT 15 / SPI 15. Spirit Surge **Hunter's Dash**: auto-succeed an AGI catch/escape or deploy a trap; wind-streak VFX.

**Glacier (Fighter) — silver water** *(exists; deepen)*
- Look: **solid white**, **icy blue eyes**, big and fluffy (biggest female pup). Harness: ice-blue armor.
- Personality: **fiercely protective** (esp. Shiver & Flurry), bold, mischievous, smart; **quick temper**, invents insults fast; idolizes **Starwhirl**. Loyalty incarnate.
- Relations: sister to Shiver, Storm, Frostbite, Cold. Bonds with the coyote **Quicksand** (two fierce ones). Magic is water/rain from her protectiveness (tied to **Pluvia**).
- Stats: **STR 18 (tied strongest with Storm)** / AGI 14 / INT 10 / SPI 12. Spirit Surge **Ice Guard**: shield a packmate from the next damage, or advantage on a STR check; ice-shard VFX.

**Flurry (Healer) — gold sun** *(exists; deepen)*
- Look: **smallest / runt**, light gray + white, **short legs** (not fast, huge heart); anxious eyes. When healing, eyes glow gold with a **second sun-shaped pupil**. Harness: lavender with herb pouches.
- Personality: **anxious but brave**, gentle, "small body but a mountain-sized heart"; excitable about plants; **dreamt the prophecy first**.
- Relations: apprentice to **Sweetbrush** (border-collie healer). Beloved little sister; Glacier shields her.
- Stats: STR 6 / AGI 14 / INT 14 / SPI 18. Spirit Surge **Soothing Light**: heal a packmate (+HP); gold-mote VFX.

**Spruce (Hunter) — fire** *(NEW PLAYABLE)*
- Look: **dark brown with a white underside**. Harness: lightweight camo with a hood + tail cover, rope strapped to the side. (NOT related to Shiver's litter — Spruce, Pine, Oak are the brown pups.)
- Personality: **the jokester / comic relief and morale engine.** Sarcastic, fast-talking, confident, brave; "I'm the one who does jokes around here!"; **the fastest of all the pups**; often scouts ahead and leads from the front; her humor defuses fear (great for courage/perseverance).
- Relations: sister to **Oak** and **Pine**; daughter of **Falcon** (deceased). Tight with the group.
- Stats: STR 11 / **AGI 18 (fastest of all)** / INT 13 / SPI 12. Spirit Surge **Blazing Dash** [fire]: auto-succeed a chase/escape/scout (AGI) **or** crack a joke that restores a packmate's Pack Heart; ember/flame-tail VFX.
- DM voice: quippy, warm, a little cocky; turns tense moments funny without breaking them.

**Storm (Fighter) — red lightning** *(NEW PLAYABLE)*
- Look: **dark grey with grey underbelly, dark blue eyes.** Harness: black armor.
- Personality: starts as the **arrogant, abrasive rival** — bites ears, breaks rules, brags, says "fluffbrained" / "floppedy fish." **Not evil** — over the journey he **softens and shows loyalty** (Ch 28 he sides with the group; joins the storytelling). Strong, blunt, proud, secretly caring. His arc = perseverance + the empathy of being accepted.
- Relations: brother to **Shiver** (he bullies, then respects), **Glacier** (clash/team), Frostbite, Cold; son of Mouse & Snapper. Mother's saying: "the one with sharp teeth and strong paws."
- Stats: **STR 18 (tied strongest with Glacier)** / AGI 13 / INT 11 / SPI 12. Spirit Surge **Thunder Charge** [red lightning]: a powerful strike / force a barrier or foe back (advantage on STR); red-bolt VFX.
- DM voice: gruff, boastful, interrupts — but let warmth peek through as chapters progress.

*Selection UI: 6 pups, distinct color + valid lucide-react icon + emoji portrait + book-accurate "features" list. Suggested icons (pick installed names): Spruce = Flame / orange; Storm = CloudLightning / rose. Add `loreContext` + `startingScene` for Spruce & Storm in Quinn's voice from the bios above.*

### KEY NPCs *(real personality, dialogue, recurring presence)*
- **Mistyfeather "Mist"** — telepathic guide. **Black fur** (blackened after being revived by dark spirits), **black void eyes**; young. Surface: **monotone, sarcastic, creepy-calm** (suppresses emotion because she hears all minds); underneath: **deeply grieving** someone she lost and was lied to about getting back. **Protective of Shiver** (Shiver's voice was the first thing she heard; reminds her of "them"). Shadow magic — ominous but **not evil**. The prophecy's "blackened one." Recurs as the in-game **inner voice / hint-giver** with dry one-liners and occasional cracks of real feeling.
- **Starwhirl** — pack **leader**. Black with white underbelly + a **star-shaped spot on the forehead**, dark-purple harness with glittery stars. Noble, kind, **young and newer to leadership than she seems**; was a great hunter; knows everyone's name; a touch literal (misses jokes). Appears at camp, at ceremonies, and to bless or assign the quest.
- **Sweetbrush** — pack **healer**, the **only non-husky: a golden-eyed border collie.** Wise, strict-but-kind, gathers herbs/berries daily, mentors **Flurry**; mysteriously as smart as the huskies.
- **Dragonfly** — **Oak's mother**. Dark brown, **wild turquoise eyes**. **Over-protective to the point of hostility**; **distrusts/blames Shiver** for Oak's leg/"curse" (truth, Ch 35: a shadow figure crippled baby Oak the same moment Shiver opened her eyes). **Not a villain — she loves fiercely.** A sympathetic obstacle; possible reconciliation arc.
- **Frostbite & Cold** — Shiver's brothers, **background NPCs, no magic** (they stayed with the pack). **Frostbite = silly and fast; Cold = serious and stronger.** The inseparable copy-each-other duo (light comic gag). Use as flavor/family at camp; not central.
- **Amberwood coyotes (Ch 26–33):**
  - **Quicksand** — oldest Amberwood pup; light brown with **black swirls**, **one blue + one gold eye**, missing an ear, side scar, **stumpy tail** (battle-marked); fierce, teasing, dramatic (pauses for suspense); **befriends Glacier**.
  - **Thorn** — Quicksand's brother (a summer younger); **yellow eyes**; gruff, suspicious, growly; **uneasy around Mist**.
  - **Floral** — small coyote pup (~4 months); **talks in breathless run-on sentences**, bubbly, endlessly curious, eager to learn **crafting from Shiver** (reminds Shiver of Flurry); naturally great at stealth; daughter of leaders **Ash** & **Clay**.
- **Background (light touch):** **Snapper** (Shiver's crafter dad, warm mentor), **Mouse** (mom, wise & gentle), **Kitsune** (fox illusion-spirit who hides the road crossing), the spirits (**Lunarprie** moon/leader, **Asterstellar** stars, **Aerwinden** wind — grumpy, **Soliendron** sun, **Hesper** sunset, **Pluvia** rain, **Aurora** trainee).

### WORLD CANON (anchor missions to this)
Forest of **Faststream**, home of the **Moonshine River Pack**; snowy, river-rich, bordered by wolves and humans. Origin: enslaved sled-dogs made too-smart by cruel humans **escaped** (led by **Lunarprie**), found the forest, became free and became the star-spirits; a traitor **Kakos** + 2 others stayed and became the **dark spirits**. **Magic was "locked away" when humans broke it** — the questing pups are **re-awakening** it; training happens in the **Dreamlands** at night. The crisis: **the river is poisoned**; the **prophecy** sends seven young pups to **find the Frost Crystal** and **ignite it with light or dark — restore or destroy.** Keep all invented side-content inside this frame.

---

## 5. JOB 1 — STATE INTEGRITY & AI MEMORY (phase R2-A)
- **Live state block** to the storyteller every turn (in `geminiService.ts`): current chapter + objective + scene; per pup: HP/maxHP, downed?, inventory (names×qty), ability-ready?; whose turn it is. Stops drift on who has what / which chapter / who's hurt.
- **Alias-safe attribution:** match `charName` **case-insensitively** + known aliases ("Mist"→"Mistyfeather"). Unknown name → log + skip safely (never crash/mis-credit). Add a resolver in `App.tsx`.
- **Authoritative client math:** AI proposes via `[[…]]`, client is source of truth. Clamp HP to `[0,maxHP]`; ignore malformed amounts.
- **Persistence audit:** every stateful field round-trips in Firestore AND local and survives refresh; add missing fields to `firestore.rules`.

## 6. JOB 2 — REMOTE MULTIPLAYER TURNS + PER-PUP SUGGESTIONS (phase R2-B)
- **First Howl (practice roll) sets turn order:** one-time pre-game step (fold into TutorialOverlay); everyone rolls the d20; **highest first**, ties re-roll; store `turnOrder: string[]` (userIds) + `currentTurnIndex: number` on the game doc. Doubles as the "how to roll" tutorial.
- **Round-robin turns:** only the **current-turn** player's ActionBar/roll/abilities are active; others see read-only "**[Pup] is deciding…**" + a **preview of their own pup's suggestions** (greyed until their turn). After the action resolves and the storyteller replies, **advance `currentTurnIndex`** (skip downed pups). Clear **turn banner** ("Your turn, Glacier!") + order in `PartyStatus`.
- **Per-pup personalized suggestions, synced to all:** storyteller emits suggestions **keyed by pup**, e.g. trailing lines:
  `[[SUGGESTIONS: Shiver | craft a filter from spiderweb ; ask Mist what she senses ; study the oily water]]`
  `[[SUGGESTIONS: Storm | shove the rotten log aside ; charge the noise ; brag, then act]]`
  Extend `parseAIText` to parse `[[SUGGESTIONS: Pup | a ; b ; c]]` → `Record<charName,string[]>`; **persist that map onto the game doc** so `onSnapshot` pushes it to **every** player (fixes the React-state-only gap). Each client renders **its own pup's** list. Suggestions must reflect that pup's **personality + abilities** (Shiver clever/crafty/telepathic + corrects fake words; Glacier protective/forceful; Oak nimble/trap; Flurry healing/gentle; Spruce fast/funny/scout; Storm strong/blunt/boastful). Keep a shared `-` fallback if a pup is omitted.
- **Host trigger unchanged** (host-only AI); the **turn** belongs to whoever's up. Nice-to-have: host migration if host leaves.

## 7. JOB 3 — EPISODIC CONTENT ENGINE (phase R2-C)
- **Chapter beats:** expand `chapters.ts` — each chapter gets `intro`, `beats: string[]` (~5–6 hints mixing a skill-check, a **values moment**, an exploration choice, a danger/combat beat, an NPC interaction), `minBeats`, and a `climax`. Feed current beats + minBeats to the storyteller. **Pacing rule (prompt):** *"Do NOT emit `[[COMPLETE_OBJECTIVE]]` until the beats are meaningfully done; aim ~30–45 min; offer optional exploration but keep the book's spine; never resolve the main quest early."* This turns the 20-min run into real episodes.
- **Guided + free-roam:** between required beats, offer **optional, plausible** side-moments (hidden cache, packmate heart-to-heart, small in-world critter, craftable). Add an "Explore a little" suggestion category; progress gates on the spine. Invented content obeys §4 world canon and never contradicts the book.
- **Save / resume across sittings:** chapter-end **"Episode Complete — rest your paws"** checkpoint guarantees a save (Firestore + local) of chapter/scene/all pup state/turn order/suggestions/Pack Heart. On resume, generate a short **"Previously, on Husky's Snow…"** recap (reuse `summarizeHistory`).
- **7 chapters map to the book arc:** Warning of Mist → Prophecy & the Seven → Escaping the Pack → The Human Road (Kitsune's illusion crossing) → The Amberwood Coyotes → The Dreamlands (unlock magic) → The Crystal Finale (Light/Dark, **placeholder ending** — invite Quinn to write the true ending later; never fabricate it).

## 8. JOB 4 — CAST IMPLEMENTATION (phase R2-D)
- **Add 2 new playables (Spruce, Storm)** to `src/constants.ts` `CHARACTERS` using §4 (stats, ability, color, icon, features, `loreContext`, `startingScene`). Update `CharacterSelectionScreen` to show **6 pups** cleanly (grid/scroll on mobile). Add Spruce/Storm abilities to `magic.ts` (both canon elements — no proposed flags).
- **Demote Frostbite & Cold to NPCs** (remove from any playable list); add them to the NPC registry (Frostbite = silly/fast, Cold = serious/strong, no magic).
- **Rename Lunaprie → Lunarprie** in `src/constants.ts` (display name; rename `id`/`charName` consistently and update any references).
- **Encode Shiver's word-correction trait** in her `loreContext` AND the storyteller rules (§11).
- **Deepen all 6 playables:** enrich each `loreContext` with book personality + relationships so the storyteller plays them right; ensure per-pup suggestions + DM voice match.
- **NPC personality + recurrence:** add an `NPCS` registry (name, look, personality, voice, where-they-recur) and inject relevant NPCs by chapter (Mist throughout; Starwhirl ch1–2 & finale; Sweetbrush ch1–2; Dragonfly ch2–3 + reconciliation beat; Quicksand/Thorn/Floral ch4–5; Frostbite/Cold as camp flavor).
- **Visual identity [art is the hard part — pragmatic path]:** near-term, tinted **SVG husky portrait** per pup (coat color + eye color incl. heterochromia + harness swatch + a **distinguishing-feature marker**: Oak's missing leg, Shiver's mixed iris + leg-scar, Storm's black armor) on selection + sheet, plus emoji + "features" text. **Note for Quinn:** the sibling website repo has a **layered-SVG husky builder** — natural to port for richer portraits. Full illustrated art = a separate asset task **with Quinn** (her mental image is canon).

## 9. JOB 5 — EDUCATIONAL LAYER: VALUES AS MECHANICS (phase R2-E)
- **Pack Heart meter** (team resource): grows from **courage** (attempt a hard/scary roll; stand up for someone), **empathy** (comfort/help a packmate or NPC — reassure Mist, understand Dragonfly), **teamwork** (combine pups; support the active pup), **perseverance** (try again after a failed roll; Hopeful-Game spirit). Spend Pack Heart to **re-roll** or **revive a downed pup**.
- New command `[[HEART: +N | value | reason]]` (value ∈ courage/empathy/teamwork/perseverance). Storyteller awards it for fiction-justified moments and may **gently name** the value once per scene — never preachy.
- **End-of-episode reflection:** checkpoint shows "Values you showed this episode" (icons + one warm line each). Modeled, not tested.
- Turn-taking teaches patience/teamwork; co-op Spirit Surges reward cooperation; tie suggestion phrasing to values where natural.

---

## 10. TYPE / DATA ADDITIONS
- `GameSession`: `turnOrder: string[]`, `currentTurnIndex: number`, `suggestionsByPup: Record<string,string[]>`, `packHeart: number` (keep chapterId/objective/scene/packWarmth).
- `Player`: ensure `hp/maxHp`, `abilityCooldownChapter` (badges/inventory exist).
- `Message`: keep roll fields; allow a `value?` tag on Pack-Heart system notes.
- `Chapter`: add `intro: string`, `beats: string[]`, `minBeats: number`, `climax: string`.
- `constants.ts`: 2 new `CHARACTERS` (Spruce, Storm); `NPCS` registry (incl. Frostbite/Cold); Lunarprie rename; extend abilities in `magic.ts`.
- Update `firestore.rules` for all new fields.

## 11. STORYTELLER PROMPT UPGRADES (`geminiService.ts` → `buildSystemInstruction`)
Add (keep existing persona/tone/safety/dice rules):
1. **Live STATE block** each turn (chapter/objective/scene; per-pup HP/inventory/ability/downed; whose turn).
2. **Per-pup suggestions:** *"End each turn with one `[[SUGGESTIONS: Pup | a ; b ; c]]` line per active pup, tailored to that pup's personality + abilities (use bios). 3–4 specific, safe options."*
3. **Turn awareness:** *"Address/prompt the current-turn pup; acknowledge others briefly."*
4. **Pacing/beats:** include the chapter's beats + minBeats + the ~30–45 min/keep-the-spine rule.
5. **NPCs in voice:** inject relevant NPC bios; voice each per personality; recur naturally.
6. **★ Shiver's trait:** *"Whenever any player, NPC, or the narration uses a word that isn't a real word, Shiver immediately and matter-of-factly corrects it (e.g., 'floppedy isn't a word'). Do this in-character for Shiver, briefly, without derailing the scene."*
7. **Values:** *"Reward courage/empathy/teamwork/perseverance with `[[HEART: +N | value | reason]]`; name a value gently at most once per scene."*
8. **Canon guardrail:** *"Stay strictly inside Husky's Snow canon (bios + world). Only the seven quest pups have magic. Invent only small, plausible, in-world side-details. Never contradict a pup's look, personality, relationships, or magic. The ending is undecided — never resolve the true ending; the crystal choice is Light=restore / Dark=destroy placeholder."*
9. Keep `[[ADD_ITEM]]/[[AWARD_BADGE]]/[[DAMAGE]]/[[HEAL]]/[[SCENE]]/[[COMPLETE_OBJECTIVE]]`; route new `[[SUGGESTIONS:]]` and `[[HEART:]]` lines in `parseAIText`. Update the `INITIATE SESSION` prompt in `App.tsx` to seed Chapter 1 intro/beats and request per-pup suggestions.

---

## 12. CANON CHECKLIST & WHAT NOT TO DO
- ✅ Playable = exactly the 6 core pups (Shiver, Oak, Glacier, Flurry, Spruce, Storm). Mist = NPC guide. Frostbite/Cold = background NPCs, no magic.
- ✅ Only the 7 questers have magic; Spruce = fire, Storm = red lightning (canon, no proposed flags).
- ✅ Rename **Lunaprie → Lunarprie** in code.
- ✅ Stats reflect Quinn: Glacier & Storm tied strongest (STR 18); Shiver smartest (INT 18); Spruce fastest (AGI 18).
- ✅ Shiver always corrects non-existent words (bio + prompt).
- ✅ Stat names stay STR/AGI/INT(smart)/SPI(spirit).
- ✅ Finale stays a **placeholder** — do not fabricate the book's ending.
- 🚫 No out-of-world/sci-fi/anything contradicting canon.
- 🚫 Don't change the stack / add three.js / expose the Gemini key.
- 🚫 Don't break Firestore↔local dual-path, the host-only trigger, or Round-1 features.
- 🚫 Don't lecture the values or add quizzes; model them.
- 🚫 Don't ship a phase that leaves the game unplayable.

## 13. QA / ACCEPTANCE
- [ ] Exactly 6 playable pups; each matches the bible (look/personality/ability/voice); Spruce & Storm added with canon magic.
- [ ] Frostbite & Cold appear only as NPCs (no playable entry, no magic). Mist is the telepathic NPC, not selectable.
- [ ] "Lunarprie" spelling everywhere (no "Lunaprie" left in code/UI).
- [ ] Shiver corrects made-up words in play (feed the AI a fake word and confirm Shiver corrects it).
- [ ] AI gets a live STATE block; HP/items always credit the correct pup; alias/case mismatches handled; no crash on bad commands.
- [ ] First Howl practice roll sets turn order; round-robin enforced; downed pups skipped; clear turn banner.
- [ ] Suggestions are per-pup, personality-accurate, **persisted to the game doc, updated for ALL players after every turn** (verify on two devices); survive refresh.
- [ ] A chapter plays ~30–45 min with ~5–6 beats; optional free-roam works without skipping the spine; objective completes only after beats.
- [ ] Episode-complete checkpoint saves everything; resume shows a "Previously…" recap (Firestore + local).
- [ ] NPCs (Mist, Starwhirl, Sweetbrush, Dragonfly, Quicksand, Thorn, Floral) appear in voice and recur.
- [ ] Pack Heart grows from courage/empathy/teamwork/perseverance and can re-roll/revive; end-of-episode shows values shown.
- [ ] Plays end-to-end on iPads (touch), multi-device via Game ID; reduced-motion respected; `npm run build` clean; no Gemini key in bundle.

## 14. SUGGESTED BUILD ORDER (commit-sized)
1. **R2-A** State: live STATE block + alias-safe attribution + persistence/rules audit.
2. **R2-D (data first)** Add Spruce & Storm playables; move Frostbite/Cold to NPC registry; **rename Lunarprie**; encode Shiver's word-correction trait; deepen all `loreContext`. (Unblocks everything else.)
3. **R2-B** Turn order (First Howl) + round-robin + `[[SUGGESTIONS: Pup|…]]` parsed, persisted, per-pup rendered on all clients.
4. **R2-C** Chapter beats/pacing + free-roam + episode checkpoint + resume recap.
5. **R2-E** Pack Heart + `[[HEART:]]` + values reflection.
6. Visual identity pass (tinted SVG portraits + feature markers); finale placeholder card polish; full QA + deploy.

---
*End of Round 2 (v1.1 — Quinn's canon locked). Build it true to her book.*
