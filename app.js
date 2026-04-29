/* =============================================
   VOTEWISE — APP LOGIC v2
   ============================================= */

const state = {
  persona: null,
  activePhase: null,
  conversationHistory: [],
  isLoading: false,
  factIndex: 0,
};

const PERSONA_META = {
  'first-voter': { icon: '🗳️', label: 'First-time Voter' },
  'citizen':     { icon: '🏛️', label: 'Curious Citizen' },
  'student':     { icon: '📋', label: 'Student / Researcher' },
};

const FACTS = [
  "India has over 960 million registered voters — the largest electorate in the world!",
  "India's first general election (1951–52) had 173 million voters and took 4 months to complete.",
  "The Electronic Voting Machine (EVM) was first used nationwide in India in 1999.",
  "India uses over 1 million polling booths spread across the country during general elections.",
  "The Model Code of Conduct (MCC) kicks in the moment election dates are announced.",
  "NOTA (None Of The Above) was introduced in Indian elections in 2013 by Supreme Court order.",
  "Every Indian citizen above 18 years is eligible to vote — regardless of education or income.",
  "The Election Commission of India was established on January 25, 1950 — one day before India became a republic.",
  "VVPAT machines print a paper slip so voters can verify their vote was cast correctly.",
  "India conducts elections in phases to deploy enough security forces across the nation.",
];

const PHASE_KEYWORDS = {
  registration: ['register', 'voter id', 'epic', 'form 6', 'enroll', 'roll', 'nvsp', 'booth level officer'],
  nomination:   ['nominate', 'nomination', 'candidate', 'eligib', 'affidavit', 'deposit', 'scrutiny', 'contest'],
  campaigning:  ['campaign', 'mcc', 'model code', 'conduct', 'rally', 'advertise', 'poll', 'silence'],
  voting:       ['vote', 'voting', 'evm', 'vvpat', 'booth', 'polling', 'nota', 'ink', 'ballot'],
  counting:     ['count', 'tally', 'strong room', 'observer', 'postal ballot', 'trend'],
  result:       ['result', 'winner', 'declare', 'elected', 'oath', 'form government', 'majority'],
};

const CHIP_SETS = {
  default: [
    { text: "How do I register to vote?", icon: "📝" },
    { text: "What is EVM?", icon: "🖥️" },
    { text: "What happens on Voting Day?", icon: "🗳️" },
    { text: "What is NOTA?", icon: "❌" },
  ],
  registration: [
    { text: "What documents do I need?", icon: "📄" },
    { text: "Can I vote without Voter ID?", icon: "🪪" },
    { text: "How to check my name on voter list?", icon: "🔍" },
    { text: "What is Form 6?", icon: "📋" },
  ],
  nomination: [
    { text: "Who can be a candidate?", icon: "🏅" },
    { text: "What is security deposit?", icon: "💰" },
    { text: "What is candidate scrutiny?", icon: "🔎" },
    { text: "Can independent candidates contest?", icon: "🤝" },
  ],
  campaigning: [
    { text: "What is Model Code of Conduct?", icon: "📜" },
    { text: "When does campaigning stop?", icon: "🔇" },
    { text: "What is poll silence?", icon: "🤫" },
    { text: "Can celebs campaign for parties?", icon: "⭐" },
  ],
  voting: [
    { text: "How does EVM work?", icon: "🖥️" },
    { text: "What is VVPAT?", icon: "🧾" },
    { text: "What is NOTA?", icon: "❌" },
    { text: "What to bring to voting booth?", icon: "👜" },
  ],
  counting: [
    { text: "How are votes counted?", icon: "🔢" },
    { text: "What are postal ballots?", icon: "📬" },
    { text: "Who observes counting?", icon: "👁️" },
    { text: "When are results announced?", icon: "📢" },
  ],
  result: [
    { text: "Who forms the government?", icon: "🏛️" },
    { text: "What if no one gets majority?", icon: "🤔" },
    { text: "Can results be challenged?", icon: "⚖️" },
    { text: "What is the role of ECI after results?", icon: "📊" },
  ],
};

