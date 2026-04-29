# 🗳️ VoteWise — India's Election Guide

**VoteWise** is an interactive, AI-powered civic education assistant that helps Indian citizens understand the election process — from voter registration to result declaration — in a simple, conversational, and engaging way.

---

## ✨ Features

### Core
- **Splash Loading Screen** — Indian flag animation + word-by-word loading text "Welcome to the Largest Democracy of the World" with a progress bar
- **Persona-based Onboarding** — Choose First-time Voter, Curious Citizen, or Student/Researcher; the assistant adapts its tone accordingly
- **AI Chat Assistant** — Conversational interface powered by Google Gemini API (with comprehensive built-in fallback responses)
- **Interactive Election Timeline** — Left sidebar with 6 clickable phases that highlight when the topic is discussed

### Sidebar
- **Election Timeline** — Visual timeline: Registration → Nomination → Campaigning → Voting Day → Counting → Result
- **Live Election Data** — Real-time election news fetched from Google News RSS (auto-refreshes every 10 minutes)
- **Did You Know?** — Rotating fact card with Indian election trivia (rotates every 30 seconds)

### Chat
- **Contextual Quick Actions** — Suggestion chips update based on the current election phase being discussed
- **Follow-up Suggestions** — Every bot response ends with a clickable follow-up question
- **Phase Detection** — Keywords in messages automatically highlight the corresponding timeline phase

### Other
- **Share Button** — Web Share API with clipboard fallback
- **Mobile Responsive** — Fully responsive for phones, tablets, and desktop
- **Clean Dark UI** — Premium dark mode with minimal, flat design; no unnecessary glows or backgrounds

---

## 📚 Topics Covered

| Topic | Description |
|---|---|
| Voter ID & EPIC | Registration process, documents needed, Form 6, NVSP portal |
| Nomination | Candidate eligibility, security deposit, scrutiny process |
| Campaigning | Model Code of Conduct (MCC), poll silence rules |
| EVM & VVPAT | How electronic voting machines work, paper audit trail |
| NOTA | None Of The Above option — what it is and how it works |
| Voting Day | Step-by-step polling procedure, what to bring |
| Counting & Results | Vote tallying, FPTP system, result declaration |
| Election Commission | Role, structure, and powers of the ECI |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- (Optional) A [Google Gemini API key](https://aistudio.google.com/) for live AI responses

### Run Locally
```bash
# Clone the repository
git clone https://github.com/Khushalpsai/Election-Process-Assistant.git
cd Election-Process-Assistant

# Start a local server (Python)
python -m http.server 5500

# Or use Node.js
npx serve .
```
Open **http://localhost:5500** in your browser.

### Connect AI (Optional)
In `app.js`, find this line and replace with your key:
```js
const API_KEY = 'YOUR_GEMINI_API_KEY';
```
Without a key, the app uses built-in curated responses for all major topics.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure |
| CSS3 | Custom properties, animations, dark theme, responsive |
| Vanilla JavaScript | Zero-dependency app logic |
| Google Gemini API | AI chat responses (optional) |
| RSS2JSON API | Live election news feed |

---

## 📁 Project Structure

```
Election-Process-Assistant/
├── index.html          # Main HTML — splash screen, onboarding, app shell
├── style.css           # Complete styling — dark theme, animations, responsive
├── app.js              # All app logic — splash, chat, API, live data, facts
└── README.md           # This documentation file
```

---

## 🏗️ Architecture & Code Guide (for continuing agents)

### App Flow
```
Splash Screen (3s) → Onboarding (persona selection) → Main App
```

### Key State (`state` object in app.js)
| Property | Type | Description |
|---|---|---|
| `persona` | string | `'first-voter'` / `'citizen'` / `'student'` |
| `activePhase` | string | Currently highlighted timeline phase |
| `conversationHistory` | array | Chat messages for LLM context (last 8 turns) |
| `isLoading` | boolean | Whether a message is being processed |
| `factIndex` | number | Current "Did You Know?" fact index |

### Key Functions
| Function | File | Purpose |
|---|---|---|
| `runSplashAnimation()` | app.js | Word-by-word text reveal + progress bar |
| `selectPersona(btn)` | app.js | Handles persona selection, transitions to main app |
| `sendMessage()` | app.js | Main chat handler — sends to LLM, renders response |
| `callLLM(msg)` | app.js | Gemini API call with system prompt + persona context |
| `getFallbackResponse(msg)` | app.js | Built-in responses for all topics (no API needed) |
| `fetchLiveElectionData()` | app.js | Fetches news via RSS2JSON, renders in sidebar |
| `detectPhase(text)` | app.js | Keyword-based phase detection for timeline highlighting |
| `activatePhase(name)` | app.js | Highlights timeline phase + updates suggestion chips |
| `renderChips(setName)` | app.js | Renders contextual suggestion chips below chat |
| `formatText(text)` | app.js | Converts markdown-like text to HTML |

### CSS Architecture
The stylesheet uses CSS custom properties for theming:
- `--bg-0` through `--bg-4`: Background depth layers (darkest to lightest)
- `--saffron`, `--green`: Indian flag accent colors
- `--text-1` through `--text-4`: Text hierarchy (brightest to dimmest)
- `--border`, `--border-h`, `--border-accent`: Border variations

### API Integration Points
1. **Gemini LLM** (`callLLM()`): POST to `generativelanguage.googleapis.com`. System prompt includes persona context. Falls back to `getFallbackResponse()` if key not set.
2. **RSS2JSON** (`fetchLiveElectionData()`): GET from `api.rss2json.com` with Google News RSS for "india election commission". Falls back to static ECI data cards. Auto-refreshes every 10 minutes.

### Extending the App
- **Add new topics**: Add keyword arrays in `PHASE_KEYWORDS`, add chip sets in `CHIP_SETS`, add fallback responses in `getFallbackResponse()`.
- **Change theme**: All colors are CSS custom properties in `:root` — edit `style.css`.
- **Add new sidebar sections**: Add a `<div class="sidebar-section">` in `index.html`.
- **Swap LLM provider**: Modify `callLLM()` in `app.js` — it just needs to return a string.

---

## 🎨 Design Philosophy

- **Dark Mode**: Deep blacks (#07090F base) with subtle elevation layers
- **Minimal**: No unnecessary glows, shadows, or glassmorphism effects
- **Flat Buttons**: Clean, border-only buttons that highlight on hover
- **Indian Flag Colors**: Saffron (#FF9933) as primary accent, Green (#138808) as secondary
- **Typography**: Inter font, weight hierarchy from 400–800
- **Persona Badge**: Plain text in header — no background pill or container

---

## 📄 License

This project is for educational purposes — helping Indian citizens understand their democratic rights and the election process.

---

**Made with 🇮🇳 for Indian Democracy**