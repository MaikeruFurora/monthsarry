/* ================================================================
   MONTHSARY — Luxury Romantic Edition
   For Cheloja, from Michael
   ================================================================ */
/* global Lenis, THREE, gsap, ScrollTrigger, VanillaTilt, Typed */

/* ---------------------------------------------------------------
   CONFIG — edit these to personalize
   --------------------------------------------------------------- */
const CONFIG = {
  // Set to false if you (or Cheloja's phone) prefer plain native scrolling.
  smoothScroll: true,

  // Anniversary / relationship start date (year, monthIndex 0-11, day, hour, minute)
  startDate: new Date(2022, 7, 27, 0, 0, 0), // August 27, 2022

  // The cinematic opening text sequence (timing in ms)
  heroLines: [
    { text: "Hi Love ♡",                       in: 600,  hold: 1800 },
    { text: "I made something for you.",       in: 700,  hold: 1900 },
    { text: "Because every moment with you…",  in: 700,  hold: 1900 },
    { text: "…deserves to be remembered.",     in: 700,  hold: 2100 },
  ],

  // The typed love letter
  letter: [
    "To my favorite person ❤️^1100<br><br>",

    "Hindi ko inexpect na may isang tao na kayang gawing mas tahimik, mas masaya, at mas okay yung mundo ko just by being here… ^500tapos dumating ka.^1200<br><br>",

    "Ewan ko paano nangyari pero naging favorite part ka na ng araw ko.^800<br>",
    "Ikaw yung una kong gustong kausap.^500<br>",
    "Ikaw yung naiisip ko bago matulog.^500<br>",
    "At ikaw yung dahilan bakit kahit simpleng moments parang special na.^1100<br><br>",

    "Thank you kasi kahit hindi mo napapansin,^300 ang gaan mo sa buhay ko.^900<br>",
    "Kapag pagod ako,^200 ikaw pahinga ko.^500<br>",
    "Kapag magulo isip ko,^200 ikaw yung takbuhan ko.^500<br>",
    "At kapag wala akong gana sa lahat,^300 somehow napapangiti mo pa rin ako.^1100<br><br>",

    "Ang dami nating simpleng moments pero honestly,^300 ayoko makalimutan kahit isa.^900<br>",
    "Yung mga usapan natin hanggang madaling araw,^500<br>",
    "yung random na tawanan,^500<br>",
    "yung mga lambing mo,^500<br>",
    "at kahit yung simpleng presence mo lang.^1100<br><br>",

    "Hindi man ako perfect sa words minsan,^400 pero gusto ko malaman mo na sobrang importante mo sakin.^1200<br><br>",

    "And if may isang bagay na gusto kong tandaan mo palagi,^500 eto yun:^1000<br><br>",

    "Kahit ilang months pa dumaan,^500<br>",
    "kahit gaano ka-busy ang life,^500<br>",
    "ikaw at ikaw pa rin pipiliin ko.^1100<br><br>",

    "Again.^600<br>",
    "And again.^600<br>",
    "And again.^1100<br><br>",

    "Happy Monthsary, love ❤️"
  ].join(""),
};

/* ---------------------------------------------------------------
   UTIL
   --------------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------
   LOADER — fades out after window load
   --------------------------------------------------------------- */
window.addEventListener("load", () => {
  // Give the dreamy background a beat to initialize
  setTimeout(() => {
    const loader = $("#loader");
    loader.classList.add("hidden");
    // Kick off the cinematic opening
    playHeroSequence();
  }, 700);
});

/* ---------------------------------------------------------------
   LENIS — buttery smooth scrolling (single RAF driver)
   --------------------------------------------------------------- */
