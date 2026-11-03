# LinguaFlow — Product Requirements Document (PRD)

> **Version**: 1.0  
> **Last Updated**: November 2026  
> **Status**: Approved for MVP Development  
> **Author**: LinguaFlow Product Team

---

## 1. Product Vision

### 1.1 Overview

| Field         | Value                                     |
|---------------|-------------------------------------------|
| **App Name**  | LinguaFlow                                |
| **Tagline**   | *"Learn Languages Beautifully"*           |
| **Platform**  | Web (React + Vite SPA)                    |
| **MVP Target**| Q1 2027                                   |

### 1.2 Problem Statement

The language learning market is saturated but bifurcated into two unsatisfying camps:

1. **Over-Gamified Apps** (e.g., Duolingo, Babbel) — Bright cartoon characters, incessant notifications, shallow repetition loops, and aggressive monetization. While engaging initially, they prioritize engagement metrics over genuine learning outcomes. Advanced learners find the childish presentation embarrassing and the content ceiling too low.

2. **Academic / Textbook-Style Tools** (e.g., Anki, traditional courses) — Rigorous but visually uninspiring. They deliver effective learning science (like spaced repetition) wrapped in a utilitarian interface that offers no joy or motivation. Dropout rates are high because the experience feels like homework.

**The gap**: There is no mainstream language learning tool that treats adult learners with respect — combining evidence-based learning science with a beautifully designed, modern interface that feels like a premium product, not a children's game.

### 1.3 Solution

**LinguaFlow** bridges this gap. It is a beautifully designed web application that:

- Employs **spaced repetition science** (SM-2 algorithm) for long-term vocabulary retention
- Delivers **varied, interactive exercises** (flashcards, quizzes, fill-in-the-blank, matching, typing) to engage different learning modalities
- Features **tasteful gamification** — XP, streaks, levels, and achievements that motivate without being childish
- Ships with a **warm, modern design system** that makes daily practice feel like opening a favorite app, not a chore
- Runs entirely **client-side** for instant, offline-capable performance with zero friction sign-up

### 1.4 Product Principles

| Principle                | Description                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------------|
| **Beauty drives habit**  | A well-crafted interface earns daily opens. Design is not decoration — it is a retention tool. |
| **Science over gimmicks**| Every learning mechanic is grounded in cognitive science (spaced repetition, active recall).   |
| **Respect the learner**  | No infantilizing design. Adults learning languages deserve a sophisticated experience.        |
| **Progress is visible**  | The user should always know where they stand, what they've learned, and what comes next.       |
| **Friction-free start**  | No account creation, no paywall. Open the app and start learning in under 60 seconds.         |

---

## 2. Target Users

### 2.1 Primary Audience

**Adults aged 18–45** who want to learn a new language for practical or personal reasons. They are comfortable with web apps, value good design, and have tried (and possibly abandoned) other language learning tools.

#### User Personas

| Persona        | Age | Motivation        | Pain Point                                          | Goal                                         |
|----------------|-----|-------------------|-----------------------------------------------------|----------------------------------------------|
| **Maria**      | 29  | Travel            | Duolingo feels juvenile; she wants something elegant | Learn basic Spanish before her trip to Spain  |
| **Kenji**      | 34  | Career            | Anki works but is ugly; he loses motivation          | Learn business French for a Paris assignment  |
| **Priya**      | 22  | Culture            | Textbooks are dull; she wants interactive practice   | Learn Japanese to enjoy anime without subs    |
| **Alex**       | 40  | Personal Growth   | Tried many apps, none stuck past 2 weeks             | Finally commit to learning Spanish fluently   |

### 2.2 Secondary Audience

**Students (16–22)** learning a second language for school or university, who want supplementary practice outside the classroom.

### 2.3 Motivation Categories

The onboarding flow captures the user's primary motivation to personalize the experience:

| Motivation         | Icon  | Personalization Effect                                    |
|--------------------|-------|-----------------------------------------------------------|
| ✈️ **Travel**       | Plane | Prioritizes travel-related vocabulary and phrases          |
| 💼 **Career**       | Case  | Emphasizes formal language, business vocabulary            |
| 🎭 **Culture**      | Arts  | Highlights cultural context, media-related vocabulary      |
| 🌱 **Personal Growth** | Plant | Balanced curriculum, emphasis on daily habit building   |

