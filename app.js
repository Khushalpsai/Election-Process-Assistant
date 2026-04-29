/* =============================================
   VOTEWISE — APP LOGIC
   ============================================= */

// ── STATE ──────────────────────────────────────
const state = {
  persona: null,         // 'first-voter' | 'citizen' | 'student'
  activePhase: null,
  conversationHistory: [],
  isLoading: false,
  factIndex: 0,
};

// ── CONSTANTS ──────────────────────────────────
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

// ── ONBOARDING ─────────────────────────────────
function selectPersona(btn) {
  state.persona = btn.dataset.persona;
  const meta = PERSONA_META[state.persona];

  // Update header badge
  document.getElementById('persona-icon-display').textContent  = meta.icon;
  document.getElementById('persona-label-display').textContent = meta.label;

  // Fade out overlay
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
}

function sendWelcomeMessage() {
  const greetings = {
    'first-voter': `🎉 Welcome! I'm **VoteWise** — your personal guide to India's election process.\n\nAs a first-time voter, you're about to be part of something incredible: the world's largest democracy! Don't worry — I'll walk you through everything step by step, in simple words.\n\nYou can ask me anything, tap any phase on the timeline, or use the quick buttons below. Where would you like to start?`,
    'citizen':     `🙏 Welcome to **VoteWise**! Great to have a curious citizen here.\n\nIndia's election process is a fascinating and complex democracy at work. From voter registration to result declaration, I'm here to break it all down for you in plain language.\n\nAsk me anything, or pick a topic from the timeline on the left!`,
    'student':     `📚 Welcome to **VoteWise**! Perfect for research and study.\n\nI can walk you through the entire Indian election process in detail — covering the Representation of the People Act, ECI guidelines, EVM mechanics, MCC enforcement, and more.\n\nFeel free to ask detailed questions. Use the timeline to navigate phases!`,
  };
  const text = greetings[state.persona] || greetings['citizen'];
  appendBotMessage(formatText(text), null, false);
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
  const phaseQuestions = {
    registration: "Tell me about voter registration and getting a Voter ID",
    nomination:   "How does candidate nomination work in Indian elections?",
    campaigning:  "What is the Model Code of Conduct during election campaigning?",
    voting:       "Walk me through the Voting Day process step by step",
    counting:     "How does vote counting work after elections?",
    result:       "How are election results declared and who forms the government?",
  };
  if (phaseQuestions[phase]) {
    document.getElementById('chat-input').value = phaseQuestions[phase];
    sendMessage();
  }
}

