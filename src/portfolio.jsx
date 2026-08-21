import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import emailjs from "@emailjs/browser";

const NAV_LINKS = ["Overview", "Experience", "Architecture", "Tools", "Contact"];

const ARCHITECTURE_PROJECTS = [
  {
    id: 1,
    title: "Logistics & Courier Management System",
    category: "Logistics / APIs",
    desc: "End-to-end logistics orchestration engine with automated consignment routing, real-time tracking, and multi-courier API integrations.",
    flow: ["Client Portal", "API Gateway", "Courier Dispatch", "Webhook Engine", "MySQL Master"],
    metrics: { throughput: "1.2K req/s", latency: "14ms", uptime: "99.99%" },
    tags: ["PHP 8.x", "MySQL", "REST API", "Courier Webhooks", "OAuth2"],
    color: "#06b6d4",
    icon: "🚚",
    impact: "+45% Automation",
  },
  {
    id: 2,
    title: "Finance & Automated Workflow Portal",
    category: "FinTech / Operations",
    desc: "Transaction ledger and invoice automation suite featuring double-entry reconciliation, payment gateway hooks, and dynamic audit reports.",
    flow: ["Billing Service", "Payment Gateway", "Reconcile Worker", "Ledger DB"],
    metrics: { throughput: "850 req/s", latency: "18ms", uptime: "100%" },
    tags: ["PHP", "MySQL", "Payment APIs", "Transaction Locking", "Cron Schedulers"],
    color: "#8b5cf6",
    icon: "💳",
    impact: "Zero Error Rate",
  },
  {
    id: 3,
    title: "Custom Enterprise REST API Suite",
    category: "API Architecture",
    desc: "High-throughput API micro-services with centralized rate limiting, strict JSON schema validation, and token authentication.",
    flow: ["Web/Mobile Client", "Rate Limiter", "JWT Guard", "Controller", "Cache Layer"],
    metrics: { throughput: "2.4K req/s", latency: "9ms", uptime: "99.98%" },
    tags: ["REST Core", "JWT Auth", "JSON Schema", "Data Sanitization", "PHP OOP"],
    color: "#10b981",
    icon: "⚙️",
    impact: "Sub-10ms Latency",
  },
  {
    id: 4,
    title: "Multi-Carrier & Payment Integration Hub",
    category: "Integrations / Webhooks",
    desc: "Unified middleware for courier tracking, identity verification, and multi-channel payment processors with idempotent retry queues.",
    flow: ["External API", "Webhook Receiver", "Signature Validator", "Job Queue"],
    metrics: { throughput: "950 req/s", latency: "22ms", uptime: "99.95%" },
    tags: ["Third-Party APIs", "Webhooks", "Idempotency", "cURL Engine", "Event Logging"],
    color: "#f59e0b",
    icon: "🔗",
    impact: "99.9% Delivery",
  },
  {
    id: 5,
    title: "Custom WordPress Plugin & Core Engine",
    category: "CMS / Custom Modules",
    desc: "Architected modular plugins with dedicated administrative dashboards, custom hooks & filters, and WooCommerce synchronization.",
    flow: ["WP Core Hooks", "Plugin Controller", "Admin React UI", "Custom DB"],
    metrics: { throughput: "Native", latency: "Fast", uptime: "Production" },
    tags: ["WordPress Plugin API", "WooCommerce", "Hooks & Filters", "PHP OOP", "ACF Pro"],
    color: "#ec4899",
    icon: "🔧",
    impact: "Modular Architecture",
  },
  {
    id: 6,
    title: "High-Performance WordPress Theme Architecture",
    category: "Full Stack / CMS",
    desc: "Bespoke custom themes built from scratch with tailored post architectures, optimized asset bundling, and sub-second load times.",
    flow: ["HTTP Request", "Template Hierarchy", "Cached Queries", "Optimized DOM"],
    metrics: { throughput: "98+ PageSpeed", latency: "380ms TTFB", uptime: "100%" },
    tags: ["Custom Post Types", "ACF Pro", "Semantic HTML5", "Modern CSS", "PHP"],
    color: "#6366f1",
    icon: "🎨",
    impact: "98+ PageSpeed",
  },
];