---

## 3. Supported Languages (MVP)

### 3.1 Launch Languages

| Language     | Flag | Native Name | Content Depth | Rationale                              |
|--------------|------|-------------|---------------|----------------------------------------|
| **Spanish**  | 🇪🇸   | Español     | Full (10 categories, 50+ lessons) | Most-studied language globally |
| **Japanese** | 🇯🇵   | 日本語       | Full (10 categories, 50+ lessons) | High demand, unique script system |
| **French**   | 🇫🇷   | Français    | Full (10 categories, 50+ lessons) | Classic choice, strong demand    |

### 3.2 Extensibility

The data architecture is language-agnostic. Each language is a self-contained module containing:

- Vocabulary database with translations, romanization (for non-Latin scripts), example sentences, and audio references
- Categorized lesson structure
- Language-specific exercise configurations (e.g., Japanese may emphasize character recognition)

Adding a new language requires only adding a data module — no code changes to the app itself.

---

## 4. Core Features

### 4.1 Onboarding Flow

A 5-step guided onboarding that personalizes the learning experience and gets the user into their first lesson within 60 seconds.

#### Steps

| Step | Screen                    | Content                                                          | User Action                     |
|------|---------------------------|------------------------------------------------------------------|---------------------------------|
| 1    | **Choose Language**       | Grid of available languages with flags and native names          | Tap to select                   |
| 2    | **Your Motivation**       | Card selection: Travel, Career, Culture, Personal Growth         | Tap to select                   |
| 3    | **Proficiency Level**     | Beginner / Some Knowledge / Intermediate                         | Tap to select                   |
| 4    | **Daily Goal**            | 5 min (Casual) / 10 min (Regular) / 15 min (Committed) / 20 min (Intense) | Tap to select          |
| 5    | **Personalized Welcome**  | "Your personalized learning path is ready!" + summary of choices | Tap "Start Learning" to proceed |

#### User Stories

- **US-O1**: As a new user, I want to choose my target language so the app shows me relevant content.
- **US-O2**: As a new user, I want to share my motivation so the app can prioritize relevant vocabulary.
- **US-O3**: As a new user, I want to set my proficiency level so I start at the right difficulty.
- **US-O4**: As a new user, I want to choose a daily goal so the app can hold me accountable.
- **US-O5**: As a new user, I want to see a summary of my choices before starting so I feel confident in my setup.

#### Acceptance Criteria

- Progress indicator visible throughout (step dots or progress bar)
- Back navigation available on steps 2–5
- Selections persist if the user navigates back
- Onboarding state saved to localStorage on completion
- Redirect to `/dashboard` after completion
- Subsequent visits skip onboarding (unless user resets from Profile)

---

### 4.2 Dashboard

The dashboard is the home base — a motivating overview of the user's progress and a launchpad into today's learning.

#### Components

| Component              | Description                                                                  |
|------------------------|------------------------------------------------------------------------------|
| **Greeting Header**    | "Good morning, Learner!" with contextual time-of-day greeting                |
| **Streak Counter**     | Flame icon + consecutive day count + best streak record                      |
| **XP Progress**        | Current XP / next level threshold with animated progress ring                |
| **Level Badge**        | Current level name (Seedling → Sprout → Sapling → Tree → Forest) with icon  |
| **Daily Goal Tracker** | Minutes practiced today vs daily goal, circular progress                     |
| **Continue Learning**  | Card linking to the last incomplete lesson — "Pick up where you left off"    |
| **Today's Lessons**    | 2–3 recommended lessons based on progress and spaced repetition schedule     |
| **Weekly Activity**    | 7-day bar chart showing minutes practiced each day                           |
| **Quick Stats**        | Words learned, lessons completed, total XP — small stat cards                |

#### User Stories