let lenis = null;
if (CONFIG.smoothScroll && window.Lenis && !prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
    // Touch should use native momentum on phones — feels far better than emulated.
    smoothTouch: false,
  });
  document.documentElement.classList.add("lenis", "lenis-smooth");

  // Register GSAP first so ScrollTrigger can read scroll values from Lenis.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on("scroll", ScrollTrigger.update);
    // Drive Lenis from GSAP's ticker only — do NOT also drive from requestAnimationFrame.
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // GSAP not present — use a standalone RAF loop.
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // Anchor links: hand control to Lenis so they animate smoothly.
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.2 });
  });
}

/* ---------------------------------------------------------------
   THREE.JS — dreamy particle field + soft aurora
   --------------------------------------------------------------- */
(function initThree() {
  if (!window.THREE) return;
  const canvas = $("#bg-canvas");
  if (!canvas) return;

  const isMobile = window.innerWidth < 700;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 60;

  // ---------- Particle field ----------
  const count = isMobile ? 700 : 1500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#ffb6c8"),
    new THREE.Color("#ffd6e0"),
    new THREE.Color("#f4d4a8"),
    new THREE.Color("#c8a6ff"),
    new THREE.Color("#fdf3ea"),
  ];
  for (let i = 0; i < count; i++) {
    positions[i*3 + 0] = (Math.random() - 0.5) * 200;
    positions[i*3 + 1] = (Math.random() - 0.5) * 200;
    positions[i*3 + 2] = (Math.random() - 0.5) * 200;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3 + 0] = c.r;
    colors[i*3 + 1] = c.g;
    colors[i*3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

  // Soft glowing point sprite
  const sprite = makeGlowTexture();
  const mat = new THREE.PointsMaterial({
    size: isMobile ? 0.9 : 0.7,
    map: sprite,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    opacity: 0.85,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Subtle directional 'aurora' plane behind everything
  const auroraGeo = new THREE.PlaneGeometry(400, 200, 1, 1);
  const auroraMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec2 uv = vUv;
        float band = sin((uv.x + uTime * 0.05) * 6.0 + sin(uv.y * 4.0 + uTime * 0.08) * 2.0) * 0.5 + 0.5;
        float falloff = smoothstep(0.0, 0.5, uv.y) * smoothstep(1.0, 0.5, uv.y);
        vec3 rose = vec3(1.0, 0.71, 0.78);
        vec3 violet = vec3(0.78, 0.65, 1.0);
        vec3 col = mix(rose, violet, band);
        float a = band * falloff * 0.18;
        gl_FragColor = vec4(col, a);
      }
    `,
  });
  const aurora = new THREE.Mesh(auroraGeo, auroraMat);
  aurora.position.z = -80;
  scene.add(aurora);

  // ---------- Animate ----------
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let scrollY = 0;
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    points.rotation.y = t * 0.025 + mouse.x * 0.15;
    points.rotation.x = mouse.y * 0.1;
    points.position.y = scrollY * -0.01;

    auroraMat.uniforms.uTime.value = t;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  // ---------- Resize ----------
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Soft glow sprite generator
  function makeGlowTexture() {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    g.addColorStop(0,    "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,220,230,0.7)");
    g.addColorStop(0.6,  "rgba(255,182,200,0.15)");
    g.addColorStop(1,    "rgba(255,182,200,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }
})();

/* ---------------------------------------------------------------
   HERO — cinematic text sequence then reveal
   --------------------------------------------------------------- */
async function playHeroSequence() {
  const lines = $$(".hero__line");
  const reveal = $("#hero-reveal");

  if (prefersReducedMotion) {
    reveal.classList.add("is-visible");
    startCounter();
    startLetter();
    return;
  }

  // Initial breath — gives her a moment to tap "Play our song" before the letter begins.
  await wait(2000);

  // Show each line in turn
  for (let i = 0; i < lines.length && i < CONFIG.heroLines.length; i++) {
    const conf = CONFIG.heroLines[i];
    const line = lines[i];
    await wait(150);
    line.classList.add("is-active");
    await wait(conf.in + conf.hold);
    line.classList.remove("is-active");
    line.classList.add("is-exit");
    await wait(900);
  }

  // Final reveal
  await wait(200);
  reveal.classList.add("is-visible");
  startCounter();
  startLetter();
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ---------------------------------------------------------------
   LIVE RELATIONSHIP COUNTER
   --------------------------------------------------------------- */
let counterStarted = false;
function startCounter() {
  if (counterStarted) return;
  counterStarted = true;

  const targets = {
    months:  $("#c-months"),
    days:    $("#c-days"),
    hours:   $("#c-hours"),
    minutes: $("#c-minutes"),
    seconds: $("#c-seconds"),
  };

  function tick() {
    const now = new Date();
    const diff = diffParts(CONFIG.startDate, now);
    setNum(targets.months,  diff.months);
    setNum(targets.days,    diff.days);
    setNum(targets.hours,   diff.hours);
    setNum(targets.minutes, diff.minutes);
    setNum(targets.seconds, diff.seconds);
  }
  tick();
  setInterval(tick, 1000);
}

function setNum(el, n) {
  if (!el) return;
  const formatted = String(n).padStart(2, "0");
  if (el.textContent !== formatted) el.textContent = formatted;
}

function diffParts(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  // Anchor "months elapsed" to the day-of-month
  const anchor = new Date(start);
  anchor.setFullYear(start.getFullYear() + Math.floor(months / 12));
  anchor.setMonth(start.getMonth() + (months % 12));
  if (end < anchor) months--;

  // Move anchor to true 'months ago' boundary
  const monthsStart = new Date(start);
  monthsStart.setMonth(start.getMonth() + months);

  let ms = end - monthsStart;
  const days    = Math.floor(ms / 86400000); ms -= days * 86400000;
  const hours   = Math.floor(ms / 3600000);  ms -= hours * 3600000;
  const minutes = Math.floor(ms / 60000);    ms -= minutes * 60000;
  const seconds = Math.floor(ms / 1000);

  return { months, days, hours, minutes, seconds };
}

/* ---------------------------------------------------------------
   LOVE LETTER — typewriter
   --------------------------------------------------------------- */
let letterStarted = false;
function startLetter() {
  if (letterStarted) return;

  // Wait until letter section is in view (lazy)
  const target = $("#letter-typed");
  if (!target) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting && !letterStarted) {
        letterStarted = true;
        runTyped(target);
        io.disconnect();
      }
    });
  }, { threshold: 0.35 });
  io.observe(target);
}

function runTyped(target) {
  if (!window.Typed) {
    target.textContent = CONFIG.letter.replace(/\^\d+/g, "");
    return;
  }
  new Typed(target, {
    strings: [CONFIG.letter],
    typeSpeed: 28,
    backSpeed: 0,
    showCursor: true,
    cursorChar: "▍",
    smartBackspace: false,
    loop: false,
    contentType: "html",
  });
}

/* ---------------------------------------------------------------
   REVEAL-ON-SCROLL
   --------------------------------------------------------------- */
(function initReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting) {
        ent.target.classList.add("is-visible");
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -60px 0px" });
  els.forEach((el) => io.observe(el));
})();

/* ---------------------------------------------------------------
   VANILLA TILT — for reason cards
   --------------------------------------------------------------- */
if (window.VanillaTilt && !prefersReducedMotion) {
  VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 8,
    speed: 600,
    glare: true,
    "max-glare": 0.18,
    perspective: 1000,
    scale: 1.02,
  });
}

// Soft mouse-glow tracking on reason cards
$$(".reason-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mx", mx + "%");
    card.style.setProperty("--my", my + "%");
  });
});

/* ---------------------------------------------------------------
   GALLERY — auto-load real images if present, lightbox
   --------------------------------------------------------------- */
(function initGallery() {
  const items = $$(".gallery__item");
  items.forEach((fig) => {
    const src = fig.dataset.src;
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      fig.innerHTML = "";
      fig.appendChild(img);
      img.alt = "A memory of us";
    };
    img.onerror = () => { /* keep placeholder */ };
    img.src = src;
  });

  const lightbox = $("#lightbox");
  const lightImg = $("#lightbox-img");
  const closeBtn = $("#lightbox-close");

  items.forEach((fig) => {
    fig.addEventListener("click", () => {
      const img = fig.querySelector("img");
      if (!img) return; // nothing to enlarge yet
      lightImg.src = img.src;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
})();

/* ---------------------------------------------------------------
   TIMELINE — try loading real images per data-img
   --------------------------------------------------------------- */
(function initTimelineImages() {
  $$(".timeline__img[data-img]").forEach((slot) => {
    const name = slot.dataset.img;
    const img = new Image();
    img.onload = () => {
      slot.innerHTML = "";
      slot.appendChild(img);
      slot.classList.add("has-image");
      img.alt = "A moment together";
    };
    img.onerror = () => { /* keep placeholder */ };
    img.src = `assets/images/${name}.jpg`;
  });
})();

/* ---------------------------------------------------------------
   MUSIC PLAYER
   --------------------------------------------------------------- */
(function initMusic() {
  const btn = $("#music-toggle");
  const audio = $("#bg-audio");
  if (!btn || !audio) return;

  const label = btn.querySelector(".music-player__label");
  btn.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        btn.classList.add("is-playing");
        btn.setAttribute("aria-pressed", "true");
        label.textContent = "Now playing";
      } catch (err) {
        label.textContent = "Add a song to /assets/music/";
      }
    } else {
      audio.pause();
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
      label.textContent = "Play our song";
    }
  });
})();

/* ---------------------------------------------------------------
   SECRET EASTER EGG — floating hearts + line reveal
   --------------------------------------------------------------- */
(function initSecret() {
  const btn = $("#secret");
  const overlay = $("#secret-overlay");
  if (!btn || !overlay) return;

  let firing = false;
  btn.addEventListener("click", () => {
    if (firing) return;
    firing = true;

    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    spawnHearts(40);

    setTimeout(() => {
      overlay.classList.remove("is-active");
      overlay.setAttribute("aria-hidden", "true");
      firing = false;
    }, 4200);
  });

  function spawnHearts(n) {
    const glyphs = ["♡", "❤", "✿", "✦"];
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      h.className = "floating-heart";
      h.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      h.style.left = Math.random() * 100 + "vw";
      h.style.bottom = "-40px";
      h.style.fontSize = (1 + Math.random() * 1.6) + "rem";
      const dur = 4 + Math.random() * 3;
      h.style.animationDuration = dur + "s";
      h.style.animationDelay = (Math.random() * 0.8) + "s";
      h.style.color = Math.random() > 0.5 ? "#ffb6c8" : "#f4d4a8";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), (dur + 1.2) * 1000);
    }
  }
})();

/* ---------------------------------------------------------------
   FINALE — paced cascade. Each step honors its data-delay (ms) so
   the lines arrive like slow breaths, not all at once.
   --------------------------------------------------------------- */
(function initFinaleCascade() {
  const finale = $("#finale");
  if (!finale) return;

  const steps = $$(".finale__step", finale);
  if (!steps.length) return;

  let fired = false;
  const fire = () => {
    if (fired) return;
    fired = true;
    steps.forEach((el) => {
      const delay = parseInt(el.dataset.delay || "0", 10);
      setTimeout(() => el.classList.add("is-visible"), delay);
    });
  };

  if (!("IntersectionObserver" in window)) { fire(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting) { fire(); io.disconnect(); }
    });
  }, { threshold: 0.25 });
  io.observe(finale);
})();

/* ---------------------------------------------------------------
   GSAP — gentle parallax for timeline cards
   --------------------------------------------------------------- */
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  $$(".timeline__item").forEach((item) => {
    gsap.fromTo(
      item.querySelector(".timeline__card"),
      { y: 40 },
      {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}
