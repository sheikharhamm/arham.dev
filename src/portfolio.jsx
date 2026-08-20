import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import emailjs from "@emailjs/browser";

const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Contact"];

const PROJECTS = [
  {
    id: 1,
    title: "Logistics Management System",
    desc: "End-to-end logistics portal with real-time order tracking, shipment management, and third-party courier API integrations for seamless operations.",
    tags: ["PHP", "MySQL", "REST API", "Shipping APIs"],
    color: "#06b6d4",
    icon: "🚚",
  },
  {
    id: 2,
    title: "Finance & Workflow Portal",
    desc: "Built logical structures to streamline finance system workflows — including invoice management, payment processing, and automated reconciliation.",
    tags: ["PHP", "MySQL", "Payment APIs", "Backend"],
    color: "#8b5cf6",
    icon: "💳",
  },
  {
    id: 3,
    title: "Custom REST API Suite",
    desc: "Designed and maintained secure REST APIs for internal and external consumption — with data validation, error handling, and token-based authentication.",
    tags: ["REST API", "PHP", "JSON", "Auth"],
    color: "#10b981",
    icon: "⚙️",
  },
  {
    id: 4,
    title: "Third-Party API Integrations",
    desc: "Integrated shipping carriers, payment gateways, identity verification, and real-time tracking providers into production PHP applications.",
    tags: ["API Integration", "PHP", "Tracking", "Payments"],
    color: "#f59e0b",
    icon: "🔗",
  },
  {
    id: 5,
    title: "Custom WordPress Plugin",
    desc: "Developed feature-rich custom WordPress plugins with admin panels, shortcodes, hooks & filters, and seamless WooCommerce integration.",
    tags: ["WordPress", "PHP", "WooCommerce", "Hooks & Filters"],
    color: "#ef4444",
    icon: "🔧",
  },
  {
    id: 6,
    title: "WordPress Theme Development",
    desc: "Built fully custom WordPress themes from scratch — pixel-perfect responsive designs with custom post types, ACF fields, and optimized performance scores.",
    tags: ["WordPress", "PHP", "ACF", "Responsive Design"],
    color: "#6366f1",
    icon: "🎨",
  },
];

const SKILLS = [
  { name: "PHP Development",         level: 90, color: "#6366f1" },
  { name: "MySQL & Database Ops",    level: 88, color: "#06b6d4" },
  { name: "REST API Design",         level: 85, color: "#10b981" },
  { name: "Third-Party Integrations",level: 83, color: "#f59e0b" },
  { name: "Laravel / MVC Frameworks",level: 78, color: "#8b5cf6" },
  { name: "Frontend (HTML/CSS/JS)",  level: 70, color: "#ec4899" },
];

const TECH_TAGS = [
  "PHP","MySQL","REST APIs","Laravel","JavaScript",
  "HTML/CSS","Git","Postman","Payment Gateways",
  "Shipping APIs","Verification APIs","Query Optimization",
  "Data Validation","Secure Auth","OOP",
  "WordPress","WooCommerce","ACF","Custom Plugins","Theme Dev",
];

/* ══════════════════════════════════════════════════════════════════════
   HOOK: 3D Mouse Tilt
   Returns { ref, style } — attach ref to the tiltable element.
   ══════════════════════════════════════════════════════════════════════ */
