/* =============================================
   VOTEWISE — APP LOGIC v2
   ============================================= */

const state = {
  persona: null,
  activePhase: null,
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

  setLoading(true);
  showTyping();

  // Small delay to feel natural
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
  hideTyping();

  const response = getResponse(text);
  const { mainText, followup } = parseResponse(response);
  appendBotMessage(formatText(mainText), followup, true);
  const botPhase = detectPhase(response);
  if (botPhase) activatePhase(botPhase);

  setLoading(false);
}

// ── KNOWLEDGE ENGINE ───────────────────────────
function getResponse(msg) {
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
  if (l.includes('document') || l.includes('proof') || l.includes('id card'))
    return `**Documents accepted for voting** (any one of these 12):\n• Voter ID card (EPIC)\n• Aadhaar card\n• PAN card\n• Indian Passport\n• Driving Licence\n• Bank/Post Office Passbook with photo\n• Class 10 marksheet\n• MNREGA Job Card\n• Health Insurance Smart Card\n• Income Tax Assessment Order\n• Disability ID from Social Justice Dept\n• Photo ID from Central/State Govt\n\nFor **registration**, you need proof of age + proof of address.\n\nFOLLOWUP: How do I register online on the NVSP portal?`;
  if (l.includes('independent') || l.includes('party'))
    return `Yes! **Independent candidates** can absolutely contest elections in India without being part of any political party.\n\nRequirements:\n• Must be a registered voter in the constituency\n• Must be **25 years or older** for Lok Sabha/State Assembly\n• Must file nomination papers with a **security deposit** (₹25,000 for Lok Sabha, ₹10,000 for Assembly)\n• Needs at least **10 proposers** from the constituency\n\nIf the independent candidate fails to get 1/6th of total votes, their deposit is forfeited. Independent candidates are assigned a **free symbol** by the ECI from a list.\n\nFOLLOWUP: How are election symbols allocated to parties?`;
  if (l.includes('phase') || l.includes('how many') || l.includes('schedule'))
    return `India conducts elections **in phases** to ensure security and logistics across its vast territory.\n\n**Why phases?**\n• India has limited Central Armed Police Forces (CAPF)\n• Forces need to move between states/regions\n• Ensures adequate security at every booth\n\nGeneral elections typically have **5–7 phases** spread over several weeks. The ECI decides the schedule based on:\n• Security requirements\n• Weather conditions\n• Festival dates\n• Exam schedules\n\nThe 2024 Lok Sabha election had **7 phases** from April 19 to June 1!\n\nFOLLOWUP: How does the ECI decide which areas vote in which phase?`;
  if (l.includes('postal') || l.includes('nri') || l.includes('overseas'))
    return `**Postal ballots** allow certain categories to vote without visiting a polling station:\n\n**Who can use postal ballots?**\n• Armed forces personnel & their families\n• Government employees on election duty\n• Voters above **80 years of age**\n• Persons with disabilities (PwD)\n• COVID-affected or quarantined voters\n\n**NRI Voting:**\n• NRIs can vote in India if registered in their home constituency\n• They must be present in person at the polling booth\n• The ECI has been working on an **online/postal system for NRIs** but it's not fully implemented yet\n\nFOLLOWUP: How do senior citizens and disabled voters cast their votes?`;
  if (l.includes('ink') || l.includes('indelible'))
    return `The **indelible ink** used in Indian elections is a special marker applied to your left index finger after voting.\n\n**Key facts:**\n• Made by **Mysore Paints and Varnish Ltd** — the sole authorized manufacturer\n• Contains **silver nitrate** which bonds with skin cells\n• Stays visible for **2–4 weeks**\n• Cannot be removed by soap, alcohol, or chemicals\n• Applied on the **cuticle/nail bed** so it can't be scraped off\n\nThis prevents **double voting** — polling officers check for ink marks before allowing entry!\n\nFOLLOWUP: What happens if someone tries to vote twice?`;
  if (l.includes('symbol') || l.includes('logo'))
    return `**Election symbols** are the icons next to candidate names on the EVM ballot unit.\n\n**National parties** have reserved symbols used across India (e.g., lotus, hand, hammer-sickle).\n\n**State parties** have symbols reserved within their states.\n\n**Independent candidates** get symbols from the ECI's **free symbols** list.\n\nWhy symbols matter:\n• India has diverse literacy levels — symbols help voters identify candidates easily\n• The ECI maintains an official list of allocated symbols\n• Disputes over symbols are settled by the ECI under the Election Symbols Order, 1968\n\nFOLLOWUP: How does a party become a national party in India?`;
  if (l.includes('booth') || l.includes('where') || l.includes('polling station'))
    return `To find your **polling station**:\n\n1. Visit **nvsp.in** → Search by EPIC number or name\n2. Use the **Voter Helpline App** (available on Android & iOS)\n3. Call the **Voter Helpline: 1950** (toll-free)\n4. Send SMS: **EPIC <your_voter_id>** to 1950\n\nYour polling station is usually a **school, community hall, or government building** near your registered address. On election day, look for the ECI banner and booth number outside the building.\n\nFOLLOWUP: What time do polling stations open and close?`;
  if (l.includes('time') || l.includes('hours') || l.includes('open') || l.includes('close'))
    return `**Polling hours** in Indian elections:\n\n• Typically **7:00 AM to 6:00 PM** in most constituencies\n• Can vary by region (some areas start at 8 AM)\n• If you're in the queue before closing time, **you WILL be allowed to vote**\n• The ECI announces specific timings for each phase\n\n**Important:** If the queue is long, don't leave! Officers will ensure everyone who arrived before 6 PM gets to vote.\n\nFOLLOWUP: Can I take my phone inside the voting booth?`;
  if (l.includes('phone') || l.includes('camera') || l.includes('selfie'))
    return `**No, phones are NOT allowed** inside the voting compartment!\n\nRules:\n• You cannot carry your phone into the polling booth\n• Taking photos/selfies of your vote is **illegal** under Section 128 of the RPA\n• Your phone must be left outside or with the polling officer\n• This protects **vote secrecy** — no one should know who you voted for\n\nViolation can lead to imprisonment of up to **3 months** or a fine.\n\nFOLLOWUP: What other things are not allowed at a polling station?`;
  if (l.includes('age') || l.includes('18') || l.includes('eligible') || l.includes('qualify'))
    return `**Voter eligibility** in India:\n\n• Must be an **Indian citizen**\n• Must be **18 years or older** as of January 1st of the year the electoral roll is prepared\n• Must be a **resident** of the constituency where you want to vote\n• Must NOT be disqualified under any law (e.g., convicted of certain crimes)\n\n**Cannot vote:**\n• Non-citizens\n• Persons of unsound mind (as declared by court)\n• Persons disqualified for corrupt practices or election offenses\n\nFOLLOWUP: How do I register to vote online?`;
  return `Great question! 🇮🇳\n\nI can help you with all of these topics about Indian elections:\n• **Voter Registration** — How to get your Voter ID\n• **Candidate Nomination** — Who can contest and how\n• **Model Code of Conduct** — Campaign rules\n• **EVM & VVPAT** — How voting machines work\n• **NOTA** — None Of The Above option\n• **Voting Day** — Step-by-step process\n• **Counting & Results** — How winners are decided\n• **Election Commission** — Its role and powers\n• **Documents needed** — What ID to carry\n• **Polling stations** — How to find yours\n\nTry asking about any of these! You can also tap the timeline phases on the left.\n\nFOLLOWUP: How do I get my Voter ID card?`;
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

function nextFact() {
  state.factIndex = (state.factIndex + 1) % FACTS.length;
  showFact(state.factIndex);
}

function prevFact() {
  state.factIndex = (state.factIndex - 1 + FACTS.length) % FACTS.length;
  showFact(state.factIndex);
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