// ── CHIPS ──────────────────────────────────────
function renderChips(setName) {
  const chips = CHIP_SETS[setName] || CHIP_SETS.default;
  const container = document.getElementById('suggestion-chips');
  container.innerHTML = chips.map(c =>
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
  const text  = input.value.trim();
  if (!text) return;

  input.value = '';
  appendUserMessage(text);

  // Detect phase from user input
  const phase = detectPhase(text);
  if (phase) activatePhase(phase);

  // Add to history
  state.conversationHistory.push({ role: 'user', content: text });

  setLoading(true);
  showTyping();

  try {
    const response = await callLLM(text);
    hideTyping();
    const { mainText, followup } = parseResponse(response);
    appendBotMessage(formatText(mainText), followup, true);

    // Detect phase from bot response too
    const botPhase = detectPhase(response);
    if (botPhase) activatePhase(botPhase);

    state.conversationHistory.push({ role: 'assistant', content: response });
  } catch (err) {
    hideTyping();
    appendBotMessage(`<p>I'm having a little trouble connecting right now. Please try again in a moment! 🙏</p><p><em>Error: ${escHtml(err.message)}</em></p>`, null, true);
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
    ...state.conversationHistory.slice(-8),  // keep last 8 turns for context
    { role: 'user', content: userMessage }
  ];

  // Using the Gemini API (free tier) — replace API key below
  const API_KEY = 'YOUR_GEMINI_API_KEY';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
    // If API key not configured, use fallback
    if (API_KEY === 'YOUR_GEMINI_API_KEY') return getFallbackResponse(userMessage);
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";
}

// ── FALLBACK (no API key) ──────────────────────
function getFallbackResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  if (lower.includes('register') || lower.includes('voter id') || lower.includes('epic')) {
    return `To register as a voter in India, you need to be:\n• **18 years or older** as of January 1st of the election year\n• An **Indian citizen**\n• A resident of the constituency you're registering in\n\nHere's how to register:\n1. Visit the **National Voters' Service Portal (NVSP)** at nvsp.in, or the **Voter Helpline App**\n2. Fill out **Form 6** — this is the form for new voter registration\n3. Submit documents: proof of age (birth certificate/Class 10 marksheet) and proof of address (Aadhaar, utility bill etc.)\n4. A **Booth Level Officer (BLO)** will verify your details\n5. Once approved, your name is added to the **Electoral Roll** and you receive your **EPIC card** (Elector's Photo Identity Card) — commonly called the Voter ID card!\n\nYou can also register offline at your nearest **Electoral Registration Officer's (ERO)** office. The whole process usually takes 4–6 weeks.\n\nFOLLOWUP: What documents are needed for voter registration?`;
  }
  if (lower.includes('evm')) {
    return `An **EVM (Electronic Voting Machine)** is the device used in Indian elections instead of paper ballots. It was designed by ECIL and BEL — two Indian government companies.\n\nIt has two units:\n• **Control Unit** — operated by the polling officer; records votes\n• **Ballot Unit** — what the voter sees; shows candidate names and party symbols with buttons\n\nWhen you press a button next to your chosen candidate, a *beep* confirms your vote. The vote is stored in the machine's memory chip. EVMs are:\n✅ Not connected to the internet\n✅ Tamper-evident (any tampering breaks the seal)\n✅ Battery-powered (works even without electricity)\n\nAlong with the EVM, there's now the **VVPAT machine** (Voter Verifiable Paper Audit Trail) that prints a paper slip for 7 seconds showing your vote — so you can verify it visually!\n\nFOLLOWUP: How does VVPAT work and why was it introduced?`;
  }
  if (lower.includes('nota')) {
    return `**NOTA** stands for **None Of The Above** — it's an option on the EVM that allows voters to reject *all* candidates if they don't find any of them suitable.\n\nNOTA was introduced in Indian elections in **2013**, after a landmark Supreme Court judgment. It is shown as the *last option* on the ballot unit with a special symbol.\n\n**Important things to know:**\n• Voting NOTA is still a valid, secret vote\n• However, NOTA votes are *not counted* toward any candidate — even if NOTA gets the most votes, the candidate with the highest votes among real candidates still wins\n• It gives voters a way to *express dissatisfaction* without boycotting the election\n\nSome electoral reformers argue NOTA should have more binding power — that's an ongoing debate in Indian democracy!\n\nFOLLOWUP: What happens if no candidate gets a clear majority?`;
  }
  if (lower.includes('mcc') || lower.includes('model code')) {
    return `The **Model Code of Conduct (MCC)** is a set of guidelines issued by the **Election Commission of India (ECI)** to ensure free and fair elections. It kicks in the **moment election dates are announced** and stays until the election process is complete.\n\nKey rules of the MCC:\n• The **ruling party cannot announce new welfare schemes** or use government resources for campaigning\n• Candidates cannot **bribe voters** with cash, gifts, or liquor\n• **Religious and communal appeals** to seek votes are banned\n• Campaign rallies must get **prior permission** from authorities\n• **Poll silence** — all campaigning must stop 48 hours before voting day\n\nThe MCC is not a law — it doesn't have a separate Act behind it — but the ECI enforces it through its constitutional powers. Violations can lead to warnings, FIRs, or cancellation of candidature.\n\nFOLLOWUP: Who enforces the Model Code of Conduct?`;
  }
  if (lower.includes('voting day') || lower.includes('how to vote') || lower.includes('step')) {
    return `Here's what happens on **Voting Day**, step by step! 🗳️\n\n**Before you go:**\n• Check your polling booth on the **Voter Helpline App** or nvsp.in\n• Carry your **Voter ID (EPIC)** or any of the 12 alternate documents (Aadhaar, PAN, Passport, etc.)\n\n**At the polling station:**\n1. Join the queue (separate queues for men, women, and senior citizens)\n2. An officer checks your name on the **Electoral Roll** and marks your slip\n3. Another officer applies **indelible ink** on your left index finger — this prevents double voting!\n4. You sign/thumbprint the voter register\n5. The **Control Unit officer** enables your Ballot Unit\n6. Go to the **EVM**, press the button next to your chosen candidate\n7. A *beep* confirms your vote — check the **VVPAT slip** for 7 seconds to verify\n8. You're done! The ink on your finger is proof you voted 🎉\n\nFOLLOWUP: What ID documents can I use if I don't have a Voter ID card?`;
  }
  if (lower.includes('count') || lower.includes('result') || lower.includes('winner')) {
    return `After voting ends, here's how **vote counting and results** work:\n\n**Counting Day:**\n• Counting happens at a **counting centre** designated by the ECI, usually 1–2 days after voting\n• Candidates and their **counting agents** are present to observe\n• ECI-appointed **Returning Officers** supervise the count\n• **Postal ballots** (from armed forces, NRIs etc.) are counted first\n• EVM results are read out, tallied, and recorded round by round\n\n**How the winner is decided:**\nIndia follows the **First Past The Post (FPTP)** system — the candidate with the **most votes** in a constituency wins, even if they don't get 50%+.\n\n**After counting:**\n• The Returning Officer issues a **Form 20** declaring the winner\n• The ECI officially notifies the result\n• Winners take an **oath** and may form the government if their party/alliance gets majority (272+ seats in Lok Sabha)\n\nFOLLOWUP: What happens if no party wins a clear majority in parliament?`;
  }
  if (lower.includes('eci') || lower.includes('election commission')) {
    return `The **Election Commission of India (ECI)** is an independent constitutional authority responsible for administering elections in India. It was established on **January 25, 1950** — one day before India became a Republic!\n\n**Its key roles:**\n• Announces election schedules and dates\n• Enforces the **Model Code of Conduct**\n• Deploys **central security forces** to ensure free & fair polling\n• Recognises political parties and allocates **election symbols**\n• Operates the **Voter Helpline (1950)** and NVSP portal\n• Can **postpone or cancel** elections in case of violence or malpractice\n\n**Structure:**\nThe ECI consists of the **Chief Election Commissioner (CEC)** and two **Election Commissioners**. They enjoy the same status as Supreme Court judges and can only be removed through a process similar to impeachment.\n\nThe ECI is widely respected as one of India's most trusted institutions! 🇮🇳\n\nFOLLOWUP: How does the Election Commission ensure elections are fair?`;
  }
  // Generic fallback
  return `That's a great question about Indian elections! 🇮🇳\n\nTo get the most accurate and detailed answer, please **add your Gemini API key** to the \`app.js\` file (look for \`YOUR_GEMINI_API_KEY\`). Once connected, I can answer any election-related question in depth!\n\nIn the meantime, here are the topics I can help with:\n• Voter Registration & EPIC card\n• Candidate Nomination process\n• Model Code of Conduct\n• How EVMs and VVPAT work\n• NOTA explained\n• Voting Day procedures\n• Vote counting & results\n• Role of the Election Commission\n\nTry asking about any of these! 😊\n\nFOLLOWUP: How do I get my Voter ID card?`;
}