function useTilt(strength = 12) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;   // -0.5 … 0.5
    const y = (e.clientY - top)  / height - 0.5;
    setTilt({ rx: -y * strength, ry: x * strength, scale: 1.03 });
  }, [strength]);

  const onLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, scale: 1 });
  }, []);

  const style = {
    transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`,
    transition: tilt.rx === 0 && tilt.ry === 0
      ? "transform 0.6s cubic-bezier(0.16,1,0.3,1)"
      : "transform 0.12s linear",
    willChange: "transform",
  };

  return { ref, style, onMove, onLeave };
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT: Scroll3D wrapper
   Children appear with a 3D rotation + slide from below when scrolled
   into view. direction = "up" | "left" | "right"
   ══════════════════════════════════════════════════════════════════════ */
function Scroll3D({ children, delay = 0, direction = "up", style: extStyle = {} }) {
  const ref  = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el  = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fromMap = {
    up:    "perspective(900px) rotateX(30deg)  translateY(52px)  translateZ(-60px)",
    left:  "perspective(900px) rotateY(-35deg) translateX(-60px) translateZ(-40px)",
    right: "perspective(900px) rotateY(35deg)  translateX(60px)  translateZ(-40px)",
    down:  "perspective(900px) rotateX(-30deg) translateY(-40px) translateZ(-60px)",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) translateZ(0)" : fromMap[direction],
        transition: `opacity 0.75s ease ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "transform, opacity",
        ...extStyle,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT: Particle Field
   ══════════════════════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.2 + 0.3,
      color: ["#6366f1","#06b6d4","#8b5cf6"][Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.4 + 0.1,
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
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 100)})`;
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
  return <canvas ref={canvasRef} style={{ position:"fixed", top:0, left:0, zIndex:0, pointerEvents:"none" }} />;
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT: Floating 3D Geometry (hero background)
   ══════════════════════════════════════════════════════════════════════ */
function FloatingGeometry() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {/* Large rotating ring */}
      <div style={{
        position:"absolute", right:"6%", top:"18%",
        width:320, height:320,
        border:"1px solid rgba(99,102,241,0.12)",
        borderRadius:"50%",
        animation:"spin3d 22s linear infinite",
        transformStyle:"preserve-3d",
      }} />
      {/* Medium tilt ring */}
      <div style={{
        position:"absolute", right:"11%", top:"28%",
        width:200, height:200,
        border:"1px solid rgba(6,182,212,0.08)",
        borderRadius:"50%",
        animation:"spin3d 14s linear infinite reverse",
        transform:"rotateX(60deg)",
        transformStyle:"preserve-3d",
      }} />
      {/* Floating cube wireframe */}
      <div style={{
        position:"absolute", right:"18%", top:"42%",
        width:80, height:80,
        border:"1px solid rgba(139,92,246,0.18)",
        borderRadius:8,
        animation:"floatCube 7s ease-in-out infinite",
        transform:"rotateX(25deg) rotateY(25deg)",
        transformStyle:"preserve-3d",
      }} />
      {/* Small glow orb */}
      <div style={{
        position:"absolute", right:"8%", top:"55%",
        width:140, height:140,
        borderRadius:"50%",
        background:"radial-gradient(circle at 40% 35%, rgba(99,102,241,0.2), rgba(139,92,246,0.1), transparent 70%)",
        animation:"float 9s ease-in-out infinite",
        filter:"blur(2px)",
      }} />
      {/* Corner dot grid */}
      <svg style={{ position:"absolute", right:"3%", bottom:"10%", opacity:0.12 }}
        width="120" height="120" viewBox="0 0 120 120">
        {Array.from({length:5},(_,r)=>Array.from({length:5},(_,c)=>(
          <circle key={`${r}-${c}`} cx={c*28+8} cy={r*28+8} r="2" fill="#6366f1"/>
        )))}
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT: Skill Bar
   ══════════════════════════════════════════════════════════════════════ */
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
    <div ref={ref} style={{ marginBottom:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
        <span style={{ color:"#cbd5e1", fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:500 }}>{name}</span>
        <span style={{ color, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700 }}>{level}%</span>
      </div>
      <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:6, overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${width}%`,
          background:`linear-gradient(90deg,${color}88,${color})`,
          borderRadius:6,
          transition:"width 1.4s cubic-bezier(0.16,1,0.3,1)",
          boxShadow:`0 0 16px ${color}60`,
        }}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT: Project Card (with 3D mouse tilt)
   ══════════════════════════════════════════════════════════════════════ */