const SYSTEM_PROMPT = `You are VoteWise, a friendly civic education assistant for Indian citizens. You explain India's election process clearly and simply. You cover voter registration, nominations, campaigning rules, EVMs, NOTA, voting day procedures, vote counting, and the role of the ECI. Always use simple, conversational language. Avoid legal jargon — if you must use a term, explain it in brackets.

User persona context will be given. Rules by persona:
- First-time Voter: Be extra gentle, encouraging, and reassuring. Use relatable analogies.
- Curious Citizen: Be informative and engaging, like explaining to a curious friend.
- Student/Researcher: Be more detailed, factual, cite specific acts or rules where relevant.

IMPORTANT: Always end every response with a section like this (literally, at the very end):
FOLLOWUP: [One helpful follow-up question the user might want to ask, phrased as a question, max 10 words]

Do not use markdown headers (###). Use *bold* for emphasis. Keep responses concise but complete — 3 to 6 paragraphs max. If the user asks something completely unrelated to Indian elections, politely decline and steer them back.`;

// ── SPLASH SCREEN ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  runSplashAnimation();
});

function runSplashAnimation() {
  const words = document.querySelectorAll('.splash-word');
  const bar = document.getElementById('splash-bar-fill');
  const total = words.length;
  let i = 0;

  const interval = setInterval(() => {
    if (i < total) {
      words[i].classList.add('lit');
      bar.style.width = `${((i + 1) / total) * 100}%`;
      i++;
    } else {
      clearInterval(interval);
      setTimeout(endSplash, 600);
    }
  }, 350);
}

function endSplash() {
  const splash = document.getElementById('splash-screen');
  splash.classList.add('fade-out');
  setTimeout(() => {
    splash.classList.remove('active', 'fade-out');
    const onboarding = document.getElementById('onboarding-overlay');
    onboarding.classList.add('active');
  }, 600);
}

// ── ONBOARDING ─────────────────────────────────
function selectPersona(btn) {
  state.persona = btn.dataset.persona;
  const meta = PERSONA_META[state.persona];
  document.getElementById('persona-icon-display').textContent = meta.icon;
  document.getElementById('persona-label-display').textContent = meta.label;

  const overlay = document.getElementById('onboarding-overlay');
  overlay.classList.add('fade-out');
  setTimeout(() => {
    overlay.classList.remove('active', 'fade-out');
    document.getElementById('app').classList.remove('hidden');
    initApp();
  }, 400);
}

// ── INIT ───────────────────────────────────────
function initApp() {
  renderChips('default');
  startFactRotation();
  sendWelcomeMessage();
  fetchLiveElectionData();
}

function sendWelcomeMessage() {
  const greetings = {
    'first-voter': `🎉 Welcome! I'm **VoteWise** — your personal guide to India's election process.\n\nAs a first-time voter, you're about to be part of something incredible: the world's largest democracy! Don't worry — I'll walk you through everything step by step, in simple words.\n\nYou can ask me anything, tap any phase on the timeline, or use the quick buttons below. Where would you like to start?`,
    'citizen':     `🙏 Welcome to **VoteWise**! Great to have a curious citizen here.\n\nIndia's election process is a fascinating and complex democracy at work. From voter registration to result declaration, I'm here to break it all down for you in plain language.\n\nAsk me anything, or pick a topic from the timeline on the left!`,
    'student':     `📚 Welcome to **VoteWise**! Perfect for research and study.\n\nI can walk you through the entire Indian election process in detail — covering the Representation of the People Act, ECI guidelines, EVM mechanics, MCC enforcement, and more.\n\nFeel free to ask detailed questions. Use the timeline to navigate phases!`,
  };
  appendBotMessage(formatText(greetings[state.persona] || greetings['citizen']), null, false);
}

