/* ============================================================
   BARADIA GROUP — shared site script (included on every page)

   🔧 EDIT HERE ONLY (GitHub → assets/site.js):
     WHATSAPP_NUMBER   lead WhatsApp number, country code first, no + or spaces
     PAYMENT_LINK      Razorpay payment link pasted into the WhatsApp message
     CONSULTATION_FEE  shown on the Start page and in the WhatsApp message
   ============================================================ */
window.BARADIA_CONFIG = {
  WHATSAPP_NUMBER: '919830183828',
  UPI_ID: 'sumitbaradia1@icici',
  CONSULTATION_FEE: '₹999',
  PRIORITY_FEE_AMOUNT: 999,
  PAYMENT_LINK: 'upi://pay?pa=sumitbaradia1@icici&pn=Baradia%20Group&am=999&cu=INR&tn=Priority%20Consultation%20Fee',

  GOOGLE_SHEET: {
    ENABLED: true,
    SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1zA8npdzpSuxyIrD5HMRCn5LGrL4s0BTrwxA1pVv8plk/edit?gid=0#gid=0',
    WEBAPP_URL: ''
  },

  GOOGLE_FORM: {
    ENABLED: true,
    ACTION: 'https://docs.google.com/forms/d/e/1FAIpQLSfRys-DJ8xAFAFaBlNQriTn5ebiOcn1FZwiyZENMHpaNi7uCg/formResponse',
    PAGE_HISTORY: '0,1,2'
  }
};

window.BARADIA_VERTICALS = {
  indesign: {
    name: 'The InDesign',
    line: 'Interior Architecture & Turnkey Solutions',
    tags: 'Office | Retail | Residential',
    path: '/indesign',
    form: 'The InDesign (Architectural Design, Holistic Space Creation)'
  },
  indesignbranded: {
    name: 'InDesign Branded',
    line: 'Handcrafted Products & Retail',
    tags: 'Sustainable | Aesthetic | Functional',
    path: '/indesignbranded',
    form: 'InDesign Branded (Luxury Design, Brand Identity & Lifestyle Experiences)'
  },
  infield: {
    name: 'The InField',
    line: 'Agroecology & Sustainable Farming',
    tags: 'Farm setup | Consultancy | Organic systems',
    path: '/infield',
    form: 'The InField (Infrastructure, Project Management, On-Site Execution)'
  },
  invest: {
    name: 'The Invest',
    line: 'Strategic Investments',
    tags: 'Business | Land | Opportunities',
    path: '/invest',
    form: 'The Invest (Strategic Investment, Capital Growth, Venture Funding)'
  },
  aiventures: {
    name: 'AI Ventures',
    line: 'AI, Automation & Business Systems',
    tags: 'Lead generation | Automation | BPO',
    path: '/aiventures',
    form: 'AI Ventures (AI Solutions, Technological Innovation, Systemic Change)'
  },
  sewa: {
    name: 'SEWA',
    line: 'Social & Ecological Initiatives',
    tags: 'Community | Sustainability | Awareness',
    path: '/sewa',
    form: 'SEWA (Social Impact, Community Development, Humanitarian Initiatives)'
  }
};

