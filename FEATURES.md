# 🗳️ VoteWise — Complete Feature Documentation

> **VoteWise** is an interactive civic education web application that helps Indian citizens understand the Indian election process — from voter registration to result declaration.
>
> 🌐 Live: [https://votewise-1bfc7.web.app](https://votewise-1bfc7.web.app)

---

## Table of Contents

1. [Splash / Loading Screen](#1-splash--loading-screen)
2. [Persona-Based Onboarding](#2-persona-based-onboarding)
3. [Chat Assistant (Knowledge Engine)](#3-chat-assistant-knowledge-engine)
4. [Election Timeline Sidebar](#4-election-timeline-sidebar)
5. [Live Election Data Feed](#5-live-election-data-feed)
6. [Did You Know? — Facts Carousel](#6-did-you-know--facts-carousel)
7. [Quick-Action Suggestion Chips](#7-quick-action-suggestion-chips)
8. [Share Functionality](#8-share-functionality)
9. [Design System & Visual Identity](#9-design-system--visual-identity)
10. [Responsive Design](#10-responsive-design)
11. [Deployment & CI/CD](#11-deployment--cicd)
12. [Technical Architecture](#12-technical-architecture)
13. [Knowledge Base — Topics Covered](#13-knowledge-base--topics-covered)

---

## 1. Splash / Loading Screen

The app opens with a cinematic, full-screen splash experience designed to set the patriotic tone of the application.

### Features

| Feature | Description |
|---|---|
| **Waving Flag Video Background** | A full-screen looping video of the Indian tricolour waving, sourced from Pexels, serves as the background. Auto-plays silently on all devices. |
| **Gradient Dark Overlay** | A three-stop gradient overlay (55% → 40% → 65% opacity) ensures text readability while preserving the video's visual impact. |
| **Text-as-Loading-Bar** | The phrase **"WELCOME TO THE BIGGEST DEMOCRACY IN THE WORLD"** itself acts as the loading indicator — no separate progress bar. |
| **Premium Typography** | Uses **Cinzel** (Google Fonts) — a clean, architectural serif inspired by Roman inscriptions, with generous 8px letter-spacing and 500 weight. |
| **Clip-Path Reveal Animation** | The text fills left-to-right using CSS `clip-path: inset()` transitions over 16 smooth steps (~4 seconds total). |
| **Shell + Fill Layering** | Two overlapping text layers — a dim "shell" (12% opacity white) shows the full text outline, while the "fill" layer (95% white with subtle glow) reveals progressively on top. |
| **Smooth Fade Transition** | After the text is fully revealed, a 1-second pause precedes a 600ms fade-out into the onboarding screen. |

### Technical Details
- Video: `autoplay`, `muted`, `loop`, `playsinline` attributes for cross-browser/mobile compatibility
- Animation: 16 steps × 250ms = 4 seconds, using `cubic-bezier(0.4, 0, 0.2, 1)` easing
- Font: Cinzel 500 weight, `clamp(1.2rem, 3.2vw, 2.4rem)` responsive sizing

---

## 2. Persona-Based Onboarding

After the splash screen, users select their identity to personalise the experience.

### Features

| Feature | Description |
|---|---|
| **Three Persona Options** | 🗳️ **First-time Voter** — simplified, gentle guidance · 🏛️ **Curious Citizen** — balanced explanations · 📋 **Student / Researcher** — detailed, factual responses |
| **Personalised Welcome Message** | Each persona receives a unique welcome message tailored to their knowledge level and interests. |
| **Persona Badge in Header** | Selected persona (icon + label) is displayed in the app header throughout the session. |
| **Smooth Screen Transition** | Onboarding overlay fades out (400ms) before revealing the main app. |

### Persona Impact on Content
- **First-time Voter**: Uses simple language, step-by-step guidance, encouraging tone ("Don't worry — I'll walk you through everything")
- **Curious Citizen**: Balanced depth, plain language, invites exploration
- **Student / Researcher**: References specific acts (RPA), technical details (EVM mechanics, MCC enforcement), encourages detailed questions

---

## 3. Chat Assistant (Knowledge Engine)

The core of VoteWise — a conversational interface for asking questions about Indian elections.

### Features

| Feature | Description |
|---|---|
| **Hybrid Chat Engine** | Choose between the built-in offline engine or "Smart Mode" powered by the Google Gemini API. |
| **Smart Mode (Gemini API)** | Users can provide their own free Gemini API key to unlock real AI that answers any nuanced edge-case questions. |
| **Local Fallback** | If the API key is missing or invalid, the app gracefully falls back to the local knowledge engine seamlessly. |
| **Built-in Knowledge Engine** | 18+ topic areas answered instantly using keyword matching — works fully offline with zero setup. |
| **Rich Text Formatting** | Responses include **bold text**, *italics*, bulleted lists, numbered steps, and emoji indicators. |
| **Follow-Up Suggestions** | Every response includes a contextual "You might also ask:" follow-up chip to guide the conversation forward. |
| **Typing Indicator** | Three bouncing dots appear during a simulated response delay (600–1000ms) for a natural feel. |
| **Auto-Phase Detection** | Keywords in user messages automatically highlight the corresponding election phase on the sidebar timeline. |
| **Markdown-to-HTML Rendering** | Internal Markdown parser converts `**bold**`, `*italic*`, bullet points, and numbered lists to formatted HTML. |
| **User & Bot Avatars** | User messages show the persona icon; bot messages show the ☸ (Ashoka Chakra) symbol. |
| **Input Validation** | Empty messages are blocked; input is disabled during response generation to prevent double-sends. |
| **XSS Protection** | All user input is HTML-escaped before rendering (`escHtml()` function). |

---

## 4. Election Timeline Sidebar

A vertical, interactive timeline of the 6 major phases of an Indian election.

### Features

| Feature | Description |
|---|---|
| **6 Election Phases** | 📝 Registration → 🏅 Nomination → 📣 Campaigning → 🗳️ Voting Day → 🔢 Counting → 🏆 Result |
| **Clickable Navigation** | Clicking any phase auto-sends a relevant question to the chat (e.g., clicking "Voting Day" asks: *"Walk me through the Voting Day process step by step"*). |
| **Active Phase Highlighting** | The current phase is highlighted with a saffron-tinted background and accent border; phase label turns saffron. |
| **Auto-Detection** | Phases automatically activate based on keywords in user messages or bot responses. |
| **Connected Vertical Lines** | Phases are visually connected by vertical lines with emoji-decorated dots. |
| **Smooth Scroll-Into-View** | Active phase auto-scrolls into the sidebar viewport. |

---

## 5. Live Election Data Feed

Real-time election news displayed in the sidebar, powered by Google News RSS.

### Features

| Feature | Description |
|---|---|
| **Live News Cards** | Up to 3 recent election-related news items from Google News RSS, rendered as compact cards. |
| **Relative Timestamps** | Each card shows time elapsed (e.g., "5 min ago", "3 hours ago", "2 days ago"). |
| **Read More Links** | Direct links to full articles, opening in new tabs. |
| **Auto-Refresh** | Data refreshes automatically every 10 minutes. |
| **Graceful Fallback** | If the RSS feed fails, static data is shown: Registered Voters (~969 Million), Lok Sabha Seats (543), Polling Stations (~10.5 Lakh). All sourced from ECI. |
| **Shimmer Loading State** | A skeleton loader with shimmer animation displays while data is being fetched. |
| **Live Indicator** | A pulsating red dot next to the section title indicates real-time data. |

### Data Source
- **API**: RSS2JSON (`api.rss2json.com`) converting Google News RSS
- **Query**: `india election commission` (English, India region)
- **Fallback**: Static ECI statistics

---

## 6. Did You Know? — Facts Carousel

A rotating collection of 10 fascinating facts about Indian democracy.

### Features

| Feature | Description |
|---|---|
| **10 Curated Facts** | Covering voter statistics, EVM history, NOTA, ECI founding, VVPAT, phased elections, and more. |
| **Tricolour Arrow Navigation** | Left/right arrows styled as the Indian flag (saffron/white/green bands) with `clip-path` triangle shapes. |
| **Auto-Rotation** | Facts rotate every 30 seconds automatically. |
| **Manual Navigation** | Users can click arrows to go forward/backward through facts. |
| **Dot Indicators** | 10 dots below the fact text show current position; active dot is saffron-coloured. |
| **Fade Transition** | Facts fade out (300ms) before the new fact fades in. |

### Facts Included
1. India has over 960 million registered voters
2. First general election (1951–52) took 4 months
3. EVMs first used nationwide in 1999
4. Over 1 million polling booths across India
5. MCC activates when election dates are announced
6. NOTA introduced in 2013 by Supreme Court
7. Every citizen above 18 can vote regardless of education/income
8. ECI established January 25, 1950
9. VVPAT prints a paper slip for vote verification
10. Elections conducted in phases for security deployment

---

## 7. Quick-Action Suggestion Chips

Contextual, one-tap buttons below the chat for quick navigation.

### Features

| Feature | Description |
|---|---|
| **7 Context-Specific Chip Sets** | Chips change based on the active election phase (default, registration, nomination, campaigning, voting, counting, result). |
| **28 Total Quick Actions** | 4 chips per set × 7 sets = 28 unique quick-start questions. |
| **Emoji Icons** | Each chip is prefixed with a relevant emoji for quick visual scanning. |
| **One-Tap Messaging** | Tapping a chip auto-fills and sends the message — no typing needed. |

### Chip Sets

| Phase | Chips |
|---|---|
| **Default** | How do I register to vote? · What is EVM? · What happens on Voting Day? · What is NOTA? |
| **Registration** | What documents do I need? · Can I vote without Voter ID? · How to check my name? · What is Form 6? |
| **Nomination** | Who can be a candidate? · What is security deposit? · What is scrutiny? · Can independents contest? |
| **Campaigning** | What is MCC? · When does campaigning stop? · What is poll silence? · Can celebs campaign? |
| **Voting** | How does EVM work? · What is VVPAT? · What is NOTA? · What to bring to booth? |
| **Counting** | How are votes counted? · What are postal ballots? · Who observes counting? · When are results announced? |
| **Result** | Who forms government? · What if no majority? · Can results be challenged? · ECI's role after results? |

---

## 8. Share Functionality

### Features

| Feature | Description |
|---|---|
| **Web Share API** | On supported devices (mobile), uses the native share sheet. |
| **Clipboard Fallback** | On desktop, copies the app URL to clipboard. |
| **Toast Notification** | "Link copied!" confirmation appears as a bottom-center pill toast (3 seconds). |
| **Share Text** | Pre-composed message: *"🗳️ Check out VoteWise — an interactive guide to India's election process!"* |

---

## 9. Design System & Visual Identity

### Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-0` | `#07090F` | Deepest background |
| `--bg-1` | `#0C1017` | Header, sidebar, input bar |
| `--bg-2` | `#111620` | Cards, message bubbles |
| `--bg-3` | `#171D2A` | Buttons, hover states |
| `--bg-4` | `#1D2535` | Active states |
| `--saffron` | `#FF9933` | Primary accent (Indian flag) |
| `--green` | `#138808` | Secondary accent (Indian flag) |
| `--text-1` | `#E8ECF4` | Primary text |
| `--text-2` | `#99A3B8` | Secondary text |
| `--text-3` | `#5E6A82` | Tertiary text |
| `--text-4` | `#3A4258` | Dimmest text, placeholders |

### Typography

| Font | Usage |
|---|---|
| **Cinzel** (Google Fonts) | Splash screen headline — clean architectural serif |
| **Inter** (Google Fonts) | All app UI — modern sans-serif with 8 weight levels (300–900) |

### Design Principles
- **Premium Dark Mode** — Deep navy-black backgrounds with subtle layering
- **Flat & Minimal** — No drop shadows, glows, or glassmorphism
- **Indian Flag Accents** — Saffron and green used sparingly for emphasis
- **Clean Typography** — Consistent weight hierarchy, anti-aliased rendering
- **Smooth Transitions** — All interactions use 200ms `cubic-bezier(0.4,0,0.2,1)` easing

---

## 10. Responsive Design

### Breakpoints

| Breakpoint | Adaptations |
|---|---|
| **≤ 768px** | Sidebar hidden · Chat area full-width · Header tagline hidden · Messages expand to 90% width · Splash text scales down |
| **≤ 480px** | Persona button icons shrink · Logo text reduces |

### Mobile Optimisations
- Touch-friendly button sizes
- Video background uses `playsinline` for iOS Safari
- Splash text uses `clamp()` for fluid font sizing
- Reduced letter-spacing on mobile for better fit

---

## 11. Deployment & CI/CD

### Hosting
| Detail | Value |
|---|---|
| **Platform** | Firebase Hosting (Google Cloud) |
| **URL** | [https://votewise-1bfc7.web.app](https://votewise-1bfc7.web.app) |
| **SSL** | Automatic HTTPS |
| **CDN** | Global edge caching |
| **Tier** | Free (10 GB storage, 360 MB/day transfer) |
| **Branding** | "Powered by Firebase 🔥" indicator in the app header |

### Continuous Deployment
| Detail | Value |
|---|---|
| **Provider** | GitHub Actions |
| **Trigger** | Every push to `main` branch |
| **Deploy Time** | ~60 seconds |
| **PR Previews** | Auto-generated preview URLs on pull requests |
| **Workflow File** | `.github/workflows/firebase-hosting-merge.yml` |

### Deployment Flow
```
Code edit → git push → GitHub Actions triggers → Firebase deploys → Site live in ~60s
```

---

## 12. Technical Architecture

### Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure, accessibility attributes |
| **CSS3** | Custom properties, clip-path animations, responsive layouts |
| **Vanilla JavaScript** | App logic, knowledge engine, DOM management |
| **RSS2JSON API** | Converts Google News RSS to JSON for live data |
| **Pexels Video CDN** | Splash screen waving flag video |
| **Google Fonts** | Cinzel + Inter typefaces |
| **Google Gemini API** | (Optional) Powers "Smart Mode" for generative AI responses |
| **Firebase Hosting** | Production deployment with global CDN |
| **GitHub Actions** | Automated CI/CD pipeline |

### Application Flow
```
Splash Screen (4s) → Onboarding (persona selection) → Main App (chat + sidebar)
```

### State Management
| Property | Type | Description |
|---|---|---|
| `state.persona` | `string` | `'first-voter'` / `'citizen'` / `'student'` |
| `state.activePhase` | `string` | Currently highlighted timeline phase |
| `state.isLoading` | `boolean` | Whether a response is being generated |
| `state.factIndex` | `number` | Current "Did You Know?" fact index |

### File Structure
```
Election-Process-Assistant/
├── index.html          ← Splash, onboarding, app shell (231 lines)
├── style.css           ← Dark theme, animations, responsive (608 lines)
├── app.js              ← Knowledge engine, chat, live data (455 lines)
├── 404.html            ← Firebase 404 page
├── firebase.json       ← Firebase hosting config
├── .firebaserc         ← Firebase project reference
├── FEATURES.md         ← This document
├── README.md           ← Project overview
└── .github/workflows/
    ├── firebase-hosting-merge.yml         ← Auto-deploy on push
    └── firebase-hosting-pull-request.yml  ← Preview on PRs
```

---

## 13. Knowledge Base — Topics Covered

The built-in knowledge engine covers **18+ topics** across the entire Indian election process:

| # | Topic | Keywords Detected | Key Information |
|---|---|---|---|
| 1 | **Voter Registration** | register, voter id, epic, form 6, nvsp | NVSP portal, Form 6, BLO verification, 4–6 week process |
| 2 | **EVM (Electronic Voting Machine)** | evm | Control unit + ballot unit, tamper-evident, battery-powered |
| 3 | **NOTA** | nota | Introduced 2013, Supreme Court order, valid secret vote |
| 4 | **Model Code of Conduct** | mcc, model code | Activates on date announcement, poll silence 48hrs before |
| 5 | **Voting Day Process** | voting day, how to vote, step | 7-step process from queue to VVPAT verification |
| 6 | **Counting & Results** | count, result, winner | FPTP system, Form 20, 272+ seats for government |
| 7 | **Election Commission of India** | eci, election commission | Est. Jan 25 1950, CEC + 2 commissioners |
| 8 | **Documents for Voting** | document, proof, id card | 12 accepted ID documents listed |
| 9 | **Independent Candidates** | independent, party | ₹25K deposit, 10 proposers, free symbol allocation |
| 10 | **Election Phases** | phase, how many, schedule | 5–7 phases, security-driven scheduling |
| 11 | **Postal Ballots & NRI Voting** | postal, nri, overseas | Armed forces, 80+ age, PwD eligible |
| 12 | **Indelible Ink** | ink, indelible | Mysore Paints, silver nitrate, 2–4 weeks visible |
| 13 | **Election Symbols** | symbol, logo | National/state/independent allocation, Symbols Order 1968 |
| 14 | **Polling Stations** | booth, where, polling station | NVSP, Voter Helpline App, 1950 helpline |
| 15 | **Polling Hours** | time, hours, open, close | 7 AM – 6 PM, must vote if in queue before closing |
| 16 | **Phone Rules at Booth** | phone, camera, selfie | Phones banned, Section 128 RPA, up to 3 months prison |
| 17 | **Voter Eligibility** | age, 18, eligible, qualify | 18+, Indian citizen, constituency resident |
| 18 | **General Fallback** | *(any unmatched query)* | Lists all available topics with suggestions |

---

## Summary Statistics

| Metric | Value |
|---|---|
| **Total Lines of Code** | ~1,294 (HTML + CSS + JS) |
| **Knowledge Topics** | 18+ |
| **Quick-Action Chips** | 28 |
| **Election Facts** | 10 |
| **Persona Types** | 3 |
| **Timeline Phases** | 6 |
| **External Dependencies** | 0 (no npm packages) |
| **API Keys Required** | Optional (Gemini API for Smart Mode) |
| **Frameworks Used** | 0 (pure HTML/CSS/JS) |

---

**Made with 🇮🇳 for Indian Democracy**
