import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Contact"];

const PROJECTS = [
  {
    id: 1,
    title: "Logistics Management System",
    desc: "End-to-end logistics portal with real-time order tracking, shipment management, and third-party courier API integrations for seamless operations.",
    tags: ["PHP", "MySQL", "REST API", "Shipping APIs"],
    color: "#00f5ff",
    icon: "🚚",
  },
  {
    id: 2,
    title: "Finance & Workflow Portal",
    desc: "Built logical structures to streamline finance system workflows — including invoice management, payment processing, and automated reconciliation.",
    tags: ["PHP", "MySQL", "Payment APIs", "Backend"],
    color: "#bf5af2",
    icon: "💳",
  },
  {
    id: 3,
    title: "Custom REST API Suite",
    desc: "Designed and maintained secure REST APIs for internal and external consumption — with data validation, error handling, and token-based authentication.",
    tags: ["REST API", "PHP", "JSON", "Auth"],
    color: "#00ff88",
    icon: "⚙️",
  },
  {
    id: 4,
    title: "Third-Party API Integrations",
    desc: "Integrated shipping carriers, payment gateways, identity verification, and real-time tracking providers into production PHP applications.",
    tags: ["API Integration", "PHP", "Tracking", "Payments"],
    color: "#ffd60a",
    icon: "🔗",
  },
  {
    id: 5,
    title: "Custom WordPress Plugin",
    desc: "Developed feature-rich custom WordPress plugins with admin panels, shortcodes, hooks & filters, and seamless WooCommerce integration for extended site functionality.",
    tags: ["WordPress", "PHP", "WooCommerce", "Hooks & Filters"],
    color: "#ff6b6b",
    icon: "🔧",
  },
  {
    id: 6,
    title: "WordPress Theme Development",
    desc: "Built fully custom WordPress themes from scratch — pixel-perfect responsive designs with custom post types, ACF fields, and optimized performance scores.",
    tags: ["WordPress", "PHP", "ACF", "Responsive Design"],
    color: "#00c9a7",
    icon: "🎨",
  },
];

const SKILLS = [
  { name: "PHP Development", level: 90, color: "#00f5ff" },
  { name: "MySQL & Database Ops", level: 88, color: "#bf5af2" },
  { name: "REST API Design", level: 85, color: "#00ff88" },
  { name: "Third-Party Integrations", level: 83, color: "#ffd60a" },
  { name: "Laravel / MVC Frameworks", level: 78, color: "#00f5ff" },
  { name: "Frontend (HTML/CSS/JS)", level: 70, color: "#bf5af2" },
];

