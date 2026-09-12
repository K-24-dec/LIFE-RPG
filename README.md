# ⚔️ LIFE RPG — "Turn your real life into an adventure."

> Built for the hackathon. Life RPG transforms mundane real-world productivity tasks into an immersive, server-authoritative RPG progression system with built-in honesty nudges and anti-gaming protection.

---

## 🌟 Product Vision & Creative Direction

Traditional productivity apps feel like chores. **Life RPG** makes users feel like they are progressing through an epic AAA game menu.

```text
REAL-LIFE GOAL
  ↓
CREATE QUEST (Or Timed Quest)
  ↓
REFLECT & SUBMIT PROOF
  ↓
INSTANT FEEDBACK (+XP, +GOLD, STAT BOOST)
  ↓
MAINTAIN STREAK (🔥 5 DAYS)
  ↓
LEVEL UP (✨ LEVEL UP MODAL)
  ↓
UNLOCK GUILD MARKET REWARDS
  ↓
BECOME A STRONGER CHARACTER
```

---

## 🛡️ Honesty-Nudging & Anti-Gaming Architecture

Completion is self-reported by design. We mitigate (not prevent) false completions via minimum-duration checks, reflection prompts, rate-limiting, and proof uploads, since server-side verification of real-world actions is out of scope for any habit app.

1. **Reflection Note on Completion**: Before a quest is marked completed, users are prompted with an optional text field (*"What did you accomplish?"*, max 280 chars). Psychological research shows people inflate/fabricate significantly less when asked to briefly justify a claim.
2. **Server-Side Minimum Time-in-Progress Enforcement**: Duration-based quests (e.g. "Read for 30 min", "Workout") enforce a backend check (`started_at` vs `min_duration_seconds`). Completing faster than the required duration is rejected server-side with a friendly error.
3. **Server-Side Rate Limiting**: The backend rate-limits quest completions (max 5 per rolling 60 seconds per user) to prevent rapid script completion or bulk fake clicks.
4. **Proof Upload Verification**: Users can attach optional proof photos/image URLs to their quest completions, which are recorded and displayed in **The Chronicle** activity timeline.
5. **Soft Anomaly Encouragement Nudges**: Rapid completion bursts (e.g., 3+ completions within 30 seconds) trigger a non-accusatory, supportive encouragement toast (*"⚡ Rapid Victory Sequence! Remember to rest and reflect between quests."*).

---

## 🎮 Key Features

* **Authoritative Game Progression Engine**: Non-linear level curve ($100 \times \text{level}^{1.5}$) with server-calculated XP, Gold, Streaks, and Attribute distribution.
* **Adventure Hub (Dashboard)**: Character stats, XP progress, level indicator, attributes panel, streak tracker, and today's active quest board.
* **Full Quest CRUD & Timed Quests**: Forge, edit, complete, filter by category/difficulty, configure minimum timers, and search real-life productivity quests.
* **Instant Floating Feedback & Confetti Celebrations**: Framer Motion animated floaters (`+75 XP`, `+35 GOLD`, `INTELLIGENCE +5`) and full-screen Level Up celebrations.
* **Guild Market & Arsenal**: Spend earned Gold on avatars, titles, frames, and themes categorized by rarity (`COMMON`, `UNCOMMON`, `RARE`, `EPIC`, `LEGENDARY`).
* **The Chronicle**: Immutable activity timeline tracking every victory, reflection note, and proof photo with precise timestamps.
* **Achievement Badges**: Trophies with locked silhouettes and real progress indicators (`FIRST QUEST`, `EARLY RISE`, `WARRIOR`, `SCHOLAR`, `STREAK MASTER`, `LEVEL 10`, `CENTURION`).

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS
* **Animations**: Framer Motion, Canvas Confetti
* **Icons**: Lucide React
* **State & Persistence**: React GameContext, LocalStorage fallback sync engine
* **Backend & Auth**: Supabase Auth & PostgreSQL Database Client (`@supabase/supabase-js`), Express Server (`server.ts`)

---

## 🚀 Local Setup & Running Commands

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Typecheck & Build**:
   ```bash
   npx tsc --noEmit
   npx vite build
   ```

---

## 🎥 90–180 Second Hackathon Demo Guide

1. Open **[http://localhost:3000](http://localhost:3000)** $\rightarrow$ Click **"START YOUR JOURNEY"** $\rightarrow$ Click **"INSTANT DEMO HERO LOGIN"**.
2. Arrive at **Adventure Hub** (`/dashboard`).
3. Click **"+ CREATE QUEST"** $\rightarrow$ Forge a 15-minute timed quest *"Study System Architecture"*.
4. Click **"[ COMPLETE QUEST ]"** immediately before starting timer $\rightarrow$ Observe server rejection message: *"This quest has not been started yet! Click 'START TIMER' to begin."*
5. Click **"START TIMER"**, then complete a standard quest $\rightarrow$ Enter reflection note *"Refactored async database module"* & attach proof URL $\rightarrow$ Click **"CONFIRM VICTORY"**.
6. Observe floating rewards (`+75 XP`, `+35 GOLD`, `INTELLIGENCE +5`).
7. Open **The Chronicle** (`/chronicle`) to view your reflection note & verified proof photo badge!