const CAPABILITY_DOMAINS = [
  {
    id: "db",
    title: "Database Architecture & Optimization",
    desc: "Relational database schema modeling, complex joins, composite indexing strategies, query profiling, and ACID transaction safety.",
    capabilities: [
      { name: "MySQL Query Optimization & EXPLAIN Profiling", level: "Expert" },
      { name: "Index Tuning & Schema Normalization (3NF)", level: "Advanced" },
      { name: "Transaction Isolation & Deadlock Prevention", level: "Advanced" },
      { name: "Data Integrity & Automated Backups", level: "Production" },
    ],
    complexity: "High Complexity",
    scale: "Enterprise Ready",
    color: "#06b6d4",
    icon: "🗄️",
  },
  {
    id: "api",
    title: "API Gateways & RESTful Engineering",
    desc: "Stateless REST API design, token-based authentication (JWT/Bearer), granular error handling, rate limiting, and schema validation.",
    capabilities: [
      { name: "RESTful Endpoint Architecture & Versioning", level: "Expert" },
      { name: "JWT Auth, CORS, & Request Sanitization", level: "Advanced" },
      { name: "JSON Payload Validation & Error Codes", level: "Expert" },
      { name: "High-Throughput cURL & HTTP Clients", level: "Expert" },
    ],
    complexity: "Core Competency",
    scale: "Sub-15ms Latency",
    color: "#8b5cf6",
    icon: "🔌",
  },
  {
    id: "async",
    title: "Integrations & Asynchronous Pipelines",
    desc: "Webhook dispatchers, third-party payment/courier gateways, cron job automation, resilient retries, and data sync middleware.",
    capabilities: [
      { name: "Courier & Shipping Carrier Integrations", level: "Specialist" },
      { name: "Payment Gateway Webhook Verification", level: "Advanced" },
      { name: "Scheduled Cron Jobs & Background Workers", level: "Advanced" },
      { name: "API Monitoring, Telemetry & Logging", level: "Production" },
    ],
    complexity: "Production Grade",
    scale: "Real-time Resilient",
    color: "#10b981",
    icon: "⚡",
  },
];

const TECH_TAXONOMY = [
  { name: "PHP 8.x (OOP)", category: "Backend", primary: true },
  { name: "MySQL / Relational DB", category: "Database", primary: true },
  { name: "REST API Architecture", category: "API & Integrations", primary: true },
  { name: "Laravel / MVC", category: "Backend", primary: true },
  { name: "Payment Gateways (Stripe/PayPal)", category: "API & Integrations", primary: false },
  { name: "Shipping & Courier APIs", category: "API & Integrations", primary: false },
  { name: "JWT & Token Authentication", category: "API & Integrations", primary: false },
  { name: "Query Optimization & Indexes", category: "Database", primary: false },
  { name: "Webhooks & Retry Logic", category: "API & Integrations", primary: false },
  { name: "Postman API Test Suite", category: "DevOps & Tools", primary: false },
  { name: "Git & Version Control", category: "DevOps & Tools", primary: false },
  { name: "JavaScript / ES6+", category: "Backend", primary: false },
  { name: "WordPress Custom Plugins", category: "CMS", primary: false },
  { name: "WooCommerce & ACF Pro", category: "CMS", primary: false },
  { name: "Linux / Server Operations", category: "DevOps & Tools", primary: false },
  { name: "JSON Schema Validation", category: "API & Integrations", primary: false },
];

const API_ENDPOINTS_DATA = {
  "/v1/engineer": {
    engineer: "Arham Aamir",
    role: "Senior Backend & Systems Developer",
    experience_years: "2+",
    current_company: "Orio Technologies",
    location: "Pakistan (Remote / Global Available)",
    status: "OPEN_TO_OPPORTUNITIES",
    core_competencies: [
      "High-Performance PHP (OOP / MVC)",
      "MySQL Schema Design & Optimization",
      "Robust REST APIs & Webhooks",
      "Third-Party Carrier & Payment Integrations"
    ],
    contact_email: "sheikharha799@gmail.com",
    github: "https://github.com/sheikharhamm",
    response_code: 200,
    latency_ms: 11,
  },
  "/v1/metrics": {
    system_status: "HEALTHY",
    uptime_percentage: 99.98,
    average_api_latency: "12ms",
    requests_per_second: "1.5K+",
    database_clusters: "Active (Master/Replica Ready)",
    zero_downtime_deployments: true,
    total_projects_delivered: 15,
    response_code: 200,
    latency_ms: 8,
  },
  "/v1/projects": {
    total: 6,
    featured: [
      "Logistics Management System (Real-time tracking & courier sync)",
      "Finance & Workflow Portal (Automated reconciliation)",
      "Custom Enterprise REST API Suite (JWT Auth & Rate Limiting)",
      "Third-Party Integration Hub (Payment & Shipping APIs)"
    ],
    architecture_style: "RESTful / Modular OOP / Scalable Services",
    response_code: 200,
    latency_ms: 14,
  },
  "/v1/contact/ping": {
    connection: "ESTABLISHED",
    message: "Ready to discuss backend architecture, API engineering, or full-time roles.",
    preferred_channels: ["Email: sheikharha799@gmail.com", "LinkedIn Direct"],
    availability: "Immediate / 2-week notice",
    response_code: 200,
    latency_ms: 6,
  },
};

/* ══════════════════════════════════════════════════════════════════
   HOOK: 3D Mouse Tilt with Smooth Spring
   ══════════════════════════════════════════════════════════════════ */