function ProjectCard({ p, i }) {
  const [hov, setHov] = useState(false);
  const { ref, style: tiltStyle, onMove, onLeave } = useTilt(10);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); onLeave(); }}
      style={{
        ...tiltStyle,
        background: hov
          ? "linear-gradient(145deg, rgba(15,15,35,0.95), rgba(15,15,35,0.8))"
          : "rgba(10,10,28,0.6)",
        border: `1px solid ${hov ? p.color + "60" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20,
        padding: "32px 28px 28px",
        boxShadow: hov
          ? `0 28px 64px ${p.color}22, 0 0 0 1px ${p.color}18`
          : "0 4px 24px rgba(0,0,0,0.3)",
        backdropFilter: "blur(12px)",
        cursor: "default",
        transformOrigin: "center center",
      }}
    >
      {/* Glow reflection on hover */}
      {hov && (
        <div style={{
          position:"absolute", inset:0, borderRadius:20, pointerEvents:"none",
          background:`radial-gradient(ellipse at 50% 0%, ${p.color}12, transparent 60%)`,
        }}/>
      )}
      <div style={{
        width:52, height:52, borderRadius:14,
        background:`${p.color}15`, border:`1px solid ${p.color}30`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:24, marginBottom:18,
      }}>{p.icon}</div>
      <h3 style={{
        color: hov ? p.color : "#f1f5f9",
        fontFamily:"'Plus Jakarta Sans',sans-serif",
        fontSize:17, fontWeight:700, letterSpacing:0.2, marginBottom:10,
        transition:"color 0.3s", lineHeight:1.4,
      }}>{p.title}</h3>
      <p style={{ color:"#94a3b8", fontSize:13.5, lineHeight:1.8, marginBottom:20 }}>{p.desc}</p>
      <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
        {p.tags.map(tag => (
          <span key={tag} style={{
            background:`${p.color}12`, color:p.color,
            border:`1px solid ${p.color}35`,
            borderRadius:7, padding:"4px 11px",
            fontSize:11, fontFamily:"'JetBrains Mono',monospace", fontWeight:500,
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN PORTFOLIO
   ══════════════════════════════════════════════════════════════════════ */
export default function Portfolio() {
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [typedText,     setTypedText]     = useState("");
  const [form,          setForm]          = useState({ name:"", email:"", message:"" });
  const [sent,          setSent]          = useState(false);
  const [sending,       setSending]       = useState(false);
  const [sendError,     setSendError]     = useState("");
  const [scrollY,       setScrollY]       = useState(0);

  // ── EmailJS ─────────────────────────────────────────────────────────
  const SERVICE_ID  = "service_XXXXXXXX";
  const TEMPLATE_ID = "template_XXXXXXXX";
  const PUBLIC_KEY  = "XXXXXXXXXXXXXXXXXXXX";

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true); setSendError("");
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name:  form.name,
        from_email: form.email,
        message:    form.message,
        to_email:   "sheikharha799@gmail.com",
      }, PUBLIC_KEY);
      setSent(true);
    } catch { setSendError("Failed to send. Please try again or email me directly."); }
    finally  { setSending(false); }
  };

  // ── Typewriter ───────────────────────────────────────────────────────
  const roles   = useMemo(() => ["Backend Developer","PHP Specialist","API Engineer","Problem Solver"], []);
  const roleRef = useRef(0), charRef = useRef(0), delRef = useRef(false);
  useEffect(() => {
    const tick = () => {
      const role = roles[roleRef.current];
      if (!delRef.current) {
        setTypedText(role.slice(0, charRef.current + 1));
        charRef.current++;
        if (charRef.current === role.length) { delRef.current = true; setTimeout(tick, 1800); return; }
      } else {
        setTypedText(role.slice(0, charRef.current - 1));
        charRef.current--;
        if (charRef.current === 0) { delRef.current = false; roleRef.current = (roleRef.current + 1) % roles.length; }
      }
      setTimeout(tick, delRef.current ? 44 : 76);
    };
    const t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [roles]);

  // ── Scroll tracking (parallax + nav) ────────────────────────────────
  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 40); setScrollY(window.scrollY); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Section tracking ─────────────────────────────────────────────────
  useEffect(() => {
    const observers = [];
    NAV_LINKS.forEach(l => {
      const el = document.getElementById(l.toLowerCase());
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(l); },
        { threshold: 0.3, rootMargin: "-60px 0px -35% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id.charAt(0).toUpperCase() + id.slice(1));
  };

  // ── Hero parallax depth factors ──────────────────────────────────────
  const parallaxSlow  = scrollY * 0.18;
  const parallaxMid   = scrollY * 0.30;
  const parallaxFast  = scrollY * 0.50;

  /* ================================================================== */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{
          background:#05050f;color:#e2e8f0;
          font-family:'Inter',sans-serif;
          overflow-x:hidden;
          -webkit-font-smoothing:antialiased;
          -moz-osx-font-smoothing:grayscale;
        }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0a1a}
        ::-webkit-scrollbar-thumb{background:#6366f140;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#6366f170}

        /* ── Blink cursor ── */
        .blink{display:inline-block;width:2px;height:1.1em;background:#6366f1;margin-left:4px;
          vertical-align:text-bottom;border-radius:1px;animation:bl 0.75s ease-in-out infinite}
        @keyframes bl{0%,100%{opacity:1}50%{opacity:0}}

        /* ── Gradient text ── */
        .grad-text{
          background:linear-gradient(135deg,#6366f1 0%,#06b6d4 50%,#8b5cf6 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .grad-text-warm{
          background:linear-gradient(135deg,#f1f5f9 0%,#94a3b8 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        /* ── Nav button ── */
        .nav-btn{
          background:none;border:none;cursor:pointer;
          font-family:'Inter',sans-serif;font-size:13px;font-weight:500;letter-spacing:0.3px;
          padding:7px 14px;border-radius:8px;transition:all 0.25s;
        }
        .nav-btn:hover{background:rgba(99,102,241,0.08)}

        /* ── Primary button ── */
        .btn-primary{
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border:none;color:#fff;font-family:'Inter',sans-serif;font-weight:600;font-size:14px;
          letter-spacing:0.3px;padding:13px 28px;border-radius:10px;cursor:pointer;
          transition:all 0.3s;box-shadow:0 4px 20px rgba(99,102,241,0.3);
        }
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(99,102,241,0.45)}
        .btn-primary:active{transform:translateY(0)}

        /* ── Outline button ── */
        .btn-outline{
          background:transparent;border:1.5px solid rgba(99,102,241,0.45);color:#a5b4fc;
          font-family:'Inter',sans-serif;font-size:14px;font-weight:500;
          padding:12px 26px;border-radius:10px;cursor:pointer;transition:all 0.3s;
        }
        .btn-outline:hover{background:rgba(99,102,241,0.08);border-color:rgba(99,102,241,0.7);color:#c7d2fe}

        /* ── Layout ── */
        .wrap{max-width:1100px;margin:0 auto;padding:0 32px}
        .sec{min-height:100vh;padding:120px 0 90px;position:relative;z-index:1}
        .sec-label{
          font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:3px;
          color:#6366f1;text-transform:uppercase;margin-bottom:12px;font-weight:500;
        }
        .sec-title{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:clamp(36px,6vw,64px);font-weight:800;line-height:1.1;
          margin-bottom:56px;letter-spacing:-0.5px;
        }

        /* ── Form field ── */
        .field{
          width:100%;background:rgba(255,255,255,0.03);
          border:1.5px solid rgba(255,255,255,0.08);border-radius:12px;
          padding:14px 18px;color:#e2e8f0;font-family:'Inter',sans-serif;font-size:14px;outline:none;
          transition:border-color 0.3s,box-shadow 0.3s,background 0.3s;
        }
        .field::placeholder{color:#475569}
        .field:focus{border-color:rgba(99,102,241,0.5);background:rgba(99,102,241,0.04);box-shadow:0 0 0 4px rgba(99,102,241,0.08)}

        /* ── Tech tag ── */
        .tech-tag{
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
          color:#94a3b8;border-radius:8px;padding:7px 14px;
          font-size:12px;font-family:'JetBrains Mono',monospace;cursor:default;transition:all 0.22s;
        }
        .tech-tag:hover{border-color:rgba(99,102,241,0.4);color:#a5b4fc;background:rgba(99,102,241,0.07)}

        /* ── Glass card ── */
        .glass-card{
          background:rgba(10,10,28,0.6);border:1px solid rgba(255,255,255,0.07);
          border-radius:20px;backdrop-filter:blur(16px);
        }

        /* ── Keyframes ── */
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes spin3d{
          0%  {transform:rotateX(0deg)   rotateY(0deg)}
          50% {transform:rotateX(12deg)  rotateY(180deg)}
          100%{transform:rotateX(0deg)   rotateY(360deg)}
        }
        @keyframes floatCube{
          0%,100%{transform:rotateX(25deg) rotateY(25deg)  translateY(0)}
          50%    {transform:rotateX(45deg) rotateY(65deg)  translateY(-18px)}
        }
        @keyframes pulse-ring{
          0%,100%{opacity:1;transform:scale(1)}
          50%    {opacity:0.5;transform:scale(1.3)}
        }
        @keyframes heroFadeIn{
          from{opacity:0;transform:perspective(900px) rotateX(18deg) translateY(30px)}
          to  {opacity:1;transform:perspective(900px) rotateX(0deg)  translateY(0)}
        }

        /* ── Section divider glow line ── */
        .glow-divider{
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(99,102,241,0.4),rgba(6,182,212,0.3),transparent);
          margin:0;
        }

        /* ── Mobile ── */
        @media(max-width:768px){
          .about-grid,.skills-grid,.contact-grid{grid-template-columns:1fr !important}
          .hide-mobile{display:none !important}
          .hero-btns{flex-direction:column !important;align-items:flex-start !important}
          .desktop-nav-links{display:none !important}
          .hamburger{display:flex !important}
          .mobile-menu{display:flex !important}
          .footer-inner{flex-direction:column !important;align-items:center !important;text-align:center !important;gap:14px !important}
          #home{padding-top:100px !important;align-items:flex-start !important}
          .wrap{padding:0 20px}
          .hero-orb{display:none !important}
          .project-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      {/* ── Global radial bg ── */}
      <div style={{
        position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background:"radial-gradient(ellipse 80% 60% at 20% 0%,rgba(99,102,241,0.07) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 80% 100%,rgba(6,182,212,0.05) 0%,transparent 60%)",
      }}/>
      <ParticleField/>

      {/* ════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════ */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 20px",
        background:(scrolled||menuOpen)?"rgba(5,5,15,0.92)":"transparent",
        backdropFilter:(scrolled||menuOpen)?"blur(24px) saturate(180%)":"none",
        borderBottom:(scrolled||menuOpen)?"1px solid rgba(255,255,255,0.06)":"1px solid transparent",
        transition:"all 0.4s",
      }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",height:70 }}>
          <div onClick={() => scrollTo("home")} style={{ cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}>
            <div style={{
              width:32,height:32,borderRadius:9,
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:14,fontWeight:800,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:"0 4px 14px rgba(99,102,241,0.4)",
            }}>A</div>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,color:"#f1f5f9",letterSpacing:0.2 }}>
              arham.dev
            </span>
          </div>

          <div className="desktop-nav-links" style={{ display:"flex",gap:2,alignItems:"center" }}>
            {NAV_LINKS.map(l => (
              <button key={l} className="nav-btn" onClick={() => scrollTo(l.toLowerCase())}
                style={{ color:activeSection===l?"#a5b4fc":"#64748b" }}>
                {l}
              </button>
            ))}
            <button className="btn-primary" style={{ padding:"9px 20px",fontSize:13,marginLeft:12 }}
              onClick={() => scrollTo("contact")}>
              Hire Me
            </button>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(o=>!o)}
            style={{ background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,cursor:"pointer",padding:"9px 11px",display:"none",flexDirection:"column",gap:5 }}>
            <span style={{ display:"block",width:20,height:2,background:menuOpen?"#6366f1":"#94a3b8",borderRadius:2,transition:"all 0.3s",transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none" }}/>
            <span style={{ display:"block",width:20,height:2,background:menuOpen?"transparent":"#94a3b8",borderRadius:2,transition:"opacity 0.3s",opacity:menuOpen?0:1 }}/>
            <span style={{ display:"block",width:20,height:2,background:menuOpen?"#6366f1":"#94a3b8",borderRadius:2,transition:"all 0.3s",transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none" }}/>
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu" style={{ display:"none",flexDirection:"column",gap:4,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:14,paddingBottom:16,paddingLeft:4,paddingRight:4 }}>
            {NAV_LINKS.map(l => (
              <button key={l} className="nav-btn" onClick={() => { scrollTo(l.toLowerCase()); setMenuOpen(false); }}
                style={{ color:activeSection===l?"#a5b4fc":"#94a3b8",textAlign:"left",width:"100%",padding:"13px 10px",fontSize:14 }}>
                {l}
              </button>
            ))}
            <button className="btn-primary" style={{ marginTop:8,width:"100%",padding:"14px" }}
              onClick={() => { scrollTo("contact"); setMenuOpen(false); }}>
              Hire Me
            </button>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════════
          HERO  — 3D parallax depth layers
      ════════════════════════════════════════════ */}
      <div id="home" style={{ minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",zIndex:1,paddingTop:70,overflow:"hidden" }}>
        {/* 3D floating geometry */}
        <FloatingGeometry/>

        <div className="wrap" style={{ width:"100%",paddingTop:60,paddingBottom:60,position:"relative",zIndex:2 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center",gap:40 }}>
            <div>
              {/* Eyebrow — parallax layer 1 (slowest) */}
              <div style={{
                transform:`translateY(${-parallaxSlow * 0.3}px) translateZ(0)`,
                animation:"heroFadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both",
              }}>
                <div style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.25)",
                  borderRadius:100,padding:"6px 16px",marginBottom:28,
                }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:"#10b981",animation:"pulse-ring 2s infinite" }}/>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#94a3b8",letterSpacing:2,textTransform:"uppercase" }}>
                    Available for Work
                  </span>
                </div>
              </div>

              {/* Name — parallax layer 2 */}
              <div style={{
                transform:`translateY(${-parallaxMid * 0.25}px) translateZ(0)`,
                animation:"heroFadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both",
              }}>
                <h1 style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontSize:"clamp(52px,9vw,108px)",fontWeight:800,lineHeight:1,
                  marginBottom:6,letterSpacing:-2,
                }}>
                  <span className="grad-text-warm">Arham</span>
                  <br/>
                  <span className="grad-text">Aamir</span>
                </h1>
              </div>

              {/* Role typewriter — parallax layer 3 */}
              <div style={{
                transform:`translateY(${-parallaxMid * 0.22}px) translateZ(0)`,
                animation:"heroFadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.32s both",
              }}>
                <div style={{
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(13px,2vw,18px)",
                  color:"#64748b",marginBottom:28,minHeight:30,
                  display:"flex",alignItems:"center",gap:6,
                }}>
                  <span style={{ color:"#6366f1" }}>&gt;</span>
                  <span style={{ color:"#94a3b8" }}>{typedText}</span>
                  <span className="blink"/>
                </div>
              </div>

              {/* Description — parallax layer 4 */}
              <div style={{
                transform:`translateY(${-parallaxFast * 0.15}px) translateZ(0)`,
                animation:"heroFadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.44s both",
              }}>
                <p style={{ fontSize:16,color:"#94a3b8",lineHeight:1.85,maxWidth:500,marginBottom:40,fontWeight:400 }}>
                  2+ years building{" "}
                  <span style={{ color:"#a5b4fc",fontWeight:600 }}>robust PHP backends</span>,
                  scalable REST APIs, and complex database systems at{" "}
                  <span style={{ color:"#06b6d4",fontWeight:600 }}>Orio Technologies</span>{" "}
                  — turning business logic into clean, maintainable code.
                </p>
              </div>

              {/* CTAs */}
              <div style={{ animation:"heroFadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.54s both" }}>
                <div className="hero-btns" style={{ display:"flex",gap:14,flexWrap:"wrap",marginBottom:60 }}>
                  <button className="btn-primary" onClick={() => scrollTo("projects")}>View My Work →</button>
                  <button className="btn-outline" onClick={() => scrollTo("contact")}>Get In Touch</button>
                </div>
              </div>

              {/* Stats — parallax layer 5 (fastest sink) */}
              <div style={{
                transform:`translateY(${-parallaxFast * 0.12}px) translateZ(0)`,
                animation:"heroFadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.68s both",
                display:"flex",gap:48,flexWrap:"wrap",
              }}>
                {[["2+","Years Experience"],["15+","Projects Built"],["10+","APIs Integrated"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{
                      fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:40,fontWeight:800,lineHeight:1,
                      background:"linear-gradient(135deg,#6366f1,#06b6d4)",
                      WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                    }}>{n}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#475569",letterSpacing:2,marginTop:5,textTransform:"uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Orb — counter-parallax (moves up slower) */}
            <div className="hero-orb" style={{
              position:"relative",width:300,height:300,flexShrink:0,
              transform:`translateY(${parallaxSlow * 0.2}px) rotateX(${scrollY * 0.02}deg)`,
              transition:"transform 0.1s linear",
            }}>
              <div style={{
                position:"absolute",inset:0,borderRadius:"50%",
                background:"radial-gradient(circle at 40% 35%,rgba(99,102,241,0.25),rgba(139,92,246,0.15),transparent 70%)",
                animation:"float 8s ease-in-out infinite",
              }}/>
              <div style={{
                position:"absolute",inset:20,borderRadius:"50%",
                border:"1px solid rgba(99,102,241,0.15)",
                animation:"spin3d 25s linear infinite",
              }}/>
              <div style={{
                position:"absolute",inset:50,borderRadius:"50%",
                border:"1px solid rgba(6,182,212,0.1)",
                animation:"spin3d 18s linear infinite reverse",
              }}/>
              {[
                {top:"12%",left:"60%",color:"#6366f1",s:8},
                {top:"75%",left:"15%",color:"#06b6d4",s:6},
                {top:"50%",left:"82%",color:"#8b5cf6",s:5},
                {top:"30%",left:"10%",color:"#10b981",s:4},
              ].map((d,i)=>(
                <div key={i} style={{
                  position:"absolute",top:d.top,left:d.left,
                  width:d.s,height:d.s,borderRadius:"50%",
                  background:d.color,boxShadow:`0 0 10px ${d.color}`,
                  animation:`float ${5+i}s ease-in-out infinite`,
                  animationDelay:`${i*0.5}s`,
                }}/>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",
          display:"flex",flexDirection:"column",alignItems:"center",gap:8,
          opacity: scrollY > 80 ? 0 : 1, transition:"opacity 0.4s",
        }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#334155",letterSpacing:3,textTransform:"uppercase" }}>Scroll</span>
          <div style={{
            width:1,height:48,
            background:"linear-gradient(to bottom,rgba(99,102,241,0.6),transparent)",
            animation:"float 2s ease-in-out infinite",
          }}/>
        </div>
      </div>

      <div className="glow-divider"/>

      {/* ════════════════════════════════════════════
          ABOUT  — 3D reveal on scroll
      ════════════════════════════════════════════ */}
      <section id="about" className="sec">
        <div className="wrap">
          <Scroll3D direction="up" delay={0}>
            <div className="sec-label">01 — About Me</div>
            <h2 className="sec-title">
              <span className="grad-text-warm">Who</span>{" "}
              <span className="grad-text">Am I?</span>
            </h2>
          </Scroll3D>

          <div className="about-grid" style={{ display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:60,alignItems:"start" }}>
            {/* Bio — slides from left */}
            <Scroll3D direction="left" delay={100}>
              <p style={{ fontSize:16,color:"#94a3b8",lineHeight:1.9,marginBottom:22 }}>
                I'm{" "}
                <span style={{ color:"#a5b4fc",fontWeight:600 }}>Arham Aamir</span>, a Backend Developer with 2+ years of hands-on experience specializing in{" "}
                <span style={{ color:"#10b981",fontWeight:600 }}>PHP</span>{" "}
                — building robust, scalable systems that power real-world business operations.
              </p>
              <p style={{ fontSize:16,color:"#94a3b8",lineHeight:1.9,marginBottom:22 }}>
                At{" "}
                <span style={{ color:"#06b6d4",fontWeight:600 }}>Orio Technologies</span>, I develop efficient modules, handle complex databases, and integrate third-party APIs for logistics, finance, and dynamic portal systems.
              </p>
              <p style={{ fontSize:16,color:"#94a3b8",lineHeight:1.9,marginBottom:36 }}>
                I pride myself on writing clean, maintainable code, solving problems logically, and delivering tailored solutions that drive impactful outcomes — always eager to learn and adapt.
              </p>
              <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                {["Open to Opportunities","Remote Friendly","Based in Pakistan"].map(t=>(
                  <span key={t} style={{
                    background:"rgba(99,102,241,0.08)",color:"#a5b4fc",
                    border:"1px solid rgba(99,102,241,0.2)",borderRadius:8,
                    padding:"7px 15px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:500,
                  }}>{t}</span>
                ))}
              </div>
            </Scroll3D>

            {/* Experience — slides from right */}
            <Scroll3D direction="right" delay={200}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:3,color:"#475569",textTransform:"uppercase",marginBottom:20 }}>Experience</div>
              <div style={{ display:"flex",gap:16 }}>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0 }}>
                  <div style={{ width:12,height:12,borderRadius:"50%",background:"#6366f1",boxShadow:"0 0 16px rgba(99,102,241,0.6)",flexShrink:0 }}/>
                  <div style={{ width:1,flex:1,background:"linear-gradient(to bottom,rgba(99,102,241,0.4),transparent)",marginTop:6 }}/>
                </div>
                <div className="glass-card" style={{ padding:"22px 22px 24px",flex:1 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#6366f1",marginBottom:6,letterSpacing:1.5,fontWeight:700 }}>2022 — PRESENT</div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:700,color:"#f1f5f9",letterSpacing:-0.3,marginBottom:4 }}>PHP Developer</div>
                  <div style={{ color:"#8b5cf6",fontSize:12,marginBottom:18,fontFamily:"'JetBrains Mono',monospace" }}>Orio Technologies · Full-time</div>
                  <ul style={{ paddingLeft:16,color:"#94a3b8",fontSize:13.5,lineHeight:2 }}>
                    {[
                      "Designed & developed logical portal modules",
                      "Integrated shipping, payment & tracking APIs",
                      "Built & maintained custom REST APIs",
                      "Optimized complex MySQL queries & data integrity",
                      "Streamlined finance & logistics workflows",
                      "Full-stack PHP: backend, frontend & database",
                    ].map(item=>(
                      <li key={item} style={{ marginBottom:2 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Scroll3D>
          </div>
        </div>
      </section>

      <div className="glow-divider"/>

      {/* ════════════════════════════════════════════
          SKILLS  — 3D stagger reveal
      ════════════════════════════════════════════ */}
      <section id="skills" className="sec" style={{ paddingTop:80 }}>
        <div className="wrap">
          <Scroll3D direction="up" delay={0}>
            <div className="sec-label">02 — Skills</div>
            <h2 className="sec-title">
              <span className="grad-text-warm">My</span>{" "}
              <span className="grad-text">Toolkit</span>
            </h2>
          </Scroll3D>

          {/* Skill bars */}
          <div className="skills-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 80px",marginBottom:56 }}>
            <Scroll3D direction="left" delay={100}>
              <div>{SKILLS.slice(0,3).map((s,i)=><SkillBar key={s.name} {...s} delay={i*150}/>)}</div>
            </Scroll3D>
            <Scroll3D direction="right" delay={150}>
              <div>{SKILLS.slice(3).map((s,i)=><SkillBar key={s.name} {...s} delay={i*150+200}/>)}</div>
            </Scroll3D>
          </div>

          {/* Tech tags */}
          <Scroll3D direction="up" delay={0}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:3,color:"#475569",textTransform:"uppercase",marginBottom:16 }}>Technologies</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:9,marginBottom:56 }}>
              {TECH_TAGS.map(tech=>(
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          </Scroll3D>

          {/* Specialty cards — staggered 3D flip */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18 }}>
            {[
              { icon:"🗄️",title:"Database Mastery",  desc:"Complex queries, performance tuning, and data integrity with MySQL.", color:"#06b6d4" },
              { icon:"🔌",title:"API Engineering",    desc:"Custom REST APIs and seamless third-party integrations — payments, shipping, and more.", color:"#8b5cf6" },
              { icon:"🧩",title:"Modular PHP",        desc:"Clean, reusable OOP modules built for long-term maintainability and scale.", color:"#10b981" },
            ].map((c,i)=>(
              <Scroll3D key={c.title} direction={i===1?"up":i===0?"left":"right"} delay={i*120}>
                <div className="glass-card" style={{ padding:"26px 24px",border:`1px solid ${c.color}20`,height:"100%" }}>
                  <div style={{
                    width:48,height:48,borderRadius:13,
                    background:`${c.color}14`,border:`1px solid ${c.color}25`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:22,marginBottom:16,
                  }}>{c.icon}</div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:700,color:"#f1f5f9",marginBottom:8 }}>{c.title}</div>
                  <p style={{ color:"#94a3b8",fontSize:13.5,lineHeight:1.75 }}>{c.desc}</p>
                </div>
              </Scroll3D>
            ))}
          </div>
        </div>
      </section>

      <div className="glow-divider"/>

      {/* ════════════════════════════════════════════
          PROJECTS  — 3D tilt cards + scroll reveal
      ════════════════════════════════════════════ */}
      <section id="projects" className="sec" style={{ paddingTop:80 }}>
        <div className="wrap">
          <Scroll3D direction="up" delay={0}>
            <div className="sec-label">03 — Projects</div>
            <h2 className="sec-title">
              <span className="grad-text-warm">Selected</span>{" "}
              <span className="grad-text">Works</span>
            </h2>
          </Scroll3D>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20 }}>
            {PROJECTS.map((p,i)=>(
              <Scroll3D
                key={p.id}
                direction={i%3===0?"left":i%3===1?"up":"right"}
                delay={i*80}
                style={{ position:"relative" }}
              >
                <ProjectCard p={p} i={i}/>
              </Scroll3D>
            ))}
          </div>
        </div>
      </section>

      <div className="glow-divider"/>

      {/* ════════════════════════════════════════════
          CONTACT  — 3D reveal
      ════════════════════════════════════════════ */}
      <section id="contact" className="sec" style={{ paddingTop:80 }}>
        <div className="wrap">
          <Scroll3D direction="up" delay={0}>
            <div className="sec-label">04 — Contact</div>
            <h2 className="sec-title">
              <span className="grad-text-warm">Let's</span>{" "}
              <span className="grad-text">Connect</span>
            </h2>
          </Scroll3D>

          <div className="contact-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:60 }}>
            {/* Left */}
            <Scroll3D direction="left" delay={100}>
              <p style={{ fontSize:16,color:"#94a3b8",lineHeight:1.85,marginBottom:36 }}>
                Looking for a backend developer who writes clean PHP, crafts reliable APIs, and delivers on time? Let's talk — I'm always open to new opportunities and collaborations.
              </p>

              {[
                { icon:"📧",label:"sheikharha799@gmail.com",href:"mailto:sheikharha799@gmail.com" },
                { icon:"💼",label:"Orio Technologies",      href:null },
                { icon:"📍",label:"Pakistan",               href:null },
              ].map(item=>(
                <div key={item.label} style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18 }}>
                  <div style={{
                    width:40,height:40,borderRadius:10,
                    background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.15)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,
                  }}>{item.icon}</div>
                  {item.href
                    ? <a href={item.href} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#a5b4fc",textDecoration:"none",transition:"color 0.2s" }}
                        onMouseEnter={e=>e.currentTarget.style.color="#c7d2fe"}
                        onMouseLeave={e=>e.currentTarget.style.color="#a5b4fc"}>{item.label}</a>
                    : <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#64748b" }}>{item.label}</span>
                  }
                </div>
              ))}

              <div style={{ display:"flex",gap:12,marginTop:28,marginBottom:32 }}>
                {[
                  { label:"GitHub",   href:"https://github.com/sheikharhamm",                         icon:"⌨" },
                  { label:"LinkedIn", href:"https://www.linkedin.com/in/arham-aamir-636b16275",       icon:"💼" },
                ].map(s=>(
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#94a3b8",fontSize:13,fontFamily:"'Inter',sans-serif",textDecoration:"none",transition:"all 0.25s",fontWeight:500 }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(99,102,241,0.4)";e.currentTarget.style.color="#a5b4fc";e.currentTarget.style.background="rgba(99,102,241,0.07)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.color="#94a3b8";e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
                    <span>{s.icon}</span> {s.label}
                  </a>
                ))}
              </div>

              <div className="glass-card" style={{ padding:"18px 22px",border:"1px solid rgba(16,185,129,0.15)" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#10b981",letterSpacing:2,marginBottom:10,fontWeight:600 }}>AVAILABILITY</div>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:"#10b981",boxShadow:"0 0 10px #10b981",animation:"pulse-ring 2s infinite" }}/>
                  <span style={{ color:"#94a3b8",fontSize:14 }}>Open to new opportunities</span>
                </div>
              </div>
            </Scroll3D>

            {/* Right — form */}
            <Scroll3D direction="right" delay={200}>
              {sent ? (
                <div className="glass-card" style={{ padding:56,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16 }}>
                  <div style={{ width:64,height:64,borderRadius:"50%",background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28 }}>✅</div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:26,fontWeight:700,color:"#f1f5f9" }}>Message Sent!</div>
                  <p style={{ color:"#94a3b8",fontSize:14 }}>I'll get back to you very soon.</p>
                </div>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                  <input className="field" placeholder="Your Name" value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))}/>
                  <input className="field" placeholder="Your Email" type="email" value={form.email} onChange={e=>setForm(s=>({...s,email:e.target.value}))}/>
                  <textarea className="field" placeholder="Tell me about your project..." rows={5} value={form.message} onChange={e=>setForm(s=>({...s,message:e.target.value}))} style={{ resize:"vertical" }}/>
                  {sendError && <p style={{ color:"#ef4444",fontFamily:"'JetBrains Mono',monospace",fontSize:12,marginTop:-4 }}>{sendError}</p>}
                  <button className="btn-primary"
                    style={{ alignSelf:"flex-start",opacity:sending?0.7:1,cursor:sending?"not-allowed":"pointer" }}
                    onClick={handleSend} disabled={sending}>
                    {sending?"Sending...":"Send Message →"}
                  </button>
                </div>
              )}
            </Scroll3D>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer style={{ position:"relative",zIndex:1,borderTop:"1px solid rgba(255,255,255,0.06)",padding:"28px 20px" }}>
        <div className="footer-inner" style={{ maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{
              width:28,height:28,borderRadius:8,
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:12,fontWeight:800,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",
            }}>A</div>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:700,color:"#cbd5e1",letterSpacing:0.2 }}>arham.dev</span>
          </div>

          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#334155",textAlign:"center" }}>
            © 2026 Arham Aamir — PHP Developer
          </span>

          <div style={{ display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center" }}>
            {[
              { label:"GitHub",   href:"https://github.com/sheikharhamm" },
              { label:"LinkedIn", href:"https://www.linkedin.com/in/arham-aamir-636b16275" },
              { label:"Email",    href:"mailto:sheikharha799@gmail.com" },
            ].map(l=>(
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:"'Inter',sans-serif",fontSize:13,color:"#475569",textDecoration:"none",transition:"color 0.2s",fontWeight:500 }}
                onMouseEnter={e=>e.currentTarget.style.color="#a5b4fc"}
                onMouseLeave={e=>e.currentTarget.style.color="#475569"}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}