// ── LIVE ELECTION DATA ─────────────────────────
async function fetchLiveElectionData() {
  const container = document.getElementById('live-data-cards');
  try {
    // Fetch election-related news from a public RSS-to-JSON proxy
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dindia%2520election%2520commission%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN%3Aen');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const items = (data.items || []).slice(0, 3);

    if (items.length === 0) throw new Error('no items');

    container.innerHTML = items.map(item => {
      const date = new Date(item.pubDate);
      const ago = timeAgo(date);
      return `<div class="live-card">
        <div class="live-card-title">${ago}</div>
        <div class="live-card-value">${escHtml(item.title)}</div>
        <div class="live-card-source"><a href="${escHtml(item.link)}" target="_blank" rel="noopener">Read more →</a></div>
      </div>`;
    }).join('');
  } catch (e) {
    // Fallback static data
    container.innerHTML = `
      <div class="live-card">
        <div class="live-card-title">Registered Voters</div>
        <div class="live-card-value">~969 Million</div>
        <div class="live-card-source"><a href="https://eci.gov.in" target="_blank" rel="noopener">Source: ECI</a></div>
      </div>
      <div class="live-card">
        <div class="live-card-title">Lok Sabha Seats</div>
        <div class="live-card-value">543 Constituencies</div>
        <div class="live-card-source"><a href="https://eci.gov.in" target="_blank" rel="noopener">Source: ECI</a></div>
      </div>
      <div class="live-card">
        <div class="live-card-title">Polling Stations</div>
        <div class="live-card-value">~10.5 Lakh Booths</div>
        <div class="live-card-source"><a href="https://eci.gov.in" target="_blank" rel="noopener">Source: ECI</a></div>
      </div>`;
  }
  // Refresh every 10 minutes
  setTimeout(fetchLiveElectionData, 600000);
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// ── PHASE MANAGEMENT ───────────────────────────
function detectPhase(text) {
  const lower = text.toLowerCase();
  for (const [phase, keywords] of Object.entries(PHASE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return phase;
  }
  return null;
}

function activatePhase(phaseName) {
  if (state.activePhase === phaseName) return;
  state.activePhase = phaseName;
  document.querySelectorAll('.timeline-phase').forEach(el => el.classList.remove('active'));
  if (phaseName) {
    const el = document.getElementById(`phase-${phaseName}`);
    if (el) {
      el.classList.add('active');
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    renderChips(phaseName in CHIP_SETS ? phaseName : 'default');
  }
}

function jumpToPhase(el) {
  const phase = el.dataset.phase;
  const q = {
    registration: "Tell me about voter registration and getting a Voter ID",
    nomination:   "How does candidate nomination work in Indian elections?",
    campaigning:  "What is the Model Code of Conduct during election campaigning?",
    voting:       "Walk me through the Voting Day process step by step",
    counting:     "How does vote counting work after elections?",
    result:       "How are election results declared and who forms the government?",
  };
  if (q[phase]) {
    document.getElementById('chat-input').value = q[phase];
    sendMessage();
  }
}

// ── CHIPS ──────────────────────────────────────
function renderChips(setName) {
  const chips = CHIP_SETS[setName] || CHIP_SETS.default;
  document.getElementById('suggestion-chips').innerHTML = chips.map(c =>
    `<button class="chip" onclick="sendQuickMessage(this)" data-text="${escHtml(c.text)}">${c.icon} ${escHtml(c.text)}</button>`
  ).join('');
}

function sendQuickMessage(btn) {
  document.getElementById('chat-input').value = btn.dataset.text;
  sendMessage();
}

// ── MESSAGING ──────────────────────────────────
function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

async function sendMessage() {
  if (state.isLoading) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendUserMessage(text);
  const phase = detectPhase(text);
  if (phase) activatePhase(phase);
  state.conversationHistory.push({ role: 'user', content: text });

  setLoading(true);
  showTyping();

  try {
    const response = await callLLM(text);
    hideTyping();
    const { mainText, followup } = parseResponse(response);
    appendBotMessage(formatText(mainText), followup, true);
    const botPhase = detectPhase(response);
    if (botPhase) activatePhase(botPhase);
    state.conversationHistory.push({ role: 'assistant', content: response });
  } catch (err) {
    hideTyping();
    appendBotMessage(`<p>I'm having trouble connecting. Please try again! 🙏</p><p><em>${escHtml(err.message)}</em></p>`, null, true);
  } finally {
    setLoading(false);
  }
}

// ── LLM API ────────────────────────────────────
async function callLLM(userMessage) {
  const personaNote = {
    'first-voter': 'The user is a First-time Voter — be extra gentle and encouraging.',
    'citizen':     'The user is a Curious Citizen — be informative and engaging.',
    'student':     'The user is a Student/Researcher — be detailed and factual.',
  }[state.persona] || '';

  const messages = [
    ...state.conversationHistory.slice(-8),
    { role: 'user', content: userMessage }
  ];

  const API_KEY = 'YOUR_GEMINI_API_KEY';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  if (API_KEY === 'YOUR_GEMINI_API_KEY') return getFallbackResponse(userMessage);

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT + '\n\nPersona note: ' + personaNote }] },
    contents: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
}

