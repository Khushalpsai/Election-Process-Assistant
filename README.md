# 🗳️ VoteWise — India's Election Guide

**VoteWise** is an interactive civic education assistant that helps Indian citizens understand the election process — from voter registration to result declaration — in a simple, conversational, and engaging way.

🌐 **Live Site:** [https://votewise-1bfc7.web.app](https://votewise-1bfc7.web.app)

---

## ✨ Features

### Splash Screen
- Indian flag animation (saffron, white with Ashoka Chakra, green)
- Word-by-word loading text: *"Welcome to the Largest Democracy of the World"*
- Animated progress bar synced to text reveal

### Persona-based Onboarding
- Choose: 🗳️ First-time Voter, 🏛️ Curious Citizen, or 📋 Student/Researcher
- Assistant adapts its tone based on selection
- Persona displayed as plain text in the header (no background)

### Chat Assistant
- **Built-in Knowledge Engine** — works instantly, offline, zero configuration
- No API keys or setup needed — anyone can use it
- Covers 18+ election topics with detailed, accurate responses
- Follow-up suggestions after every response
- Contextual quick-action chips that update per topic

### Sidebar
- **Election Timeline** — 6 clickable phases: Registration → Nomination → Campaigning → Voting Day → Counting → Result
- **Live Election Data** — Real-time election news from Google News RSS (auto-refreshes every 10 min, falls back to static ECI data)
- **Did You Know?** — Rotating facts with **tricolor (saffron/white/green) arrow buttons** for manual navigation

### Design
- Premium dark mode UI (no unnecessary glows or backgrounds)
- Flat, minimal buttons with hover highlights
- Indian flag accent colors (Saffron #FF9933, Green #138808)
- Inter font with clean weight hierarchy
- Mobile responsive

---

## 📚 Topics Covered

| Topic | Keywords Detected |
|---|---|
| Voter ID & Registration | register, voter id, epic, form 6, nvsp |
| Candidate Nomination | nominate, candidate, eligibility, deposit, scrutiny |
| Campaigning & MCC | campaign, model code, conduct, rally, poll silence |
| EVM & VVPAT | evm, vvpat, electronic voting machine |
| NOTA | nota, none of the above |
| Voting Day Process | voting day, how to vote, step by step |
| Counting & Results | count, result, winner, majority, tally |
| Election Commission | eci, election commission |
| Documents for Voting | document, proof, id card |
| Polling Stations | booth, polling station, where to vote |
| Polling Hours | time, hours, open, close |
| Phone Rules | phone, camera, selfie |
| Voter Eligibility | age, 18, eligible, qualify |
| Election Phases | phase, schedule, how many |
| Postal Ballots & NRI | postal, nri, overseas |
| Indelible Ink | ink, indelible |
| Election Symbols | symbol, logo |
| Independent Candidates | independent, party |

---

## 🚀 Getting Started

### Run Locally
```bash
git clone https://github.com/Khushalpsai/Election-Process-Assistant.git
cd Election-Process-Assistant

# Start a local server (Python)
python -m http.server 5500

# Or use Node.js
npx serve .
```
Open **http://localhost:5500** in your browser.

**No API keys or configuration needed.** The app works fully offline with its built-in knowledge engine.

---

## 🌐 Deployment

### Live URL
**[https://votewise-1bfc7.web.app](https://votewise-1bfc7.web.app)**

### Hosting
Deployed on **Firebase Hosting** (Google Cloud) with:
- Automatic HTTPS
- Free tier (10 GB storage, 360 MB/day transfer)
- Global CDN for fast loading

### Continuous Deployment
GitHub Actions auto-deploy is configured. Every push to `main` triggers an automatic deployment:
```
Edit code → git push → Site updates in ~60 seconds
```
Workflow files: `.github/workflows/firebase-hosting-merge.yml`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Dark theme, animations, responsive layout |
| Vanilla JavaScript | App logic, knowledge engine, DOM management |
| RSS2JSON API | Live election news feed |
| Firebase Hosting | Production deployment + CDN |
| GitHub Actions | Continuous deployment pipeline |

---

## 📁 Project Structure

```
Election-Process-Assistant/
├── index.html                                    # Splash screen, onboarding, app shell
├── style.css                                     # Dark theme, animations, responsive
├── app.js                                        # Knowledge engine, chat, live data, facts
├── 404.html                                      # Firebase 404 page
├── firebase.json                                 # Firebase hosting config
├── .firebaserc                                   # Firebase project reference
├── .github/
│   └── workflows/
│       ├── firebase-hosting-merge.yml            # Auto-deploy on push to main
│       └── firebase-hosting-pull-request.yml     # Preview deploy on PRs
└── README.md
```

---

## 🏗️ Architecture Guide (for continuing agents)

### App Flow
```
Splash Screen (3s) → Onboarding (persona selection) → Main App (chat + sidebar)
```

### Key State (`state` object in app.js)
| Property | Type | Description |
|---|---|---|
| `persona` | string | `'first-voter'` / `'citizen'` / `'student'` |
| `activePhase` | string | Currently highlighted timeline phase |
| `isLoading` | boolean | Whether a response is being generated |
| `factIndex` | number | Current "Did You Know?" fact index |

### Key Functions
| Function | Purpose |
|---|---|
| `runSplashAnimation()` | Word-by-word text reveal + progress bar |
| `selectPersona(btn)` | Handles persona selection, transitions to main app |
| `sendMessage()` | Main chat handler — routes to knowledge engine |
| `getResponse(msg)` | Built-in knowledge engine with keyword matching |
| `fetchLiveElectionData()` | Fetches news via RSS2JSON, renders in sidebar |
| `detectPhase(text)` | Keyword-based phase detection for timeline |
| `activatePhase(name)` | Highlights timeline phase + updates chips |
| `renderChips(setName)` | Renders contextual suggestion chips |
| `nextFact()` / `prevFact()` | Tricolor arrow fact navigation |
| `formatText(text)` | Converts markdown-like text to HTML |

### CSS Custom Properties
| Variable | Purpose |
|---|---|
| `--bg-0` to `--bg-4` | Background depth layers (darkest → lightest) |
| `--saffron`, `--green` | Indian flag accent colors |
| `--text-1` to `--text-4` | Text hierarchy (brightest → dimmest) |
| `--border`, `--border-h` | Border variations |

### Extending the App
- **Add topics:** Add keyword arrays in `PHASE_KEYWORDS`, chip sets in `CHIP_SETS`, responses in `getResponse()`
- **Change theme:** Edit CSS custom properties in `:root`
- **Add sidebar sections:** Add `<div class="sidebar-section">` in `index.html`
- **Add AI:** Replace `getResponse()` with an LLM API call in `sendMessage()`

---

## 📄 License

This project is for educational purposes — helping Indian citizens understand their democratic rights and the election process.

---

**Made with 🇮🇳 for Indian Democracy**