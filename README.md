# 🗳️ VoteWise — India's Election Guide

**VoteWise** is an interactive, AI-powered civic education assistant that helps Indian citizens understand the election process — from voter registration to result declaration — in a simple, conversational, and engaging way.

---

## ✨ Features

- **Persona-based Onboarding** — Choose between First-time Voter, Curious Citizen, or Student/Researcher. The assistant adapts its tone and detail level accordingly.
- **Interactive Election Timeline** — Visual sidebar with 6 clickable phases (Registration → Nomination → Campaigning → Voting Day → Counting → Result) that glow when discussed.
- **AI Chat Assistant** — Ask anything about Indian elections and get clear, jargon-free answers powered by Google Gemini API (with smart fallback responses built-in).
- **Contextual Quick Actions** — Suggestion chips update based on the current topic being discussed.
- **Follow-up Suggestions** — Every response ends with a relevant follow-up question the user can click.
- **Did You Know?** — Rotating fact card with real Indian election trivia.
- **Share Button** — Share VoteWise with friends via Web Share API or clipboard.
- **Mobile Responsive** — Works great on phones, tablets, and desktop.

## 📚 Topics Covered

| Topic | Description |
|---|---|
| Voter ID & EPIC | Registration process, documents needed, Form 6 |
| Nomination | Candidate eligibility, security deposit, scrutiny |
| Campaigning | Model Code of Conduct (MCC), poll silence |
| EVM & VVPAT | How voting machines work, paper audit trail |
| NOTA | None Of The Above option explained |
| Voting Day | Step-by-step polling procedure |
| Counting & Results | Vote tallying, FPTP system, result declaration |
| Election Commission | Role, structure, and powers of the ECI |

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
Then open **http://localhost:5500** in your browser.

### Connect AI (Optional)
Open `app.js` and replace:
```js
const API_KEY = 'YOUR_GEMINI_API_KEY';
```
with your Gemini API key. Without it, the app uses built-in curated responses for all key election topics.

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, animations, responsive design
- **Vanilla JavaScript** — No frameworks, zero dependencies
- **Google Gemini API** — AI-powered chat responses (optional)

## 🎨 Design

- Indian flag-inspired palette: saffron, white, green accents with navy blue
- Clean Inter font family
- Subtle animations and micro-interactions
- Glassmorphism effects on onboarding
- Fully responsive for all screen sizes

## 📁 Project Structure

```
Election-Process-Assistant/
├── index.html    # Main HTML structure
├── style.css     # All styles and animations
├── app.js        # App logic, chat, API integration
└── README.md     # This file
```

## 📄 License

This project is for educational purposes — helping Indian citizens understand their democratic rights and the election process.

---

**Made with 🇮🇳 for Indian Democracy**