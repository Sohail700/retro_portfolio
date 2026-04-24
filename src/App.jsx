import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0a0700",
  panel: "#201601",
  card: "#141000",
  border: "#4f3100",
  amber: "#d97f0a",
  bright: "#ffaa33",
  dim: "#f5cc8f",
  ghost: "#49350d",
  text: "#eed3ac",
  success: "#4a9a4a",
  error: "#792f2f",
};
const FS = {
  xs: "0.75rem",
  sm: "0.85rem",
  md: "1rem",
  lg: "1.2rem",
  xl: "1.5rem",
};
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }

  html { 
    font-size: 19px; /* 🔥 master control */
  }

  body, #root { 
    height: 100%; 
    overflow: hidden; 
    background: ${T.bg}; 
    font-family: 'Share Tech Mono', monospace;
  }

  /* 🔥 FORCE GLOBAL TEXT SCALING */
  * {
    font-size: 1rem;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.dim}; }
  ::selection { background: ${T.amber}; color: ${T.bg}; }

  input, textarea, button { 
    font-family: 'Share Tech Mono', monospace; 
    font-size: 1rem;
  }
`;
// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "01",
    title: "SoulCircle",
    tech: ["React Native", "Expo", "NativeWind", "Firebase"],
    desc: "Islamic lifestyle super-app — Daily Tafsir, Habit Tracker, Community Feed, Anonymous Q&A, and Circles for group reflection. Built with love for the ummah.",
    tags: ["mobile", "islamic", "active"],
    status: "active",
    stars: 24,
    forks: 3,
    url: "https://github.com/Sohail700?tab=repositories",
  },
  {
    id: "02",
    title: "HAR — Human Activity Recognition",
    tech: ["Python", "CNN", "LSTM", "TensorFlow", "UCI-HAR"],
    desc: "AI-based activity recognition using CNN/LSTM on UCI-HAR dataset. Achieved 92.4% accuracy. Final-year major project — IEEE two-column format.",
    tags: ["ai", "deep-learning", "thesis"],
    status: "complete",
    stars: 18,
    forks: 5,
    url: "https://github.com/Sohail700?tab=repositories",
  },
  {
    id: "03",
    title: "Staff Management System",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
    desc: "Full-stack HR management app with role-based access, employee records, leave management, and dashboard analytics.",
    tags: ["fullstack", "next.js", "complete"],
    status: "complete",
    stars: 9,
    forks: 1,
    url: "https://github.com/Sohail700?tab=repositories",
  },
  {
    id: "04",
    title: "Lucknow Metro Redesign",
    tech: ["React", "SVG", "Figma", "Design Systems"],
    desc: "Japanese-minimalist logo redesign referencing Nawabi architecture, Devanagari script, and Awadhi craft motifs. SVG-based React components.",
    tags: ["design", "svg", "complete"],
    status: "complete",
    stars: 31,
    forks: 7,
    url: "https://github.com/Sohail700?tab=repositories",
  },
  {
    id: "05",
    title: "Weather App",
    tech: ["React", "Vite", "OpenWeatherMap API"],
    desc: "Sunset-themed weather application with live API, animated sky backgrounds, hourly and 5-day forecasts.",
    tags: ["react", "api", "complete"],
    status: "complete",
    stars: 12,
    forks: 2,
    url: "https://github.com/Sohail700?tab=repositories",
  },
  {
    id: "06",
    title: "URL Checker Extension",
    tech: ["JavaScript", "WebExtensions API", "Firefox"],
    desc: "Browser extension to validate company URLs — checks status codes, redirects, and SSL certificates in real-time.",
    tags: ["extension", "js", "complete"],
    status: "complete",
    stars: 6,
    forks: 1,
    url: "https://github.com/Sohail700?tab=repositories",
  },
  {
    id: "07",
    title: "DSA Revision App",
    tech: ["React", "Recharts", "CSS Animations"],
    desc: "Interactive DSA study companion with 10 topics, animated visualizations, quiz mode, and progress tracking for interview prep.",
    tags: ["dsa", "education", "active"],
    status: "active",
    stars: 14,
    forks: 4,
    url: "https://github.com/Sohail700?tab=repositories",
  },
  {
    id: "08",
    title: "Auth Backend API",
    tech: ["Node.js", "Express", "MongoDB", "JWT"],
    desc: "Production-ready authentication service with JWT, refresh tokens, role-based permissions, rate limiting, and Swagger docs.",
    tags: ["backend", "api", "complete"],
    status: "complete",
    stars: 8,
    forks: 2,
    url: "https://github.com/Sohail700?tab=repositories",
  },
];

const SKILLS = {
  Frontend: {
    items: ["React", "Next.js", "HTML/CSS", "Tailwind", "SVG", "Framer Motion"],
    pct: 88,
  },
  Backend: {
    items: ["Node.js", "Express", "REST APIs", "JWT", "Socket.io"],
    pct: 80,
  },
  Mobile: {
    items: ["React Native", "Flutter", "Dart", "Expo", "NativeWind"],
    pct: 68,
  },
  "AI / ML": {
    items: ["Python", "TensorFlow", "CNN", "LSTM", "Scikit-learn", "Pandas"],
    pct: 75,
  },
  Databases: {
    items: ["MongoDB", "PostgreSQL", "Prisma", "Firebase", "SQL"],
    pct: 72,
  },
  Tools: {
    items: ["Git", "GitHub", "Figma", "Blender", "VS Code", "Vite"],
    pct: 85,
  },
};

const EXPERIENCE = [
  {
    co: "Saral Tech",
    role: "Full-Stack Intern",
    period: "2024–2025",
    tech: "Next.js · Node.js · MongoDB",
    desc: "Shipped production features, optimized REST APIs, and performed code reviews in an agile team.",
  },
  {
    co: "The Spark Foundation",
    role: "Web Dev Intern",
    period: "2023",
    tech: "HTML · CSS · JS · REST APIs",
    desc: "Built and optimized web pages; integrated external REST APIs for dynamic content.",
  },
  {
    co: "Codesoft",
    role: "Frontend Intern",
    period: "2022",
    tech: "React · JavaScript",
    desc: "Developed reusable React components and improved UI/UX across key user flows.",
  },
];

const JOURNALS = [
  {
    date: "Apr 2026",
    e: "🎓",
    title: "Romanian Gov Scholarship — Submitted",
    body: "Filed POLITEHNICA Bucharest as first choice with apostilled transcripts across 7 semesters. CGPA 7.62. Fingers crossed.",
    tags: ["scholarship", "milestone"],
  },
  {
    date: "Mar 2026",
    e: "💼",
    title: "Tech2Globe AI Ops — Round 1 Cleared",
    body: "Passed the technical screening. Evaluated employment bond legality carefully before proceeding. A calculated move.",
    tags: ["career", "internship"],
  },
  {
    date: "Jan 2026",
    e: "🤖",
    title: "HAR Project — 92.4% Accuracy",
    body: "CNN/LSTM pipeline on UCI-HAR wrapped up. Full IEEE two-column paper written. Proud of this one.",
    tags: ["ai", "thesis"],
  },
  {
    date: "Dec 2025",
    e: "⚡",
    title: "Saral Tech — Internship Complete",
    body: "Shipped real features with Next.js, Node.js and MongoDB. Learned what production code review actually looks like.",
    tags: ["internship", "fullstack"],
  },
  {
    date: "Oct 2025",
    e: "🕌",
    title: "SoulCircle — First Commit",
    body: "Started the Islamic lifestyle app I always wanted. React Native + Expo. Made dua before the first commit.",
    tags: ["mobile", "islamic"],
  },
  {
    date: "Aug 2025",
    e: "🗼",
    title: "Lucknow Metro Redesign — Published",
    body: "Japanese-minimalist take on Nawabi heritage. The SVG logo got 31 GitHub stars. Unexpected.",
    tags: ["design", "open-source"],
  },
];

const NOTIFS_INIT = [
  {
    id: 1,
    icon: "★",
    text: "HAR project received 5 new stars on GitHub",
    time: "2h ago",
    read: false,
  },
  {
    id: 2,
    icon: "◎",
    text: "Romanian scholarship portal updated — check status",
    time: "5h ago",
    read: false,
  },
  {
    id: 3,
    icon: "✉",
    text: "New C-Mail from recruiter@company.com",
    time: "1d ago",
    read: false,
  },
  {
    id: 4,
    icon: "⚡",
    text: "SoulCircle — 3 new issues opened",
    time: "2d ago",
    read: true,
  },
  {
    id: 5,
    icon: "⬆",
    text: "DSA Revision App v1.2.0 deployed successfully",
    time: "3d ago",
    read: true,
  },
];

const ALL_CMDS = [
  { key: "p", label: "Go to Profile", action: () => "profile" },
  { key: "r", label: "Go to Projects", action: () => "projects" },
  { key: "s", label: "Go to Skills", action: () => "skills" },
  { key: "x", label: "Go to Experience", action: () => "experience" },
  { key: "j", label: "Go to Journal", action: () => "journal" },
  { key: "c", label: "Go to Contact", action: () => "contact" },
  { key: "t", label: "Open Terminal", action: () => "terminal" },
  { key: "b", label: "Bookmarks", action: () => "bookmarks" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer");
const copyToClipboard = (text, cb) =>
  navigator.clipboard
    ?.writeText(text)
    .then(() => cb(`Copied: ${text}`))
    .catch(() => cb("Copy failed"));

// ─── PIXEL AVATAR ─────────────────────────────────────────────────────────────
const PixelAvatar = ({ size = 88 }) => (
  <img
    src="/cat.jpg"
    alt="logo"
    width={size}
    height={size}
    style={{
      imageRendering: "pixelated",
      border: `1px solid ${T.dim}`,
      background: T.card,
      flexShrink: 0,
      objectFit: "cover",
    }}
  />
);

// ─── SMALL UI ─────────────────────────────────────────────────────────────────
const Tag = ({ l }) => (
  <span
    style={{
      background: T.ghost,
      border: `1px solid ${T.border}`,
      color: T.dim,
      padding: "1px 7px",
      fontSize: 10,
      marginRight: 4,
      marginBottom: 3,
      display: "inline-block",
    }}
  >
    {l}
  </span>
);

function Btn({ children, onClick, variant = "def", style = {} }) {
  const [h, setH] = useState(false);
  const isPri = variant === "primary";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? (isPri ? T.amber : T.ghost) : "transparent",
        border: `1px solid ${isPri ? T.amber : T.border}`,
        color: isPri ? (h ? T.bg : T.amber) : h ? T.bright : T.dim,
        padding: "4px 12px",
        cursor: "pointer",
        fontSize: 11,
        transition: "all 0.12s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style = {}, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        border: `1px solid ${h ? T.dim : T.border}`,
        background: h ? "#1c1200" : T.card,
        padding: "12px 14px",
        marginBottom: 8,
        animation: "fadeIn 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.14s,background 0.14s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const SH = ({ t }) => (
  <div
    style={{
      color: T.bright,
      letterSpacing: 4,
      fontSize: 10,
      marginBottom: 10,
      paddingBottom: 5,
      borderBottom: `1px solid ${T.border}`,
      textTransform: "uppercase",
    }}
  >
    {t}
  </div>
);

const Dot = ({ s }) => (
  <span
    style={{
      display: "inline-block",
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: s === "active" ? T.bright : T.dim,
      marginRight: 6,
      boxShadow: `0 0 4px ${s === "active" ? T.bright : T.dim}`,
      animation: s === "active" ? "blink 1.3s infinite" : "none",
    }}
  />
);

// ─── BOOT SCREEN ──────────────────────────────────────────────────────────────
function BootScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const [pct, setPct] = useState(0);
  const LINES = [
    "Sohail Portfolio v1.0.0 — initializing kernel...",
    "Loading module: CSE.AI.CloudComputing",
    "Mounting /projects ... 8 entries found",
    "Mounting /skills   ... 6 categories",
    "Mounting /journal  ... 6 entries",
    "TensorFlow LSTM: status OK [92.4% acc]",
    "Network: portfolio.sohail.online — UP",
    "✓ All systems nominal. Assalam Alaikum ☽",
  ];
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setLines((l) => [...l, LINES[i]]);
      setPct(Math.round(((i + 1) / LINES.length) * 100));
      i++;
      if (i >= LINES.length) {
        clearInterval(iv);
        setTimeout(onDone, 700);
      }
    }, 270);
    return () => clearInterval(iv);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: T.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "'Share Tech Mono',monospace",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          fontFamily: "'VT323',monospace",
          fontSize: 52,
          color: T.bright,
          letterSpacing: 6,
          animation: "glow 2s infinite",
          marginBottom: 30,
        }}
      >
        S☉hail
      </div>
      <div style={{ width: "100%", maxWidth: 440, marginBottom: 20 }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              color: i === lines.length - 1 ? T.bright : T.dim,
              fontSize: 12,
              marginBottom: 4,
              animation: "typeIn 0.15s ease",
            }}
          >
            {i === lines.length - 1 ? "▶ " : "  "}
            {l}
          </div>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ background: T.ghost, height: 4, marginBottom: 5 }}>
          <div
            style={{
              height: "100%",
              background: `linear-gradient(90deg,${T.dim},${T.bright})`,
              width: `${pct}%`,
              transition: "width 0.26s",
              boxShadow: `0 0 8px ${T.amber}`,
            }}
          />
        </div>
        <div style={{ color: T.dim, fontSize: 10 }}>Loading... {pct}%</div>
      </div>
    </div>
  );
}

// ─── TOASTS ───────────────────────────────────────────────────────────────────
function Toasts({ items, isMobile }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? 70 : 38,
        right: 14,
        zIndex: 8888,
        display: "flex",
        flexDirection: "column-reverse",
        gap: 5,
        pointerEvents: "none",
        maxWidth: isMobile ? "calc(100vw - 28px)" : 280,
      }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            background: T.panel,
            border: `1px solid ${T.dim}`,
            color: T.amber,
            padding: "7px 14px",
            fontSize: 11,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────
function CommandPalette({ onClose, onNav }) {
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => {
    ref.current?.focus();
  }, []);
  const filtered = ALL_CMDS.filter(
    (c) =>
      c.label.toLowerCase().includes(q.toLowerCase()) ||
      c.key === q.toLowerCase(),
  );
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.78)",
        zIndex: 7000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 60,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.panel,
          border: `1px solid ${T.dim}`,
          width: "min(500px, 94vw)",
          animation: "fadeIn 0.14s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: T.dim }}>⌘</span>
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command..."
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && filtered[0]) {
                onNav(filtered[0].action());
                onClose();
              }
            }}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: T.bright,
              fontSize: 13,
              outline: "none",
            }}
          />
          <span
            style={{ color: T.dim, fontSize: 10, cursor: "pointer" }}
            onClick={onClose}
          >
            [ESC]
          </span>
        </div>
        {filtered.map((c) => (
          <div
            key={c.key}
            onClick={() => {
              onNav(c.action());
              onClose();
            }}
            style={{
              padding: "9px 16px",
              display: "flex",
              justifyContent: "space-between",
              borderBottom: `1px solid ${T.border}`,
              cursor: "pointer",
              color: T.text,
              fontSize: 12,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.ghost)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span>{c.label}</span>
            <span
              style={{
                color: T.dim,
                border: `1px solid ${T.border}`,
                padding: "0 5px",
                fontSize: 10,
              }}
            >
              {c.key.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotifPanel({ notifs, setNotifs, onClose, isMobile }) {
  return (
    <div
      style={{
        position: "fixed",
        top: isMobile ? 0 : 32,
        right: 0,
        left: isMobile ? 0 : "auto",
        width: isMobile ? "100%" : 310,
        background: T.panel,
        border: `1px solid ${T.dim}`,
        zIndex: 6000,
        animation: "fadeIn 0.14s ease",
        maxHeight: isMobile ? "70vh" : "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "9px 14px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span style={{ color: T.bright, fontSize: 11 }}>NOTIFICATIONS</span>
        <div style={{ display: "flex", gap: 12 }}>
          <span
            style={{ color: T.dim, fontSize: 10, cursor: "pointer" }}
            onClick={() =>
              setNotifs((n) => n.map((x) => ({ ...x, read: true })))
            }
          >
            Mark all read
          </span>
          <span
            style={{ color: T.dim, fontSize: 10, cursor: "pointer" }}
            onClick={onClose}
          >
            [ESC]
          </span>
        </div>
      </div>
      <div style={{ overflowY: "auto" }}>
        {notifs.map((n) => (
          <div
            key={n.id}
            onClick={() =>
              setNotifs((ns) =>
                ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
              )
            }
            style={{
              padding: "9px 14px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              gap: 9,
              cursor: "pointer",
              background: n.read ? "transparent" : T.ghost,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.ghost)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = n.read
                ? "transparent"
                : T.ghost)
            }
          >
            <span style={{ color: T.bright, fontSize: 14, flexShrink: 0 }}>
              {n.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: n.read ? T.dim : T.amber,
                  fontSize: 11,
                  lineHeight: 1.5,
                }}
              >
                {n.text}
              </div>
              <div style={{ color: T.dim, fontSize: 9, marginTop: 2 }}>
                {n.time}
              </div>
            </div>
            {!n.read && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: T.bright,
                  flexShrink: 0,
                  marginTop: 5,
                  animation: "blink 1.5s infinite",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
function SettPanel({ s, setS, onClose, isMobile }) {
  const row = (label, key, type = "bool") => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "9px 0",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <span style={{ color: T.text, fontSize: 12 }}>{label}</span>
      {type === "bool" ? (
        <div
          onClick={() => setS((x) => ({ ...x, [key]: !x[key] }))}
          style={{
            width: 36,
            height: 18,
            background: s[key] ? T.amber : T.ghost,
            border: `1px solid ${T.dim}`,
            cursor: "pointer",
            position: "relative",
            transition: "background 0.18s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 2,
              left: s[key] ? 18 : 2,
              width: 12,
              height: 12,
              background: T.bg,
              transition: "left 0.18s",
            }}
          />
        </div>
      ) : (
        <input
          type="range"
          min={30}
          max={100}
          value={s[key]}
          onChange={(e) => setS((x) => ({ ...x, [key]: +e.target.value }))}
          style={{ accentColor: T.amber, width: 80 }}
        />
      )}
    </div>
  );
  return (
    <div
      style={{
        position: "fixed",
        top: isMobile ? "auto" : 32,
        bottom: isMobile ? 60 : "auto",
        right: 0,
        left: isMobile ? 0 : "auto",
        width: isMobile ? "100%" : 270,
        background: T.panel,
        border: `1px solid ${T.dim}`,
        zIndex: 6000,
        animation: "fadeIn 0.14s ease",
      }}
    >
      <div
        style={{
          padding: "9px 14px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: T.bright, fontSize: 11 }}>SETTINGS</span>
        <span
          style={{ color: T.dim, fontSize: 10, cursor: "pointer" }}
          onClick={onClose}
        >
          [ESC]
        </span>
      </div>
      <div style={{ padding: "0 14px 10px" }}>
        {row("CRT Scanlines", "scanlines")}
        {row("Screen Flicker", "flicker")}
        {row("Brightness", "brightness", "range")}
        <div style={{ marginTop: 10, color: T.dim, fontSize: 9 }}>
          Sohail Portfolio v1.0.0 · Build 2026.04.12
        </div>
      </div>
    </div>
  );
}

// ─── TERMINAL ─────────────────────────────────────────────────────────────────
function Terminal() {
  const [hist, setHist] = useState([
    {
      t: "sys",
      v: "Sohail Portfolio Terminal v1.0.0 — type 'help' for commands",
    },
    { t: "sys", v: "Connected as: guest@portfolio.sohail.online" },
  ]);
  const [inp, setInp] = useState("");
  const [cmdH, setCmdH] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef();
  const inpRef = useRef();
  useEffect(
    () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
    [hist],
  );
  const CMDS = {
    help: () => [
      "Commands: about · skills · projects · contact · github · date · uptime · quote · neofetch · clear",
    ],
    about: () => [
      "Sohail Khan — B.Tech CSE, Amity University UP (2022–2026)",
      "Specialization: AI & Cloud Computing · CGPA: 7.62/10",
      "Building things with code & faith in the loop.",
    ],
    whoami: () => ["guest@portfolio.sohail.online (read-only access)"],
    skills: () =>
      Object.keys(SKILLS).map(
        (k) =>
          `  ${k.padEnd(12)} [${"█".repeat(Math.floor(SKILLS[k].pct / 10))}${"░".repeat(10 - Math.floor(SKILLS[k].pct / 10))}] ${SKILLS[k].pct}%`,
      ),
    projects: () => PROJECTS.map((p) => `  [${p.id}] ${p.title}`),
    contact: () => [
      "Email   : Sohail.khan196in@gmail.com",
      "GitHub  : github.com/sohail700",
      "LinkedIn: linkedin.com/in/sohail0",
      "Location: New Delhi, India",
    ],
    date: () => [
      new Date().toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    ],
    uptime: () => [
      `Uptime: ${Math.floor(Math.random() * 48 + 1)}h ${Math.floor(Math.random() * 60)}m · All systems operational`,
    ],
    quote: () => [
      [
        '"First solve the problem, then write the code."',
        '"Any fool can write code a computer can understand." — M. Fowler',
        '"In sha Allah, the bug will be fixed tomorrow." — every Muslim dev',
        '"Simplicity is the soul of efficiency."',
      ][Math.floor(Math.random() * 4)],
    ],
    github: () => {
      openLink("https://github.com/sohail700");
      return ["Opening GitHub → github.com/sohail700"];
    },
    neofetch: () => [
      "   ▒▒▒▒▒▒▒    sohail@portfolio",
      "  ▒▒▒▒▒▒▒▒▒   ────────────────",
      " ▒▒▒▒▒▒▒▒▒▒   OS: SohailOS v1.0.0",
      " ▒▒▒▒▒▒▒▒▒▒   Host: Amity UP · CSE",
      " ▒▒▒▒▒▒▒▒▒▒   Kernel: React.jsx 18",
      "  ▒▒▒▒▒▒▒▒▒   Shell: Share Tech Mono",
      "   ▒▒▒▒▒▒▒    GPU: TensorFlow LSTM",
      "             Memory: 7.62 CGPA",
    ],
    clear: () => null,
  };
  const run = () => {
    const cmd = inp.trim().toLowerCase();
    if (!cmd) return;
    setCmdH((h) => [cmd, ...h]);
    setHIdx(-1);
    const out = CMDS[cmd]
      ? CMDS[cmd]()
      : [`'${cmd}': command not found — try 'help'`];
    if (out === null) {
      setHist([{ t: "sys", v: "Terminal cleared." }]);
    } else {
      setHist((h) => [
        ...h,
        { t: "cmd", v: `guest@sohail:~$ ${inp}` },
        ...out.map((v) => ({ t: "out", v })),
      ]);
    }
    setInp("");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'Share Tech Mono',monospace",
      }}
    >
      <SH t="Terminal" />
      <div
        style={{ flex: 1, overflowY: "auto", fontSize: 12, lineHeight: 1.7 }}
        onClick={() => inpRef.current?.focus()}
      >
        {hist.map((l, i) => (
          <div
            key={i}
            style={{
              color: l.t === "cmd" ? T.bright : l.t === "sys" ? T.dim : T.text,
              marginBottom: 1,
            }}
          >
            {l.v}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderTop: `1px solid ${T.border}`,
          paddingTop: 8,
          marginTop: 4,
        }}
      >
        <span style={{ color: T.bright, fontSize: 12, flexShrink: 0 }}>
          guest@sohail:~$
        </span>
        <input
          ref={inpRef}
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
            if (e.key === "ArrowUp") {
              const idx = Math.min(hIdx + 1, cmdH.length - 1);
              setHIdx(idx);
              setInp(cmdH[idx] || "");
            }
            if (e.key === "ArrowDown") {
              const idx = Math.max(hIdx - 1, -1);
              setHIdx(idx);
              setInp(idx === -1 ? "" : cmdH[idx] || "");
            }
            if (e.key === "Tab") {
              e.preventDefault();
              const m = Object.keys(CMDS).find((k) => k.startsWith(inp));
              if (m) setInp(m);
            }
          }}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: T.bright,
            fontSize: 12,
            outline: "none",
            caretColor: T.bright,
          }}
          placeholder="type a command..."
        />
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileView({ toast, isMobile }) {
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <SH t="Profile" />
      <Card>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          {!isMobile && <PixelAvatar />}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isMobile && (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <PixelAvatar size={64} />
                <div>
                  <span
                    style={{
                      color: T.bright,
                      fontSize: 18,
                      fontFamily: "'VT323',monospace",
                      letterSpacing: 1,
                    }}
                  >
                    @sohail_khan
                  </span>
                  <div style={{ color: T.dim, fontSize: 10 }}>
                    Since Sept 2022
                  </div>
                </div>
              </div>
            )}
            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    color: T.bright,
                    fontSize: 16,
                    fontFamily: "'VT323',monospace",
                    letterSpacing: 1,
                  }}
                >
                  @sohail_khan{" "}
                  <span style={{ opacity: 0.4, fontSize: 12 }}>◎L⌇</span>
                </span>
                <span style={{ color: T.dim, fontSize: 10 }}>
                  Since Sept 2022
                </span>
              </div>
            )}
            <div
              style={{
                marginTop: 6,
                color: T.text,
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              Building things with code & faith in the loop.
            </div>
            <div style={{ color: T.dim, fontSize: 10, marginTop: 3 }}>
              New Delhi, India · Amity University UP · Final Year CSE
            </div>
            <div style={{ color: T.dim, fontSize: 10, marginTop: 2 }}>
              AI & Cloud Computing · CGPA 7.62 · Batch 2022–2026
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <Btn
            variant="primary"
            onClick={() => openLink("https://github.com/sohail700")}
          >
            [G] GitHub
          </Btn>
          <Btn onClick={() => openLink("https://linkedin.com/in/sohail0")}>
            [L] LinkedIn
          </Btn>
          <Btn onClick={() => openLink("mailto:Sohail.khan196in@gmail.com")}>
            [M] Email
          </Btn>
          <Btn
            onClick={() => {
              const el = document.createElement("a");
              el.href = "resume_sohail.pdf";
              el.download = "resume_sohail";
              el.click();
              toast("⬇ Downloading resume...");
            }}
          >
            [D] Resume
          </Btn>
        </div>
      </Card>

      <Card>
        <div style={{ color: T.dim, fontSize: 10, marginBottom: 7 }}>
          README.md
        </div>
        {[
          `> Final-year B.Tech CSE @ Amity University UP, Greater Noida`,
          `> Specialization: Artificial Intelligence & Cloud Computing`,
          `> CGPA: 7.62 / 10 · Enrollment: A41105222029`,
          `> Expected Graduation: June 2026`,
          `> Interned at: Saral Tech · The Spark Foundation · Codesoft`,
          `> Learning: French language · Urdu script · Blender 3D`,
          `> Instagram: Islamic reflections & Quranic content`,
          `> Surah Ash-Sharh (94:5-6): With every hardship comes ease ∞`,
        ].map((l, i) => (
          <div
            key={i}
            style={{
              color: i >= 5 ? T.dim : T.text,
              fontSize: 12,
              lineHeight: 1.82,
              marginBottom: 1,
            }}
          >
            {l}
          </div>
        ))}
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)",
          gap: 8,
        }}
      >
        {[
          { label: "Projects", val: PROJECTS.length, sub: "total" },
          { label: "Grad Year", val: "2026", sub: "June" },
          { label: "CGPA", val: "7.62", sub: "out of 10" },
          { label: "Internships", val: "3", sub: "completed" },
          { label: "GitHub Stars", val: "122", sub: "across repos" },
        ].map((s) => (
          <Card
            key={s.label}
            style={{
              textAlign: "center",
              padding: "9px 6px",
              cursor: "default",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontFamily: "'VT323',monospace",
                color: T.bright,
              }}
            >
              {s.val}
            </div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 1 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 11, color: "#ffffff", marginTop: 1 }}>
              {s.sub}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function ProjectsView({ bookmarks, setBookmarks, toast }) {
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("all");
  const FILTERS = [
    "all",
    "active",
    "complete",
    "mobile",
    "ai",
    "fullstack",
    "design",
    "backend",
  ];
  const visible = PROJECTS.filter((p) =>
    filter === "all" ? true : p.status === filter || p.tags.includes(filter),
  );

  if (sel !== null) {
    const p = PROJECTS[sel];
    const bk = bookmarks.includes(p.id);
    return (
      <div style={{ animation: "fadeIn 0.2s ease" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <Btn onClick={() => setSel(null)}>[← ] Back</Btn>
          <Btn onClick={() => openLink(p.url)} variant="primary">
            [↗] Source
          </Btn>
          <Btn
            onClick={() => {
              setBookmarks((b) =>
                bk ? b.filter((x) => x !== p.id) : [...b, p.id],
              );
              toast(bk ? "Bookmark removed" : "★ Bookmarked!");
            }}
          >
            {bk ? "[★] Saved" : "[☆] Save"}
          </Btn>
          <Btn onClick={() => copyToClipboard(p.url, toast)}>Copy Link</Btn>
        </div>
        <Card>
          <div
            style={{
              fontFamily: "'VT323',monospace",
              fontSize: 24,
              color: T.bright,
              marginBottom: 4,
            }}
          >
            <Dot s={p.status} />
            {p.title}
          </div>
          <div style={{ color: T.dim, fontSize: 10, marginBottom: 10 }}>
            #{p.id} · {p.status} · ★ {p.stars} · ⑂ {p.forks}
          </div>
          <div
            style={{
              lineHeight: 1.8,
              color: T.text,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            {p.desc}
          </div>
          <SH t="Stack" />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 12,
            }}
          >
            {p.tech.map((t) => (
              <span
                key={t}
                style={{
                  border: `1px solid ${T.amber}`,
                  color: T.amber,
                  padding: "2px 10px",
                  fontSize: 11,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <SH t="Tags" />
          {p.tags.map((t) => (
            <Tag key={t} l={t} />
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <SH t="Projects" />
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}
      >
        {FILTERS.map((f) => (
          <span
            key={f}
            onClick={() => setFilter(f)}
            style={{
              border: `1px solid ${filter === f ? T.amber : T.border}`,
              color: filter === f ? T.bright : T.dim,
              padding: "2px 9px",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            {f}
          </span>
        ))}
      </div>
      {visible.map((p) => {
        const bk = bookmarks.includes(p.id);
        return (
          <Card key={p.id} onClick={() => setSel(PROJECTS.indexOf(p))}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              <span style={{ color: T.bright, fontSize: 13 }}>
                <Dot s={p.status} />
                {p.title}
              </span>
              <span style={{ color: T.dim, fontSize: 10 }}>
                ★ {p.stars} &nbsp;⑂ {p.forks} {bk ? "· ★ saved" : ""}
              </span>
            </div>
            <div
              style={{
                color: T.dim,
                fontSize: 10,
                marginTop: 3,
                marginBottom: 5,
              }}
            >
              {p.tech.slice(0, 3).join(" · ")}
              {p.tech.length > 3 ? ` +${p.tech.length - 3}` : ""}
            </div>
            <div style={{ color: T.text, fontSize: 12, lineHeight: 1.6 }}>
              {p.desc.slice(0, 105)}...
            </div>
            <div style={{ marginTop: 7 }}>
              {p.tags.map((t) => (
                <Tag key={t} l={t} />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
function SkillsView() {
  const [open, setOpen] = useState("Frontend");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 120);
  }, []);
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <SH t="Skills & Proficiency" />
      {Object.entries(SKILLS).map(([cat, { items, pct }]) => (
        <Card key={cat}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setOpen(open === cat ? null : cat)}
          >
            <span style={{ color: T.bright, fontSize: 13 }}>{cat}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 80, height: 4, background: T.ghost }}>
                <div
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg,${T.dim},${T.bright})`,
                    width: mounted ? `${pct}%` : 0,
                    transition: "width 1s ease",
                    boxShadow: `0 0 4px ${T.amber}`,
                  }}
                />
              </div>
              <span style={{ color: T.dim, fontSize: 10, width: 32 }}>
                {pct}%
              </span>
              <span style={{ color: T.dim }}>
                {open === cat ? "[-]" : "[+]"}
              </span>
            </div>
          </div>
          {open === cat && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 10,
                animation: "fadeIn 0.15s ease",
              }}
            >
              {items.map((s) => (
                <span
                  key={s}
                  style={{
                    border: `1px solid ${T.amber}`,
                    color: T.amber,
                    padding: "3px 10px",
                    fontSize: 11,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </Card>
      ))}
      <SH t="Certifications" />
      {[
        {
          name: "CS50: Intro to Computer Science",
          org: "Harvard / edX",
          year: "2023",
        },
        { name: "Full-Stack Web Development", org: "Coursera", year: "2023" },
        {
          name: "TensorFlow Developer Certificate",
          org: "DeepLearning.AI",
          year: "2024",
        },
        {
          name: "Cloud Computing Fundamentals",
          org: "AWS / Coursera",
          year: "2024",
        },
      ].map((c) => (
        <Card
          key={c.name}
          onClick={() =>
            openLink(
              "https://www.linkedin.com/in/sohail0/details/certifications/",
            )
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <span style={{ color: T.amber, fontSize: 12 }}>{c.name}</span>
            <span style={{ color: T.dim, fontSize: 10 }}>{c.year}</span>
          </div>
          <div style={{ color: T.dim, fontSize: 10, marginTop: 2 }}>
            {c.org}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
function ExperienceView() {
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <SH t="Work Experience" />
      {EXPERIENCE.map((e, i) => (
        <Card key={i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <span
              style={{
                color: T.bright,
                fontSize: 15,
                fontFamily: "'VT323',monospace",
              }}
            >
              {e.co}
            </span>
            <span style={{ color: T.dim, fontSize: 10 }}>{e.period}</span>
          </div>
          <div
            style={{
              color: T.amber,
              fontSize: 11,
              marginTop: 2,
              marginBottom: 5,
            }}
          >
            {e.role}
          </div>
          <div style={{ color: T.dim, fontSize: 10, marginBottom: 5 }}>
            {e.tech}
          </div>
          <div style={{ color: T.text, fontSize: 12, lineHeight: 1.65 }}>
            {e.desc}
          </div>
        </Card>
      ))}
      <SH t="Education" />
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          <span
            style={{
              color: T.bright,
              fontSize: 15,
              fontFamily: "'VT323',monospace",
            }}
          >
            Amity University UP
          </span>
          <span style={{ color: T.dim, fontSize: 10 }}>2022 – 2026</span>
        </div>
        <div style={{ color: T.amber, fontSize: 11, marginTop: 2 }}>
          B.Tech — Computer Science & Engineering
        </div>
        <div style={{ color: T.dim, fontSize: 10, marginTop: 2 }}>
          AI & Cloud Computing · Greater Noida · Enrollment: A41105222029
        </div>
        <div
          style={{
            color: T.text,
            fontSize: 12,
            marginTop: 6,
            lineHeight: 1.65,
          }}
        >
          CGPA: 7.62 / 10 · Expected June 2026
          <br />
          Major project: HAR (CNN/LSTM, 92.4% accuracy, IEEE format)
          <br />
          Organized & promoted campus tech events
        </div>
      </Card>
      <SH t="Applying For" />
      {[
        {
          prog: "Romanian Government Scholarship 2026",
          inst: "POLITEHNICA Bucharest · Babeș-Bolyai",
          status: "Submitted",
          color: T.success,
        },
        {
          prog: "MEXT Scholarship 2026",
          inst: "Tokyo Tech IGP",
          status: "Exploring",
          color: T.dim,
        },
        {
          prog: "ADB-JSP Scholarship",
          inst: "Asian Development Bank",
          status: "Exploring",
          color: T.dim,
        },
      ].map((s) => (
        <Card
          key={s.prog}
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ color: T.amber, fontSize: 12 }}>{s.prog}</div>
            <div style={{ color: T.dim, fontSize: 10, marginTop: 2 }}>
              {s.inst}
            </div>
          </div>
          <span
            style={{
              border: `1px solid ${s.color}`,
              color: s.color,
              padding: "2px 8px",
              fontSize: 10,
              flexShrink: 0,
            }}
          >
            {s.status}
          </span>
        </Card>
      ))}
    </div>
  );
}

// ─── JOURNAL ──────────────────────────────────────────────────────────────────
function JournalView({ toast }) {
  const [open, setOpen] = useState(null);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const [entries, setEntries] = useState(JOURNALS);
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <SH t="Dev Journal" />
        <Btn onClick={() => setWriting((w) => !w)} style={{ marginBottom: 10 }}>
          {writing ? "[ESC] Cancel" : "[W] Write"}
        </Btn>
      </div>
      {writing && (
        <Card>
          <div style={{ color: T.dim, fontSize: 10, marginBottom: 6 }}>
            New Entry —{" "}
            {new Date().toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What happened today in the build log..."
            style={{
              width: "100%",
              minHeight: 80,
              background: T.bg,
              border: `1px solid ${T.border}`,
              color: T.text,
              padding: "8px",
              fontSize: 12,
              resize: "vertical",
              outline: "none",
              fontFamily: "'Share Tech Mono',monospace",
            }}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <Btn
              variant="primary"
              onClick={() => {
                if (draft.trim()) {
                  setEntries((e) => [
                    {
                      date: new Date().toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                      }),
                      e: "✏",
                      title: "New Entry",
                      body: draft,
                      tags: ["personal"],
                    },
                    ...e,
                  ]);
                  toast("Entry saved!");
                  setDraft("");
                  setWriting(false);
                } else toast("Write something first!");
              }}
            >
              [↵] Publish
            </Btn>
            <Btn onClick={() => setDraft("")}>[X] Clear</Btn>
          </div>
        </Card>
      )}
      {entries.map((j, i) => (
        <Card key={i} onClick={() => setOpen(open === i ? null : i)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <span style={{ color: T.bright, fontSize: 12 }}>
              {j.e} {j.title}
            </span>
            <span style={{ color: T.dim, fontSize: 10 }}>{j.date}</span>
          </div>
          {open === i ? (
            <div style={{ marginTop: 10, animation: "fadeIn 0.15s ease" }}>
              <div style={{ color: T.text, fontSize: 12, lineHeight: 1.75 }}>
                {j.body}
              </div>
              <div style={{ marginTop: 8 }}>
                {j.tags.map((t) => (
                  <Tag key={t} l={t} />
                ))}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 7 }}>
                <Btn
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(j.body, toast);
                  }}
                >
                  Copy
                </Btn>
                <Btn
                  onClick={(e) => {
                    e.stopPropagation();
                    toast("Entry bookmarked!");
                  }}
                >
                  Save
                </Btn>
              </div>
            </div>
          ) : (
            <div style={{ color: T.dim, fontSize: 10, marginTop: 4 }}>
              {j.body.slice(0, 72)}...
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function ContactView({ toast, isMobile }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const inp = {
    width: "100%",
    background: T.bg,
    border: `1px solid ${T.border}`,
    color: T.text,
    padding: "8px 10px",
    fontSize: 12,
    outline: "none",
    fontFamily: "'Share Tech Mono',monospace",
    marginBottom: 8,
  };
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <SH t="Contact" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 8,
          marginBottom: 10,
        }}
      >
        {[
          {
            icon: "⬡",
            label: "GitHub",
            val: "sohail700",
            url: "https://github.com/sohail700",
          },
          {
            icon: "◈",
            label: "LinkedIn",
            val: "sohail0",
            url: "https://linkedin.com/in/sohail0",
          },
          {
            icon: "✉",
            label: "Email",
            val: "Sohail.khan196in@gmail.com",
            url: "mailto:Sohail.khan196in@gmail.com",
          },
        ].map((c) => (
          <Card
            key={c.label}
            onClick={() => openLink(c.url)}
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <span style={{ color: T.bright, fontSize: 18, flexShrink: 0 }}>
              {c.icon}
            </span>
            <div>
              <div style={{ color: T.amber, fontSize: 11 }}>{c.label}</div>
              <div
                style={{
                  color: T.dim,
                  fontSize: 10,
                  marginTop: 1,
                  wordBreak: "break-all",
                }}
              >
                {c.val}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div
        style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}
      >
        <Btn
          onClick={() => copyToClipboard("Sohail.khan196in@gmail.com", toast)}
        >
          [C] Copy Email
        </Btn>
        <Btn
          variant="primary"
          onClick={() => openLink("mailto:Sohail.khan196in@gmail.com")}
        >
          [M] Open Mail App
        </Btn>
      </div>
      <SH t="C-Mail — Direct Message" />
      {sent ? (
        <Card>
          <div style={{ color: T.bright, fontSize: 13 }}>
            ✓ Transmission sent.
          </div>
          <div style={{ color: T.dim, fontSize: 11, marginTop: 4 }}>
            Expected response: 24–48 system cycles.
          </div>
          <div style={{ marginTop: 10 }}>
            <Btn
              onClick={() => {
                setSent(false);
                setName("");
                setEmail("");
                setMsg("");
              }}
            >
              Send another
            </Btn>
          </div>
        </Card>
      ) : (
        <Card>
          <div style={{ color: T.dim, fontSize: 10, marginBottom: 8 }}>
            Compose transmission
          </div>
          <input
            style={inp}
            placeholder="From: Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={inp}
            placeholder="Reply-To: your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            style={{ ...inp, resize: "vertical", minHeight: 86 }}
            placeholder="Message body..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <Btn
              variant="primary"
              onClick={() => {
                if (name && msg) {
                  emailjs
                    .send(
                      "service_u27zfys",
                      "template_7wafwzb",
                      {
                        from_name: name,
                        reply_to: email,
                        message: msg,
                        to_email: "Sohail.khan196in@gmail.com",
                      },
                      "ehlelRhE9QIOJpwuB",
                    )
                    .then(() => {
                      setSent(true);
                      toast("📡 Message transmitted!");
                      setName("");
                      setEmail("");
                      setMsg("");
                    })
                    .catch(() => toast("Transmission failed."));
                } else toast("Fill in name and message first.");
              }}
            >
              [↵] Transmit
            </Btn>
            <Btn
              onClick={() => {
                setName("");
                setEmail("");
                setMsg("");
              }}
            >
              [X] Clear
            </Btn>
          </div>
        </Card>
      )}
      <SH t="Availability" />
      <Card>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.success,
              display: "inline-block",
              boxShadow: `0 0 6px ${T.success}`,
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ color: T.bright, fontSize: 12 }}>
            Open to opportunities
          </span>
        </div>
        <div style={{ color: T.text, fontSize: 12, lineHeight: 1.7 }}>
          Actively looking for full-time SWE / AI roles starting June 2026.
          <br />
          Also open to: remote internships · freelance · open-source collab.
        </div>
        <div
          style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}
        >
          <Btn
            variant="primary"
            onClick={() => openLink("mailto:Sohail.khan196in@gmail.com")}
          >
            Hire Me
          </Btn>
          <Btn onClick={() => openLink("https://linkedin.com/in/sohail0")}>
            LinkedIn
          </Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── BOOKMARKS ────────────────────────────────────────────────────────────────
function BookmarksView({ bookmarks, setBookmarks, toast }) {
  const saved = PROJECTS.filter((p) => bookmarks.includes(p.id));
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <SH t="Saved Projects" />
      {saved.length === 0 ? (
        <Card>
          <div style={{ color: T.dim, fontSize: 12 }}>
            No bookmarks yet. Open a project and click [☆ Save] to save it here.
          </div>
        </Card>
      ) : (
        saved.map((p) => (
          <Card key={p.id} onClick={() => openLink(p.url)}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              <span style={{ color: T.bright, fontSize: 13 }}>
                <Dot s={p.status} />
                {p.title}
              </span>
              <Btn
                onClick={(e) => {
                  e.stopPropagation();
                  setBookmarks((b) => b.filter((x) => x !== p.id));
                  toast("Bookmark removed");
                }}
                style={{ fontSize: 10 }}
              >
                Remove
              </Btn>
            </div>
            <div style={{ color: T.dim, fontSize: 11, marginTop: 3 }}>
              {p.tech.join(" · ")}
            </div>
            <div
              style={{
                color: T.text,
                fontSize: 12,
                marginTop: 5,
                lineHeight: 1.6,
              }}
            >
              {p.desc.slice(0, 90)}...
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { key: "profile", label: "Profile", icon: "◉", sc: "p" },
  { key: "projects", label: "Projects", icon: "⬡", sc: "r" },
  { key: "skills", label: "Skills", icon: "◈", sc: "s" },
  { key: "experience", label: "XP", icon: "⌖", sc: "x" },
  { key: "journal", label: "Journal", icon: "✦", sc: "j" },
  { key: "contact", label: "Contact", icon: "✉", sc: "c" },
  { key: "terminal", label: "Terminal", icon: "$", sc: "t" },
  { key: "bookmarks", label: "Saved", icon: "★", sc: "b" },
];

// ─── MOBILE BOTTOM TAB BAR ────────────────────────────────────────────────────
function MobileTabBar({ view, nav, bookmarks }) {
  // Show 5 primary tabs + a "more" concept via last slot cycling
  const PRIMARY = NAV.slice(0, 5);
  return (
    <div
      style={{
        height: 56,
        background: T.panel,
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "stretch",
        flexShrink: 0,
        zIndex: 200,
      }}
    >
      {PRIMARY.map((item) => {
        const active = view === item.key;
        return (
          <div
            key={item.key}
            onClick={() => nav(item.key)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              cursor: "pointer",
              borderTop: `2px solid ${active ? T.bright : "transparent"}`,
              background: active ? "#1c1200" : "transparent",
              transition: "all 0.1s",
            }}
          >
            <span style={{ fontSize: 16, color: active ? T.bright : T.dim }}>
              {item.icon}
            </span>
            <span
              style={{
                fontSize: 9,
                color: active ? T.bright : T.dim,
                letterSpacing: 0.5,
              }}
            >
              {item.label}
            </span>
            {item.key === "bookmarks" && bookmarks.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  fontSize: 8,
                  color: T.bright,
                  border: `1px solid ${T.border}`,
                  padding: "0 2px",
                }}
              >
                {bookmarks.length}
              </span>
            )}
          </div>
        );
      })}
      {/* "More" slot cycles remaining views */}
      <MoreTab view={view} nav={nav} />
    </div>
  );
}

function MoreTab({ view, nav }) {
  const SECONDARY = NAV.slice(5);
  const [open, setOpen] = useState(false);
  const isActive = SECONDARY.some((x) => x.key === view);
  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          cursor: "pointer",
          borderTop: `2px solid ${isActive ? T.bright : "transparent"}`,
          background: isActive ? "#1c1200" : "transparent",
        }}
      >
        <span style={{ fontSize: 16, color: isActive ? T.bright : T.dim }}>
          ···
        </span>
        <span style={{ fontSize: 9, color: isActive ? T.bright : T.dim }}>
          More
        </span>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            right: 0,
            background: T.panel,
            border: `1px solid ${T.dim}`,
            width: 130,
            animation: "fadeIn 0.15s ease",
            zIndex: 500,
          }}
        >
          {SECONDARY.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                nav(item.key);
                setOpen(false);
              }}
              style={{
                padding: "10px 14px",
                borderBottom: `1px solid ${T.border}`,
                color: view === item.key ? T.bright : T.dim,
                fontSize: 12,
                display: "flex",
                gap: 8,
                alignItems: "center",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.ghost)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DESKTOP SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({ view, nav, bookmarks, setPalette }) {
  return (
    <div
      style={{
        width: 158,
        background: T.panel,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "14px 14px 12px",
          borderBottom: `1px solid ${T.border}`,
          cursor: "pointer",
        }}
        onClick={() => nav("profile")}
      >
        <div
          style={{
            fontFamily: "'VT323',monospace",
            fontSize: 22,
            color: T.bright,
            letterSpacing: 2,
            animation: "glow 3s infinite",
          }}
        >
          S☉hail
        </div>
        <div style={{ color: T.dim, fontSize: 9, marginTop: 1 }}>
          v1.0.0 · portfolio
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
        {NAV.map((item) => {
          const active = view === item.key;
          return (
            <div
              key={item.key}
              onClick={() => nav(item.key)}
              style={{
                padding: "7px 14px",
                cursor: "pointer",
                color: active ? T.bright : T.dim,
                background: active ? "#1c1200" : "transparent",
                borderLeft: `2px solid ${active ? T.bright : "transparent"}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.1s",
                fontSize: 13,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = T.amber;
                  e.currentTarget.style.background = T.ghost;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = T.dim;
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ display: "flex", gap: 7, alignItems: "center" }}>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{item.icon}</span>
                {item.label}
              </span>
              {item.key === "bookmarks" && bookmarks.length > 0 && (
                <span
                  style={{
                    color: T.bright,
                    fontSize: 9,
                    border: `1px solid ${T.border}`,
                    padding: "0 3px",
                  }}
                >
                  {bookmarks.length}
                </span>
              )}
              {item.key === "journal" && (
                <span
                  style={{
                    color: T.dim,
                    fontSize: 9,
                    border: `1px solid ${T.border}`,
                    padding: "0 3px",
                  }}
                >
                  {JOURNALS.length}
                </span>
              )}
              {item.key === "projects" && (
                <span
                  style={{
                    color: T.dim,
                    fontSize: 9,
                    border: `1px solid ${T.border}`,
                    padding: "0 3px",
                  }}
                >
                  {PROJECTS.length}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: `1px solid ${T.border}` }}>
        <div
          style={{
            padding: "8px 14px",
            cursor: "pointer",
            color: T.dim,
            fontSize: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => setPalette(true)}
          onMouseEnter={(e) => (e.currentTarget.style.color = T.amber)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.dim)}
        >
          <span>Commands</span>
          <span
            style={{
              border: `1px solid ${T.border}`,
              padding: "0 4px",
              fontSize: 9,
            }}
          >
            ⌘K
          </span>
        </div>
        <div style={{ padding: "6px 14px 10px", display: "flex", gap: 12 }}>
          {[
            { icon: "⬡", url: "https://github.com/sohail700", tip: "GitHub" },
            {
              icon: "◈",
              url: "https://linkedin.com/in/sohail0",
              tip: "LinkedIn",
            },
            {
              icon: "✉",
              url: "mailto:Sohail.khan196in@gmail.com",
              tip: "Email",
            },
          ].map((s) => (
            <span
              key={s.icon}
              title={s.tip}
              onClick={() => openLink(s.url)}
              style={{
                cursor: "pointer",
                color: T.dim,
                fontSize: 16,
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.bright)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.dim)}
            >
              {s.icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MOBILE DRAWER SIDEBAR ────────────────────────────────────────────────────
function MobileDrawer({ view, nav, bookmarks, open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 3000,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 220,
          background: T.panel,
          borderRight: `1px solid ${T.dim}`,
          zIndex: 3001,
          animation: "slideIn 0.2s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "14px 14px 12px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'VT323',monospace",
              fontSize: 22,
              color: T.bright,
              letterSpacing: 2,
              animation: "glow 3s infinite",
            }}
          >
            S☉hail
          </div>
          <span
            style={{ color: T.dim, cursor: "pointer", fontSize: 18 }}
            onClick={onClose}
          >
            ✕
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
          {NAV.map((item) => {
            const active = view === item.key;
            return (
              <div
                key={item.key}
                onClick={() => {
                  nav(item.key);
                  onClose();
                }}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  color: active ? T.bright : T.dim,
                  background: active ? "#1c1200" : "transparent",
                  borderLeft: `2px solid ${active ? T.bright : "transparent"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13 }}>{item.icon}</span>
                  {item.label}
                </span>
                {item.key === "bookmarks" && bookmarks.length > 0 && (
                  <span
                    style={{
                      color: T.bright,
                      fontSize: 10,
                      border: `1px solid ${T.border}`,
                      padding: "0 4px",
                    }}
                  >
                    {bookmarks.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            gap: 16,
          }}
        >
          {[
            { icon: "⬡", url: "https://github.com/sohail700" },
            { icon: "◈", url: "https://linkedin.com/in/sohail0" },
            { icon: "✉", url: "mailto:Sohail.khan196in@gmail.com" },
          ].map((s) => (
            <span
              key={s.icon}
              onClick={() => openLink(s.url)}
              style={{ cursor: "pointer", color: T.dim, fontSize: 20 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.bright)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.dim)}
            >
              {s.icon}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [booted, setBooted] = useState(false);
  const [view, setView] = useState("profile");
  const [palette, setPalette] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settOpen, setSettOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [notifs, setNotifs] = useState(NOTIFS_INIT);
  const [bookmarks, setBookmarksRaw] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sohail_bookmarks") || "[]");
    } catch {
      return [];
    }
  });
  const setBookmarks = (fn) => {
    setBookmarksRaw((prev) => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      localStorage.setItem("sohail_bookmarks", JSON.stringify(next));
      return next;
    });
  };
  const [time, setTime] = useState(new Date());
  const [sett, setSett] = useState({
    scanlines: true,
    flicker: true,
    brightness: 88,
  });

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;

  const toast = useCallback((msg) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPalette((p) => !p);
        return;
      }
      const n = NAV.find((x) => x.sc === e.key.toLowerCase());
      if (n) {
        setView(n.key);
        setPalette(false);
      }
      if (e.key === "Escape") {
        setPalette(false);
        setNotifOpen(false);
        setSettOpen(false);
        setDrawerOpen(false);
      }
      if (e.key === "\\") {
        setSett((s) => ({ ...s, scanlines: !s.scanlines }));
        toast("Scanlines toggled");
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const nav = (key) => {
    setView(key);
    setPalette(false);
    setNotifOpen(false);
    setSettOpen(false);
    setDrawerOpen(false);
  };
  const unread = notifs.filter((n) => !n.read).length;

  const VIEWS = {
    profile: <ProfileView toast={toast} isMobile={isMobile} />,
    projects: (
      <ProjectsView
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
        toast={toast}
      />
    ),
    skills: <SkillsView />,
    experience: <ExperienceView />,
    journal: <JournalView toast={toast} />,
    contact: <ContactView toast={toast} isMobile={isMobile} />,
    terminal: <Terminal toast={toast} />,
    bookmarks: (
      <BookmarksView
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
        toast={toast}
      />
    ),
  };

  if (!booted) return <BootScreen onDone={() => setBooted(true)} />;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: T.bg,
          filter: `brightness(${sett.brightness}%)`,
          animation: sett.flicker ? "flicker 10s infinite" : "none",
          fontFamily: "'Share Tech Mono',monospace",
          fontSize: 14,
          color: T.text,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scanlines */}
        {sett.scanlines && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.09) 2px,rgba(0,0,0,.09) 4px)",
              pointerEvents: "none",
              zIndex: 9990,
            }}
          />
        )}

        {/* Top bar */}
        <div
          style={{
            height: 36,
            background: T.panel,
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
            flexShrink: 0,
            zIndex: 100,
          }}
        >
          {/* Hamburger on mobile */}
          {isMobile ? (
            <span
              onClick={() => {
                setDrawerOpen(true);
                setNotifOpen(false);
                setSettOpen(false);
              }}
              style={{
                color: T.dim,
                fontSize: 18,
                cursor: "pointer",
                lineHeight: 1,
                padding: "0 2px",
              }}
            >
              ☰
            </span>
          ) : (
            <>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#FF5F57",
                  display: "inline-block",
                  cursor: "pointer",
                }}
                onClick={() =>
                  toast("You can't close the portfolio that easily 👀")
                }
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#FFBD2E",
                  display: "inline-block",
                  cursor: "pointer",
                }}
                onClick={() => toast("Minimized to the void.")}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#28C840",
                  display: "inline-block",
                  cursor: "pointer",
                }}
                onClick={() => {
                  document.documentElement.requestFullscreen?.();
                  toast("Entering fullscreen...");
                }}
              />
            </>
          )}

          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: T.dim,
              fontSize: isMobile ? 9 : 11,
              letterSpacing: isMobile ? 1 : 2,
              cursor: "pointer",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
            onClick={() => toast("◎ portfolio.sohail.online")}
          >
            {isMobile ? "sohail.online" : "◎ portfolio.sohail.online"}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 10 : 14,
            }}
          >
            {/* Notifications */}
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => {
                setNotifOpen((n) => !n);
                setSettOpen(false);
                setDrawerOpen(false);
              }}
            >
              <span
                style={{ color: notifOpen ? T.bright : T.dim, fontSize: 14 }}
              >
                🔔
              </span>
              {unread > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -5,
                    background: T.amber,
                    color: T.bg,
                    borderRadius: "50%",
                    width: 13,
                    height: 13,
                    fontSize: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {unread}
                </span>
              )}
            </div>
            {/* Settings */}
            <span
              style={{
                color: settOpen ? T.bright : T.dim,
                cursor: "pointer",
                display: "inline-block",
                animation: settOpen ? "spin 3s linear infinite" : "none",
                fontSize: 14,
              }}
              onClick={() => {
                setSettOpen((s) => !s);
                setNotifOpen(false);
                setDrawerOpen(false);
              }}
            >
              ⚙
            </span>
            {!isMobile && (
              <span style={{ color: T.dim, fontSize: 11 }}>
                {time.toLocaleTimeString("en-US", { hour12: false })}
              </span>
            )}
          </div>
        </div>

        {/* Dropdowns */}
        {notifOpen && (
          <NotifPanel
            notifs={notifs}
            setNotifs={setNotifs}
            onClose={() => setNotifOpen(false)}
            isMobile={isMobile}
          />
        )}
        {settOpen && (
          <SettPanel
            s={sett}
            setS={setSett}
            onClose={() => setSettOpen(false)}
            isMobile={isMobile}
          />
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <MobileDrawer
            view={view}
            nav={nav}
            bookmarks={bookmarks}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        )}

        {/* Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <Sidebar
              view={view}
              nav={nav}
              bookmarks={bookmarks}
              setPalette={setPalette}
            />
          )}

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Breadcrumb bar */}
            <div
              style={{
                padding: isMobile ? "6px 12px" : "8px 18px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: T.bright,
                  letterSpacing: 3,
                  fontSize: 10,
                  textTransform: "uppercase",
                }}
              >
                {NAV.find((n) => n.key === view)?.icon}{" "}
                {NAV.find((n) => n.key === view)?.label}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {view !== "contact" && (
                  <Btn onClick={() => nav("contact")} variant="primary">
                    Hire Me
                  </Btn>
                )}
                {!isMobile && view !== "profile" && (
                  <Btn onClick={() => nav("profile")}>Profile</Btn>
                )}
              </div>
            </div>

            {/* View Content */}
            <div
              style={{
                flex: 1,
                overflowY: view === "terminal" ? "hidden" : "auto",
                padding: isMobile ? "12px" : "14px 18px",
                display: view === "terminal" ? "flex" : "block",
                flexDirection: "column",
              }}
            >
              {VIEWS[view]}
            </div>
          </div>
        </div>

        {/* Bottom — Desktop shortcut bar / Mobile tab bar */}
        {isMobile ? (
          <MobileTabBar view={view} nav={nav} bookmarks={bookmarks} />
        ) : (
          <div
            style={{
              height: 26,
              background: T.panel,
              borderTop: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 12,
              flexShrink: 0,
              fontSize: 10,
              color: T.dim,
              overflowX: "auto",
            }}
          >
            {[
              { label: "[⌘K] Palette", fn: () => setPalette(true) },
              { label: "[P] Profile", fn: () => nav("profile") },
              { label: "[R] Projects", fn: () => nav("projects") },
              { label: "[S] Skills", fn: () => nav("skills") },
              { label: "[X] XP", fn: () => nav("experience") },
              { label: "[J] Journal", fn: () => nav("journal") },
              { label: "[C] Contact", fn: () => nav("contact") },
              { label: "[T] Terminal", fn: () => nav("terminal") },
              {
                label: "[\\] Scanlines",
                fn: () => {
                  setSett((s) => ({ ...s, scanlines: !s.scanlines }));
                  toast("Scanlines toggled");
                },
              },
            ].map((s) => (
              <span
                key={s.label}
                onClick={s.fn}
                style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.amber)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.dim)}
              >
                {s.label}
              </span>
            ))}
            <span style={{ flex: 1 }} />
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.success,
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ color: T.amber }}>@sohail_khan</span>
          </div>
        )}
      </div>

      {palette && (
        <CommandPalette onClose={() => setPalette(false)} onNav={nav} />
      )}
      <Toasts items={toasts} isMobile={isMobile} />
    </>
  );
}