- **US-D1**: As a returning user, I want to see my streak count prominently so I'm motivated to maintain it.
- **US-D2**: As a returning user, I want to continue my last lesson with one tap so there's no friction.
- **US-D3**: As a user, I want to see my weekly activity so I can identify my learning patterns.
- **US-D4**: As a user, I want to see my level and XP progress so I feel a sense of advancement.
- **US-D5**: As a user, I want recommended lessons so I don't have to decide what to study next.

---

### 4.3 Lesson Browser

A categorized view of all available lessons for the selected language, with clear progress indicators.

#### Categories (MVP — 10 per language)

| Order | Category       | Icon  | Description                            | Lesson Count |
|-------|----------------|-------|----------------------------------------|--------------|
| 1     | Basics         | 📚    | Alphabet, pronunciation, essentials    | 5            |
| 2     | Greetings      | 👋    | Hello, goodbye, introductions          | 5            |
| 3     | Food & Drink   | 🍽️    | Ordering, ingredients, preferences     | 5            |
| 4     | Travel         | ✈️    | Directions, transportation, hotels     | 5            |
| 5     | Numbers        | 🔢    | Counting, dates, time, money           | 5            |
| 6     | Colors         | 🎨    | Colors, descriptions, adjectives       | 5            |
| 7     | Family         | 👨‍👩‍👧‍👦 | Family members, relationships          | 5            |
| 8     | Weather        | 🌤️    | Weather, seasons, climate              | 5            |
| 9     | Shopping       | 🛒    | Prices, stores, clothing, bargaining   | 5            |
| 10    | Directions     | 🧭    | Navigation, landmarks, asking the way  | 5            |

#### States

- **Unlocked**: Available to start. Shows lesson count and progress percentage.
- **In Progress**: Has a colored progress bar showing completion.
- **Completed**: Checkmark overlay, gold border accent. All lessons finished.
- **Locked**: Greyed out with lock icon. Unlocks when the prerequisite category reaches 60% completion.

#### User Stories

- **US-L1**: As a user, I want to browse all lesson categories so I can choose what interests me.
- **US-L2**: As a user, I want to see my progress per category so I know how much I've completed.
- **US-L3**: As a user, I want locked categories to show their prerequisites so I know what to complete first.
- **US-L4**: As a user, I want a satisfying visual when I complete a category so I feel accomplished.

---

### 4.4 Lesson Player

The core learning experience. Each lesson contains a sequence of exercises that teach and test vocabulary.

#### Lesson Structure