/* Sends lead directly to Google Spreadsheet row (all 21 columns) */
window.baradiaSendToGoogleSheet = function (lead) {
  var cfg = window.BARADIA_CONFIG.GOOGLE_SHEET;
  if (!cfg || !cfg.ENABLED) return;

  var payload = {
    date: lead.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    source: lead.source || 'Website',
    vertical: lead.verticalName || lead.vertical || '',
    leadType: lead.leadType || (lead.consult === 'paid' ? 'Priority Consultation (₹999)' : 'Free Consultation'),
    name: lead.name || '',
    phone: lead.phone || '',
    email: lead.email || '',
    city: lead.city || '',
    currentSituation: lead.currentSituation || lead.situation || '',
    goalExpectation: lead.goalExpectation || lead.goal || '',
    scale: lead.scale || '',
    budgetRange: lead.budgetRange || lead.budget || '',
    timeline: lead.timeline || lead.start || '',
    details: lead.details || lead.notes || '',
    status: 'New',
    priority: lead.consult === 'paid' ? 'Priority (₹999)' : 'Free',
    messageSent: 'Yes',
    lastContacted: '',
    nextFollowUp: '',
    owner: 'Sumit Baradia',
    notes: lead.details || lead.notes || ''
  };

  try {
    var stored = JSON.parse(localStorage.getItem('baradia_leads') || '[]');
    stored.unshift(payload);
    localStorage.setItem('baradia_leads', JSON.stringify(stored.slice(0, 50)));
    localStorage.setItem('baradia_current_lead', JSON.stringify(payload));
  } catch (e) {}

  if (cfg.WEBAPP_URL) {
    try {
      fetch(cfg.WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Google Sheet submission warning', err);
    }
  }
};

/* Maps a lead onto Google Form */
window.baradiaGoogleFormFields = function (lead) {
  var v = window.BARADIA_VERTICALS[lead.vertical];
  var summary = [
    'Lead ID: ' + lead.id,
    'City: ' + lead.city,
    'Situation: ' + (lead.currentSituation || ''),
    'Goal: ' + (lead.goalExpectation || ''),
    'Scale: ' + (lead.scale || ''),
    'Budget: ' + (lead.budgetRange || ''),
    'Timeline: ' + (lead.timeline || ''),
    'Consultation: ' + (lead.consultLabel || lead.leadType || ''),
    lead.details ? 'Details: ' + lead.details : ''
  ].filter(Boolean).join(' | ');

  return {
    'emailAddress': lead.email || '',
    'pageHistory': window.BARADIA_CONFIG.GOOGLE_FORM.PAGE_HISTORY,
    'entry.496226899': v ? v.form : "I'm not sure / Please route my inquiry based on my needs",
    'entry.1955524538': lead.scale || 'Other',
    'entry.1802452401': lead.timeline || 'Ready for Execution',
    'entry.4113614': lead.name || '',
    'entry.519952687': 'Phone: ' + (lead.phone || ''),
    'entry.877236420': summary,
    'entry.790453556': 'Column 1',
    'entry.1094721931': 'Column 1',
    'entry.1288729833': 'Column 1',
    'entry.2126284558': 'Website / Portfolio'
  };
};

window.baradiaSendToGoogleForm = function (lead) {
  var cfg = window.BARADIA_CONFIG.GOOGLE_FORM;
  if (!cfg.ENABLED) return;
  var body = new URLSearchParams(window.baradiaGoogleFormFields(lead));
  try {
    fetch(cfg.ACTION, { method: 'POST', mode: 'no-cors', keepalive: true, body: body });
  } catch (e) {
    if (navigator.sendBeacon) navigator.sendBeacon(cfg.ACTION, body);
  }
};

window.baradiaCurrentVertical = function () {
  var seg = (location.pathname.split('/')[1] || '').replace(/\.html$/, '').toLowerCase();
  if (seg === 'aiventure') seg = 'aiventures';
  return window.BARADIA_VERTICALS[seg] ? seg : '';
};

(function () {
  var css = '' +
    '@keyframes bgStartPulse{0%{box-shadow:0 0 0 0 rgba(194,21,47,.55)}70%{box-shadow:0 0 0 16px rgba(194,21,47,0)}100%{box-shadow:0 0 0 0 rgba(194,21,47,0)}}' +
    '@keyframes bgStartGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.25)}}' +
    '.start-now{display:inline-flex!important;align-items:center;justify-content:center;gap:10px;background:#C2152F!important;color:#fff!important;' +
      'border:none!important;border-radius:999px!important;padding:16px 34px!important;font-family:Arimo,Arial,sans-serif!important;font-size:.95rem!important;font-weight:700!important;' +
      'letter-spacing:.14em!important;text-transform:uppercase!important;text-decoration:none!important;cursor:pointer;opacity:1!important;' +
      'animation:bgStartPulse 1.6s ease-out infinite,bgStartGlow 1.6s ease-in-out infinite;transition:transform .2s ease}' +
    '.start-now:hover{transform:translateY(-2px) scale(1.03)}' +
    '#bg-start-float{position:fixed;right:20px;bottom:20px;z-index:99990;padding:14px 26px!important;font-size:.85rem!important}' +
    '@media (max-width:600px){#bg-start-float{right:12px;bottom:12px;padding:12px 20px!important}}' +
    '@media (prefers-reduced-motion:reduce){.start-now{animation:none}}';
  var style = document.createElement('style');
  style.id = 'bg-site-css';
  style.textContent = css;
  document.head.appendChild(style);

  function startHref() {
    var v = window.baradiaCurrentVertical();
    var isSub = location.pathname.indexOf('/indesign') !== -1 ||
                location.pathname.indexOf('/indesignbranded') !== -1 ||
                location.pathname.indexOf('/infield') !== -1 ||
                location.pathname.indexOf('/invest') !== -1 ||
                location.pathname.indexOf('/aiventures') !== -1 ||
                location.pathname.indexOf('/sewa') !== -1;
    var prefix = isSub ? '../start/' : '/start/';
    return prefix + (v ? '?v=' + v : '');
  }

  function addFloatingButton() {
    if (location.pathname.indexOf('/start') !== -1 || document.getElementById('bg-start-float')) return;
    var a = document.createElement('a');
    a.id = 'bg-start-float';
    a.className = 'start-now';
    a.href = startHref();
    a.textContent = "Let's Connect";
    a.setAttribute('aria-label', "Let's Connect — send us your requirement");
    document.body.appendChild(a);
  }

  /* Pages with a #preloader used to wait for window "load" (every image) before
     showing anything. Hide it as soon as the HTML is parsed and reveal on scroll. */
  function hidePreloader() {
    var pre = document.getElementById('preloader');
    if (!pre) return;
    pre.style.transition = 'opacity .25s ease';
    pre.style.opacity = '0';
    setTimeout(function () { pre.style.display = 'none'; }, 260);
  }

  function revealOnScroll() {
    var nodes = document.querySelectorAll('.anim-target');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('fade-in-up');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('fade-in-up'); io.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);
  }

  function init() {
    hidePreloader();
    revealOnScroll();
    addFloatingButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