const TECH_TAGS = [
  "PHP", "MySQL", "REST APIs", "Laravel", "JavaScript",
  "HTML/CSS", "Git", "Postman", "Payment Gateways",
  "Shipping APIs", "Verification APIs", "Query Optimization",
  "Data Validation", "Secure Auth", "OOP",
  "WordPress", "WooCommerce", "ACF", "Custom Plugins", "Theme Dev",
];

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.4,
      color: ["#00f5ff", "#bf5af2", "#00ff88"][Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.5 + 0.15,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${0.07 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function GlitchText({ text }) {
  return <span className="glitch" data-text={text}>{text}</span>;
}

function SkillBar({ name, level, color, delay }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(() => setWidth(level), delay); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [level, delay]);
  return (
    <div ref={ref} style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ color: "#ccc", fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{name}</span>
        <span style={{ color, fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{level}%</span>
      </div>
      <div style={{ height: 3, background: "#12122a", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${width}%`,
          background: `linear-gradient(90deg,${color}55,${color})`,
          borderRadius: 2,
          transition: "width 1.3s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 0 12px ${color}`,
        }} />
      </div>
    </div>
  );
}

function ProjectCard({ p, i }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="fade-up"
      style={{
        animationDelay: `${i * 0.1}s`,
        background: hov ? `linear-gradient(135deg,#0d0d1a,${p.color}14)` : "linear-gradient(135deg,#0d0d1a,#12122a)",
        border: `1px solid ${hov ? p.color : "#1e1e3a"}`,
        borderRadius: 18,
        padding: "30px 28px 26px",
        transform: hov ? "translateY(-7px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: hov ? `0 24px 60px ${p.color}20` : "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 14 }}>{p.icon}</div>
      <h3 style={{
        color: hov ? p.color : "#fff",
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: 21, letterSpacing: 1, marginBottom: 10,
        transition: "color 0.3s",
      }}>{p.title}</h3>
      <p style={{ color: "#777", fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>{p.desc}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {p.tags.map(tag => (
          <span key={tag} style={{
            background: `${p.color}18`, color: p.color,
            border: `1px solid ${p.color}40`,
            borderRadius: 6, padding: "3px 10px",
            fontSize: 11, fontFamily: "'Space Mono',monospace",
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const roles = ["Backend Developer", "PHP Specialist", "API Engineer", "Problem Solver"];
  const roleRef = useRef(0), charRef = useRef(0), delRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      const role = roles[roleRef.current];
      if (!delRef.current) {
        setTypedText(role.slice(0, charRef.current + 1));
        charRef.current++;
        if (charRef.current === role.length) { delRef.current = true; setTimeout(tick, 1600); return; }
      } else {
        setTypedText(role.slice(0, charRef.current - 1));
        charRef.current--;
        if (charRef.current === 0) { delRef.current = false; roleRef.current = (roleRef.current + 1) % roles.length; }
      }
      setTimeout(tick, delRef.current ? 48 : 80);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, [roles]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Syne:wght@300;400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#07071a;color:#e0e0e0;font-family:'Syne',sans-serif;overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#0d0d1a}
        ::-webkit-scrollbar-thumb{background:#00f5ff44;border-radius:4px}

        .glitch{position:relative;color:#00f5ff;text-shadow:0 0 24px #00f5ff88}
        .glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%}
        .glitch::before{color:#ff6b6b;animation:g1 3.8s infinite;clip-path:polygon(0 25%,100% 25%,100% 45%,0 45%);transform:translate(-2px,0);opacity:.7}
        .glitch::after{color:#bf5af2;animation:g2 3.8s infinite;clip-path:polygon(0 60%,100% 60%,100% 78%,0 78%);transform:translate(2px,0);opacity:.7}
        @keyframes g1{0%,88%,100%{transform:translate(-2px,0)}90%{transform:translate(3px,2px)}93%{transform:translate(-3px,-1px)}96%{transform:translate(0,0)}}
        @keyframes g2{0%,88%,100%{transform:translate(2px,0)}90%{transform:translate(-3px,-2px)}93%{transform:translate(3px,1px)}96%{transform:translate(0,0)}}

        .fade-up{opacity:0;transform:translateY(28px);animation:fu 0.7s cubic-bezier(0.16,1,0.3,1) forwards}
        @keyframes fu{to{opacity:1;transform:translateY(0)}}

        .blink{display:inline-block;width:2px;height:1em;background:#00f5ff;margin-left:3px;vertical-align:text-bottom;animation:bl 0.7s infinite}
        @keyframes bl{0%,100%{opacity:1}50%{opacity:0}}

        .nav-btn{background:none;border:none;cursor:pointer;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:8px 14px;border-radius:6px;transition:all 0.3s}
        .btn-p{background:linear-gradient(135deg,#00f5ff,#bf5af2);border:none;color:#07071a;font-family:'Space Mono',monospace;font-weight:700;font-size:12px;letter-spacing:2px;padding:14px 32px;border-radius:8px;cursor:pointer;transition:all 0.3s;text-transform:uppercase}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 10px 40px #00f5ff44}
        .btn-o{background:transparent;border:1px solid #00f5ff;color:#00f5ff;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:2px;padding:13px 28px;border-radius:8px;cursor:pointer;transition:all 0.3s;text-transform:uppercase}
        .btn-o:hover{background:#00f5ff14;box-shadow:0 0 20px #00f5ff28}

        .wrap{max-width:1080px;margin:0 auto;padding:0 28px}
        .sec{min-height:100vh;padding:110px 0 80px;position:relative;z-index:1}
        .sec-label{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:4px;color:#00f5ff;text-transform:uppercase;margin-bottom:10px}
        .sec-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(42px,7vw,76px);line-height:1;color:#fff;margin-bottom:52px}

        .field{width:100%;background:#0d0d1a;border:1px solid #1e1e3a;border-radius:10px;padding:14px 18px;color:#e0e0e0;font-family:'Syne',sans-serif;font-size:15px;outline:none;transition:border-color 0.3s,box-shadow 0.3s}
        .field:focus{border-color:#00f5ff;box-shadow:0 0 0 3px #00f5ff14}

        .g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px}

        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes spin{to{transform:rotate(360deg)}}

        @media(max-width:700px){
          .about-grid,.skills-grid,.contact-grid{grid-template-columns:1fr !important}
          .hide-mobile{display:none !important}
          .hero-btns{flex-direction:column !important;align-items:flex-start !important}
          .desktop-nav-links{display:none !important}
          .hamburger{display:flex !important}
          .mobile-menu{display:flex !important}
          .footer-inner{flex-direction:column !important;align-items:center !important;text-align:center !important;gap:12px !important}
          #home{padding-top:90px !important;align-items:flex-start !important;padding-bottom:40px}
          .wrap{padding:0 18px}
        }
      `}</style>

      <ParticleField />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "12px 20px",
        background: (scrolled || menuOpen) ? "rgba(7,7,26,0.97)" : "transparent",
        backdropFilter: (scrolled || menuOpen) ? "blur(24px)" : "none",
        borderBottom: (scrolled || menuOpen) ? "1px solid #1a1a30" : "1px solid transparent",
        transition: "all 0.4s",
      }}>
        {/* Top bar: logo + desktop links + hamburger */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div onClick={() => scrollTo("home")} style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "#00f5ff", letterSpacing: 2, cursor: "pointer" }}>
            ARHAM.DEV
          </div>

          {/* Desktop links */}
          <div className="desktop-nav-links" style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <button key={l} className="nav-btn" onClick={() => scrollTo(l.toLowerCase())}
                style={{ color: activeSection === l ? "#00f5ff" : "#555", background: activeSection === l ? "#00f5ff12" : "transparent" }}>
                {l}
              </button>
            ))}
            <button className="btn-p" style={{ padding: "9px 20px", fontSize: 10, marginLeft: 8 }} onClick={() => scrollTo("contact")}>
              Hire Me
            </button>
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: "none", border: "1px solid #1e1e3a", borderRadius: 8, cursor: "pointer", padding: "8px 10px", display: "none", flexDirection: "column", gap: 5 }}
          >
            <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "#00f5ff" : "#aaa", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "transparent" : "#aaa", borderRadius: 2, transition: "opacity 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "#00f5ff" : "#aaa", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-menu" style={{
            display: "none", flexDirection: "column", gap: 4,
            borderTop: "1px solid #1a1a30", marginTop: 14, paddingTop: 14, paddingBottom: 8,
          }}>
            {NAV_LINKS.map(l => (
              <button key={l} className="nav-btn" onClick={() => { scrollTo(l.toLowerCase()); setMenuOpen(false); }}
                style={{ color: activeSection === l ? "#00f5ff" : "#888", background: activeSection === l ? "#00f5ff0e" : "transparent", textAlign: "left", width: "100%", padding: "12px 8px", fontSize: 13, letterSpacing: 1 }}>
                {l}
              </button>
            ))}
            <button className="btn-p" style={{ marginTop: 10, width: "100%", padding: "13px", fontSize: 12 }} onClick={() => { scrollTo("contact"); setMenuOpen(false); }}>
              Hire Me
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", zIndex: 1, paddingTop: 80 }}>
        <div className="wrap" style={{ width: "100%" }}>
          <div className="fade-up" style={{ animationDelay: "0.1s", fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: 4, color: "#00f5ff66", marginBottom: 18, textTransform: "uppercase" }}>
            👋 Hello, I'm
          </div>
          <h1 className="fade-up" style={{ animationDelay: "0.2s", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(60px,11vw,125px)", lineHeight: 0.9, marginBottom: 20 }}>
            <GlitchText text="ARHAM" />
            <br />
            <span style={{ color: "#fff" }}>AAMIR</span>
          </h1>
          <div className="fade-up" style={{ animationDelay: "0.32s", fontFamily: "'Space Mono',monospace", fontSize: "clamp(14px,2.4vw,20px)", color: "#666", marginBottom: 30, minHeight: 36 }}>
            <span style={{ color: "#00ff88" }}>{"// "}</span>
            <span style={{ color: "#bbb" }}>{typedText}</span>
            <span className="blink" />
          </div>
          <p className="fade-up" style={{ animationDelay: "0.44s", fontSize: 16, color: "#555", lineHeight: 1.9, maxWidth: 520, marginBottom: 42 }}>
            2+ years building <span style={{ color: "#00f5ff" }}>robust PHP backends</span>, scalable REST APIs, and complex database systems at{" "}
            <span style={{ color: "#bf5af2", fontWeight: 600 }}>Orio Technologies</span> — turning business logic into clean, maintainable code.
          </p>
          <div className="fade-up hero-btns" style={{ animationDelay: "0.54s", display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-p" onClick={() => scrollTo("projects")}>View My Work</button>
            <button className="btn-o" onClick={() => scrollTo("contact")}>Get In Touch</button>
          </div>
          <div className="fade-up" style={{ animationDelay: "0.7s", display: "flex", gap: 50, marginTop: 60, flexWrap: "wrap" }}>
            {[["2+", "Years Experience"], ["15+", "Projects Built"], ["30+", "Courier APIs Integrated"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 42, color: "#00f5ff", lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#333", letterSpacing: 2, marginTop: 4 }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative orb */}
        <div style={{
          position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle at 38% 38%, #00f5ff22, #bf5af218, transparent 70%)",
          animation: "float 7s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: "12%", top: "42%", transform: "translateY(-50%)",
          width: 180, height: 180, borderRadius: "50%",
          border: "1px solid #00f5ff18",
          animation: "spin 20s linear infinite",
          pointerEvents: "none",
        }} />
      </div>

      {/* ABOUT */}
      <section id="about" className="sec">
        <div className="wrap">
          <div className="sec-label">01 — About Me</div>
          <h2 className="sec-title">WHO AM I?</h2>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 16, color: "#888", lineHeight: 1.9, marginBottom: 22 }}>
                I'm <span style={{ color: "#00f5ff" }}>Arham Aamir</span>, a Backend Developer with 2+ years of hands-on experience specializing in{" "}
                <span style={{ color: "#00ff88" }}>PHP</span> — building robust, scalable systems that power real-world business operations.
              </p>
              <p style={{ fontSize: 16, color: "#888", lineHeight: 1.9, marginBottom: 22 }}>
                At <span style={{ color: "#bf5af2" }}>Orio Technologies</span>, I develop efficient modules, handle complex databases, and integrate third-party APIs for logistics, finance, and dynamic portal systems.
              </p>
              <p style={{ fontSize: 16, color: "#888", lineHeight: 1.9, marginBottom: 36 }}>
                I pride myself on writing clean, maintainable code, solving problems logically, and delivering tailored solutions that drive impactful outcomes — always eager to learn and adapt.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Open to Opportunities", "Remote Friendly", "Based in Pakistan"].map(t => (
                  <span key={t} style={{ background: "#00f5ff10", color: "#00f5ff", border: "1px solid #00f5ff28", borderRadius: 8, padding: "6px 14px", fontFamily: "'Space Mono',monospace", fontSize: 11 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#333", textTransform: "uppercase", marginBottom: 22 }}>Experience</div>
              <div style={{ display: "flex", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 12px #00f5ff", flexShrink: 0 }} />
                  <div style={{ width: 1, flex: 1, background: "linear-gradient(to bottom,#00f5ff44,transparent)", marginTop: 6 }} />
                </div>
                <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 14, padding: "22px 22px 20px", flex: 1 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#00f5ff", marginBottom: 6, letterSpacing: 1 }}>2022 — PRESENT</div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: "#fff", letterSpacing: 1, marginBottom: 4 }}>PHP Developer</div>
                  <div style={{ color: "#bf5af2", fontSize: 12, marginBottom: 18, fontFamily: "'Space Mono',monospace" }}>Orio Technologies · Full-time</div>
                  <ul style={{ paddingLeft: 16, color: "#666", fontSize: 13, lineHeight: 1.9 }}>
                    {[
                      "Designed & developed logical portal modules",
                      "Integrated shipping, payment & tracking APIs",
                      "Built & maintained custom REST APIs",
                      "Optimized complex MySQL queries & data integrity",
                      "Streamlined finance & logistics workflows",
                      "Full-stack PHP: backend, frontend & database",
                    ].map(item => (
                      <li key={item} style={{ marginBottom: 3 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="sec" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="sec-label">02 — Skills</div>
          <h2 className="sec-title">MY TOOLKIT</h2>
          <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 72px", marginBottom: 52 }}>
            <div>{SKILLS.slice(0, 3).map((s, i) => <SkillBar key={s.name} {...s} delay={i * 150} />)}</div>
            <div>{SKILLS.slice(3).map((s, i) => <SkillBar key={s.name} {...s} delay={i * 150 + 200} />)}</div>
          </div>

          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#333", textTransform: "uppercase", marginBottom: 16 }}>Technologies</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 52 }}>
            {TECH_TAGS.map(tech => (
              <span key={tech}
                style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", color: "#555", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontFamily: "'Space Mono',monospace", cursor: "default", transition: "all 0.22s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#00f5ff44"; e.currentTarget.style.color = "#00f5ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e3a"; e.currentTarget.style.color = "#555"; }}
              >{tech}</span>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              { icon: "🗄️", title: "Database Mastery", desc: "Complex queries, performance tuning, and data integrity with MySQL.", color: "#00f5ff" },
              { icon: "🔌", title: "API Engineering", desc: "Custom REST APIs and seamless third-party integrations — payments, shipping, and more.", color: "#bf5af2" },
              { icon: "🧩", title: "Modular PHP", desc: "Clean, reusable OOP modules built for long-term maintainability and scale.", color: "#00ff88" },
            ].map(c => (
              <div key={c.title} style={{ background: "#0d0d1a", border: `1px solid ${c.color}28`, borderRadius: 16, padding: "24px 22px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: c.color, letterSpacing: 1, marginBottom: 8 }}>{c.title}</div>
                <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="sec" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="sec-label">03 — Projects</div>
          <h2 className="sec-title">SELECTED WORKS</h2>
          <div className="g2">
            {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="sec" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="sec-label">04 — Contact</div>
          <h2 className="sec-title">LET'S CONNECT</h2>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56 }}>
            <div>
              <p style={{ fontSize: 16, color: "#666", lineHeight: 1.85, marginBottom: 36 }}>
                Looking for a backend developer who writes clean PHP, crafts reliable APIs, and delivers on time? Let's talk — I'm always open to new opportunities and collaborations.
              </p>
              {[
                { icon: "📧", label: "sheikharha799@gmail.com", href: "mailto:sheikharha799@gmail.com" },
                { icon: "💼", label: "Orio Technologies", href: null },
                { icon: "📍", label: "Pakistan", href: null },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#00f5ff", textDecoration: "none" }}>{item.label}</a>
                  ) : (
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#444" }}>{item.label}</span>
                  )}
                </div>
              ))}
              <div style={{ marginTop: 36, padding: "18px 22px", background: "#0d0d1a", border: "1px solid #00f5ff1a", borderRadius: 14 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#00f5ff", letterSpacing: 2, marginBottom: 10 }}>AVAILABILITY</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "bl 1.5s infinite" }} />
                  <span style={{ color: "#777", fontSize: 14 }}>Open to new opportunities</span>
                </div>
              </div>
            </div>

            {sent ? (
              <div style={{ background: "#0d0d1a", border: "1px solid #00f5ff44", borderRadius: 16, padding: 48, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: "#00f5ff", marginBottom: 10 }}>Message Sent!</div>
                <p style={{ color: "#555", fontSize: 14 }}>I'll get back to you very soon.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input className="field" placeholder="Your Name" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} />
                <input className="field" placeholder="Your Email" type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} />
                <textarea className="field" placeholder="Tell me about your project..." rows={5} value={form.message} onChange={e => setForm(s => ({ ...s, message: e.target.value }))} style={{ resize: "vertical" }} />
                <button className="btn-p" style={{ alignSelf: "flex-start" }} onClick={() => {
                  if (form.name && form.email && form.message) {
                    window.location.href = `mailto:sheikharha799@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${encodeURIComponent(form.email)}`;
                    setSent(true);
                  }
                }}>
                  Send Message →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid #12122a", padding: "24px 20px" }}>
        <div className="footer-inner" style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#00f5ff", letterSpacing: 2 }}>ARHAM.DEV</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#222", textAlign: "center" }}>© 2026 Arham Aamir — PHP Developer</span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "GitHub", href: "https://github.com/sheikharhamm" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/arham-aamir-636b16275" },
              { label: "Email", href: "mailto:sheikharha799@gmail.com" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#2a2a4a", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#00f5ff"}
                onMouseLeave={e => e.currentTarget.style.color = "#2a2a4a"}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