```
Lesson Flow:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Vocabulary   │────▶│  Flashcards  │────▶│   Exercises   │────▶│   Summary    │
│ Introduction  │     │   Review     │     │  (Mixed Type) │     │  & XP Award  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

#### Exercise Types

| Type                 | Description                                                         | XP  |
|----------------------|---------------------------------------------------------------------|-----|
| **Vocabulary Intro** | Word shown with translation, romanization, example sentence         | 0   |
| **Flashcard**        | Tap to flip card — target language on front, native on back         | 5   |
| **Multiple Choice**  | Question + 4 options, one correct                                   | 10  |
| **Fill in the Blank**| Sentence with a missing word, user selects from word bank           | 10  |
| **Matching Pairs**   | 4–6 pairs to match (tap-to-select or drag-and-drop)                | 15  |
| **Typing Exercise**  | User types the translation of a shown word/phrase                   | 15  |

#### Lesson Player UI Elements

| Element            | Description                                                              |
|--------------------|--------------------------------------------------------------------------|
| **Progress Bar**   | Top of screen, animated fill showing exercise completion percentage      |
| **Lives System**   | 3 hearts (lives). Lose one per wrong answer. Lesson fails at 0 hearts.   |
| **XP Counter**     | Running total of XP earned in this lesson session                        |
| **Close Button**   | Top-left, confirms exit ("Your progress will be saved")                  |
| **Feedback Toast** | "Correct! ✓" (green) or "Not quite — the answer is..." (red) after each |
| **Continue Button** | Proceeds to next exercise after feedback is shown                       |

#### User Stories

- **US-LP1**: As a user, I want to see new vocabulary with examples before being quizzed so I can learn before being tested.
- **US-LP2**: As a user, I want varied exercise types so learning stays engaging and reinforces different skills.
- **US-LP3**: As a user, I want immediate feedback on my answers so I learn from mistakes.
- **US-LP4**: As a user, I want a lives system that adds stakes without being punishing (can retry lesson).
- **US-LP5**: As a user, I want to see my XP accumulate during the lesson so I feel rewarded.
- **US-LP6**: As a user, I want a completion summary showing XP earned, accuracy, and words learned.
- **US-LP7**: As a user, I want my progress saved if I quit mid-lesson so I can resume later.

---

### 4.5 Practice / Review Mode

A dedicated space for reviewing previously learned vocabulary using spaced repetition.

#### Features

| Feature                | Description                                                        |
|------------------------|--------------------------------------------------------------------|
| **Spaced Repetition**  | Words due for review surface automatically based on SM-2 algorithm |
| **Weak Words**         | Words frequently answered incorrectly are prioritized              |
| **Timed Challenge**    | Optional: 60-second rapid-fire quiz for bonus XP                   |
| **Review Stats**       | Words reviewed, accuracy rate, words mastered vs struggling        |

#### User Stories

- **US-P1**: As a user, I want the app to remind me which words need review so I don't forget them.
- **US-P2**: As a user, I want to see which words I'm struggling with so I can focus on them.
- **US-P3**: As a user, I want optional timed challenges for an extra push when I'm feeling motivated.

---

### 4.6 Profile & Settings

#### Profile Content

| Section          | Content                                                              |
|------------------|----------------------------------------------------------------------|
| **Stats Overview** | Total XP, current level, words learned, lessons completed, streak  |
| **Achievements** | Grid of earned badges with locked badges shown dimly                  |
| **Settings**     | Change language, daily goal, reset progress, toggle animations       |

#### Achievements / Badges

| Badge Name         | Condition                              | Icon  |
|--------------------|----------------------------------------|-------|
| First Steps        | Complete first lesson                  | 👣    |
| Week Warrior       | Maintain a 7-day streak               | 🔥    |
| Centurion          | Learn 100 words                        | 💯    |
| Perfectionist      | Get 100% accuracy on a lesson          | ⭐    |
| Polyglot Starter   | Start learning a second language       | 🌍    |
| Dedicated Learner  | Complete 25 lessons                    | 📖    |
| Streak Master      | Maintain a 30-day streak              | 🏆    |
| Vocabulary Builder | Learn 500 words                        | 📚    |
| Speed Demon        | Complete a timed challenge with 90%+   | ⚡    |
| Category Champion  | Complete all lessons in one category   | 🏅    |

#### User Stories

- **US-PR1**: As a user, I want to view my overall stats so I can see my learning journey.
- **US-PR2**: As a user, I want to see my achievements and know what's left to earn.
- **US-PR3**: As a user, I want to change my daily goal or language without losing progress.
- **US-PR4**: As a user, I want the option to reset my progress for a fresh start.

---

## 5. Gamification System

### 5.1 XP (Experience Points)

| Action                     | XP Awarded |
|----------------------------|------------|
| Correct answer (quiz/fill) | +10 XP     |
| Correct flashcard recall   | +5 XP      |
| Matching pair completed    | +15 XP     |
| Typing exercise correct    | +15 XP     |
| Streak bonus (per answer)  | +5 XP      |
| Lesson completion bonus    | +50 XP     |
| Timed challenge completion | +30 XP     |
| Perfect lesson (no mistakes)| +25 XP bonus|

### 5.2 Level System

| Level         | XP Range      | Icon  | Description                           |
|---------------|---------------|-------|---------------------------------------|
| **Seedling**  | 0 – 99        | 🌱    | Just getting started                  |
| **Sprout**    | 100 – 499     | 🌿    | Growing your roots                    |
| **Sapling**   | 500 – 1,499   | 🌳    | Building strong foundations           |
| **Tree**      | 1,500 – 4,999 | 🌲    | Standing tall with knowledge          |
| **Forest**    | 5,000+        | 🌲🌲🌲 | A master of the language             |

### 5.3 Streak System

- **Daily Streak**: Increments by 1 for each consecutive calendar day the user completes at least one lesson or practice session.
- **Streak Reset**: If `currentDate - lastActiveDate > 1 day`, streak resets to 0.
- **Streak Freeze** (future feature): Protect streak for one missed day.
- **Best Streak**: The highest streak ever achieved is tracked and displayed.

---

## 6. Success Metrics

| Metric                    | Target (MVP)      | Measurement                                       |
|---------------------------|-------------------|----------------------------------------------------|
| **Daily Active Users**    | Track trend       | Users who open the app and complete ≥1 exercise    |
| **Lesson Completion Rate**| ≥ 70%             | % of started lessons that reach the summary screen |
| **Avg Session Duration**  | ≥ 8 minutes       | Time from app open to last interaction             |
| **7-Day Retention**       | ≥ 40%             | % of new users returning within 7 days             |
| **Streak Maintenance**    | ≥ 30% at 7+ days  | % of active users maintaining a 7+ day streak      |

> [!NOTE]
> Since the MVP uses localStorage with no backend, metrics will initially be tracked via client-side analytics events (e.g., a lightweight analytics script or manual review). Post-MVP, a backend will enable proper telemetry.

---

## 7. Out of Scope (MVP)

The following features are explicitly **not** included in the MVP but are planned for future iterations:

| Feature                  | Reason for Deferral                                        | Priority  |
|--------------------------|------------------------------------------------------------|-----------|
| Backend / API            | MVP uses localStorage for speed; backend comes in v2       | High      |
| User Accounts / Auth     | Requires backend; MVP is anonymous/local                   | High      |
| Speech Recognition       | Requires Web Speech API tuning + complex UX                | Medium    |
| Audio Pronunciation      | Requires audio asset pipeline                              | Medium    |
| Real-time Multiplayer    | Requires backend + WebSocket infrastructure                | Low       |
| Native Mobile App        | Web-first; PWA possible as intermediate step               | Medium    |
| Social Features          | Leaderboards, friend challenges — requires backend         | Low       |
| Content Authoring Tool   | For community-contributed lessons — post-launch            | Low       |

---

## 8. User Flow Diagram

```
                    ┌─────────┐
                    │  Landing │
                    │   Page   │
                    └────┬─────┘
                         │
                    "Get Started"
                         │
                    ┌────▼─────┐
                    │Onboarding│
                    │ (5 steps)│
                    └────┬─────┘
                         │
                   ┌─────▼──────┐
              ┌────│  Dashboard  │────┐
              │    └─────┬───────┘    │
              │          │            │
         ┌────▼───┐ ┌───▼────┐  ┌────▼───┐
         │Practice│ │Lessons │  │Profile │
         │ Review │ │Browser │  │Settings│
         └────────┘ └───┬────┘  └────────┘
                        │
                  ┌─────▼──────┐
                  │  Lesson    │
                  │  Player    │
                  └─────┬──────┘
                        │
                  ┌─────▼──────┐
                  │  Lesson    │
                  │  Complete  │
                  └────────────┘
```

---

## 9. Release Plan

| Phase       | Milestone                                    | Timeline |
|-------------|----------------------------------------------|----------|
| **Phase 1** | Core infrastructure + onboarding + dashboard | Week 1–2 |
| **Phase 2** | Lesson browser + lesson player (all types)   | Week 3–4 |
| **Phase 3** | Practice mode + gamification + profile        | Week 5–6 |
| **Phase 4** | Polish, accessibility, testing, launch        | Week 7–8 |

---

## 10. Open Questions

| # | Question                                                     | Status    |
|---|--------------------------------------------------------------|-----------|
| 1 | Should we include audio pronunciation in MVP?                | Deferred  |
| 2 | Should category unlocking be linear or allow some branching? | Decided: hybrid (60% threshold) |
| 3 | How many lives per lesson? 3 or 5?                           | Decided: 3 |
| 4 | Should streak freeze be in MVP?                              | Deferred  |

---

*This document is the authoritative reference for LinguaFlow's MVP scope. All feature decisions should be validated against this PRD.*