function useTilt(strength = 6) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ rx: -y * strength, ry: x * strength, scale: 1.015 });
  }, [strength]);

  const onLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, scale: 1 });
  }, []);

  const style = {
    transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`,
    transition: tilt.rx === 0 && tilt.ry === 0
      ? "transform 0.5s cubic-bezier(0.16,1,0.3,1)"
      : "transform 0.1s ease-out",
    willChange: "transform",
  };

  return { ref, style, onMove, onLeave };
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENT: Telemetry & Server Node Canvas
   ══════════════════════════════════════════════════════════════════ */
function TelemetryCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let time = 0;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = [
      { name: "Gateway", x: 0.12, y: 0.5, color: "#6366f1", pulse: 0 },
      { name: "Auth Guard", x: 0.35, y: 0.3, color: "#8b5cf6", pulse: 1 },
      { name: "PHP Core", x: 0.55, y: 0.65, color: "#06b6d4", pulse: 2 },
      { name: "MySQL Pool", x: 0.85, y: 0.35, color: "#10b981", pulse: 3 },
      { name: "Redis Cache", x: 0.85, y: 0.75, color: "#f59e0b", pulse: 4 },
    ];

    const draw = () => {
      time += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Telemetry grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Telemetry Waveform
      ctx.beginPath();
      ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x += 4) {
        const y = h * 0.5 + Math.sin(x * 0.02 + time * 2) * 18 + Math.sin(x * 0.05 - time) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Node connections
      const connections = [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4]];

      connections.forEach(([from, to]) => {
        const n1 = nodes[from];
        const n2 = nodes[to];
        const x1 = n1.x * w;
        const y1 = n1.y * h;
        const x2 = n2.x * w;
        const y2 = n2.y * h;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const packetProgress = (time * 0.6 + from * 0.3) % 1;
        const px = x1 + (x2 - x1) * packetProgress;
        const py = y1 + (y2 - y1) * packetProgress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Nodes
      nodes.forEach((node) => {
        const nx = node.x * w;
        const ny = node.y * h;
        const pRadius = 6 + Math.sin(time * 3 + node.pulse) * 2;

        ctx.beginPath();
        ctx.arc(nx, ny, pRadius + 6, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}20`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, 5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.name, nx, ny + 18);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: 260, borderRadius: 16, overflow: "hidden", background: "rgba(10, 15, 29, 0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ position: "absolute", top: 12, left: 16, display: "flex", alignItems: "center", gap: 8, zIndex: 2 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#e2e8f0", letterSpacing: 1, fontWeight: 600 }}>
          LIVE API & NODE TELEMETRY
        </span>
      </div>
      <div style={{ position: "absolute", top: 12, right: 16, zIndex: 2 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#38bdf8", background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.35)", padding: "3px 9px", borderRadius: 6, fontWeight: 600 }}>
          ~8ms Latency
        </span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENT: Interactive Live API Terminal
   ══════════════════════════════════════════════════════════════════ */
function ApiPlaygroundTerminal() {
  const [endpoint, setEndpoint] = useState("/v1/engineer");
  const [copied, setCopied] = useState(false);
  const [latency, setLatency] = useState(11);
  const [loading, setLoading] = useState(false);

  const activeResponse = API_ENDPOINTS_DATA[endpoint];

  const handleSelectEndpoint = (ep) => {
    setLoading(true);
    setEndpoint(ep);
    setTimeout(() => {
      setLatency(API_ENDPOINTS_DATA[ep].latency_ms + Math.floor(Math.random() * 4) - 2);
      setLoading(false);
    }, 120);
  };

  const copyCurl = () => {
    const curl = `curl -X GET "https://api.arham.dev${endpoint}" \\\n  -H "Accept: application/json" \\\n  -H "Authorization: Bearer guest_token"`;
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-shell glass-card" style={{ padding: 0, overflow: "hidden", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
      {/* Terminal Top Bar */}
      <div style={{ background: "rgba(13, 20, 36, 0.98)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#cbd5e1", fontWeight: 600 }}>
            api.arham.dev (REST Console)
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={copyCurl}
            className="copy-curl-btn"
            style={{
              background: copied ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.15)",
              border: `1px solid ${copied ? "rgba(16,185,129,0.5)" : "rgba(99,102,241,0.4)"}`,
              color: copied ? "#34d399" : "#c7d2fe",
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: 11.5,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 600,
            }}
          >
            {copied ? "✓ Copied cURL" : "Copy cURL"}
          </button>
        </div>
      </div>

      {/* Endpoint Tabs */}
      <div style={{ background: "rgba(9, 14, 26, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
        {Object.keys(API_ENDPOINTS_DATA).map((ep) => {
          const isActive = endpoint === ep;
          return (
            <button
              key={ep}
              onClick={() => handleSelectEndpoint(ep)}
              style={{
                background: isActive ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? "#6366f1" : "rgba(255,255,255,0.06)"}`,
                color: isActive ? "#38bdf8" : "#94a3b8",
                borderRadius: 6,
                padding: "7px 14px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <span style={{ color: ep.startsWith("POST") ? "#f59e0b" : "#10b981", fontWeight: 700, marginRight: 6 }}>
                {ep.startsWith("POST") ? "POST" : "GET"}
              </span>
              {ep.replace(/^(GET|POST) /, "")}
            </button>
          );
        })}
      </div>

      {/* Terminal Code View */}
      <div style={{ padding: "22px 24px", background: "#060913", minHeight: 280, position: "relative" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240, color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, gap: 10 }}>
            <span className="spinner" /> Querying API endpoint...
          </div>
        ) : (
          <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, lineHeight: 1.7, color: "#f8fafc", overflowX: "auto" }}>
            <code>
              {Object.entries(activeResponse).map(([k, v]) => {
                const isCode = k === "response_code";
                const isLat = k === "latency_ms";
                return (
                  <div key={k} style={{ marginBottom: 4 }}>
                    <span style={{ color: "#38bdf8" }}>"{k}"</span>:{" "}
                    {Array.isArray(v) ? (
                      <span style={{ color: "#c7d2fe" }}>
                        [
                        {v.map((item, idx) => (
                          <div key={idx} style={{ paddingLeft: 22, color: "#e2e8f0" }}>
                            "{item}"{idx < v.length - 1 ? "," : ""}
                          </div>
                        ))}
                        ]
                      </span>
                    ) : typeof v === "number" ? (
                      <span style={{ color: isCode ? "#34d399" : isLat ? "#f59e0b" : "#38bdf8", fontWeight: 600 }}>{v}</span>
                    ) : typeof v === "boolean" ? (
                      <span style={{ color: "#c084fc", fontWeight: 600 }}>{v ? "true" : "false"}</span>
                    ) : (
                      <span style={{ color: v === "OPEN_TO_OPPORTUNITIES" ? "#34d399" : "#fdba74" }}>"{v}"</span>
                    )}
                    ,
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </div>

      {/* Terminal Footer Telemetry */}
      <div style={{ background: "rgba(13, 20, 36, 0.98)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ color: "#34d399", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} /> HTTP 200 OK
          </span>
          <span style={{ color: "#cbd5e1" }}>Latency: <strong style={{ color: "#38bdf8" }}>{latency}ms</strong></span>
          <span style={{ color: "#94a3b8" }}>Format: application/json</span>
        </div>
        <span style={{ color: "#a5b4fc", fontWeight: 500 }}>TLS 1.3 · HMAC Auth Ready</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COMPONENT: Architecture Project Bento Card (Pixel-Perfect Alignment)
   ══════════════════════════════════════════════════════════════════ */
function ArchitectureCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const { ref, style: tiltStyle, onMove, onLeave } = useTilt(5);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        onLeave();
      }}
      style={{
        ...tiltStyle,
        background: hovered
          ? "linear-gradient(155deg, rgba(19, 28, 52, 0.95), rgba(13, 19, 36, 0.92))"
          : "rgba(13, 19, 36, 0.85)",
        border: `1px solid ${hovered ? project.color + "70" : "rgba(255,255,255,0.09)"}`,
        borderRadius: 20,
        padding: "26px 22px 22px",
        boxShadow: hovered
          ? `0 24px 50px ${project.color}25, 0 0 0 1px ${project.color}25`
          : "0 8px 30px rgba(0,0,0,0.4)",
        backdropFilter: "blur(16px)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        transition: "border 0.3s, box-shadow 0.3s, background 0.3s",
      }}
    >
      {/* ── Top Block: Header, Title, Description, Flow ── */}
      <div>
        {/* Row 1: Category Tag on Left, Impact Badge on Right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `${project.color}20`,
                border: `1px solid ${project.color}45`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {project.icon}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: project.color,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {project.category}
            </span>
          </div>

          <span
            style={{
              background: `${project.color}18`,
              color: project.color,
              border: `1px solid ${project.color}40`,
              padding: "4px 9px",
              borderRadius: 6,
              fontSize: 10.5,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {project.impact}
          </span>
        </div>

        {/* Row 2: Title with Strict minHeight for 100% Horizontal Alignment */}
        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.35,
            minHeight: 50,
            display: "flex",
            alignItems: "flex-start",
            marginBottom: 10,
          }}
        >
          {project.title}
        </h3>

        {/* Row 3: Description with Consistent minHeight */}
        <p
          style={{
            color: "#cbd5e1",
            fontSize: 13.5,
            lineHeight: 1.7,
            minHeight: 70,
            marginBottom: 16,
          }}
        >
          {project.desc}
        </p>

        {/* Row 4: System Flow Visualizer with Fixed minHeight */}
        <div
          style={{
            background: "rgba(6, 10, 20, 0.85)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "12px 14px",
            minHeight: 84,
            marginBottom: 18,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9.5,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: 1.2,
              marginBottom: 7,
              fontWeight: 600,
            }}
          >
            Architecture Pipeline:
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            {project.flow.map((step, idx) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "#f1f5f9",
                    padding: "3px 7px",
                    borderRadius: 5,
                    fontSize: 10.5,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                  }}
                >
                  {step}
                </span>
                {idx < project.flow.length - 1 && (
                  <span style={{ color: project.color, fontSize: 10, fontWeight: 800 }}>➔</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Block: Performance Metrics & Tags (Locked to Bottom) ── */}
      <div>
        {/* Row 5: KPI Benchmark Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
            padding: "10px 0",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            marginBottom: 14,
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase" }}>Throughput</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#f8fafc", marginTop: 2 }}>{project.metrics.throughput}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase" }}>Latency</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#38bdf8", marginTop: 2 }}>{project.metrics.latency}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase" }}>Availability</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#34d399", marginTop: 2 }}>{project.metrics.uptime}</div>
          </div>
        </div>

        {/* Row 6: Technology Tags with Consistent Area */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", minHeight: 52, alignContent: "flex-start" }}>
          {project.tags.map((t) => (
            <span
              key={t}
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "#cbd5e1",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                padding: "3px 8px",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PORTFOLIO
   ══════════════════════════════════════════════════════════════════ */
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const SERVICE_ID = "service_XXXXXXXX";
  const TEMPLATE_ID = "template_XXXXXXXX";
  const PUBLIC_KEY = "XXXXXXXXXXXXXXXXXXXX";

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setSendError("Please complete all fields before sending.");
      return;
    }
    setSending(true);
    setSendError("");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: "sheikharha799@gmail.com",
        },
        PUBLIC_KEY
      );
      setSent(true);
    } catch {
      setSendError("Failed to dispatch email directly. Please reach me via sheikharha799@gmail.com.");
    } finally {
      setSending(false);
    }
  };

  const roles = useMemo(
    () => [
      "Scalable PHP & OOP Systems",
      "High-Throughput REST APIs",
      "MySQL Query Optimization",
      "Resilient Webhooks & Integrations",
    ],
    []
  );
  const roleRef = useRef(0);
  const charRef = useRef(0);
  const delRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      const role = roles[roleRef.current];
      if (!delRef.current) {
        setTypedText(role.slice(0, charRef.current + 1));
        charRef.current++;
        if (charRef.current === role.length) {
          delRef.current = true;
          setTimeout(tick, 2000);
          return;
        }
      } else {
        setTypedText(role.slice(0, charRef.current - 1));
        charRef.current--;
        if (charRef.current === 0) {
          delRef.current = false;
          roleRef.current = (roleRef.current + 1) % roles.length;
        }
      }
      setTimeout(tick, delRef.current ? 35 : 70);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, [roles]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const targetMap = {
      overview: "home",
      experience: "experience",
      architecture: "architecture",
      tools: "tools",
      contact: "contact",
    };
    const targetId = targetMap[id.toLowerCase()] || id.toLowerCase();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const filteredTech = useMemo(() => {
    if (filterCategory === "All") return TECH_TAXONOMY;
    return TECH_TAXONOMY.filter((t) => t.category === filterCategory);
  }, [filterCategory]);

  return (
    <div style={{ background: "#060911", minHeight: "100vh", color: "#e2e8f0", position: "relative", overflowX: "hidden" }}>
      <style>{`
        /* ── Typography & Headings ── */
        .grad-title {
          background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 60%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-accent {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Buttons ── */
        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #ffffff;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 13px 26px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.6);
        }
        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-secondary {
          background: rgba(13, 19, 36, 0.8);
          color: #e2e8f0;
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 14px;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-secondary:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.5);
          color: #ffffff;
        }

        /* ── Glass Containers ── */
        .glass-card {
          background: rgba(13, 19, 36, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 18px;
          backdrop-filter: blur(20px);
        }
        .glass-panel {
          background: rgba(9, 14, 26, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
        }

        /* ── Input fields ── */
        .input-dark {
          width: 100%;
          background: rgba(13, 19, 36, 0.8);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 14px 16px;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.25s;
        }
        .input-dark:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
          background: rgba(18, 26, 48, 0.95);
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        .pulse-live {
          animation: pulseDot 2s infinite ease-in-out;
        }

        .cursor-blink {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: #38bdf8;
          margin-left: 4px;
          vertical-align: text-bottom;
          animation: blink 0.8s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(99,102,241,0.3);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .page-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 28px;
        }
        .section-padding {
          padding: 100px 0 80px;
          position: relative;
          z-index: 1;
        }

        .architecture-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
        }

        .domain-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
        }

        @media (max-width: 1080px) {
          .architecture-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .domain-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
          .architecture-grid { grid-template-columns: 1fr !important; }
          .domain-grid { grid-template-columns: 1fr !important; }
          .about-split { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-split { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>

      {/* Background ambient lighting */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 65% 45% at 15% 10%, rgba(99, 102, 241, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 85% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 50% 90%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          background: scrolled || menuOpen ? "rgba(6, 9, 17, 0.95)" : "rgba(6, 9, 17, 0.6)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
          {/* Logo & Identity */}
          <div onClick={() => scrollTo("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 800,
                color: "#ffffff",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
              }}
            >
              A
            </div>
            <div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#f8fafc", letterSpacing: 0.2 }}>
                Arham Aamir
              </span>
              <span style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#38bdf8", fontWeight: 600 }}>
                Backend / Systems Engineer
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="desktop-nav" style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {NAV_LINKS.map((link) => {
              const isActive = activeSection.toLowerCase() === link.toLowerCase();
              return (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: isActive ? "#38bdf8" : "#cbd5e1",
                    padding: "8px 16px",
                    borderRadius: 8,
                    transition: "all 0.2s",
                  }}
                >
                  {link}
                </button>
              );
            })}
          </div>

          {/* Status Pill & Hire Me */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                borderRadius: 100,
                padding: "6px 14px",
              }}
            >
              <div className="pulse-live" style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#34d399", fontWeight: 600, letterSpacing: 0.5 }}>
                SYSTEM OPERATIONAL
              </span>
            </div>

            <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => scrollTo("contact")}>
              Hire Me ⚡
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              cursor: "pointer",
              padding: "8px 12px",
              display: "none",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span style={{ display: "block", width: 20, height: 2, background: "#f1f5f9" }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#f1f5f9" }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#f1f5f9" }} />
          </button>
        </div>

        {menuOpen && (
          <div style={{ padding: "16px 0 20px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => {
                  scrollTo(link);
                  setMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  padding: "10px 14px",
                  color: "#e2e8f0",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                {link}
              </button>
            ))}
            <button
              className="btn-primary"
              style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
              onClick={() => {
                scrollTo("contact");
                setMenuOpen(false);
              }}
            >
              Get In Touch
            </button>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section id="home" className="section-padding" style={{ paddingTop: 140 }}>
        <div className="page-wrap">
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 50, alignItems: "center" }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  borderRadius: 100,
                  padding: "6px 14px",
                  marginBottom: 24,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#c7d2fe", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
                  Senior PHP & Systems Architecture
                </span>
              </div>

              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(38px, 5.5vw, 68px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 20 }}>
                <span className="grad-title">BUILDING</span>{" "}
                <span className="grad-accent">HIGH-PERFORMANCE</span><br />
                <span className="grad-title">BACKEND SYSTEMS.</span>
              </h1>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(14px, 2vw, 17px)", color: "#cbd5e1", minHeight: 28, display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
                <span style={{ color: "#38bdf8", fontWeight: 700 }}>&gt;</span>
                <span style={{ color: "#38bdf8", fontWeight: 600 }}>{typedText}</span>
                <span className="cursor-blink" />
              </div>

              <p style={{ color: "#cbd5e1", fontSize: 16, lineHeight: 1.85, maxWidth: 540, marginBottom: 36 }}>
                Full-lifecycle backend engineer with 2+ years of production experience at{" "}
                <strong style={{ color: "#38bdf8" }}>Orio Technologies</strong>. Specializing in high-throughput PHP/MySQL architectures, courier/payment integrations, and automated business workflows.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
                <button className="btn-primary" onClick={() => scrollTo("architecture")}>
                  Explore Architectures ↓
                </button>
                <button className="btn-secondary" onClick={() => scrollTo("tools")}>
                  Live API Terminal ⚡
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 32, borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 24, justifyContent: "start" }}>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: "#f8fafc" }}>
                    2+ <span style={{ fontSize: 16, color: "#818cf8" }}>YRS</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                    Production Exp.
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: "#f8fafc" }}>
                    15+ <span style={{ fontSize: 16, color: "#38bdf8" }}>PROJ</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                    Enterprise Systems
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: "#f8fafc" }}>
                    99.9%
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                    Uptime Target
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="glass-card" style={{ padding: 20, boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
                <TelemetryCanvas />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
                  <div className="glass-panel" style={{ padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#94a3b8", textTransform: "uppercase" }}>Throughput</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#38bdf8", marginTop: 4 }}>1.5K+ /s</div>
                  </div>
                  <div className="glass-panel" style={{ padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#94a3b8", textTransform: "uppercase" }}>DB Latency</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#34d399", marginTop: 4 }}>~8ms</div>
                  </div>
                  <div className="glass-panel" style={{ padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#94a3b8", textTransform: "uppercase" }}>System State</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#fbbf24", marginTop: 4 }}>Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          EXPERIENCE SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section id="experience" className="section-padding" style={{ background: "rgba(9, 13, 24, 0.6)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="page-wrap">
          <div style={{ marginBottom: 48 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
              01 // Professional Journey
            </span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f8fafc", marginTop: 8 }}>
              Engineering Depth & Experience
            </h2>
          </div>

          <div className="about-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 50, alignItems: "start" }}>
            <div>
              <div className="glass-card" style={{ padding: "32px 28px", height: "100%" }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: "#f8fafc", marginBottom: 16 }}>
                  Architecting Reliable Infrastructure
                </h3>
                <p style={{ color: "#cbd5e1", fontSize: 14.5, lineHeight: 1.85, marginBottom: 18 }}>
                  I focus on writing clean, scalable PHP solutions that eliminate operational bottlenecks. Over 2+ years of production experience, I have delivered critical modules that automate logistics pipelines, reconcile complex financials, and interface with external carrier APIs.
                </p>
                <p style={{ color: "#cbd5e1", fontSize: 14.5, lineHeight: 1.85, marginBottom: 24 }}>
                  My engineering philosophy is rooted in <strong>defensive programming</strong>, <strong>index-optimized database structures</strong>, and <strong>clear architectural separation</strong> between transport, business logic, and persistence layers.
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["Clean OOP Code", "Database Indexing", "API Security", "Defensive Architecture"].map((badge) => (
                    <span
                      key={badge}
                      style={{
                        background: "rgba(99, 102, 241, 0.12)",
                        color: "#c7d2fe",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        borderRadius: 6,
                        padding: "6px 13px",
                        fontSize: 11.5,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="glass-card" style={{ padding: "32px 28px", border: "1px solid rgba(99,102,241,0.25)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#38bdf8", fontWeight: 700, letterSpacing: 1 }}>
                      2022 — PRESENT · FULL-TIME
                    </span>
                    <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#f8fafc", marginTop: 4 }}>
                      PHP & Systems Developer
                    </h4>
                    <div style={{ color: "#c7d2fe", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                      Orio Technologies
                    </div>
                  </div>
                  <span
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      padding: "4px 11px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                    }}
                  >
                    Active Production Role
                  </span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    "Designed and maintained core PHP portal modules handling thousands of transactional operations daily.",
                    "Engineered resilient multi-courier shipping and webhook synchronization systems.",
                    "Refactored complex MySQL queries and index layouts, reducing portal query latency by ~35%.",
                    "Architected internal REST API suites with token verification and granular rate limiting.",
                    "Built custom WordPress plugins, automated financial reconciliation routines, and admin dashboards.",
                  ].map((item, idx) => (
                    <li key={idx} style={{ display: "flex", gap: 12, fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>
                      <span style={{ color: "#38bdf8", fontWeight: 700 }}>›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CAPABILITIES & DOMAIN MATRIX (Aligned Bento Grid)
          ══════════════════════════════════════════════════════════════════ */}
      <section id="tools" className="section-padding">
        <div className="page-wrap">
          <div style={{ marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#38bdf8", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
                02 // Core Competencies
              </span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f8fafc", marginTop: 8 }}>
                System Capabilities Matrix
              </h2>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 13.5, fontFamily: "'JetBrains Mono', monospace", maxWidth: 360 }}>
              Grouped by engineering domains with verified production complexity.
            </p>
          </div>

          <div className="domain-grid" style={{ marginBottom: 50 }}>
            {CAPABILITY_DOMAINS.map((domain) => (
              <div
                key={domain.id}
                className="glass-card"
                style={{
                  padding: "26px 22px 22px",
                  border: `1px solid ${domain.color}35`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: `${domain.color}20`, border: `1px solid ${domain.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      {domain.icon}
                    </div>
                    <span style={{ background: `${domain.color}18`, color: domain.color, border: `1px solid ${domain.color}40`, padding: "4px 9px", borderRadius: 6, fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                      {domain.scale}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#f8fafc", minHeight: 48, display: "flex", alignItems: "center", marginBottom: 10 }}>
                    {domain.title}
                  </h3>
                  <p style={{ color: "#cbd5e1", fontSize: 13.5, lineHeight: 1.65, minHeight: 66, marginBottom: 18 }}>
                    {domain.desc}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {domain.capabilities.map((cap) => (
                      <div key={cap.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 11px", background: "rgba(6, 10, 20, 0.8)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: 12, color: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>{cap.name}</span>
                        <span style={{ fontSize: 10.5, color: domain.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{cap.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: "#94a3b8" }}>Complexity:</span>
                  <span style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: "#f8fafc", fontWeight: 600 }}>{domain.complexity}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
                Interactive REST Sandbox
              </span>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: "#f8fafc", marginTop: 4 }}>
                Live API Playground & Query Console
              </h3>
            </div>
            <ApiPlaygroundTerminal />
          </div>

          <div style={{ marginTop: 50 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>
                Full Technical Taxonomy
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["All", "Backend", "Database", "API & Integrations", "CMS", "DevOps & Tools"].map((cat) => {
                  const count = cat === "All" ? TECH_TAXONOMY.length : TECH_TAXONOMY.filter(t => t.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      style={{
                        background: filterCategory === cat ? "rgba(99, 102, 241, 0.25)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${filterCategory === cat ? "#6366f1" : "rgba(255,255,255,0.09)"}`,
                        color: filterCategory === cat ? "#38bdf8" : "#cbd5e1",
                        borderRadius: 6,
                        padding: "5px 12px",
                        fontSize: 11.5,
                        fontFamily: "'JetBrains Mono', monospace",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontWeight: 600,
                      }}
                    >
                      <span>{cat}</span>
                      <span style={{ fontSize: 10, opacity: 0.8, background: "rgba(255,255,255,0.12)", padding: "1px 5px", borderRadius: 4 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {filteredTech.map((tech) => (
                <span
                  key={tech.name}
                  style={{
                    background: tech.primary ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${tech.primary ? "rgba(99,102,241,0.45)" : "rgba(255,255,255,0.09)"}`,
                    color: tech.primary ? "#f8fafc" : "#cbd5e1",
                    padding: "7px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontWeight: 500,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: tech.primary ? "#38bdf8" : "#64748b" }} />
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SELECTED ARCHITECTURES (Pixel-Perfect Aligned Bento Grid)
          ══════════════════════════════════════════════════════════════════ */}
      <section id="architecture" className="section-padding" style={{ background: "rgba(9, 13, 24, 0.6)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="page-wrap">
          <div style={{ marginBottom: 48 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#34d399", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
              03 // Featured Case Studies
            </span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f8fafc", marginTop: 8 }}>
              Selected System Architectures
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: 15, marginTop: 8, maxWidth: 600 }}>
              Production deployments demonstrating data pipelines, low query latency, and high-reliability integrations.
            </p>
          </div>

          <div className="architecture-grid">
            {ARCHITECTURE_PROJECTS.map((project) => (
              <ArchitectureCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CONTACT SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="section-padding">
        <div className="page-wrap">
          <div style={{ marginBottom: 48 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
              04 // Get In Touch
            </span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f8fafc", marginTop: 8 }}>
              Let's Discuss Architecture & Opportunities
            </h2>
          </div>

          <div className="contact-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 16, color: "#cbd5e1", lineHeight: 1.85, marginBottom: 32 }}>
                Whether you need a senior PHP engineer to design a high-throughput API, optimize database performance, or integrate third-party payment/courier services, I'm ready to collaborate.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
                {[
                  { icon: "📧", label: "Email Direct", val: "sheikharha799@gmail.com", href: "mailto:sheikharha799@gmail.com" },
                  { icon: "💼", label: "Current Company", val: "Orio Technologies", href: null },
                  { icon: "📍", label: "Location", val: "Pakistan (Remote / Worldwide Available)", href: null },
                ].map((item) => (
                  <div key={item.label} className="glass-panel" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ color: "#38bdf8", fontSize: 14.5, fontFamily: "'JetBrains Mono', monospace", textDecoration: "none", fontWeight: 700 }}>
                          {item.val}
                        </a>
                      ) : (
                        <div style={{ color: "#f8fafc", fontSize: 14.5, fontWeight: 600 }}>{item.val}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { name: "GitHub", url: "https://github.com/sheikharhamm", icon: "⌨" },
                  { name: "LinkedIn", url: "https://www.linkedin.com/in/arham-aamir-636b16275", icon: "💼" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#f1f5f9",
                      padding: "11px 20px",
                      borderRadius: 10,
                      fontSize: 13.5,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.2s",
                    }}
                  >
                    <span>{s.icon}</span> {s.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="glass-card" style={{ padding: "36px 30px" }}>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 18px" }}>
                      ✓
                    </div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>
                      Message Transmitted!
                    </h3>
                    <p style={{ color: "#cbd5e1", fontSize: 14 }}>
                      Thank you for reaching out. I will respond to your inquiry shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#cbd5e1", marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>
                        Your Name / Organization
                      </label>
                      <input
                        className="input-dark"
                        placeholder="e.g. John Doe / Tech Corp"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#cbd5e1", marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>
                        Direct Email Address
                      </label>
                      <input
                        type="email"
                        className="input-dark"
                        placeholder="e.g. john@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#cbd5e1", marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>
                        Project Scope / Inquiries
                      </label>
                      <textarea
                        className="input-dark"
                        rows={5}
                        placeholder="Tell me about your technical requirements, API needs, or role details..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        style={{ resize: "vertical" }}
                      />
                    </div>

                    {sendError && (
                      <div style={{ color: "#ef4444", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                        {sendError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={sending}
                      style={{ opacity: sending ? 0.7 : 1, cursor: sending ? "not-allowed" : "pointer", alignSelf: "flex-start", marginTop: 6 }}
                    >
                      {sending ? "Transmitting Packet..." : "Dispatch Message →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "32px 24px", background: "rgba(5, 8, 16, 0.98)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>
              A
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#cbd5e1" }}>
              arham.dev
            </span>
          </div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
            © 2026 Arham Aamir — High-Performance PHP & Backend Architectures
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <a href="https://github.com/sheikharhamm" target="_blank" rel="noopener noreferrer" style={{ color: "#cbd5e1", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textDecoration: "none" }}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/arham-aamir-636b16275" target="_blank" rel="noopener noreferrer" style={{ color: "#cbd5e1", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textDecoration: "none" }}>
              LinkedIn
            </a>
            <a href="mailto:sheikharha799@gmail.com" style={{ color: "#cbd5e1", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textDecoration: "none" }}>
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}