// ── FALLBACK RESPONSES ─────────────────────────
function getFallbackResponse(msg) {
  const l = msg.toLowerCase();
  if (l.includes('register') || l.includes('voter id') || l.includes('epic'))
    return `To register as a voter in India, you need to be:\n• **18 years or older** as of January 1st of the election year\n• An **Indian citizen**\n• A resident of the constituency you're registering in\n\nHere's how to register:\n1. Visit the **National Voters' Service Portal (NVSP)** at nvsp.in\n2. Fill out **Form 6** — the form for new voter registration\n3. Submit documents: proof of age and proof of address\n4. A **Booth Level Officer (BLO)** will verify your details\n5. Once approved, you receive your **EPIC card** (Voter ID card)!\n\nThe process usually takes 4–6 weeks.\n\nFOLLOWUP: What documents are needed for voter registration?`;
  if (l.includes('evm'))
    return `An **EVM (Electronic Voting Machine)** is used in Indian elections instead of paper ballots.\n\nIt has two units:\n• **Control Unit** — operated by the polling officer\n• **Ballot Unit** — shows candidate names and party symbols\n\nWhen you press a button next to your candidate, a *beep* confirms your vote. EVMs are:\n✅ Not connected to the internet\n✅ Tamper-evident\n✅ Battery-powered\n\nThe **VVPAT machine** prints a paper slip for 7 seconds so you can verify your vote visually!\n\nFOLLOWUP: How does VVPAT work and why was it introduced?`;
  if (l.includes('nota'))
    return `**NOTA** stands for **None Of The Above** — an option on the EVM to reject all candidates.\n\nIntroduced in **2013** by Supreme Court order. Important points:\n• Voting NOTA is a valid, secret vote\n• NOTA votes don't count toward any candidate\n• It lets voters express dissatisfaction without boycotting\n\nFOLLOWUP: What happens if no candidate gets a clear majority?`;
  if (l.includes('mcc') || l.includes('model code'))
    return `The **Model Code of Conduct (MCC)** ensures free and fair elections. It kicks in when **election dates are announced**.\n\nKey rules:\n• Ruling party cannot announce new welfare schemes\n• No bribing voters with cash, gifts, or liquor\n• Religious and communal appeals are banned\n• **Poll silence** — campaigning stops 48 hours before voting\n\nThe ECI enforces it through constitutional powers.\n\nFOLLOWUP: Who enforces the Model Code of Conduct?`;
  if (l.includes('voting day') || l.includes('how to vote') || l.includes('step'))
    return `**Voting Day** step by step! 🗳️\n\n**Before you go:**\n• Check your polling booth on the Voter Helpline App\n• Carry your Voter ID or alternate ID\n\n**At the station:**\n1. Join the queue\n2. Officer checks your name on the Electoral Roll\n3. **Indelible ink** applied on your left finger\n4. Sign the voter register\n5. Press button on the **EVM** for your candidate\n6. Check the **VVPAT slip** for 7 seconds\n7. Done! 🎉\n\nFOLLOWUP: What ID documents can I use without a Voter ID card?`;
  if (l.includes('count') || l.includes('result') || l.includes('winner'))
    return `**Vote counting and results:**\n\n• Counting happens at designated centres, 1–2 days after voting\n• **Postal ballots** are counted first\n• EVM results tallied round by round\n• India uses **First Past The Post (FPTP)** — most votes wins\n\n**After counting:**\n• Returning Officer issues **Form 20** declaring the winner\n• Winners take oath; party with 272+ seats forms government\n\nFOLLOWUP: What happens if no party wins a clear majority?`;
  if (l.includes('eci') || l.includes('election commission'))
    return `The **Election Commission of India (ECI)** administers all elections. Established **January 25, 1950**.\n\n**Key roles:**\n• Announces election schedules\n• Enforces Model Code of Conduct\n• Deploys security forces\n• Recognises parties and allocates symbols\n• Operates Voter Helpline (1950)\n\nThe ECI has a **Chief Election Commissioner** and two Election Commissioners with Supreme Court judge status.\n\nFOLLOWUP: How does the ECI ensure elections are fair?`;
  return `Great question! 🇮🇳\n\nI can help with: Voter Registration, Nominations, Model Code of Conduct, EVMs & VVPAT, NOTA, Voting Day, Counting & Results, and the Election Commission.\n\nTry asking about any of these topics!\n\nFOLLOWUP: How do I get my Voter ID card?`;
}