// ── RESPONSE PARSING ───────────────────────────
function parseResponse(text) {
  const match = text.match(/FOLLOWUP:\s*(.+?)$/im);
  const followup = match ? match[1].trim() : null;
  const mainText = text.replace(/FOLLOWUP:\s*.+$/im, '').trim();
  return { mainText, followup };
}

// ── TEXT FORMATTING ────────────────────────────
function formatText(text) {
  return text
    .split('\n').map(line => {
      line = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g,     '<em>$1</em>')
        .replace(/✅|🎉|🇮🇳|📝|🏅|📣|🗳️|🔢|🏆|💡|🙏|📚|⚖️|📢|👁️|📬|🔎|🤝|💰|⭐|🤫|🔇|📜|📄|🪪|🔍|📋|🖥️|🧾|❌|👜|📊/g, match => `<span>${match}</span>`);
      if (/^[•\-\*]\s/.test(line)) return `<li>${line.slice(2)}</li>`;
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
  div.innerHTML = `
    <div class="message-avatar">
      ${PERSONA_META[state.persona]?.icon || '👤'}
    </div>
    <div class="message-bubble">${escHtml(text)}</div>`;
  msgs.appendChild(div);
  scrollToBottom();
}

function appendBotMessage(htmlContent, followup, animated) {
  const msgs = document.getElementById('chat-messages');
  const div  = document.createElement('div');
  div.className = 'message bot' + (animated ? '' : ' no-anim');
  const followupHtml = followup
    ? `<div class="inline-followup">
         <span>💬 You might also want to ask:</span>
         <button class="followup-chip" onclick="sendQuickFollowup(this)">${escHtml(followup)}</button>
       </div>`
    : '';
  div.innerHTML = `
    <div class="message-avatar">☸</div>
    <div class="message-bubble">${htmlContent}${followupHtml}</div>`;
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
  typingEl.innerHTML = `
    <div class="message-avatar">☸</div>
    <div class="message-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  msgs.appendChild(typingEl);
  scrollToBottom();
}
function hideTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

function scrollToBottom() {
  const msgs = document.getElementById('chat-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function setLoading(val) {
  state.isLoading = val;
  document.getElementById('send-btn').disabled  = val;
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
  const el   = document.getElementById('fact-text');
  const dots = document.querySelectorAll('.fact-dot');
  el.classList.add('fading');
  setTimeout(() => {
    el.textContent = FACTS[idx];
    el.classList.remove('fading');
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, 400);
}

// ── SHARE ──────────────────────────────────────
function shareApp() {
  const url  = window.location.href;
  const text = '🗳️ Check out VoteWise — an interactive guide to India\'s election process!';
  if (navigator.share) {
    navigator.share({ title: 'VoteWise', text, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('🔗 Link copied to clipboard!'));
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

// ── UTILS ──────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
