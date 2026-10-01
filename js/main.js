/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'orologeria-zebedia',
    /* nessun WhatsApp: il fisso della scheda Google */
    whatsapp: { number: '', message: '', ids: [] },
    /* pannello Google (30/9/2026) = SumUp Bookings: lunedì–venerdì 10–18, sabato e domenica chiuso */
    hours: {
      0: [], 1: [['10:00', '18:00']], 2: [['10:00', '18:00']], 3: [['10:00', '18:00']],
      4: [['10:00', '18:00']], 5: [['10:00', '18:00']], 6: [],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1100,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Orologeria Zebedia: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.banco": "What we repair",
      "n.orologi": "From the bench",
      "n.bottega": "The shop",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Historic Shop of Milan · Via Zebedia 9, between Piazza Missori and the Duomo",
      "h.titolo": "Watch repairs, since 1929.",
      "h.seconda": "Full services, crystals, stems and crowns, batteries; wristwatches and pocket watches, bracket clocks.",
      "h.testo": "A small shop a few steps from Piazza Missori, with the watches in the window and the loupe on the bench.",
      "h.google": "on Google, 48 reviews",
      "h.chi": "Marcella, in a review on Google (in English: «Skilled craftsmen, professional. When honesty pays!»)",
      "p.titolo": "The service",
      "p.desc": "A watch seen from the back, in its gold case, on the green velvet of our pouch. The caseback opens; the parts of the movement go back in place one by one; it is wound; the movement starts again, the balance wheel swings and settles; the case catches the light. Three jobs: the service of a hand-wound watch, an automatic with its oscillating weight, a quartz watch with a new battery.",
      "p.d0": "Service: opened, reassembled piece by piece, wound, running again.",
      "p.d1": "Automatic: the oscillating weight winds it with every movement of the wrist.",
      "p.d2": "Battery: the quartz movement, with the new battery in its place.",
      "p.modi": "Which job",
      "p.b0": "Service",
      "p.b1": "Automatic",
      "p.b2": "Battery",
      "p.nota": "A watch seen from the back, on the green velvet of our pouch: the caseback, the movement, the jewels.",
      "b.etichetta": "On the bench",
      "b.titolo": "What we repair",
      "b.sotto": "The jobs we do at the bench, one per tag. In quotation marks, our own words about jobs we have done (in Italian).",
      "b.n1": "Full service",
      "b.t1": "For hand-wound watches, automatics, chronographs.",
      "b.n2": "Crystal, stem and crown",
      "b.t2": "A scratched or broken crystal, a crown that won’t hold, the stem.",
      "b.n3": "Winding mechanism",
      "b.t3": "When the watch no longer winds the way it used to.",
      "b.n4": "Period parts",
      "b.t4": "For vintage watches, the original parts of their time.",
      "b.n5": "The battery",
      "b.t5": "A new battery for quartz watches, snap-on casebacks too.",
      "b.n6": "Clocks and pocket watches",
      "b.t6": "Nineteenth and twentieth century bracket clocks, pocket watches, music boxes.",
      "b.vendita": "And in the window, used and vintage watches to buy.",
      "c.etichetta": "A piece of advice",
      "c.titolo": "«Never wind your watch while it’s on your wrist!»",
      "c.testo": "Take it off and turn the crown calmly, holding it in your hand: on the wrist the crown turns at an angle, and it is the stem and the winding mechanism that suffer.",
      "o.etichetta": "From the bench",
      "o.titolo": "Through our hands",
      "o.sotto": "From our photos of May and June 2021, on our green velvet pouch.",
      "a.cronooro": "A gold chronograph on our green velvet pouch, the loupe at the top.",
      "k.cronooro": "A gold chronograph:",
      "a.ovale": "An oval gold hand-wound watch with Roman numerals.",
      "k.ovale": "An oval gold hand-wound watch:",
      "a.anni60": "A gold watch from the sixties with a crocodile strap, the loupe.",
      "k.anni60": "Gold, hand-wound, the sixties: new crystal, stem and crown.",
      "a.cronoblu": "A steel and gold chronograph with a blue strap.",
      "k.cronoblu": "A steel and gold chronograph, with a new winding mechanism.",
      "a.acciaio": "A square steel and gold automatic, with its bracelet.",
      "k.acciaio": "A steel and gold automatic, after a full service.",
      "a.monachina": "A gold pendant watch on its chain, next to a ring with stones.",
      "l.etichetta": "The shop",
      "l.titolo": "At Via Zebedia 9",
      "a.saracinesca": "Our shutter painted green: a hand holding a pocket watch by its chain; above it, the sign.",
      "k.saracinesca": "The shutter, when the shop is closed",
      "l.t1": "We are a <b>Historic Shop of Milan</b>, on the city’s register: watch repairs and sales, between Piazza Missori and the Duomo.",
      "l.t2": "A few square metres, the watches in the window, the clocks, the loupe on the bench. The green velvet pouch with the gold lettering is ours: you can see it under the watches in the photos.",
      "a.vetrina": "The window full of wristwatches on red velvet, a carriage clock, the «Riparazione orologi» sign.",
      "k.vetrina": "The window, in a photo of ours from a few years ago",
      "a.pendola": "An inlaid bracket clock with gilt bronze and a Roman numeral dial.",
      "k.pendola": "A bracket clock in the shop, photographed by a client",
      "d.etichetta": "Reviews",
      "d.titolo": "Who has been to the bench",
      "d.google": "on Google, 48 reviews",
      "d.g2a": "Google, 2 years ago",
      "d.g4a": "Google, 4 years ago",
      "d.g4m": "Google, 4 months ago",
      "d.g7a": "Google, 7 years ago",
      "d.g1a": "Google, a year ago",
      "d.g3a": "Google, 3 years ago, in French",
      "d.nota": "From the reviews on Google, as they were written; […] where we cut. The line at the top comes from another client, also on Google.",
      "d.tutte": "All the reviews on Google",
      "r.etichetta": "Hours and where",
      "r.titolo": "Monday to Friday, 10 am to 6 pm",
      "r.testa": "Hours",
      "r.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "r.chiuso": "closed",
      "r.nota": "Hours from our Google listing (September 2026).",
      "w.mappa": "Map: Orologeria Zebedia, Via Zebedia 9, Milan",
      "w.dove": "Where",
      "w.dovev": "Via Zebedia 9, 20123 Milan, between Piazza Missori and the Duomo",
      "w.metro": "By metro",
      "w.metrov": "M3 Missori, about 200 metres away; M1 and M3 Duomo, about 450",
      "w.tram": "By tram",
      "w.tramv": "15, 16 and 24 at Missori, about 150 metres away; the 3 on Via Torino, about 150",
      "w.tel": "Phone",
      "f2.riga": "Historic Shop of Milan · watch repairs and sales",
      "f2.orario": "Monday to Friday 10 am–6 pm · Saturday and Sunday closed",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · hours, rating and reviews from their Google listing (September 2026); the photos of the watches from their Facebook page and Instagram (2021), the shutter, the window and the clock from the Google listing. We drew the open watch ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ OROLOGERIA ZEBEDIA — Via Zebedia 9 ══════════
     la FIRMA — «la revisione»: l'orologio visto da dietro, nella cassa d'oro, sul velluto verde del loro sacchetto. Il fondello si
     apre; i pezzi del movimento tornano al loro posto uno per uno; si carica; il movimento riparte (le ruote girano, il bilanciere
     oscilla e si posa); la cassa prende la luce. Lo stato è M (revisione, automatico, pila), T (0…1) e V (0 al suo posto; fino a 1
     l'orologio esce a destra; da −1 a 0 entra da sinistra il prossimo, col fondello chiuso). Senza JS e alla fine: revisione, T = 1,
     V = 0 (l'HTML). L'attesa (classe nell'head): il fondello chiuso. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al
     60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,560],"via":560,"cala":26,"fasi":{"apre":{"t":0.03,"d":0.12},"posa":{"t":0.16,"d":0.38},"carica":{"t":0.56,"d":0.08},"corsa":{"t":0.66,"d":0.22},"luce":{"t":0.88,"d":0.12}},"modi":[{"nome":"Revisione","pezzi":[{"c":[446,280],"posa":{"t":0.16,"d":0.08},"carica":720,"corsa":0},{"c":[200,196],"posa":{"t":0.193333,"d":0.08},"carica":0,"corsa":24},{"c":[300,262],"posa":{"t":0.226667,"d":0.08},"carica":0,"corsa":-72},{"c":[374,206],"posa":{"t":0.26,"d":0.08},"carica":0,"corsa":240},{"c":[400,280],"posa":{"t":0.293333,"d":0.08},"carica":0,"corsa":-480},{"c":[378,330],"posa":{"t":0.326667,"d":0.08},"carica":0,"corsa":900},{"c":[318,384],"posa":{"t":0.36,"d":0.08},"carica":0,"corsa":0,"osc":{"fase":"corsa","amp":11,"giri":5}},{"c":[208,372],"posa":{"t":0.393333,"d":0.08},"carica":0,"corsa":0,"osc":{"fase":"corsa","amp":210,"giri":5}},{"c":[208,372],"posa":{"t":0.426667,"d":0.08},"carica":0,"corsa":0},{"c":[200,196],"posa":{"t":0.46,"d":0.08},"carica":540,"corsa":0}]},{"nome":"Automatico","pezzi":[{"c":[446,280],"posa":{"t":0.16,"d":0.08},"carica":0,"corsa":0},{"c":[200,196],"posa":{"t":0.193333,"d":0.08},"carica":0,"corsa":24},{"c":[300,262],"posa":{"t":0.226667,"d":0.08},"carica":0,"corsa":-72},{"c":[374,206],"posa":{"t":0.26,"d":0.08},"carica":0,"corsa":240},{"c":[400,280],"posa":{"t":0.293333,"d":0.08},"carica":0,"corsa":-480},{"c":[378,330],"posa":{"t":0.326667,"d":0.08},"carica":0,"corsa":900},{"c":[318,384],"posa":{"t":0.36,"d":0.08},"carica":0,"corsa":0,"osc":{"fase":"corsa","amp":11,"giri":5}},{"c":[208,372],"posa":{"t":0.393333,"d":0.08},"carica":0,"corsa":0,"osc":{"fase":"corsa","amp":210,"giri":5}},{"c":[208,372],"posa":{"t":0.426667,"d":0.08},"carica":0,"corsa":0},{"c":[280,280],"posa":{"t":0.46,"d":0.08},"carica":0,"corsa":0,"osc":{"fase":"carica","amp":150,"giri":1.5}}]},{"nome":"Pila","pezzi":[{"c":[280,280],"posa":{"t":0.16,"d":0.08},"carica":0,"corsa":0},{"c":[446,280],"posa":{"t":0.22,"d":0.08},"carica":0,"corsa":0},{"c":[186,300],"posa":{"t":0.28,"d":0.08},"carica":0,"corsa":0},{"c":[368,176],"posa":{"t":0.34,"d":0.08},"carica":0,"corsa":0},{"c":[250,200],"posa":{"t":0.4,"d":0.08},"carica":0,"corsa":540},{"c":[292,238],"posa":{"t":0.46,"d":0.08},"carica":0,"corsa":-350},{"c":[330,384],"posa":{"t":0.56,"d":0.08},"carica":0,"corsa":0}]}],"tempi":{"inizio":300,"revisione":7600,"servi":480,"arriva":520,"revisioneV":6800}};
  /* la revisione a (M, T, V) — una sola fonte: la usano _ozb_firma.mjs (l'HTML allo stato finale), main.js (via ozb_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     L'orologio visto da dietro, nella cassa d'oro, sul velluto verde del loro sacchetto: il fondello si apre; i pezzi del movimento
     tornano al loro posto uno per uno (calati dall'alto, come con la pinzetta); si carica (il cricco, la massa oscillante o la pila
     nuova); il movimento riparte (le ruote girano, il bilanciere oscilla e si posa); la cassa prende la luce. Il modo è il lavoro
     (revisione, automatico, pila); col V l'orologio esce a destra, il prossimo entra da sinistra col fondello chiuso. */
  function creaRevisione(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q1 = function (c) { return svg.querySelector('.' + c); };
    var servito = q1('servito'), fondello = q1('fondello'), luce = q1('luce');
    var P = D.modi.map(function (M, m) {
      return M.pezzi.map(function (_, i) {
        var q = function (c) { return svg.querySelector('.' + c + '[data-m="' + m + '"][data-i="' + i + '"]'); };
        return { posa: q('pezzo'), gira: q('gira') };
      });
    });
    /* un tratto disegnato da 0 a «quanto» (pathLength = 1) */
    var tratto = function (el, quanto) { el.setAttribute('stroke-dasharray', r3(quanto) + ' 2'); el.setAttribute('stroke-dashoffset', '0'); };
    /* l'angolo di un pezzo: la carica, la corsa, e un'oscillazione che si spegne a fine fase (a 1 vale 0) */
    function angolo(p, t) {
      var F = D.fasi, a = p.carica * dolce(fase(t, F.carica)) + p.corsa * dolce(fase(t, F.corsa));
      if (p.osc) { var u = fase(t, F[p.osc.fase]); a += p.osc.amp * Math.sin(2 * Math.PI * p.osc.giri * u) * (1 - u); }
      return r1(a);
    }
    function disegna(m, t, v) {
      var F = D.fasi;
      /* il fondello si apre */
      fondello.setAttribute('opacity', String(r3(1 - dolce(fase(t, F.apre)))));
      /* i pezzi: calati al loro posto uno per uno, poi girano */
      D.modi[m].pezzi.forEach(function (p, i) {
        var d = dolce(fase(t, p.posa)), q = P[m][i];
        q.posa.setAttribute('transform', 'translate(' + p.c[0] + ' ' + r1(p.c[1] - D.cala * (1 - d)) + ')');
        q.posa.setAttribute('opacity', String(r3(d)));
        q.gira.setAttribute('transform', 'rotate(' + angolo(p, t) + ')');
      });
      /* la luce sulla cassa */
      tratto(luce, dolce(fase(t, F.luce)));
      /* col V l'orologio esce a destra; il prossimo entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!(servito && fondello && luce) && P.every(function (L) { return L.every(function (q) { return q.posa && q.gira; }); });
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('revisione-firma'), svgF = prendi('revisioneSvg'), leggiF = prendi('revisioneLeggi');
  var REVISIONE = svgF ? creaRevisione(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.revisione__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.revisione__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    REVISIONE.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) REVISIONE.disegna(k, 1, 0); });
    REVISIONE.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta il fondello chiuso */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il fondello chiuso */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.revisione, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.revisione });
  }
  /* il gesto: scegliere il lavoro. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     l'orologio esce a destra, entra da sinistra il prossimo col fondello chiuso, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.revisioneV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && REVISIONE && REVISIONE.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaRevisione); } catch (e) {}
    window.__revisione = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__revisione.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta il fondello chiuso */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__revisione.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