// ── RESPONSE PARSING ───────────────────────────
function parseResponse(text) {
  const match = text.match(/FOLLOWUP:\s*(.+?)$/im);
  const followup = match ? match[1].trim() : null;
  const mainText = text.replace(/FOLLOWUP:\s*.+$/im, '').trim();
  return { mainText, followup };
}

function formatText(text) {
  return text
    .split('\n').map(line => {
      line = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      if (/^[•\-]\s/.test(line)) return `<li>${line.slice(2)}</li>`;
      if (/^\d+\.\s/.test(line)) return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
      return line ? `<p>${line}</p>` : '';
    })
    .join('')
    .replace(/(<li>.*<\/li>)+/g, m => `<ul>${m}</ul>`);
}

// ── DOM HELPERS ────────────────────────────────
function appendUserMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message user';
  div.innerHTML = `<div class="message-avatar">${PERSONA_META[state.persona]?.icon || '👤'}</div><div class="message-bubble">${escHtml(text)}</div>`;
  msgs.appendChild(div);
  scrollToBottom();
}

function appendBotMessage(html, followup, animated) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message bot';
  const fu = followup ? `<div class="inline-followup"><span>You might also ask:</span><button class="followup-chip" onclick="sendQuickFollowup(this)">${escHtml(followup)}</button></div>` : '';
  div.innerHTML = `<div class="message-avatar">☸</div><div class="message-bubble">${html}${fu}</div>`;
  msgs.appendChild(div);
  scrollToBottom();
}

function sendQuickFollowup(btn) {
  document.getElementById('chat-input').value = btn.textContent.trim();
  sendMessage();
}

let typingEl = null;
function showTyping() {
  const msgs = document.getElementById('chat-messages');
  typingEl = document.createElement('div');
  typingEl.className = 'message bot typing-indicator';
  typingEl.innerHTML = `<div class="message-avatar">☸</div><div class="message-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  msgs.appendChild(typingEl);
  scrollToBottom();
}
function hideTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }

function scrollToBottom() {
  const msgs = document.getElementById('chat-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function setLoading(val) {
  state.isLoading = val;
  document.getElementById('send-btn').disabled = val;
  document.getElementById('chat-input').disabled = val;
}

// ── FACTS ROTATION ─────────────────────────────
function startFactRotation() {
  const dots = document.getElementById('fact-dots');
  FACTS.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'fact-dot' + (i === 0 ? ' active' : '');
    dots.appendChild(d);
  });
  showFact(0);
  setInterval(() => {
    state.factIndex = (state.factIndex + 1) % FACTS.length;
    showFact(state.factIndex);
  }, 30000);
}

function showFact(idx) {
  const el = document.getElementById('fact-text');
  const dots = document.querySelectorAll('.fact-dot');
  el.classList.add('fading');
  setTimeout(() => {
    el.textContent = FACTS[idx];
    el.classList.remove('fading');
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, 300);
}

// ── SHARE ──────────────────────────────────────
function shareApp() {
  const url = window.location.href;
  const text = '🗳️ Check out VoteWise — an interactive guide to India\'s election process!';
  if (navigator.share) {
    navigator.share({ title: 'VoteWise', text, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Link copied!'));
  } else {
    showToast('Share: ' + url);
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
