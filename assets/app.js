// onevarez.swf: preloader, particle headline, timeline reel. No dependencies.
(() => {
  const root = document.documentElement;
  const FX = root.classList.contains("fx");
  const $ = (s) => document.querySelector(s);
  const store = (fn) => { try { return fn(); } catch (e) { return null; } };

  /* ---------------- preloader ---------------- */
  let startParticles = () => {};
  const finishIntro = () => {
    if (root.classList.contains("loaded")) return;
    root.classList.add("loaded");
    store(() => sessionStorage.setItem("swf-seen", "1"));
    startParticles();
  };

  function runPreloader() {
    if (!FX || root.classList.contains("seen")) return finishIntro();
    const num = $("#pl-num"), fill = $("#pl-fill"), log = $("#pl-log");
    const lines = ["loading kineto.engine", "linking mcp servers", "compiling rust", "warming up particles", "rendering keyframes", "ready"];
    const duration = 2600, t0 = performance.now();
    $("#pl-skip").addEventListener("click", finishIntro);
    addEventListener("keydown", (e) => { if (e.key === "Escape" || e.key === "Enter") finishIntro(); }, { once: true });
    (function tick(now) {
      if (root.classList.contains("loaded")) return;
      const t = Math.min(1, (now - t0) / duration);
      // Stutter like a real 56k download.
      const pct = Math.floor(100 * (t < 0.6 ? t * 1.15 : 0.69 + (t - 0.6) * 0.775) ** 1.1);
      num.textContent = Math.min(100, pct);
      fill.style.width = Math.min(100, pct) + "%";
      log.textContent = lines[Math.min(lines.length - 1, Math.floor(t * lines.length))] + "…";
      if (t < 1) requestAnimationFrame(tick); else setTimeout(finishIntro, 250);
    })(t0);
  }

  /* ---------------- particle headline ---------------- */
  function particles() {
    const hero = $("#hero"), canvas = $("#particles"), h1 = $("#headline");
    if (!FX || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const palette = ["#c6ff3d", "#c6ff3d", "#c6ff3d", "#f1f1ee", "#ff3d7f"];
    let W = 0, H = 0, dpr = 1, size = 3, pts = [], dust = [], running = false, visible = true, started = false;
    const mouse = { x: -1e4, y: -1e4 };

    function targets() {
      const hr = hero.getBoundingClientRect();
      const cs = getComputedStyle(h1);
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d");
      o.fillStyle = "#fff";
      o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      o.textBaseline = "alphabetic";
      // Draw each glyph exactly where the browser laid it out, so the particles match the real h1
      // (canvas text ignores letter-spacing, so whole words would drift).
      const text = h1.firstChild;
      const fs = parseFloat(cs.fontSize);
      const r = document.createRange();
      for (let i = 0; i < text.length; i++) {
        const ch = text.data[i];
        if (!ch.trim()) continue;
        r.setStart(text, i); r.setEnd(text, i + 1);
        const rect = r.getClientRects()[0];
        if (!rect) continue;
        o.fillText(ch, rect.left - hr.left, rect.top - hr.top + rect.height / 2 + fs * 0.33);
      }
      size = Math.max(2, Math.round(fs / 30));
      const data = o.getImageData(0, 0, W, H).data, out = [];
      for (let y = 0; y < H; y += size + 1)
        for (let x = 0; x < W; x += size + 1)
          if (data[(y * W + x) * 4 + 3] > 128) out.push([x, y]);
      return out;
    }

    function build() {
      const r = hero.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1);
      W = Math.round(r.width); H = Math.round(r.height);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = targets();
      const old = pts;
      pts = t.map(([tx, ty], i) => {
        const p = old[i] || {
          x: started ? tx : W / 2 + (Math.random() - 0.5) * W * 1.6,
          y: started ? ty : H / 2 + (Math.random() - 0.5) * H * 1.6,
          vx: 0, vy: 0, c: palette[(Math.random() * palette.length) | 0],
        };
        p.tx = tx; p.ty = ty; p.d = 0.06 + Math.random() * 0.05;
        return p;
      });
      dust = Array.from({ length: Math.round((W * H) / 9000) }, () => ({
        x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.5 + 0.3, v: Math.random() * 0.3 + 0.05,
      }));
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(241,241,238,.35)";
      for (const d of dust) {
        d.y -= d.v; if (d.y < 0) { d.y = H; d.x = Math.random() * W; }
        ctx.fillRect(d.x, d.y, d.s, d.s);
      }
      const R = 110, R2 = R * R;
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dist2 = dx * dx + dy * dy;
        if (dist2 < R2) {
          const f = (1 - Math.sqrt(dist2) / R) * 6;
          const a = Math.atan2(dy, dx);
          p.vx += Math.cos(a) * f; p.vy += Math.sin(a) * f;
        }
        p.vx += (p.tx - p.x) * p.d; p.vy += (p.ty - p.y) * p.d;
        p.vx *= 0.82; p.vy *= 0.82;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, size, size);
      }
      requestAnimationFrame(frame);
    }
    const play = () => { if (!running && visible && started) { running = true; requestAnimationFrame(frame); } };

    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!visible) running = false; else play(); }).observe(hero);
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); });

    startParticles = () => {
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
        build(); started = true; play();
      });
    };
  }

  /* ---------------- reel + timeline ---------------- */
  function reel() {
    const section = $("#reel"), track = $("#track"), body = $("#tl-body"), ruler = $("#ruler");
    const head = $("#playhead"), headNum = $("#ph-num");
    const frames = [...track.querySelectorAll(".frame")], keys = [...document.querySelectorAll(".key")];
    const n = frames.length, PER = 12, total = n * PER;
    const wide = matchMedia("(min-width: 900px)");
    let pinned = false, progress = 0;

    for (let f = 1; f <= total; f++) {
      if (f !== 1 && f % 5) continue;
      const s = document.createElement("span");
      s.textContent = f; if (f % 10 && f !== 1) s.className = "minor"; s.style.left = ((f - 0.5) / total) * 100 + "%";
      ruler.appendChild(s);
    }

    function paint(p) {
      progress = Math.max(0, Math.min(1, p));
      const idx = Math.round(progress * (n - 1));
      const frame = 1 + Math.round(progress * (n - 1) * PER);
      head.style.setProperty("--x", ((frame - 0.5) / total) * body.clientWidth + "px");
      headNum.textContent = String(frame).padStart(3, "0");
      frames.forEach((el, i) => el.classList.toggle("active", i === idx));
      keys.forEach((el, i) => el.classList.toggle("active", i === idx));
      if (pinned) {
        // Keep the current scene centred, easing between neighbouring frames.
        const pos = progress * (n - 1), a = Math.floor(pos), b = Math.min(n - 1, a + 1), t = pos - a;
        const c = (el) => el.offsetLeft + el.offsetWidth / 2;
        const x = c(frames[a]) + (c(frames[b]) - c(frames[a])) * t;
        track.style.transform = `translate3d(${track.clientWidth / 2 - x}px,0,0)`;
      }
    }

    function fromScroll() {
      if (pinned) {
        const r = section.getBoundingClientRect();
        paint(-r.top / (section.offsetHeight - innerHeight));
      } else {
        const max = track.scrollWidth - track.clientWidth;
        paint(max > 0 ? track.scrollLeft / max : 0);
      }
    }

    function seek(p, smooth) {
      p = Math.max(0, Math.min(1, p));
      const behavior = smooth && FX ? "smooth" : "auto";
      if (pinned) {
        const top = section.getBoundingClientRect().top + scrollY;
        scrollTo({ top: top + p * (section.offsetHeight - innerHeight), behavior });
      } else {
        track.scrollTo({ left: p * (track.scrollWidth - track.clientWidth), behavior });
      }
      if (behavior === "auto") paint(p);
    }

    function layout() {
      pinned = FX && wide.matches;
      section.classList.toggle("pinned", pinned);
      if (!pinned) track.style.transform = "";
      fromScroll();
    }

    keys.forEach((k, i) => k.addEventListener("click", () => seek(n > 1 ? i / (n - 1) : 0, true)));

    // Scrub the playhead like the Flash IDE.
    const pToX = (e) => {
      const r = body.getBoundingClientRect();
      const frame = ((e.clientX - r.left) / r.width) * total + 0.5;
      return (frame - 1) / ((n - 1) * PER);
    };
    let dragging = false;
    body.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".key")) return;
      dragging = true; body.setPointerCapture(e.pointerId); seek(pToX(e));
    });
    body.addEventListener("pointermove", (e) => { if (dragging) seek(pToX(e)); });
    body.addEventListener("pointerup", () => { dragging = false; });

    addEventListener("scroll", () => pinned && fromScroll(), { passive: true });
    track.addEventListener("scroll", () => !pinned && fromScroll(), { passive: true });
    addEventListener("resize", layout);
    wide.addEventListener?.("change", layout);
    layout();
  }

  /* ---------------- reveals + counters ---------------- */
  function reveals() {
    if (!FX || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const co = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        co.unobserve(e.target);
        const el = e.target, raw = el.dataset.count, m = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
        if (!m) continue;
        const target = parseInt(m[2].replace(/,/g, ""), 10), t0 = performance.now();
        (function step(now) {
          const t = Math.min(1, (now - t0) / 1400), v = Math.round(target * (1 - (1 - t) ** 3));
          el.textContent = m[1] + v.toLocaleString("en-US") + m[3];
          if (t < 1) requestAnimationFrame(step);
        })(t0);
      }
    }, { threshold: 0.5 });
    document.querySelectorAll("[data-count]").forEach((el) => co.observe(el));
  }

  particles();
  reel();
  reveals();
  runPreloader();
})();
