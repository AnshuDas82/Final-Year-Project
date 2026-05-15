import { useState, useRef, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area } from "recharts";

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS — Premium Violet × Amber × Coral
══════════════════════════════════════════════════════ */
const T = {
  /* Sidebar & hero darks */
  ink:     "#0D0B26",
  inkL:    "#14113A",
  inkM:    "#1E1A52",
  /* Primary violet */
  violet:  "#6C4EF5",
  violetL: "#8A70FF",
  violetD: "#4F38C2",
  /* Amber accent */
  amber:   "#F5A623",
  amberL:  "#FFCA6B",
  amberD:  "#C27A0A",
  /* Coral accent */
  coral:   "#FF6B6B",
  coralL:  "#FF9B9B",
  /* Mint accent */
  mint:    "#00C9A7",
  mintL:   "#6EE7D4",
  /* Cyan accent */
  cyan:    "#38BDF8",
  /* Page bg */
  bg:      "#F4F3FF",
  bgCard:  "#FFFFFF",
  /* Grays */
  dark:    "#1A1540",
  mid:     "#4B4580",
  muted:   "#7B789E",
  light:   "#B8B5D4",
  border:  "#E8E6F5",
  /* Semantic */
  success: "#10C98F",
  danger:  "#FF5757",
  warning: "#FFAA00",
  info:    "#5097FF",
};

/* Gradient presets */
const GR = {
  violet:  `linear-gradient(135deg, ${T.violetD}, ${T.violet})`,
  amber:   `linear-gradient(135deg, ${T.amberD}, ${T.amber})`,
  coral:   `linear-gradient(135deg, #E63E3E, ${T.coral})`,
  mint:    `linear-gradient(135deg, #008F73, ${T.mint})`,
  cyan:    `linear-gradient(135deg, #1E8CC0, ${T.cyan})`,
  ink:     `linear-gradient(160deg, ${T.ink} 0%, ${T.inkM} 100%)`,
};

/* ══════════════════════════════════════════════════════
   DATA LAYER
══════════════════════════════════════════════════════ */
const USERS = [
  { id:1, email:"admin@mce.edu",   password:"admin123",   role:"admin",   name:"Dr. S.K. Sharma",    dept:"Administration" },
  { id:2, email:"teacher@mce.edu", password:"teacher123", role:"teacher", name:"Prof. Juhi Kumari",  dept:"CSE-AI" },
  { id:3, email:"student@mce.edu", password:"student123", role:"student", name:"Anshu Kumar Das",    dept:"CSE-AI", rollNo:"22510", semester:"7th" },
];

const STUDENTS = [
  { id:"22510", name:"Anshu Kumar Das",     class:"B.Tech CSE-AI", sem:"7th", att:92, gpa:8.7, fee:"Paid",    rank:3 },
  { id:"22526", name:"Devanshu Raj",        class:"B.Tech CSE-AI", sem:"7th", att:87, gpa:8.2, fee:"Paid",    rank:5 },
  { id:"22529", name:"SatyaPrakash Verma",  class:"B.Tech CSE-AI", sem:"7th", att:95, gpa:9.1, fee:"Paid",    rank:1 },
  { id:"22533", name:"Ritesh Kumar",        class:"B.Tech CSE-AI", sem:"7th", att:78, gpa:7.8, fee:"Pending", rank:7 },
  { id:"22541", name:"Priya Singh",         class:"B.Tech CSE",    sem:"5th", att:91, gpa:8.5, fee:"Paid",    rank:4 },
  { id:"22545", name:"Rohit Sharma",        class:"B.Tech CSE",    sem:"5th", att:65, gpa:6.9, fee:"Overdue", rank:12 },
  { id:"22551", name:"Neha Gupta",          class:"B.Tech IT",     sem:"3rd", att:88, gpa:8.0, fee:"Paid",    rank:6 },
  { id:"22558", name:"Vikram Yadav",        class:"B.Tech IT",     sem:"3rd", att:72, gpa:7.2, fee:"Pending", rank:10 },
];

const TEACHERS = [
  { id:"T001", name:"Prof. Juhi Kumari",  subject:"Artificial Intelligence", dept:"CSE-AI", exp:"8 yrs", rating:4.8, students:120 },
  { id:"T002", name:"Dr. Ramesh Gupta",   subject:"Data Structures",         dept:"CSE",    exp:"12 yrs",rating:4.6, students:180 },
  { id:"T003", name:"Prof. Anita Sinha",  subject:"Machine Learning",        dept:"CSE-AI", exp:"6 yrs", rating:4.9, students:80  },
  { id:"T004", name:"Dr. Vijay Kumar",    subject:"Database Systems",        dept:"CSE",    exp:"15 yrs",rating:4.5, students:140 },
];

const ATTENDANCE_CHART = [
  { month:"Jan", present:92, absent:8 }, { month:"Feb", present:88, absent:12 },
  { month:"Mar", present:95, absent:5 }, { month:"Apr", present:90, absent:10 },
  { month:"May", present:93, absent:7 }, { month:"Jun", present:86, absent:14 },
];

const PERF_CHART = [
  { sub:"AI", score:87 }, { sub:"ML", score:85 }, { sub:"DSA", score:92 },
  { sub:"DBMS", score:78 }, { sub:"OS", score:88 }, { sub:"CN", score:82 },
];

const DEPT_CHART = [
  { dept:"CSE-AI", avg:88, students:240 }, { dept:"CSE", avg:83, students:320 },
  { dept:"IT", avg:80, students:180 }, { dept:"ECE", avg:85, students:210 },
];

const RADAR_DATA = [
  { subject:"Assignments", A:88, fullMark:100 }, { subject:"Attendance", A:92, fullMark:100 },
  { subject:"Tests", A:85, fullMark:100 },        { subject:"Projects", A:90, fullMark:100 },
  { subject:"Labs", A:78, fullMark:100 },          { subject:"Seminar", A:95, fullMark:100 },
];

const NOTICES = [
  { id:1, title:"Mid-Semester Examination Schedule Released", date:"Apr 5, 2025",  type:"exam",       priority:"high" },
  { id:2, title:"Annual Tech Fest 'InnovateX 2025' — Registrations Open", date:"Apr 3, 2025",  type:"event",     priority:"medium" },
  { id:3, title:"Library Closed on Apr 14 (Holiday)", date:"Apr 2, 2025",  type:"general",   priority:"low" },
  { id:4, title:"NPTEL Online Course Enrollment Deadline: April 10", date:"Apr 1, 2025",  type:"academic",  priority:"high" },
  { id:5, title:"Campus Placement Drive — TCS & Infosys (April 20)", date:"Mar 30, 2025", type:"placement", priority:"high" },
];

const LIBRARY = [
  { id:1, title:"Artificial Intelligence: A Modern Approach", author:"Russell & Norvig", available:3, total:5, borrowed:false },
  { id:2, title:"Introduction to Algorithms (CLRS)", author:"Cormen et al.", available:0, total:4, borrowed:true, due:"Apr 12" },
  { id:3, title:"Deep Learning", author:"Goodfellow et al.", available:2, total:3, borrowed:false },
  { id:4, title:"Database System Concepts", author:"Silberschatz", available:1, total:6, borrowed:false },
  { id:5, title:"Operating System Concepts", author:"Galvin", available:4, total:6, borrowed:false },
];

const FEES = [
  { id:"22510", name:"Anshu Kumar Das",  sem:"7th", tuition:42000, hostel:18000, misc:3500, paid:63500, status:"Paid"    },
  { id:"22526", name:"Devanshu Raj",     sem:"7th", tuition:42000, hostel:18000, misc:3500, paid:30000, status:"Pending" },
  { id:"22529", name:"SatyaPrakash V.", sem:"7th", tuition:42000, hostel:0,     misc:3500, paid:45500, status:"Paid"    },
  { id:"22533", name:"Ritesh Kumar",     sem:"7th", tuition:42000, hostel:18000, misc:3500, paid:0,     status:"Overdue" },
  { id:"22541", name:"Priya Singh",      sem:"5th", tuition:40000, hostel:18000, misc:3500, paid:61500, status:"Paid"    },
  { id:"22545", name:"Rohit Sharma",     sem:"5th", tuition:40000, hostel:0,     misc:3500, paid:20000, status:"Overdue" },
];

const EVENTS = [
  { id:1, title:"Mid-Term Exams Begin",         date:"Apr 12", time:"10:00 AM", type:"exam",      color:T.coral },
  { id:2, title:"Tech Fest InnovateX 2025",     date:"Apr 18", time:"9:00 AM",  type:"event",     color:T.violet },
  { id:3, title:"TCS Campus Placement",         date:"Apr 20", time:"9:00 AM",  type:"placement", color:T.mint },
  { id:4, title:"Faculty Development Program",  date:"Apr 22", time:"2:00 PM",  type:"training",  color:T.amber },
  { id:5, title:"Annual Sports Day",            date:"Apr 28", time:"8:00 AM",  type:"sports",    color:T.cyan },
  { id:6, title:"End-Semester Exams",           date:"May 10", time:"9:00 AM",  type:"exam",      color:T.coral },
];

const GRADEBOOK = [
  { student:"Anshu Kumar Das",    AI:87, ML:85, DSA:92, DBMS:78, OS:88, total:430, grade:"A"  },
  { student:"SatyaPrakash Verma", AI:92, ML:91, DSA:95, DBMS:88, OS:93, total:459, grade:"A+" },
  { student:"Devanshu Raj",       AI:82, ML:80, DSA:88, DBMS:74, OS:84, total:408, grade:"A-" },
  { student:"Ritesh Kumar",       AI:74, ML:70, DSA:80, DBMS:68, OS:76, total:368, grade:"B+" },
  { student:"Priya Singh",        AI:88, ML:86, DSA:90, DBMS:82, OS:87, total:433, grade:"A"  },
];



const MATERIALS = [
  { id:1, title:"Unit 1: Intro to AI & Agents",      subject:"AI",   type:"PDF", size:"2.4 MB", date:"Mar 15", dl:45 },
  { id:2, title:"Neural Networks — Lecture Slides",  subject:"AI",   type:"PPT", size:"8.1 MB", date:"Mar 20", dl:38 },
  { id:3, title:"DSA Complete Notes",                subject:"DSA",  type:"PDF", size:"5.6 MB", date:"Mar 10", dl:67 },
  { id:4, title:"ML Algorithms Cheatsheet",          subject:"ML",   type:"PDF", size:"1.2 MB", date:"Mar 25", dl:52 },
  { id:5, title:"DBMS ER Diagrams",                  subject:"DBMS", type:"PDF", size:"3.1 MB", date:"Apr 1",  dl:29 },
];

const RESULTS = [
  { subject:"Artificial Intelligence", mid:42, end:78, int:18, total:138, max:150, grade:"A"  },
  { subject:"Machine Learning",        mid:38, end:72, int:16, total:126, max:150, grade:"B+" },
  { subject:"Data Structures",         mid:45, end:82, int:19, total:146, max:150, grade:"A+" },
  { subject:"Database Systems",        mid:35, end:68, int:15, total:118, max:150, grade:"B"  },
  { subject:"Operating Systems",       mid:40, end:76, int:17, total:133, max:150, grade:"A-" },
];

const NOTIFS = [
  { id:1, text:"Assignment 'Neural Network Implementation' due in 3 days", time:"2h ago",  read:false, type:"warn" },
  { id:2, text:"Your result for DSA Unit Test has been published",          time:"5h ago",  read:false, type:"info" },
  { id:3, text:"Mid-term exam schedule released — check Notice Board",     time:"1d ago",  read:true,  type:"info" },
  { id:4, text:"Attendance marked for AI class (Apr 7)",                    time:"1d ago",  read:true,  type:"success" },
  { id:5, text:"New study material uploaded: Neural Networks Slides",       time:"2d ago",  read:true,  type:"info" },
];

const TIMETABLE = {
  Monday:    ["AI (9:00 AM)","DSA Lab (11:00 AM)","ML (2:00 PM)"],
  Tuesday:   ["DBMS (9:00 AM)","OS (11:00 AM)","AI Lab (2:00 PM)"],
  Wednesday: ["ML (9:00 AM)","DS (11:00 AM)","Seminar (2:00 PM)"],
  Thursday:  ["AI (9:00 AM)","DBMS Lab (11:00 AM)","OS (2:00 PM)"],
  Friday:    ["ML (9:00 AM)","DSA (11:00 AM)","Project (2:00 PM)"],
};

/* ══════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════ */
const avi = (name = "?", size = 36, bg = T.violet, tc = "#fff") => {
  const ini = name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color:tc, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.34, fontWeight:700, flexShrink:0 }}>{ini}</div>
  );
};

function Tag({ children, color="violet" }) {
  const m = {
    violet:  ["#EDE9FE","#4F38C2"], amber: ["#FEF3C7","#92400E"], coral: ["#FFE4E4","#9B1C1C"],
    mint:    ["#D1FAF0","#064E3B"], cyan:  ["#E0F2FE","#0C4A6E"], gray:  ["#F1F0F9","#4B4580"],
    success: ["#D1FAF0","#064E3B"], danger:["#FFE4E4","#9B1C1C"], warning:["#FEF3C7","#92400E"],
  };
  const [bg, tc] = m[color] || m.violet;
  return <span style={{ background:bg, color:tc, padding:"3px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, whiteSpace:"nowrap", display:"inline-block" }}>{children}</span>;
}

function Stat({ icon, label, value, sub, gradient=GR.violet, iconBg }) {
  return (
    <div style={{ background:T.bgCard, borderRadius:16, padding:"18px 20px", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:14, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:-14, top:-14, width:80, height:80, borderRadius:"50%", background: iconBg || gradient, opacity:0.07 }} />
      <div style={{ width:50, height:50, borderRadius:14, background: iconBg || gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:12, color:T.muted, marginBottom:2, fontWeight:600, letterSpacing:"0.03em" }}>{label}</div>
        <div style={{ fontSize:22, fontWeight:800, color:T.dark, lineHeight:1.2 }}>{value}</div>
        {sub && <div style={{ fontSize:11.5, color:T.light, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Card({ children, style={} }) {
  return <div style={{ background:T.bgCard, borderRadius:16, padding:22, border:`1px solid ${T.border}`, ...style }}>{children}</div>;
}

function SecHead({ title, sub, action }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22 }}>
      <div>
        <h2 style={{ fontSize:20, fontWeight:800, color:T.dark, margin:0 }}>{title}</h2>
        {sub && <p style={{ fontSize:13, color:T.muted, margin:"4px 0 0" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Btn({ children, onClick, v="primary", sz="md", disabled=false, style={}, ...props }) {
  const vs = {
    primary: { background:GR.violet, color:"#fff", border:"none" },
    amber: { background:GR.amber, color:T.ink, border:"none" },
    coral: { background:GR.coral, color:"#fff", border:"none" },
    mint: { background:GR.mint, color:"#fff", border:"none" },
    ghost: { background:"transparent", color:T.mid, border:`1.5px solid ${T.border}` },
    danger: { background:GR.coral, color:"#fff", border:"none" },
    ink: { background:GR.ink, color:"#fff", border:"none" },
  };

  const ss = {
    sm:{ padding:"6px 14px", fontSize:12.5 },
    md:{ padding:"9px 18px", fontSize:13.5 },
    lg:{ padding:"12px 26px", fontSize:15 }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...props}
      style={{
        ...vs[v],
        ...ss[sz],
        borderRadius:10,
        cursor:disabled?"not-allowed":"pointer",
        fontWeight:700,
        fontFamily:"inherit",
        ...style
      }}
    >
      {children}
    </button>
  );
}

function Inp({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, color:T.dark, outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:T.bgCard, transition:"border 0.15s" }}
        onFocus={e=>e.target.style.borderColor=T.violet} onBlur={e=>e.target.style.borderColor=T.border} />
    </div>
  );
}

function THead({ cols }) {
  return (
    <thead>
      <tr style={{ background:T.bg }}>
        {cols.map(c=><th key={c} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.07em" }}>{c}</th>)}
      </tr>
    </thead>
  );
}

function ProgressBar({ value, max=100, color=T.violet, height=6 }) {
  const pct = Math.round((value/max)*100);
  return (
    <div style={{ height, background:T.border, borderRadius:height/2, overflow:"hidden" }}>
      <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:height/2, transition:"width 0.4s" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEACHER VERIFICATION GATE
   Wraps all teacher pages. Shows a "pending" screen
   if the teacher has not yet been verified by an admin.
══════════════════════════════════════════════════════ */
function TeacherVerificationGate({ children }) {
  return children;
}

/* ══════════════════════════════════════════════════════
   AUTH SCREEN
══════════════════════════════════════════════════════ */
function AuthScreen({ onLogin }) {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [name,setName]=useState(""); const [role,setRole]=useState("student"); const [err,setErr]=useState("");

  const doLogin = async () => {
    try {
      setErr("");
      const res = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: pass, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      localStorage.setItem("token", data.token);
      onLogin({ ...data.user, name: data.user.name || data.user.username, dept: "MCE" });
    } catch (error) {
      setErr(error.message);
    }
  };

  const doRegister = async () => {
    try {
      setErr("");
      const res = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: pass, role, name }) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      
      setMode("login");
      setErr("Registration successful! Please log in.");
    } catch (error) {
      setErr(error.message);
    }
  };
  const features = [["🤖","AI-Powered","Lesson planner, chatbot & question generator"],["📊","Live Analytics","Real-time dashboards & performance insights"],["🔒","Secure Access","JWT auth with role-based protected routes"],["📱","Responsive","Works seamlessly on any device"]];

  return (
    <div style={{ minHeight:"100vh", background:GR.ink, display:"flex", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      {/* Left panel */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 80px", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:`radial-gradient(circle at 20% 30%, ${T.violetD}55 0%, transparent 55%), radial-gradient(circle at 80% 80%, ${T.ink}CC 0%, transparent 60%)` }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:56 }}>
            <div style={{ width:48, height:48, background:GR.amber, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🎓</div>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:17 }}>EduAI Pro</div>
              <div style={{ color:T.amberL, fontSize:11.5 }}>Motihari College of Engineering</div>
            </div>
          </div>
          <h1 style={{ fontSize:48, fontWeight:800, color:"#fff", lineHeight:1.15, margin:"0 0 18px" }}>
            Smart Education<br /><span style={{ color:T.amberL }}>Management System</span>
          </h1>
          <p style={{ fontSize:15.5, color:"rgba(255,255,255,0.65)", lineHeight:1.8, maxWidth:480, marginBottom:56 }}>
            The complete AI-powered academic platform — automate attendance, manage assignments, track performance, and leverage generative AI for better learning outcomes.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, maxWidth:500 }}>
            {features.map(([ic,t,d])=>(
              <div key={t} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"16px 18px" }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{ic}</div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:13.5, marginBottom:4 }}>{t}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right panel — form */}
      <div style={{ width:440, background:"rgba(255,255,255,0.97)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"56px 44px", overflowY:"auto" }}>
        <div style={{ marginBottom:30 }}>
          <h2 style={{ fontSize:26, fontWeight:800, color:T.dark, margin:"0 0 6px" }}>{mode==="login"?"Welcome back 👋":"Create account"}</h2>
          <p style={{ fontSize:13.5, color:T.muted, margin:0 }}>{mode==="login"?"Sign in to your account":"Join EduAI Pro today"}</p>
        </div>
        {/* Tab */}
        <div style={{ display:"flex", background:T.bg, borderRadius:12, padding:4, marginBottom:28, gap:4 }}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:"9px 0", borderRadius:9, border:"none", cursor:"pointer", background:mode===m?T.bgCard:"transparent", color:mode===m?T.dark:T.muted, fontWeight:mode===m?800:500, fontSize:13.5, fontFamily:"inherit", boxShadow:mode===m?"0 2px 8px rgba(108,78,245,0.12)":"none", transition:"all 0.18s" }}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>
        {mode==="register"&&<Inp label="Full Name" value={name} onChange={setName} placeholder="Your full name"/>}
        <Inp label="Email Address" type="email" value={email} onChange={setEmail} placeholder="your@mce.edu"/>
        <Inp label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••"/>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:6 }}>Role</label>
          <div style={{ display:"flex", gap:7 }}>
            {["student","teacher","admin"].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{ flex:1, padding:"9px 0", borderRadius:10, border:`2px solid ${role===r?T.violet:T.border}`, background:role===r?T.violet+"18":"transparent", color:role===r?T.violetD:T.muted, fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>{r}</button>
            ))}
          </div>
        </div>
        {err&&<div style={{ background:"#FFF0F0", color:T.danger, padding:"10px 14px", borderRadius:10, fontSize:13, marginBottom:14, border:`1px solid #FFCDD2` }}>{err}</div>}
        <button onClick={mode==="login"?doLogin:doRegister} style={{ width:"100%", padding:"13px", background:GR.violet, color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit", marginBottom:20 }}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════ */
function Sidebar({ user, active, setActive, onLogout, notifCount }) {
  const navs = {
    admin:   [
      {k:"overview",ic:"⬛",l:"Dashboard"},{k:"students",ic:"👤",l:"Students"},{k:"teachers",ic:"👥",l:"Teachers"},
      {k:"classes",ic:"🏫",l:"Classes"},{k:"subjects",ic:"📚",l:"Subjects"},
      {k:"timetable",ic:"📅",l:"Timetable"},{k:"events",ic:"🗓️",l:"Events"},{k:"noticeboard",ic:"📢",l:"Notice Board"},{k:"analytics",ic:"📊",l:"Analytics"},
    ],
    teacher: [
      {k:"overview",ic:"⬛",l:"Dashboard"},{k:"students",ic:"👤",l:"Students"},{k:"attendance",ic:"✅",l:"Attendance"},{k:"assignments",ic:"📝",l:"Assignments"},
      {k:"materials",ic:"📁",l:"Materials"},{k:"gradebook",ic:"📒",l:"Gradebook"},{k:"tests",ic:"🧪",l:"Online Tests"},
      {k:"performance",ic:"📈",l:"Performance"},{k:"noticeboard",ic:"📢",l:"Notice Board"},
      {k:"lessonplanner",ic:"🤖",l:"AI Lesson Planner"},{k:"questiongen",ic:"❓",l:"Question Generator"},{k:"aichat",ic:"💬",l:"AI Assistant"},
    ],
    student: [
      {k:"overview",ic:"⬛",l:"Dashboard"},{k:"profile",ic:"👤",l:"My Profile"},{k:"attendance",ic:"✅",l:"Attendance"},
      {k:"materials",ic:"📁",l:"Study Materials"},{k:"assignments",ic:"📝",l:"Assignments"},
      {k:"tests",ic:"🧪",l:"Online Tests"},{k:"results",ic:"🏆",l:"Results & Grades"},
      {k:"library",ic:"📖",l:"Library"},{k:"leaderboard",ic:"🥇",l:"Leaderboard"},
      {k:"noticeboard",ic:"📢",l:"Notice Board"},{k:"aichat",ic:"🤖",l:"AI Assistant"},
    ],
  };
  const items = navs[user.role]||[];
  const roleGrad = { admin:GR.violet, teacher:GR.amber, student:GR.mint };
  const roleCol = { admin:T.violetL, teacher:T.amberL, student:T.mintL };

  return (
    <div style={{ width:256, background:GR.ink, height:"100vh", position:"sticky", top:0, display:"flex", flexDirection:"column", flexShrink:0, fontFamily:"'Plus Jakarta Sans',sans-serif", overflow:"hidden" }}>
      {/* Logo */}
      <div style={{ padding:"22px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, background:GR.amber, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🎓</div>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>EduAI Pro</div>
            <div style={{ color:T.amberL, fontSize:10.5, opacity:.85 }}>AI-Powered Platform</div>
          </div>
        </div>
      </div>
      {/* User */}
      <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"12px 12px", display:"flex", alignItems:"center", gap:10 }}>
          {avi(user.name, 38, roleGrad[user.role]||GR.violet, user.role==="teacher"?T.ink:"#fff")}
          <div style={{ overflow:"hidden" }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
            <div style={{ color:roleCol[user.role], fontSize:11, textTransform:"capitalize", marginTop:1 }}>{user.role} · {user.dept||"MCE"}</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 10px", overflowY:"auto" }}>
        {items.map(item=>{
          const isAct = active===item.k;
          return (
            <button key={item.k} onClick={()=>setActive(item.k)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 11px", borderRadius:10, border:"none",
              cursor:"pointer", marginBottom:2, textAlign:"left", fontFamily:"inherit", transition:"all 0.15s",
              background:isAct?"rgba(108,78,245,0.25)":"transparent",
              color:isAct?T.violetL:"rgba(255,255,255,0.55)",
              fontWeight:isAct?700:500, fontSize:13.5,
              borderLeft:`3px solid ${isAct?T.violetL:"transparent"}`,
            }}>
              <span style={{ fontSize:14 }}>{item.ic==="⬛"?"🏠":item.ic}</span>
              {item.l}
              {item.k==="overview"&&notifCount>0&&<span style={{ marginLeft:"auto", background:T.coral, color:"#fff", borderRadius:20, fontSize:10.5, fontWeight:800, padding:"1px 7px", minWidth:18, textAlign:"center" }}>{notifCount}</span>}
            </button>
          );
        })}
      </nav>
      {/* Logout */}
      <div style={{ padding:"10px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={onLogout} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", background:"rgba(255,87,87,0.08)", color:"rgba(255,150,150,0.85)", fontSize:13, fontWeight:600, fontFamily:"inherit" }}>🚪 Sign Out</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════════════════ */
function Topbar({ user, notifs, markAllAsRead, showNotifs, setShowNotifs }) {
  const notifCount = notifs.filter(n => !n.read).length;
  return (
    <div style={{ background:T.bgCard, borderBottom:`1px solid ${T.border}`, padding:"12px 30px", display:"flex", alignItems:"center", justifyContent:"space-between", fontFamily:"'Plus Jakarta Sans',sans-serif", position:"sticky", top:0, zIndex:10 }}>
      <div style={{ fontSize:13, color:T.muted }}>📅 {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ position:"relative" }}>
          <button onClick={()=>setShowNotifs(!showNotifs)} style={{ background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:10, width:38, height:38, cursor:"pointer", fontSize:17, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>🔔
            {notifCount>0&&<span style={{ position:"absolute", top:-4, right:-4, background:T.coral, color:"#fff", borderRadius:"50%", fontSize:9, fontWeight:800, width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center" }}>{notifCount}</span>}
          </button>
          {showNotifs&&(
            <div style={{ position:"absolute", right:0, top:46, width:360, background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:14, boxShadow:"0 12px 48px rgba(108,78,245,0.14)", zIndex:100 }}>
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontWeight:800, color:T.dark, fontSize:14 }}>Notifications</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {notifCount > 0 && <button onClick={markAllAsRead} style={{ background: "none", border: "none", fontSize: 11, color: T.violetD, cursor: "pointer", fontWeight: 700 }}>Mark all as read</button>}
                  <Tag color="violet">{notifCount} new</Tag>
                </div>
              </div>
              {notifs.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: T.muted, fontSize: 13 }}>No notifications</div>
              ) : (
                notifs.map(n=>(
                  <div key={n.id} style={{ padding:"11px 16px", borderBottom:`1px solid ${T.border}`, background:n.read?"transparent":T.violet+"08", display:"flex", gap:10, alignItems:"flex-start" }}>
                    <span style={{ fontSize:16 }}>{n.type==="warn"?"⚠️":n.type==="success"?"✅":"ℹ️"}</span>
                    <div>
                      <div style={{ fontSize:13, color:T.dark, fontWeight:n.read?400:700, lineHeight:1.5 }}>{n.text}</div>
                      <div style={{ fontSize:11, color:T.light, marginTop:3 }}>{n.time}</div>
                    </div>
                    {!n.read&&<div style={{ width:7, height:7, background:T.violet, borderRadius:"50%", flexShrink:0, marginTop:5 }}/>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:9, background:T.bg, borderRadius:10, padding:"6px 12px 6px 6px", border:`1.5px solid ${T.border}` }}>
          {avi(user.name, 28, GR.violet)}
          <span style={{ fontSize:13, fontWeight:700, color:T.dark }}>{user.name.split(" ")[0]}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   NOTICE BOARD
══════════════════════════════════════════════════════ */
function NoticeBoard({ user }) {
  const typeIc = { exam:"📋", event:"🎉", general:"📌", academic:"📚", placement:"💼" };
  const typeColor = { exam:"coral", event:"violet", general:"gray", academic:"cyan", placement:"mint" };

  const [notices, setNotices] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", date: "", type: "general", priority: "medium" });

  const handlePostNotice = () => {
    if (!newNotice.title || !newNotice.date) return;
    setNotices([{ ...newNotice, id: Date.now() }, ...notices]);
    setNewNotice({ title: "", date: "", type: "general", priority: "medium" });
    setShowAdd(false);
  };

  const canPost = user?.role === "admin";

  return (
    <div>
      <SecHead 
        title="📢 Notice Board" 
        sub="Official announcements from the college administration" 
        action={canPost && <Btn v="primary" sz="sm" onClick={() => setShowAdd(!showAdd)}>{showAdd ? "Cancel" : "+ Post Notice"}</Btn>} 
      />

      {showAdd && canPost && (
        <Card style={{ marginBottom: 20, borderLeft: `4px solid ${T.violet}` }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:14 }}>Post New Notice</div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:10, alignItems: "flex-end", marginBottom: 14 }}>
            <Inp label="Notice Title" value={newNotice.title} onChange={v => setNewNotice({...newNotice, title: v})} placeholder="e.g. Holiday on Friday"/>
            <Inp label="Date" type="date" value={newNotice.date} onChange={v => setNewNotice({...newNotice, date: v})} />
            
            <div style={{ marginBottom: 14 }}>
              <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Type</label>
              <select value={newNotice.type} onChange={e=>setNewNotice({...newNotice, type: e.target.value})} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}>
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="exam">Exam</option>
                <option value="event">Event</option>
                <option value="placement">Placement</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Priority</label>
              <select value={newNotice.priority} onChange={e=>setNewNotice({...newNotice, priority: e.target.value})} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High (Urgent)</option>
              </select>
            </div>
          </div>
          <Btn v="primary" sz="sm" onClick={handlePostNotice}>Publish Notice</Btn>
        </Card>
      )}

      {notices.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: T.muted }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📢</div>
          <div style={{ fontWeight: 600 }}>No notices available.</div>
          {canPost && <div style={{ fontSize: 13 }}>Click "+ Post Notice" to add one.</div>}
        </div>
      ) : (
        <div style={{ display:"grid", gap:12 }}>
          {notices.map(n=>(
            <Card key={n.id} style={{ borderLeft:`4px solid ${n.priority==="high"?T.coral:n.priority==="medium"?T.amber:T.border}`, padding:"16px 20px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{typeIc[n.type]||"📌"}</div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:T.dark, lineHeight:1.4 }}>{n.title}</div>
                    <div style={{ fontSize:12.5, color:T.muted, marginTop:5 }}>📅 {n.date}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <Tag color={typeColor[n.type]||"gray"}>{n.type}</Tag>
                  {n.priority==="high"&&<Tag color="coral">Urgent</Tag>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   EVENTS CALENDAR
══════════════════════════════════════════════════════ */
function EventsCalendar() {
  const typeIc = { exam:"📋", event:"🎉", placement:"💼", training:"🎓", sports:"🏃" };
  const typeColors = { exam:T.coral, event:T.violet, placement:T.mint, training:T.amber, sports:T.cyan };

  const [events, setEvents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", type: "event" });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, { ...newEvent, id: Date.now(), color: typeColors[newEvent.type] || T.violet }]);
    setNewEvent({ title: "", date: "", time: "", type: "event" });
    setShowAdd(false);
  };

  return (
    <div>
      <SecHead 
        title="🗓️ Events & Calendar" 
        sub="Upcoming academic events, exams, and activities" 
        action={<Btn v="primary" sz="sm" onClick={() => setShowAdd(!showAdd)}>{showAdd ? "Cancel" : "+ Add Event"}</Btn>} 
      />

      {showAdd && (
        <Card style={{ marginBottom: 20, borderLeft: `4px solid ${T.violet}` }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:14 }}>Create New Event</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10, alignItems: "flex-end", marginBottom: 14 }}>
            <Inp label="Event Title" value={newEvent.title} onChange={v => setNewEvent({...newEvent, title: v})} placeholder="e.g. Annual Sports Day"/>
            <Inp label="Date" type="date" value={newEvent.date} onChange={v => setNewEvent({...newEvent, date: v})} />
            <Inp label="Time" type="time" value={newEvent.time} onChange={v => setNewEvent({...newEvent, time: v})} />
            <div style={{ marginBottom: 14 }}>
              <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Event Type</label>
              <select value={newEvent.type} onChange={e=>setNewEvent({...newEvent, type: e.target.value})} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}>
                <option value="event">Event</option>
                <option value="exam">Exam</option>
                <option value="placement">Placement</option>
                <option value="training">Training</option>
                <option value="sports">Sports</option>
              </select>
            </div>
          </div>
          <Btn v="primary" sz="sm" onClick={handleAddEvent}>Create Event</Btn>
        </Card>
      )}

      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: T.muted }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
          <div style={{ fontWeight: 600 }}>No upcoming events.</div>
          <div style={{ fontSize: 13 }}>Click "+ Add Event" to schedule a new one.</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {events.map(e=>(
            <Card key={e.id} style={{ borderTop:`4px solid ${e.color}` }}>
              <div style={{ fontSize:26, marginBottom:10 }}>{typeIc[e.type]||"📅"}</div>
              <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:5 }}>{e.title}</div>
              <div style={{ fontSize:13, color:T.muted, marginBottom:4 }}>📅 {e.date}</div>
              <div style={{ fontSize:13, color:T.muted, marginBottom:14 }}>⏰ {e.time}</div>
              <Tag color={e.type==="exam"?"coral":e.type==="placement"?"mint":e.type==="event"?"violet":"amber"}>{e.type}</Tag>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FEE MANAGEMENT
══════════════════════════════════════════════════════ */
function FeeManagement() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/students", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
        else console.error("Error fetching students:", data);
      })
      .catch(err => console.log(err));
  }, []);

  const feeData = students.map((s, index) => {
    const tuition = 40000;
    const hostel = 18000;
    const misc = 3500;
    const paid = index % 3 === 0 ? 61500 : (index % 3 === 1 ? 20000 : 0);
    const tot = tuition + hostel + misc;
    const status = paid === tot ? "Paid" : (paid > 0 ? "Pending" : "Overdue");

    return {
      id: s._id?.slice(-5) || "00000",
      name: s.name,
      sem: s.semester || "1st",
      tuition,
      hostel,
      misc,
      paid,
      status
    };
  });

  const total = feeData.reduce((a,f)=>a+f.paid,0);
  const due   = feeData.reduce((a,f)=>a+(f.tuition+f.hostel+f.misc-f.paid),0);

  return (
    <div>
      <SecHead title="💳 Fee Management" sub="Track tuition, hostel, and miscellaneous fee payments" action={<Btn v="amber" sz="sm">Generate Report</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <Stat icon="💰" label="Total Collected" value={`₹${(total/1000).toFixed(0)}K`} sub="This semester" gradient={GR.mint} />
        <Stat icon="⏳" label="Pending Amount" value={`₹${(due/1000).toFixed(0)}K`} sub={`Across ${feeData.filter(f=>f.status!=="Paid").length} students`} gradient={GR.coral} />
        <Stat icon="✅" label="Fully Paid" value={`${feeData.filter(f=>f.status==="Paid").length}`} sub={`of ${feeData.length} students`} gradient={GR.violet} />
        <Stat icon="🚨" label="Overdue" value={`${feeData.filter(f=>f.status==="Overdue").length}`} sub="Requires action" gradient={GR.amber} />
      </div>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <THead cols={["Roll No","Student","Semester","Tuition","Hostel","Misc","Paid","Balance","Status","Action"]}/>
          <tbody>
            {feeData.map((f, i)=>{
              const tot=f.tuition+f.hostel+f.misc; const bal=tot-f.paid;
              return (
                <tr key={f.id + i} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"11px 14px", fontSize:12.5, color:T.muted, fontWeight:700 }}>{f.id}</td>
                  <td style={{ padding:"11px 14px" }}><div style={{ display:"flex", alignItems:"center", gap:8 }}>{avi(f.name,28)}<span style={{ fontSize:13.5, fontWeight:700, color:T.dark }}>{f.name}</span></div></td>
                  <td style={{ padding:"11px 14px", fontSize:13 }}>{f.sem} Sem</td>
                  <td style={{ padding:"11px 14px", fontSize:13 }}>₹{f.tuition.toLocaleString()}</td>
                  <td style={{ padding:"11px 14px", fontSize:13 }}>₹{f.hostel.toLocaleString()}</td>
                  <td style={{ padding:"11px 14px", fontSize:13 }}>₹{f.misc.toLocaleString()}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:T.success }}>₹{f.paid.toLocaleString()}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:bal>0?T.danger:T.success }}>₹{bal.toLocaleString()}</td>
                  <td style={{ padding:"11px 14px" }}><Tag color={f.status==="Paid"?"success":f.status==="Pending"?"warning":"coral"}>{f.status}</Tag></td>
                  <td style={{ padding:"11px 14px" }}><Btn v="ghost" sz="sm">Send Reminder</Btn></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LIBRARY
══════════════════════════════════════════════════════ */
function LibraryView({ role }) {
  return (
    <div>
      <SecHead title="📖 Library Management" sub="Browse, borrow, and return books" action={role==="admin"&&<Btn v="primary" sz="sm">+ Add Book</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        <Stat icon="📚" label="Total Books" value="847" gradient={GR.violet} />
        <Stat icon="✅" label="Available" value="612" sub="Ready to borrow" gradient={GR.mint} />
        <Stat icon="📤" label="Borrowed" value="235" sub="Due this week: 18" gradient={GR.amber} />
      </div>
      <div style={{ display:"grid", gap:10 }}>
        {LIBRARY.map(b=>(
          <Card key={b.id} style={{ padding:"16px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:50, height:60, background:b.available===0?T.bg:GR.violet, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>📕</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700, color:T.dark }}>{b.title}</div>
                <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>✍️ {b.author}</div>
                {b.borrowed&&b.due&&<div style={{ fontSize:12.5, color:T.warning, marginTop:4, fontWeight:700 }}>⏰ Due: {b.due}</div>}
                <div style={{ marginTop:10 }}>
                  <ProgressBar value={b.available} max={b.total} color={b.available===0?T.danger:T.success} />
                  <div style={{ fontSize:11.5, color:T.muted, marginTop:4 }}>{b.available}/{b.total} copies available</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Tag color={b.available===0?"coral":"mint"}>{b.available===0?"Unavailable":"Available"}</Tag>
                {role==="student"&&(
                  b.borrowed
                    ? <Btn v="ghost" sz="sm">Return</Btn>
                    : b.available>0 ? <Btn v="primary" sz="sm">Borrow</Btn> : <Btn v="ghost" sz="sm" disabled>Reserved</Btn>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LEADERBOARD
══════════════════════════════════════════════════════ */
function Leaderboard() {
  const sorted = [...STUDENTS].sort((a,b)=>b.gpa-a.gpa);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div>
      <SecHead title="🏆 Class Leaderboard" sub="Rankings based on GPA, attendance & performance" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        {sorted.slice(0,3).map((s,i)=>(
          <Card key={s.id} style={{ textAlign:"center", padding:"28px 20px", border:`2px solid ${i===0?T.amber:i===1?T.light:T.coral}` }}>
            <div style={{ fontSize:42, marginBottom:10 }}>{medals[i]}</div>
            {avi(s.name, 56, i===0?GR.amber:i===1?GR.violet:GR.coral, i===1?"#fff":T.ink)}
            <div style={{ margin:"10px auto 0" }}>
              <div style={{ fontSize:15, fontWeight:800, color:T.dark }}>{s.name}</div>
              <div style={{ fontSize:12.5, color:T.muted, marginBottom:10 }}>{s.id} · {s.class}</div>
              <div style={{ fontSize:26, fontWeight:800, color:i===0?T.amberD:T.violetD }}>{s.gpa} GPA</div>
              <div style={{ fontSize:12, color:T.muted }}>Attendance: {s.att}%</div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <THead cols={["Rank","Student","Roll No","Class","GPA","Attendance","Status"]}/>
          <tbody>
            {sorted.map((s,i)=>(
              <tr key={s.id} style={{ borderBottom:`1px solid ${T.border}`, background:i<3?T.violet+"05":"transparent" }}>
                <td style={{ padding:"12px 14px", fontWeight:800, fontSize:17, color:i===0?T.amberD:i===1?T.violetD:i===2?T.coral:T.muted }}>{medals[i]||`#${i+1}`}</td>
                <td style={{ padding:"12px 14px" }}><div style={{ display:"flex", alignItems:"center", gap:9 }}>{avi(s.name,32)}<span style={{ fontSize:14, fontWeight:700, color:T.dark }}>{s.name}</span></div></td>
                <td style={{ padding:"12px 14px", fontSize:13, color:T.muted, fontWeight:700 }}>{s.id}</td>
                <td style={{ padding:"12px 14px", fontSize:13, color:T.muted }}>{s.class}</td>
                <td style={{ padding:"12px 14px", fontWeight:800, fontSize:16, color:T.violetD }}>{s.gpa}</td>
                <td style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:80 }}><ProgressBar value={s.att} color={s.att>=75?T.success:T.danger}/></div>
                    <span style={{ fontSize:12.5, fontWeight:700, color:s.att>=75?T.success:T.danger }}>{s.att}%</span>
                  </div>
                </td>
                <td style={{ padding:"12px 14px" }}><Tag color={s.att>=75&&s.gpa>=8?"mint":s.gpa>=7?"violet":"coral"}>{s.att>=75&&s.gpa>=8?"Excellent":s.gpa>=7?"Good":"Needs Help"}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STUDENT PROFILE
══════════════════════════════════════════════════════ */
function StudentProfile({ user }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/students", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStudent(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  const profileUser = student || user;

  return (
    <div>
      <SecHead title="👤 My Profile" />
      <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:18 }}>
        <div>
          <Card style={{ textAlign:"center", padding:"30px 24px" }}>
            <div style={{ width:90, height:90, borderRadius:"50%", background:GR.violet, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, fontWeight:800, color:"#fff", margin:"0 auto 14px" }}>
              {(profileUser.name || "Student").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div style={{ fontSize:19, fontWeight:800, color:T.dark }}>{profileUser.name}</div>
            <div style={{ fontSize:13.5, color:T.muted, margin:"4px 0 14px" }}>Roll No: {profileUser.rollNo||"N/A"}</div>
            <Tag color="violet">{profileUser.branch || "B.Tech CSE-AI"} · {profileUser.semester || "1st"} Semester</Tag>
            <div style={{ marginTop:18, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ background:T.bg, borderRadius:10, padding:12 }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.violetD }}>{profileUser.gpa || "N/A"}</div>
                <div style={{ fontSize:11, color:T.muted }}>Current GPA</div>
              </div>
              <div style={{ background:T.bg, borderRadius:10, padding:12 }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.success }}>{profileUser.attendance || 0}%</div>
                <div style={{ fontSize:11, color:T.muted }}>Attendance</div>
              </div>
            </div>
          </Card>
          <Card style={{ marginTop:14 }}>
            <div style={{ fontSize:14, fontWeight:800, color:T.dark, marginBottom:14 }}>Contact Info</div>
            {[["📧 Email", profileUser.email || "N/A"],["📱 Phone", profileUser.phone || "N/A"],["🏠 Address", profileUser.address || "N/A"],["🎂 DOB", profileUser.dob || "N/A"]].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.border}`, fontSize:13 }}>
                <span style={{ color:T.muted }}>{l}</span><span style={{ fontWeight:600, color:T.dark, textAlign:"right" }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <Card style={{ marginBottom:14 }}>
            <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:16 }}>Academic Performance</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke={T.border}/><PolarAngleAxis dataKey="subject" tick={{ fontSize:12, fill:T.muted }}/>
                <Radar name="Performance" dataKey="A" stroke={T.violet} fill={T.violet} fillOpacity={0.18}/>
              </RadarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:16 }}>Academic Details</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["Program", profileUser.branch || "B.Tech CSE-AI"], ["Batch", profileUser.batch || "N/A"], ["Semester", profileUser.semester || "1st"], ["Roll No", profileUser.rollNo || "N/A"], ["Registration No", profileUser.registrationNumber || "N/A"], ["Class", profileUser.class || "N/A"]].map(([l,v])=>(
                <div key={l} style={{ background:T.bg, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:11.5, color:T.muted, marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.dark }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ADMIN OVERVIEW
══════════════════════════════════════════════════════ */
function AdminOverview({ onNavigate }) {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalSubjects: 0, totalClasses: 0 });
  const [subjects, setSubjects] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const h = { "Authorization": `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:5001/students",  { headers: h }).then(r => r.json()),
      fetch("http://localhost:5001/teachers",  { headers: h }).then(r => r.json()),
      fetch("http://localhost:5001/subjects",  { headers: h }).then(r => r.json()),
      fetch("http://localhost:5001/classes",   { headers: h }).then(r => r.json()),
    ])
      .then(([students, teachers, subjs, classes]) => {
        const sc = Array.isArray(students) ? students.length : 0;
        const tc = Array.isArray(teachers) ? teachers.length : 0;
        const sbc = Array.isArray(subjs) ? subjs.length : 0;
        const cc = Array.isArray(classes) ? classes.length : 0;

        setStats({ totalStudents: sc, totalTeachers: tc, totalSubjects: sbc, totalClasses: cc });
        if (Array.isArray(subjs)) setSubjects(subjs);

        // Real alerts based on live data
        const newAlerts = [];
        if (sc === 0) newAlerts.push({ id: 1, t: "No students enrolled yet — add students to get started.", c: "warning" });
        if (tc === 0) newAlerts.push({ id: 2, t: "No teachers added yet — go to Teachers to add faculty.", c: "warning" });
        if (sbc === 0) newAlerts.push({ id: 3, t: "No subjects created — add subjects in the Subjects section.", c: "amber" });
        if (cc === 0) newAlerts.push({ id: 4, t: "No classes set up — create classes in the Classes section.", c: "amber" });
        if (sc > 0) newAlerts.push({ id: 5, t: `${sc} student${sc > 1 ? "s" : ""} currently enrolled.`, c: "mint" });
        if (tc > 0) newAlerts.push({ id: 6, t: `${tc} faculty member${tc > 1 ? "s" : ""} added to the system.`, c: "mint" });
        if (sbc > 0) newAlerts.push({ id: 7, t: `${sbc} active subject${sbc > 1 ? "s" : ""} this semester.`, c: "mint" });
        setAlerts(newAlerts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dismissAlert = (id) => setAlerts(alerts.filter(a => a.id !== id));

  // Build subject chart from real subjects data
  const subjectChart = subjects.slice(0, 6).map(s => ({
    name: (s.name || s.code || "Subject").slice(0, 10),
    credits: s.credits || 3,
  }));

  return (
    <div>
      <SecHead title="Admin Dashboard" sub="System-wide overview of Motihari College of Engineering" action={<Tag color="mint">● All Systems Operational</Tag>} />

      {/* STAT CARDS — real data, no fee */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <Stat icon="👨‍🎓" label="Total Students"  value={loading ? "…" : stats.totalStudents} sub="Enrolled in system"   gradient={GR.violet} />
        <Stat icon="👨‍🏫" label="Total Teachers" value={loading ? "…" : stats.totalTeachers}  sub="Verified faculty"     gradient={GR.amber}  />
        <Stat icon="📚"  label="Active Subjects" value={loading ? "…" : stats.totalSubjects}  sub="This semester"        gradient={GR.coral}  />
        <Stat icon="🏫"  label="Total Classes"   value={loading ? "…" : stats.totalClasses}   sub="Across all branches"  gradient={GR.mint}   />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:14, marginBottom:14 }}>
        {/* SUBJECTS CHART — real data */}
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Active Subjects</div>
          {subjectChart.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px", color:T.muted }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📚</div>
              <div style={{ fontWeight:600, fontSize:13 }}>No subjects added yet.</div>
              <div style={{ fontSize:12, marginTop:4 }}>Go to <b>Subjects</b> to add courses.</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectChart} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize:11, fill:T.muted }} />
                <YAxis tick={{ fontSize:11, fill:T.muted }} />
                <Tooltip formatter={(v) => [`${v} Credits`, "Credits"]} />
                <Bar dataKey="credits" radius={[6,6,0,0]}>
                  {subjectChart.map((_,i) => <Cell key={i} fill={[T.violet,T.amber,T.coral,T.mint,T.cyan,T.violetL][i % 6]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* QUICK ACTIONS — no fee */}
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Quick Actions</div>
          {[
            ["➕","Add New Student",  "students"],
            ["👨‍🏫","Add New Teacher",  "teachers"],
            ["🏫","Manage Classes",   "classes"],
            ["📚","Add Subject",      "subjects"],
            ["📅","Update Timetable", "timetable"],
            ["📢","Post Announcement","noticeboard"],
          ].map(([ic, l, dest]) => (
            <button key={l} onClick={() => onNavigate && onNavigate(dest)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, background:T.bg, cursor:"pointer", marginBottom:7, color:T.dark, fontSize:13.5, fontWeight:600, fontFamily:"inherit", textAlign:"left", transition:"0.2s" }}>
              <span style={{ fontSize:16 }}>{ic}</span>{l}
            </button>
          ))}
        </Card>
      </div>

      {/* SUBJECTS LIST + ALERTS */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Recent Subjects</div>
          {subjects.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px", color:T.muted, fontSize:13 }}>No subjects added yet.</div>
          ) : (
            subjects.slice(0, 5).map((s, i) => (
              <div key={s._id || i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:8, background:[GR.violet,GR.amber,GR.coral,GR.mint,GR.cyan][i%5], display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📖</div>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:T.dark }}>{s.name || s.code}</div>
                    <div style={{ fontSize:11.5, color:T.muted }}>{s.dept || "—"} · {s.sem || "—"} Sem</div>
                  </div>
                </div>
                <Tag color="violet">{s.credits || 0} Cr</Tag>
              </div>
            ))
          )}
        </Card>

        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14, display:"flex", justifyContent:"space-between" }}>
            System Alerts
            {alerts.length > 0 && <span style={{ fontSize:11, background:T.coral, color:"#fff", padding:"2px 6px", borderRadius:10 }}>{alerts.length}</span>}
          </div>
          {alerts.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px", color:T.muted, fontSize:13 }}>No alerts. Everything looks good! ✅</div>
          ) : (
            alerts.map(a => (
              <div key={a.id} style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"flex-start", padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:{coral:T.danger,warning:T.warning,amber:T.amber,mint:T.success}[a.c]||T.muted, flexShrink:0, marginTop:5 }} />
                  <span style={{ fontSize:13.5, color:T.dark }}>{a.t}</span>
                </div>
                <button onClick={() => dismissAlert(a.id)} style={{ background:"transparent", border:"none", cursor:"pointer", color:T.muted, fontSize:14 }}>×</button>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════
   ADMIN STUDENTS
══════════════════════════════════════════════════════ */
function AdminStudents() {
  const [q, setQ] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = () => {
    fetch("http://localhost:5001/students", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
        else console.error("Error fetching students:", data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const list = students.filter(s => {
    const matchQ = s.name?.toLowerCase().includes(q.toLowerCase()) || s.rollNo?.toLowerCase().includes(q.toLowerCase()) || s._id?.includes(q);
    const matchSem = semesterFilter ? s.semester === semesterFilter : true;
    const matchBranch = branchFilter ? s.branch === branchFilter : true;
    return matchQ && matchSem && matchBranch;
  });

  return (
    <div>
      {selectedStudent && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Card style={{ width:"90%", maxWidth:600, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:800, color:"#1A1540" }}>Student Details</div>
              <Btn v="ghost" sz="sm" onClick={() => setSelectedStudent(null)}>✕ Close</Btn>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Name</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.name}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Roll No</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.rollNo || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Registration No</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.registrationNumber || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Batch</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.batch || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Branch</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.branch || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Semester</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.semester || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Email</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.email || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Phone</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.phone || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>DOB</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.dob || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Address</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1A1540" }}>{selectedStudent.address || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>Attendance</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#10C98F" }}>{selectedStudent.attendance || 0}%</div>
              </div>
              <div>
                <div style={{ fontSize:14, color:"#7B789E", marginBottom:2 }}>GPA</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#4F38C2" }}>{selectedStudent.gpa || 0}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <AddStudentForm onAdd={fetchStudents} />

      <SecHead
        title="Student Management"
        sub={`${students.length} students enrolled`}
      />

      <Card>
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="🔍  Search by name or roll number..."
            style={{ flex: 1, minWidth: "200px", padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13.5, outline: "none" }}
          />
          <select value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)} style={{ padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13.5, outline: "none" }}>
            <option value="">All Semesters</option>
            <option value="1st">1st Semester</option>
            <option value="2nd">2nd Semester</option>
            <option value="3rd">3rd Semester</option>
            <option value="4th">4th Semester</option>
            <option value="5th">5th Semester</option>
            <option value="6th">6th Semester</option>
            <option value="7th">7th Semester</option>
            <option value="8th">8th Semester</option>
          </select>

          <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} style={{ padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13.5, outline: "none" }}>
            <option value="">All Branches</option>
            <option value="CSE-AI">CSE-AI</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
          </select>
          <Btn v="ghost" sz="sm">Export CSV</Btn>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <THead cols={["Roll No","Name","Branch","Sem","Attendance","GPA","Status","Action"]} />
          <tbody>
            {list.map(s => (
              <tr key={s._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "12px 14px", fontWeight: 700 }}>{s.rollNo || s._id?.slice(-5)}</td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    {avi(s.name, 32)}
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                  </div>
                </td>
                <td style={{ padding: "12px 14px" }}>{s.branch || s.class || "N/A"}</td>
                <td style={{ padding: "12px 14px" }}>{s.semester}</td>
                <td style={{ padding: "12px 14px" }}>{s.attendance}%</td>
                <td style={{ padding: "12px 14px", fontWeight: 700 }}>{s.gpa}</td>
                <td style={{ padding: "12px 14px" }}><Tag color="mint">Active</Tag></td>
                <td style={{ padding: "12px 14px" }}><Btn v="ghost" sz="sm" onClick={() => setSelectedStudent(s)}>View →</Btn></td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan="8" style={{ padding:"24px", textAlign:"center", color:T.muted }}>No students found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEACHER STUDENTS
   Teachers only see students THEY personally added.
   Backend scopes by teacherId = current teacher's userId.
══════════════════════════════════════════════════════ */
function TeacherStudents() {
  const [q, setQ] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchStudents = () => {
    fetch("http://localhost:5001/students", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) { setStudents(data); setError(""); }
        else if (data.error === "NOT_VERIFIED") setError(data.message);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchStudents(); }, []);

  const list = students.filter(
    s => s.name?.toLowerCase().includes(q.toLowerCase()) || s._id?.includes(q)
  );

  if (error) return (
    <div style={{ textAlign:"center", padding:"60px", color:T.muted }}>
      <div style={{ fontSize:36, marginBottom:10 }}>🔒</div>
      <div style={{ fontWeight:700 }}>{error}</div>
    </div>
  );

  return (
    <div>
      {/* STUDENT DETAIL MODAL */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:T.bgCard, borderRadius:18, padding:30, width:"100%", maxWidth:580, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(108,78,245,0.2)" }}>
            {/* Modal Header */}
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
              {avi(selected.name, 52)}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.dark }}>{selected.name}</div>
                <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>
                  {selected.branch || "—"} · Semester {selected.semester || "—"}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:22, color:T.muted }}>✕</button>
            </div>

            {/* Status Tags */}
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              <Tag color={Number(selected.attendance) >= 75 ? "mint" : "coral"}>
                Attendance: {selected.attendance || 0}%
              </Tag>
              {selected.gpa && <Tag color="violet">GPA: {selected.gpa}</Tag>}
              <Tag color={Number(selected.attendance) >= 75 ? "mint" : "coral"}>
                {Number(selected.attendance) >= 75 ? "✅ Safe" : "⚠️ Low Attendance"}
              </Tag>
            </div>

            {/* Detail Grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                ["👤 Roll No",            selected.rollNo              || "—"],
                ["📋 Registration No",    selected.registrationNumber  || "—"],
                ["🌿 Branch",             selected.branch              || "—"],
                ["📅 Semester",           selected.semester            || "—"],
                ["🎓 Batch",              selected.batch               || "—"],
                ["🏫 Class",              selected.class               || "—"],
                ["📧 Email",              selected.email               || "—"],
                ["📞 Phone",              selected.phone               || "—"],
                ["🎂 Date of Birth",      selected.dob                 || "—"],
                ["📍 Address",            selected.address             || "—"],
                ["📊 Attendance",         `${selected.attendance || 0}%`],
                ["⭐ GPA",                selected.gpa                 || "—"],
              ].map(([label, val]) => (
                <div key={label} style={{ background:T.bg, borderRadius:10, padding:"11px 14px" }}>
                  <div style={{ fontSize:11, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.dark, wordBreak:"break-word" }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
              <Btn v="ghost" sz="sm" onClick={() => setSelected(null)}>Close</Btn>
            </div>
          </div>
        </div>
      )}

      <SecHead title="My Students" sub={`${students.length} students in your records`} />
      <Card>
        <div style={{ display:"flex", gap:10, marginBottom:18 }}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍  Search by name..."
            style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}/>
        </div>
        {list.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px", color:T.muted }}>
            <div style={{ fontSize:36, marginBottom:8 }}>👤</div>
            <div>No students assigned. Ask your admin to add students to your institution.</div>
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <THead cols={["ID","Name","Class","Semester","Attendance","GPA","Action"]}/>
            <tbody>
              {list.map(s=>(
                <tr key={s._id} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"12px 14px", fontWeight:700, color:T.muted }}>{s._id?.slice(-5)}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      {avi(s.name,32)}
                      <span style={{ fontWeight:700, color:T.dark }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:13 }}>{s.class}</td>
                  <td style={{ padding:"12px 14px", fontSize:13 }}>{s.semester}</td>
                  <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:Number(s.attendance)>=75?T.success:T.danger }}>{s.attendance}%</td>
                  <td style={{ padding:"12px 14px", fontWeight:700 }}>{s.gpa}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <Btn v="ghost" sz="sm" onClick={() => setSelected(s)}>View →</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
/* ══════════════════════════════════════════════════════
   ADMIN TEACHERS
══════════════════════════════════════════════════════ */
function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = () => {
    fetch("http://localhost:5001/teachers", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTeachers(data);
        else console.error("Error fetching teachers:", data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div>
      <AddTeacherForm onAdd={fetchTeachers} />

      <SecHead title="Teacher Management" sub={`${teachers.length} faculty members`} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {teachers.map(t=>(
          <Card key={t._id} style={{ borderTop:`4px solid ${T.violet}` }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:13, marginBottom:14 }}>
              {avi(t.name, 50, GR.violet)}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15.5, fontWeight:800, color:T.dark }}>{t.name}</div>
                <div style={{ fontSize:13, color:T.amber, fontWeight:700, marginTop:2 }}>{t.subject}</div>
                <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>🏷️ {t.dept} · 🕐 {t.exp}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:800, color:T.dark }}>⭐ {t.rating}</div>
                <div style={{ fontSize:11, color:T.muted }}>Rating</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, padding:"12px 0", borderTop:`1px solid ${T.border}` }}>
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontSize:17, fontWeight:800, color:T.violetD }}>{t.students}</div>
                <div style={{ fontSize:11, color:T.muted }}>Students</div>
              </div>
              <div style={{ width:1, background:T.border }}/>
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontSize:17, fontWeight:800, color:T.violetD }}>{t.classes || 3}</div>
                <div style={{ fontSize:11, color:T.muted }}>Classes</div>
              </div>
              <div style={{ width:1, background:T.border }}/>
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontSize:17, fontWeight:800, color:T.violetD }}>6</div>
                <div style={{ fontSize:11, color:T.muted }}>Subjects</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <Btn v="ghost" sz="sm" style={{ flex:1 }}>View Profile</Btn>
              <Btn v="primary" sz="sm" style={{ flex:1 }}>Message</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ADMIN ANALYTICS
══════════════════════════════════════════════════════ */
function AdminAnalytics() {
  return (
    <div>
      <SecHead title="Analytics & Insights" sub="Institution-wide academic performance data" action={<Btn v="ghost" sz="sm">📥 Export PDF</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Subject-wise Avg Scores</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PERF_CHART} barSize={36}>
              <XAxis dataKey="sub" tick={{ fontSize:12, fill:T.muted }}/><YAxis domain={[60,100]} tick={{ fontSize:11, fill:T.muted }}/><Tooltip/>
              <Bar dataKey="score" fill={T.violet} radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Attendance Trend (6 months)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ATTENDANCE_CHART}>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:T.muted }}/><YAxis tick={{ fontSize:11, fill:T.muted }}/><Tooltip/>
              <Line type="monotone" dataKey="present" stroke={T.mint}  strokeWidth={2.5} dot={{ fill:T.mint,  r:4 }}/>
              <Line type="monotone" dataKey="absent"  stroke={T.coral} strokeWidth={2.5} dot={{ fill:T.coral, r:4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
        <Card style={{ textAlign:"center", padding:"24px" }}>
          <div style={{ fontSize:38, fontWeight:800, color:T.violetD }}>8.2</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.dark }}>Institute Average GPA</div>
          <div style={{ fontSize:12, color:T.muted }}>↑ 0.3 from last semester</div>
        </Card>
        <Card style={{ textAlign:"center", padding:"24px" }}>
          <div style={{ fontSize:38, fontWeight:800, color:T.success }}>89%</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.dark }}>Overall Attendance</div>
          <div style={{ fontSize:12, color:T.muted }}>Above 75% threshold</div>
        </Card>
        <Card style={{ textAlign:"center", padding:"24px" }}>
          <div style={{ fontSize:38, fontWeight:800, color:T.amberD }}>94%</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.dark }}>Fee Recovery Rate</div>
          <div style={{ fontSize:12, color:T.muted }}>₹8.4L collected this sem</div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ADMIN SUBJECTS
══════════════════════════════════════════════════════ */
function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchSubjects = () => {
    fetch("http://localhost:5001/subjects", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSubjects(data);
      })
      .catch(err => console.log(err));
  };

  const fetchTeachers = () => {
    fetch("http://localhost:5001/teachers", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTeachers(data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const handleEdit = (s) => {
    setEditingId(s._id);
    setEditForm(s);
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:5001/subjects/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(editForm)
      });
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AddSubjectForm onAdd={fetchSubjects} teachers={teachers} />

      <SecHead title="Subjects & Courses" sub={`${subjects.length} active subjects`} />
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <THead cols={["Code","Subject Name","Credits","Semester","Department","Faculty","Classes","Action"]}/>
          <tbody>
            {subjects.map(s=>(
              <tr key={s._id || s.code} style={{ borderBottom:`1px solid ${T.border}` }}>
                {editingId === s._id ? (
                  <>
                    <td style={{ padding:"12px 14px" }}><Inp value={editForm.code} onChange={v => setEditForm({...editForm, code: v})} /></td>
                    <td style={{ padding:"12px 14px" }}><Inp value={editForm.name} onChange={v => setEditForm({...editForm, name: v})} /></td>
                    <td style={{ padding:"12px 14px" }}><Inp type="number" value={editForm.credits} onChange={v => setEditForm({...editForm, credits: Number(v)})} /></td>
                    <td style={{ padding:"12px 14px" }}><Inp value={editForm.sem} onChange={v => setEditForm({...editForm, sem: v})} /></td>
                    <td style={{ padding:"12px 14px" }}><Inp value={editForm.dept} onChange={v => setEditForm({...editForm, dept: v})} /></td>
                    <td style={{ padding:"12px 14px" }}>
                      <select value={editForm.teacher} onChange={e => setEditForm({...editForm, teacher: e.target.value})} style={{ padding:"8px", border:`1.5px solid ${T.border}`, borderRadius:8 }}>
                        <option value="">Select Teacher</option>
                        {teachers.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:"12px 14px" }}><Inp type="number" value={editForm.classes} onChange={v => setEditForm({...editForm, classes: Number(v)})} /></td>
                    <td style={{ padding:"12px 14px" }}>
                      <Btn v="primary" sz="sm" onClick={handleSave}>Save</Btn>
                      <Btn v="ghost" sz="sm" onClick={() => setEditingId(null)} style={{ marginLeft: 8 }}>Cancel</Btn>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding:"12px 14px", fontWeight:800, fontSize:13, color:T.violetD }}>{s.code}</td>
                    <td style={{ padding:"12px 14px", fontSize:14, fontWeight:700, color:T.dark }}>{s.name}</td>
                    <td style={{ padding:"12px 14px" }}><Tag color="violet">{s.credits} Cr</Tag></td>
                    <td style={{ padding:"12px 14px", fontSize:13 }}>{s.sem}</td>
                    <td style={{ padding:"12px 14px", fontSize:13 }}>{s.dept}</td>
                    <td style={{ padding:"12px 14px", fontSize:13, color:T.muted }}>{s.teacher}</td>
                    <td style={{ padding:"12px 14px", fontSize:13 }}>{s.classes || 0}</td>
                    <td style={{ padding:"12px 14px" }}><Btn v="ghost" sz="sm" onClick={() => handleEdit(s)}>Edit</Btn></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TIMETABLE
══════════════════════════════════════════════════════ */
function TimetableView() {
  const dayColors={Monday:T.violet,Tuesday:T.coral,Wednesday:T.mint,Thursday:T.amber,Friday:T.cyan,Saturday:T.violetL};
  
  const [department, setDepartment] = useState("CSE-AI");
  const [semester, setSemester] = useState("7th");
  const [isEditing, setIsEditing] = useState(false);
  
  const [timetables, setTimetables] = useState({
    "CSE-AI-7th": {
      Monday:    ["AI", "DSA", "Free", "ML", "OS", "DBMS"],
      Tuesday:   ["DBMS", "OS", "Free", "AI Lab", "AI Lab", "Free"],
      Wednesday: ["ML", "DS", "Free", "Seminar", "Seminar", "Free"],
      Thursday:  ["AI", "DBMS Lab", "DBMS Lab", "OS", "Free", "Free"],
      Friday:    ["ML", "DSA", "Free", "Project", "Project", "Free"],
      Saturday:  ["Free", "Free", "Free", "Free", "Free", "Free"]
    }
  });

  const times = [
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 1:00",
    "2:00 - 3:00",
    "3:00 - 4:00",
    "4:00 - 5:00"
  ];

  const currentKey = `${department}-${semester}`;
  const currentTimetable = timetables[currentKey] || {
    Monday: Array(6).fill(""), Tuesday: Array(6).fill(""), Wednesday: Array(6).fill(""), Thursday: Array(6).fill(""), Friday: Array(6).fill(""), Saturday: Array(6).fill("")
  };

  const handleSlotChange = (day, slotIndex, value) => {
    setTimetables(prev => {
      const updated = { ...prev };
      if (!updated[currentKey]) {
        updated[currentKey] = { Monday: Array(6).fill(""), Tuesday: Array(6).fill(""), Wednesday: Array(6).fill(""), Thursday: Array(6).fill(""), Friday: Array(6).fill(""), Saturday: Array(6).fill("") };
      }
      updated[currentKey] = { ...updated[currentKey] };
      updated[currentKey][day] = [...(updated[currentKey][day] || Array(6).fill(""))];
      updated[currentKey][day][slotIndex] = value;
      return updated;
    });
  };

  return (
    <div>
      <SecHead 
        title="Weekly Timetable" 
        sub="Manage schedules across departments and semesters" 
        action={
          <Btn v={isEditing ? "mint" : "primary"} sz="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "✓ Save Changes" : "✏️ Edit Schedule"}
          </Btn>
        }
      />

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Department</label>
            <select value={department} onChange={e=>setDepartment(e.target.value)} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}>
              <option value="CSE-AI">B.Tech CSE-AI</option>
              <option value="CSE">B.Tech CSE</option>
              <option value="IT">B.Tech IT</option>
              <option value="ECE">B.Tech ECE</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Semester</label>
            <select value={semester} onChange={e=>setSemester(e.target.value)} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
              <option value="3rd">3rd Semester</option>
              <option value="4th">4th Semester</option>
              <option value="5th">5th Semester</option>
              <option value="6th">6th Semester</option>
              <option value="7th">7th Semester</option>
              <option value="8th">8th Semester</option>
            </select>
          </div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
        {Object.keys(dayColors).map(day => (
          <Card key={day} style={{ padding:16, borderTop:`4px solid ${dayColors[day]||T.violet}` }}>
            <div style={{ fontSize:14, fontWeight:800, color:dayColors[day]||T.violet, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>{day}</div>
            {times.map((time, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 700 }}>Slot {i + 1} <br/> <span style={{fontWeight: 500}}>{time}</span></div>
                {isEditing ? (
                  <input
                    value={(currentTimetable[day] && currentTimetable[day][i]) || ""}
                    onChange={e => handleSlotChange(day, i, e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "6px 8px", border: `1.5px solid ${dayColors[day]||T.violet}`, borderRadius: 6, fontSize: 12, fontFamily: "inherit", outline: "none", background: T.bgCard }}
                    placeholder="Subject/Practical"
                  />
                ) : (
                  <div style={{ background:T.bg, borderRadius:6, padding:"8px 10px", fontSize:12.5, color:T.dark, fontWeight:600, borderLeft:`3px solid ${dayColors[day]||T.violet}`, minHeight: 18 }}>
                    {(currentTimetable[day] && currentTimetable[day][i]) || <span style={{ color: T.light }}>Free</span>}
                  </div>
                )}
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEACHER OVERVIEW
══════════════════════════════════════════════════════ */
function TeacherOverview({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [adminName, setAdminName] = useState("Pending Admin Approval");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const h = { "Authorization": `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:5001/classes",     { headers: h }).then(r => r.json()),
      fetch("http://localhost:5001/students",    { headers: h }).then(r => r.json()),
      fetch("http://localhost:5001/teachers",    { headers: h }).then(r => r.json()),
      fetch("http://localhost:5001/assignments", { headers: h }).then(r => r.json()),
      fetch("http://localhost:5001/subjects",    { headers: h }).then(r => r.json()),
    ])
      .then(([clsData, stuData, teacherData, asgData, subjData]) => {
        const myClasses     = Array.isArray(clsData)    ? clsData    : [];
        const myStudents    = Array.isArray(stuData)    ? stuData    : [];
        const myAssignments = Array.isArray(asgData)    ? asgData    : [];
        const mySubjects    = Array.isArray(subjData)   ? subjData   : [];

        // Resolve admin name from teacher profile
        if (Array.isArray(teacherData) && teacherData.length > 0) {
          const myProfile = teacherData.find(t => t.name === user.username) || teacherData[0];
          if (myProfile?.adminId) {
            setAdminName(myProfile.adminId.name || myProfile.adminId.username || "Admin");
          }
        }

        setClasses(myClasses);
        setStudents(myStudents);
        setAssignments(myAssignments);
        setSubjects(mySubjects);
      })
      .catch(err => console.error("Teacher dashboard error:", err))
      .finally(() => setLoading(false));
  }, [user]);

  // Calculate real avg attendance across my students
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (Number(s.attendance) || 0), 0) / students.length)
    : 0;

  // Pending assignments (no submissions yet or fewer than student count)
  const pendingReview = assignments.filter(a => (a.submissions || []).length < students.length).length;

  return (
    <div>
      <SecHead
        title={`Welcome, ${user.name.split(" ")[0]} 👋`}
        sub={`Your teaching summary · Managed by Admin: ${adminName}`}
      />

      {/* STAT CARDS — all real */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <Stat icon="👨‍🎓" label="My Students"   value={loading ? "…" : students.length}    sub={`${classes.length} class${classes.length !== 1 ? "es" : ""} assigned`} gradient={GR.violet} />
        <Stat icon="📝"  label="Assignments"   value={loading ? "…" : assignments.length}  sub={`${pendingReview} pending review`}                                      gradient={GR.amber}  />
        <Stat icon="🏫"  label="My Classes"    value={loading ? "…" : classes.length}      sub="Active this semester"                                                    gradient={GR.coral}  />
        <Stat icon="✅"  label="Avg Attendance" value={loading ? "…" : `${avgAttendance}%`} sub="Across all students"                                                    gradient={GR.mint}   />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:14 }}>
        {/* My Students list — real */}
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>My Students</div>
          {students.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px", color:T.muted, fontSize:13 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>👨‍🎓</div>
              No students assigned yet.
            </div>
          ) : (
            students.slice(0, 5).map((s, i) => {
              const att = Number(s.attendance) || 0;
              return (
                <div key={s._id || i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {avi(s.name, 32)}
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:700, color:T.dark }}>{s.name}</div>
                      <div style={{ fontSize:11.5, color:T.muted }}>{s.branch || s.class || "—"} · Sem {s.semester || "—"}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <Tag color={att >= 75 ? "mint" : "coral"}>{att}% att.</Tag>
                    {s.gpa ? <Tag color="violet">GPA {s.gpa}</Tag> : null}
                  </div>
                </div>
              );
            })
          )}
          {students.length > 5 && (
            <div style={{ textAlign:"center", marginTop:10, fontSize:12.5, color:T.muted }}>
              +{students.length - 5} more students — go to Students tab to view all.
            </div>
          )}
        </Card>

        {/* My Classes — real */}
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>My Classes</div>
          {classes.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px", color:T.muted, fontSize:13 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>🏫</div>
              No classes assigned yet.
            </div>
          ) : (
            classes.slice(0, 4).map((c, i) => (
              <div key={c._id || i} style={{ display:"flex", gap:12, padding:"10px 12px", background:T.bg, borderRadius:10, marginBottom:8, alignItems:"center", borderLeft:`3px solid ${[T.violet,T.coral,T.mint,T.amber][i%4]}` }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:T.dark }}>{c.name}</div>
                  <div style={{ fontSize:11.5, color:T.muted, marginTop:2 }}>
                    📚 {c.subject || "—"} · 🌿 {c.branch || "—"} · Room {c.room || "TBA"}
                  </div>
                </div>
                <Tag color={["violet","coral","mint","amber"][i%4]}>Sem {c.semester || "—"}</Tag>
              </div>
            ))
          )}
          {classes.length > 4 && (
            <div style={{ textAlign:"center", marginTop:6, fontSize:12.5, color:T.muted }}>
              +{classes.length - 4} more classes
            </div>
          )}
        </Card>
      </div>

      {/* MY SUBJECTS — real, assigned by admin */}
      <div style={{ marginTop:14 }}>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>
            My Subjects
            <span style={{ fontSize:12, fontWeight:500, color:T.muted, marginLeft:8 }}>Assigned by admin</span>
          </div>
          {subjects.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px", color:T.muted, fontSize:13 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📚</div>
              No subjects assigned to you yet. Ask your admin to assign subjects.
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {subjects.map((s, i) => (
                <div key={s._id || i} style={{ background:T.bg, borderRadius:12, padding:"14px 16px", borderLeft:`4px solid ${[T.violet,T.coral,T.mint,T.amber,T.cyan,T.violetL][i%6]}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <div style={{ fontSize:13.5, fontWeight:800, color:T.dark }}>{s.name}</div>
                    <Tag color="violet">{s.credits} Cr</Tag>
                  </div>
                  <div style={{ fontSize:11.5, color:T.muted }}>
                    📋 {s.code} · 🌿 {s.dept || "—"} · Sem {s.sem || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════
   ATTENDANCE
══════════════════════════════════════════════════════ */
function AttendanceMark() {
  const [students, setStudents] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [semFilter, setSemFilter] = useState("");
  const [marked, setMarked] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchStudents = () => {
    fetch("http://localhost:5001/students", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data);
          if (data.length > 0 && !deptFilter) {
            const defaultDept = [...new Set(data.map(s => s.class).filter(Boolean))][0] || "";
            const defaultSem = [...new Set(data.filter(s => s.class === defaultDept).map(s => s.semester).filter(Boolean))][0] || "";
            setDeptFilter(defaultDept);
            setSemFilter(defaultSem);
          }
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const uniqueDepts = [...new Set(students.map(s => s.class).filter(Boolean))];
  const uniqueSems = [...new Set(students.filter(s => s.class === deptFilter).map(s => s.semester).filter(Boolean))];

  const filteredStudents = students.filter(s => s.class === deptFilter && s.semester === semFilter);

  // Load existing attendance when filters or date change
  useEffect(() => {
    const initialMarked = {};
    filteredStudents.forEach(s => {
      const record = s.attendanceRecords?.find(r => r.date === date);
      if (record) {
        initialMarked[s._id] = record.status === 'Present';
      }
    });
    setMarked(initialMarked);
    setSuccessMsg("");
  }, [deptFilter, semFilter, date, students]);

  const toggle = id => {
    setMarked(p => ({ ...p, [id]: !p[id] }));
    setSuccessMsg("");
  };

  const pres = Object.values(marked).filter(Boolean).length;
  const total = filteredStudents.length;

  const handleSubmit = async () => {
    setIsSaving(true);
    const records = {};
    filteredStudents.forEach(s => {
      records[s._id] = !!marked[s._id]; // true if marked present, else false
    });

    try {
      const res = await fetch("http://localhost:5001/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ date, records })
      });
      if (res.ok) {
        setSuccessMsg(`✓ Attendance saved for ${date} — ${pres} present, ${total - pres} absent`);
        fetchStudents(); // Refresh data to get updated percentages
      }
    } catch (error) {
      console.error(error);
    }
    setIsSaving(false);
  };

  return (
    <div>
      <SecHead title="Mark Attendance" sub="Keep record of the attendance of students each day" action={
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          style={{ padding:"8px 12px", border:`1.5px solid ${T.violet}`, borderRadius:8, fontSize:13.5, color:T.violetD, fontWeight:700, outline:"none", fontFamily:"inherit" }} 
        />
      }/>
      
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Department / Class</label>
            <select value={deptFilter} onChange={e=>{setDeptFilter(e.target.value); setSemFilter([...new Set(students.filter(s => s.class === e.target.value).map(s => s.semester).filter(Boolean))][0] || "");}} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}>
              {uniqueDepts.length > 0 ? uniqueDepts.map(d => <option key={d} value={d}>{d}</option>) : <option value="">No Classes Found</option>}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Semester</label>
            <select value={semFilter} onChange={e=>setSemFilter(e.target.value)} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}>
              {uniqueSems.length > 0 ? uniqueSems.map(s => <option key={s} value={s}>{s}</option>) : <option value="">No Semesters Found</option>}
            </select>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", gap:14, fontSize:13.5 }}>
            <span style={{ color:T.success, fontWeight:700 }}>✅ Present: {pres}</span>
            <span style={{ color:T.danger, fontWeight:700 }}>❌ Absent: {total - pres}</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn v="ghost" sz="sm" onClick={()=>setMarked(Object.fromEntries(filteredStudents.map(s=>[s._id,true])))}>Mark All Present</Btn>
            <Btn v="mint" sz="sm" onClick={handleSubmit} disabled={isSaving || total === 0}>{isSaving ? "Saving..." : "Submit Attendance"}</Btn>
          </div>
        </div>
        {successMsg && <div style={{ background:"#D1FAF0", color:"#064E3B", padding:"11px 14px", borderRadius:10, marginTop:14, fontWeight:700, fontSize:13.5 }}>{successMsg}</div>}
      </Card>

      {filteredStudents.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px", color:T.muted, fontSize:14 }}>No students found for {deptFilter} ({semFilter}).</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {filteredStudents.map(s=>(
            <div key={s._id} onClick={()=>toggle(s._id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", border:`2px solid ${marked[s._id]?T.success:T.border}`, borderRadius:12, cursor:"pointer", background:marked[s._id]?"#D1FAF0":T.bgCard, transition:"all 0.15s" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", border:`2px solid ${marked[s._id]?T.success:T.border}`, background:marked[s._id]?T.success:"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, flexShrink:0 }}>{marked[s._id]?"✓":""}</div>
              {avi(s.name,32,GR.violet)}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.dark }}>{s.name}</div>
                <div style={{ fontSize:11, color:T.muted }}>{s._id.slice(-5)}</div>
              </div>
              <div style={{ fontSize:12, fontWeight:800, color:Number(s.attendance)>=75?T.success:T.danger }}>{s.attendance||0}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   GRADEBOOK
══════════════════════════════════════════════════════ */
function Gradebook() {
  const gradeColor={A:"mint","A+":"mint","A-":"cyan","B+":"violet","B":"amber","B-":"warning"};
  return (
    <div>
      <SecHead title="📒 Gradebook" sub="Subject-wise marks & grades for all students" action={<Btn v="ghost" sz="sm">Export Excel</Btn>}/>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <THead cols={["Student","AI /100","ML /100","DSA /100","DBMS /100","OS /100","Total /500","Grade"]}/>
          <tbody>
            {GRADEBOOK.map((g,i)=>(
              <tr key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
                <td style={{ padding:"12px 14px" }}><div style={{ display:"flex", alignItems:"center", gap:9 }}>{avi(g.student,32)}<span style={{ fontSize:13.5, fontWeight:700, color:T.dark }}>{g.student}</span></div></td>
                {[g.AI,g.ML,g.DSA,g.DBMS,g.OS].map((v,j)=>(
                  <td key={j} style={{ padding:"12px 14px", textAlign:"center", fontWeight:700, fontSize:14, color:v>=85?T.success:v>=75?T.violetD:T.warning }}>{v}</td>
                ))}
                <td style={{ padding:"12px 14px", fontWeight:800, fontSize:15, color:T.dark }}>{g.total}</td>
                <td style={{ padding:"12px 14px" }}><Tag color={gradeColor[g.grade]||"violet"}>{g.grade}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEACHER ASSIGNMENTS
══════════════════════════════════════════════════════ */
function TeacherAssignments({ user }) {
  const [show, setShow] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: "", subject: "", deadline: "", description: "", branch: "", semester: "" });
  const [submission, setSubmission] = useState({});

  const fetchAssignments = async () => {
    try {
      const res = await fetch("http://localhost:5001/assignments", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setAssignments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = async () => {
    if (!newAssignment.title || !newAssignment.deadline || !newAssignment.description || !newAssignment.branch || !newAssignment.semester) return alert("Please fill all required fields including Branch and Semester");
    try {
      await fetch("http://localhost:5001/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(newAssignment)
      });
      setShow(false);
      setNewAssignment({ title: "", subject: "", deadline: "", description: "", branch: "", semester: "" });
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (id) => {
    if (!submission[id]) return alert("Please write your submission first");
    try {
      await fetch(`http://localhost:5001/assignments/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ content: submission[id] })
      });
      alert("Assignment submitted successfully!");
      setSubmission({ ...submission, [id]: "" });
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const isTeacher = user?.role === "teacher";

  return (
    <div>
      <SecHead 
        title="Assignments" 
        sub={isTeacher ? "Manage and grade student assignments" : "View and submit your assignments"} 
        action={isTeacher && <Btn v="primary" sz="sm" onClick={() => setShow(!show)}>{show ? "Cancel" : "+ New Assignment"}</Btn>}
      />
      
      {show && isTeacher && (
        <Card style={{ marginBottom: 14, borderLeft: `4px solid ${T.violet}` }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.dark, marginBottom: 14 }}>Create New Assignment</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Inp label="Title *" value={newAssignment.title} onChange={(v) => setNewAssignment({ ...newAssignment, title: v })} placeholder="Assignment title" />
            <Inp label="Subject *" value={newAssignment.subject} onChange={(v) => setNewAssignment({ ...newAssignment, subject: v })} placeholder="e.g. Deep Learning" />
            <Inp label="Due Date *" type="date" value={newAssignment.deadline} onChange={(v) => setNewAssignment({ ...newAssignment, deadline: v })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.dark }}>Assign to Branch *</label>
              <select value={newAssignment.branch} onChange={e => setNewAssignment({ ...newAssignment, branch: e.target.value })}
                style={{ padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13.5, fontFamily: "inherit", outline: "none" }}>
                <option value="">-- Select Branch --</option>
                <option value="CSE-AI">B.Tech CSE-AI</option>
                <option value="CSE">B.Tech CSE</option>
                <option value="IT">B.Tech IT</option>
                <option value="ECE">B.Tech ECE</option>
                <option value="All">All Branches</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.dark }}>Assign to Semester *</label>
              <select value={newAssignment.semester} onChange={e => setNewAssignment({ ...newAssignment, semester: e.target.value })}
                style={{ padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13.5, fontFamily: "inherit", outline: "none" }}>
                <option value="">-- Select Semester --</option>
                {["1st","2nd","3rd","4th","5th","6th","7th","8th"].map(s => <option key={s} value={s}>{s} Semester</option>)}
                <option value="All">All Semesters</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14, marginTop: 10 }}>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: T.dark, marginBottom: 5 }}>Description *</label>
            <textarea value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} rows={3} style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" }} placeholder="Assignment instructions..." />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn v="primary" sz="sm" onClick={handleCreate}>Publish Assignment</Btn>
            <Btn v="ghost" sz="sm" onClick={() => setShow(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {assignments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: T.muted }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
          <div style={{ fontWeight: 600 }}>No assignments found.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {assignments.map(a => {
            const hasSubmitted = !isTeacher && a.submissions?.some(s => s.studentId === user.id);
            const status = isTeacher ? "active" : (hasSubmitted ? "submitted" : "pending");
            
            return (
              <Card key={a._id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 15.5, fontWeight: 800, color: T.dark, marginBottom: 5 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: T.muted }}>📚 {a.subject} · 📅 Due: {a.deadline}</div>
                    {(a.branch || a.semester) && (
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                        🎯 For: {a.branch || "All Branches"} · {a.semester || "All Semesters"} Sem
                      </div>
                    )}
                    <div style={{ fontSize: 13, marginTop: 8, color: T.dark }}>{a.description}</div>
                  </div>
                  <Tag color={status === "submitted" ? "mint" : status === "pending" ? "amber" : "violet"}>
                    {status.toUpperCase()}
                  </Tag>
                </div>
                
                {isTeacher ? (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: T.muted, marginBottom: 4 }}>
                      <span>Submissions received</span><span style={{ fontWeight: 700, color: T.dark }}>{a.submissions?.length || 0}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 14 }}>
                    {!hasSubmitted ? (
                      <div>
                        <textarea 
                          placeholder="Type your submission content or link here..."
                          value={submission[a._id] || ""}
                          onChange={(e) => setSubmission({ ...submission, [a._id]: e.target.value })}
                          rows={2}
                          style={{ width: "100%", padding: "10px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 8 }}
                        />
                        <Btn v="primary" sz="sm" onClick={() => handleSubmit(a._id)}>Submit Assignment</Btn>
                      </div>
                    ) : (
                      <div style={{ padding: "10px", background: T.bg, borderRadius: 8, fontSize: 13, color: T.mint }}>
                        ✓ You have successfully submitted this assignment.
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MATERIALS
══════════════════════════════════════════════════════ */
function MaterialsView({ role }) {
  const [materials, setMaterials] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  
  const [newMaterial, setNewMaterial] = useState({ title: '', subject: '', description: '', fileUrl: '' });

  const typeColors = { PDF:"coral", PPT:"cyan", DOC:"mint", URL:"violet" };
  const typeBg     = { PDF:"#FFE4E4", PPT:"#E0F2FE", DOC:"#D1FAF0", URL:"#F4F3FF" };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/materials", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!newMaterial.title || !newMaterial.subject || !newMaterial.description) return alert("Please fill all required fields");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newMaterial)
      });
      if (res.ok) {
        setShow(false);
        setNewMaterial({ title: '', subject: '', description: '', fileUrl: '' });
        fetchMaterials();
      } else {
        const err = await res.json();
        alert("Upload failed: " + err.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/materials/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchMaterials();
      }
    } catch (error) {
      alert("Delete failed");
    }
  };

  const list = materials.filter(m => (m.title||"").toLowerCase().includes(q.toLowerCase()) || (m.subject||"").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <SecHead title="Study Materials" sub="Lecture notes, slides, and reference materials" action={
        <div style={{ display:"flex", gap:8 }}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Search..." style={{ padding:"8px 12px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13, fontFamily:"inherit", outline:"none", width:200 }}/>
          {role==="teacher"&&<Btn v="primary" sz="sm" onClick={() => setShow(!show)}>+ Upload</Btn>}
        </div>
      }/>

      {show && role === "teacher" && (
        <Card style={{ marginBottom: 14, borderLeft: `4px solid ${T.violet}` }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:14 }}>Upload New Material</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom: 10 }}>
            <Inp label="Title" value={newMaterial.title} onChange={(val) => setNewMaterial({...newMaterial, title: val})} placeholder="Material title" />
            <Inp label="Subject" value={newMaterial.subject} onChange={(val) => setNewMaterial({...newMaterial, subject: val})} placeholder="e.g. Mathematics" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <Inp label="File URL / Link" value={newMaterial.fileUrl} onChange={(val) => setNewMaterial({...newMaterial, fileUrl: val})} placeholder="https://..." />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Description</label>
            <textarea value={newMaterial.description} onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})} rows={3} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }} placeholder="Material description..." />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn v="primary" sz="sm" onClick={handleUpload}>Upload</Btn>
            <Btn v="ghost" sz="sm" onClick={() => setShow(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: T.muted }}>Loading materials...</div>
      ) : list.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px", color: T.muted }}>No materials found.</Card>
      ) : (
        <div style={{ display:"grid", gap:10 }}>
          {list.map(m => {
            const mType = m.fileUrl?.endsWith(".pdf") ? "PDF" : m.fileUrl?.endsWith(".ppt") ? "PPT" : "URL";
            return (
              <Card key={m._id} style={{ padding:"15px 20px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:50, height:56, borderRadius:10, background:typeBg[mType]||T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14.5, fontWeight:700, color:T.dark }}>{m.title}</div>
                    <div style={{ fontSize:12.5, color:T.muted, marginTop:3 }}>{m.subject} · Uploaded on {new Date(m.createdAt).toLocaleDateString()}</div>
                    <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>{m.description}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexDirection: "column" }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <Tag color={typeColors[mType]||"gray"}>{mType}</Tag>
                      {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize:12.5, fontWeight:700, color:T.violet, textDecoration:"none", padding:"6px 12px", border:`1px solid ${T.violet}`, borderRadius:8 }}>View/Download</a>}
                    </div>
                    {role === "teacher" && (
                      <Btn v="ghost" sz="sm" onClick={() => handleDelete(m._id)} style={{ color: T.danger, borderColor: T.danger, width: "100%" }}>Delete</Btn>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PERFORMANCE
══════════════════════════════════════════════════════ */
function PerformanceView() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/students", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
      })
      .catch(console.error);
  }, []);

  const classGroups = students.reduce((acc, s) => {
    const cls = s.class || "Unknown";
    if (!acc[cls]) acc[cls] = { gpaSum: 0, attSum: 0, count: 0 };
    acc[cls].gpaSum += Number(s.gpa) || 0;
    acc[cls].attSum += Number(s.attendance) || 0;
    acc[cls].count += 1;
    return acc;
  }, {});

  const dynamicPerfChart = Object.keys(classGroups).map(c => ({
    sub: c.length > 8 ? c.substring(0, 8) + '...' : c,
    score: Math.round((classGroups[c].gpaSum / classGroups[c].count) * 10)
  }));

  const dynamicAttChart = Object.keys(classGroups).map((c) => ({
    month: c.length > 8 ? c.substring(0, 8) + '...' : c,
    present: Math.round(classGroups[c].attSum / classGroups[c].count),
    absent: 100 - Math.round(classGroups[c].attSum / classGroups[c].count)
  }));

  return (
    <div>
      <SecHead title="Student Performance Analytics" sub="Data-driven insights for your classes"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Class Average Performance (%)</div>
          {dynamicPerfChart.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px", color:T.muted, fontSize:13 }}>No student data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dynamicPerfChart} layout="vertical" barSize={18}>
                <XAxis type="number" domain={[0,100]} tick={{ fontSize:11, fill:T.muted }}/><YAxis type="category" dataKey="sub" tick={{ fontSize:11, fill:T.muted }} width={60}/><Tooltip/>
                <Bar dataKey="score" radius={[0,6,6,0]}>{dynamicPerfChart.map((_,i)=><Cell key={i} fill={[T.violet,T.coral,T.mint,T.amber,T.cyan,T.violetL][i%6]}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Class Attendance Overview</div>
          {dynamicAttChart.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px", color:T.muted, fontSize:13 }}>No attendance data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dynamicAttChart}>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:T.muted }}/><YAxis domain={[0,100]} tick={{ fontSize:11, fill:T.muted }}/><Tooltip/>
                <Area type="monotone" dataKey="present" stroke={T.mint}  fill={T.mint+"22"}  strokeWidth={2.5}/>
                <Area type="monotone" dataKey="absent"  stroke={T.coral} fill={T.coral+"22"} strokeWidth={2.5}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
      <Card>
        <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Student Rankings</div>
        {students.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px", color:T.muted, fontSize:13 }}>No students enrolled to display rankings.</div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <THead cols={["Rank","Student","Class","GPA","Attendance","Performance","Status"]}/>
            <tbody>
              {[...students].sort((a,b)=>(Number(b.gpa)||0)-(Number(a.gpa)||0)).map((s,i)=>{
                const gpa = Number(s.gpa) || 0;
                const att = Number(s.attendance) || 0;
                return (
                  <tr key={s._id} style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:"12px 14px", fontWeight:800, fontSize:18, color:i===0?T.amberD:i===1?T.violetD:i===2?T.coral:T.muted }}>{["🥇","🥈","🥉"][i]||`#${i+1}`}</td>
                    <td style={{ padding:"12px 14px" }}><div style={{ display:"flex", alignItems:"center", gap:9 }}>{avi(s.name,32)}<span style={{ fontSize:13.5, fontWeight:700, color:T.dark }}>{s.name}</span></div></td>
                    <td style={{ padding:"12px 14px", fontSize:13, color:T.muted }}>{s.class}</td>
                    <td style={{ padding:"12px 14px", fontWeight:800, fontSize:16, color:T.violetD }}>{gpa}</td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:70 }}><ProgressBar value={att} color={att>=75?T.success:T.danger}/></div>
                        <span style={{ fontSize:12.5, fontWeight:700, color:att>=75?T.success:T.danger }}>{att}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px", width:120 }}>
                      <ProgressBar value={gpa*10} max={100} color={T.violet} height={8}/>
                    </td>
                    <td style={{ padding:"12px 14px" }}><Tag color={att>=75&&gpa>=8?"mint":gpa>=7?"violet":"coral"}>{att>=75&&gpa>=8?"Excellent":gpa>=7?"Good":"At Risk"}</Tag></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ONLINE TESTS (Teacher)
══════════════════════════════════════════════════════ */
function OnlineTests() {
  const [show,setShow]=useState(false);
  const tests=[
    {title:"Mid-Term: Artificial Intelligence",class:"7th Sem CSE-AI",date:"Apr 12, 2025",dur:90,qs:30,status:"upcoming"},
    {title:"Unit Test: Data Structures",       class:"5th Sem CSE",   date:"Apr 05, 2025",dur:45,qs:15,status:"completed"},
    {title:"Quiz: Machine Learning",           class:"7th Sem CSE-AI",date:"Apr 18, 2025",dur:30,qs:10,status:"upcoming"},
  ];
  return (
    <div>
      <SecHead title="Online Tests" sub="Create, schedule, and review exams" action={<Btn v="primary" sz="sm" onClick={()=>setShow(!show)}>+ Create Test</Btn>}/>
      {show&&<Card style={{ marginBottom:14, borderLeft:`4px solid ${T.violet}` }}>
        <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:14 }}>Configure New Test</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          <Inp label="Test Title" value="" onChange={()=>{}} placeholder="Test name"/>
          <Inp label="Date & Time" type="datetime-local" value="" onChange={()=>{}}/>
          <Inp label="Duration (mins)" type="number" value="" onChange={()=>{}} placeholder="60"/>
        </div>
        <div style={{ display:"flex", gap:8 }}><Btn v="primary" sz="sm" onClick={()=>setShow(false)}>Create Test</Btn><Btn v="ghost" sz="sm" onClick={()=>setShow(false)}>Cancel</Btn></div>
      </Card>}
      <div style={{ display:"grid", gap:10 }}>
        {tests.map((t,i)=>(
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:15.5, fontWeight:800, color:T.dark, marginBottom:5 }}>{t.title}</div>
                <div style={{ fontSize:13, color:T.muted }}>👥 {t.class} · 📅 {t.date} · ⏱ {t.dur} mins · ❓ {t.qs} questions</div>
              </div>
              <Tag color={t.status==="completed"?"mint":"violet"}>{t.status}</Tag>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              {t.status==="completed"&&<Btn v="ghost" sz="sm">View Results</Btn>}
              <Btn v="ghost" sz="sm">Preview</Btn><Btn v="primary" sz="sm">Manage</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   AI LESSON PLANNER
══════════════════════════════════════════════════════ */
function LessonPlanner() {
  const [topic,setTopic]=useState(""); const [subject,setSubject]=useState(""); const [duration,setDuration]=useState("60"); const [level,setLevel]=useState("undergraduate");
  const [plan,setPlan]=useState(""); const [loading,setLoading]=useState(false);

  const generate=async()=>{
    if(!topic.trim())return;
    setLoading(true);setPlan("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Create a detailed ${duration}-minute lesson plan for:\nTopic: ${topic}\nSubject: ${subject||"Computer Science"}\nLevel: ${level} B.Tech engineering students\n\nInclude:\n🎯 Learning Objectives (3-4 points)\n📋 Prerequisites\n🗒️ Lesson Outline with time allocations\n💡 Teaching Methods & Activities\n📊 Assessment Strategy\n📚 Resources Needed\n🏠 Homework Assignment\n\nMake it practical, engaging, and well-structured.`}]})});
      const d=await res.json();
      setPlan(d.content?.map(c=>c.text||"").join("")||"Could not generate plan.");
    }catch{setPlan("⚠️ Connection error. Please try again.");}
    setLoading(false);
  };

  const quickTopics=["Neural Networks","Binary Search Trees","SQL Joins","Operating Systems","Machine Learning","Computer Networks"];
  return (
    <div>
      <SecHead title="🤖 AI Lesson Planner" sub="Generate detailed, structured lesson plans instantly" action={<Tag color="violet">Powered by Claude AI</Tag>}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:14 }}>
        <div>
          <Card>
            <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:16 }}>Configure Lesson</div>
            <Inp label="Topic / Chapter" value={topic} onChange={setTopic} placeholder="e.g., Neural Networks, Binary Trees..."/>
            <Inp label="Subject" value={subject} onChange={setSubject} placeholder="e.g., Artificial Intelligence"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Inp label="Duration (mins)" value={duration} onChange={setDuration} type="number"/>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:5 }}>Level</label>
                <select value={level} onChange={e=>setLevel(e.target.value)} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }}>
                  <option value="undergraduate">Undergraduate</option><option value="postgraduate">Postgraduate</option><option value="diploma">Diploma</option>
                </select>
              </div>
            </div>
            <button onClick={generate} disabled={loading||!topic.trim()} style={{ width:"100%", padding:"13px", background:loading||!topic.trim()?T.border:GR.violet, color:loading||!topic.trim()?T.muted:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:800, cursor:loading||!topic.trim()?"not-allowed":"pointer", fontFamily:"inherit" }}>
              {loading?"⏳ Generating...":"🤖 Generate Lesson Plan"}
            </button>
          </Card>
          <Card style={{ marginTop:14 }}>
            <div style={{ fontSize:13, fontWeight:800, color:T.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.07em" }}>Quick Topics</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {quickTopics.map(t=><button key={t} onClick={()=>setTopic(t)} style={{ padding:"5px 12px", border:`1.5px solid ${T.border}`, borderRadius:20, background:T.bg, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", color:T.dark, fontWeight:500 }}>{t}</button>)}
            </div>
          </Card>
        </div>
        <Card style={{ display:"flex", flexDirection:"column", minHeight:460 }}>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Generated Plan</div>
          {loading?(
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
              <div style={{ width:70, height:70, background:GR.violet, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>🤖</div>
              <div style={{ fontSize:15, color:T.muted, fontWeight:600 }}>Crafting your lesson plan...</div>
              <div style={{ width:200, height:5, background:T.border, borderRadius:3 }}><div style={{ width:"65%", height:"100%", background:GR.violet, borderRadius:3 }}/></div>
            </div>
          ):plan?(
            <>
              <div style={{ flex:1, whiteSpace:"pre-wrap", fontSize:13.5, lineHeight:1.85, color:T.dark, overflowY:"auto", maxHeight:390 }}>{plan}</div>
              <div style={{ display:"flex", gap:7, marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
                <Btn v="ghost" sz="sm">📋 Copy</Btn><Btn v="ghost" sz="sm">📥 Save as PDF</Btn><Btn v="ghost" sz="sm" onClick={()=>setPlan("")}>🔄 Clear</Btn>
              </div>
            </>
          ):(
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:T.light }}>
              <div style={{ fontSize:56 }}>📋</div>
              <div style={{ fontSize:15, fontWeight:600 }}>Enter a topic and click Generate</div>
              <div style={{ fontSize:12.5 }}>AI will create a complete structured lesson plan</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   QUESTION GENERATOR
══════════════════════════════════════════════════════ */
function QuestionGen() {
  const [topic,setTopic]=useState(""); const [type,setType]=useState("mcq"); const [count,setCount]=useState("5");
  const [qs,setQs]=useState(""); const [loading,setLoading]=useState(false);

  const generate=async()=>{
    if(!topic.trim())return;
    setLoading(true);setQs("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Generate ${count} ${type==="mcq"?"Multiple Choice Questions (4 options each, mark correct with ✓)":type==="short"?"Short Answer Questions":"True/False Questions"} on the topic: "${topic}" for B.Tech CSE undergraduate students. Number them clearly and format nicely.`}]})});
      const d=await res.json();
      setQs(d.content?.map(c=>c.text||"").join("")||"Could not generate questions.");
    }catch{setQs("⚠️ Error. Please try again.");}
    setLoading(false);
  };

  return (
    <div>
      <SecHead title="❓ Auto Question Generator" sub="AI-powered question bank creation" action={<Tag color="amber">AI Powered</Tag>}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:14 }}>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:16 }}>Configure</div>
          <Inp label="Topic" value={topic} onChange={setTopic} placeholder="e.g., Backpropagation, Sorting..."/>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:T.dark, marginBottom:6 }}>Question Type</label>
            <div style={{ display:"flex", gap:7 }}>
              {[["mcq","MCQ"],["short","Short Answer"],["tf","True/False"]].map(([v,l])=>(
                <button key={v} onClick={()=>setType(v)} style={{ flex:1, padding:"9px 0", borderRadius:10, border:`2px solid ${type===v?T.amber:T.border}`, background:type===v?T.amber+"18":"transparent", fontWeight:type===v?800:500, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", color:type===v?T.amberD:T.dark }}>{l}</button>
              ))}
            </div>
          </div>
          <Inp label="Number of Questions" value={count} onChange={setCount} type="number"/>
          <button onClick={generate} disabled={loading||!topic.trim()} style={{ width:"100%", padding:"13px", background:loading||!topic.trim()?T.border:GR.amber, color:loading||!topic.trim()?T.muted:T.ink, border:"none", borderRadius:12, fontSize:14, fontWeight:800, cursor:loading||!topic.trim()?"not-allowed":"pointer", fontFamily:"inherit" }}>
            {loading?"⏳ Generating...":"❓ Generate Questions"}
          </button>
        </Card>
        <Card style={{ minHeight:320, display:"flex", flexDirection:"column" }}>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Generated Questions</div>
          {loading?(<div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}><div style={{ fontSize:50 }}>🧪</div><div style={{ fontSize:14, color:T.muted, fontWeight:600 }}>Generating questions...</div></div>)
          :qs?(<><div style={{ flex:1, whiteSpace:"pre-wrap", fontSize:13.5, lineHeight:1.85, color:T.dark, overflowY:"auto", maxHeight:360 }}>{qs}</div><div style={{ display:"flex", gap:7, marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}` }}><Btn v="ghost" sz="sm">📋 Copy</Btn><Btn v="amber" sz="sm">📤 Add to Test</Btn></div></>)
          :(<div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:T.light }}><div style={{ fontSize:52 }}>❓</div><div style={{ fontSize:14, fontWeight:600 }}>Enter a topic to generate questions</div></div>)}
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   AI CHAT
══════════════════════════════════════════════════════ */
function AIChat({ user }) {
  const isTeacher=user.role==="teacher";
  const [msgs,setMsgs]=useState([{role:"assistant",content:`Hi ${user.name.split(" ")[0]}! 👋 I'm your AI ${isTeacher?"teaching":"learning"} assistant. Ask me anything about your coursework, get code examples, solve problems, or explore any CS topic! 🎓`}]);
  const [inp,setInp]=useState(""); const [loading,setLoading]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs]);

  const send=async()=>{
    if(!inp.trim()||loading)return;
    const text=inp.trim();setInp("");
    setMsgs(p=>[...p,{role:"user",content:text}]);
    setLoading(true);
    try{
      const history=msgs.map(m=>({role:m.role,content:m.content}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`You are an expert AI academic assistant for ${user.name}, a ${user.role} at Motihari College of Engineering (B.Tech CSE-AI). Be helpful, concise, and educational. Focus on: AI, ML, Data Structures, DBMS, OS, Networks, Algorithms. Use examples and code snippets where helpful. Be encouraging and supportive.`,messages:[...history,{role:"user",content:text}]})});
      const d=await res.json();
      setMsgs(p=>[...p,{role:"assistant",content:d.content?.map(c=>c.text||"").join("")||"Sorry, try again."}]);
    }catch{setMsgs(p=>[...p,{role:"assistant",content:"⚠️ Connection issue. Please try again."}]);}
    setLoading(false);
  };

  const suggs=isTeacher
    ?["Generate quiz on backpropagation","Create rubric for AI assignment","Explain transformer architecture","Design a lesson on recursion"]
    :["Explain neural networks simply","What is recursion with example?","Help me with SQL queries","Explain Big O notation"];

  return (
    <div>
      <SecHead title={isTeacher?"🤖 AI Teaching Assistant":"🤖 AI Learning Assistant"} sub="Powered by Claude AI — Ask anything about your coursework" action={<Tag color="mint">● Online</Tag>}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:14 }}>
        <Card style={{ padding:0, overflow:"hidden", display:"flex", flexDirection:"column", height:580 }}>
          {/* Header */}
          <div style={{ padding:"14px 20px", background:GR.ink, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, background:GR.amber, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
            <div><div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>EduAI Assistant</div><div style={{ color:T.amberL, fontSize:11.5 }}>Always learning, always helping</div></div>
            <div style={{ marginLeft:"auto" }}><div style={{ width:8, height:8, background:T.mint, borderRadius:"50%", display:"inline-block", marginRight:5 }}/><span style={{ color:T.mintL, fontSize:12 }}>Online</span></div>
          </div>
          {/* Messages */}
          <div ref={ref} style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:12, background:T.bg }}>
            {msgs.map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:8 }}>
                {m.role==="assistant"&&<div style={{ width:28, height:28, background:GR.violet, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginTop:2 }}>🤖</div>}
                <div style={{ maxWidth:"76%", padding:"11px 15px", borderRadius:m.role==="user"?"16px 16px 3px 16px":"16px 16px 16px 3px", background:m.role==="user"?GR.violet:T.bgCard, color:m.role==="user"?"#fff":T.dark, fontSize:13.5, lineHeight:1.75, whiteSpace:"pre-wrap", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>{m.content}</div>
                {m.role==="user"&&avi(user.name,28,GR.amber,T.ink)}
              </div>
            ))}
            {loading&&<div style={{ display:"flex", gap:8 }}><div style={{ width:28, height:28, background:GR.violet, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div><div style={{ background:T.bgCard, padding:"11px 15px", borderRadius:"16px 16px 16px 3px", fontSize:13.5, color:T.muted, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>Thinking...</div></div>}
          </div>
          {/* Input */}
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:9, background:T.bgCard }}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Ask anything about your coursework..." style={{ flex:1, padding:"10px 15px", border:`1.5px solid ${T.border}`, borderRadius:24, fontSize:13.5, fontFamily:"inherit", outline:"none" }} onFocus={e=>e.target.style.borderColor=T.violet} onBlur={e=>e.target.style.borderColor=T.border}/>
            <button onClick={send} disabled={loading||!inp.trim()} style={{ width:44, height:44, background:loading||!inp.trim()?T.border:GR.violet, border:"none", borderRadius:"50%", cursor:"pointer", fontSize:18, opacity:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>➤</button>
          </div>
        </Card>
        <div>
          <Card style={{ marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:800, color:T.dark, marginBottom:10 }}>Quick Questions</div>
            {suggs.map((s,i)=><button key={i} onClick={()=>setInp(s)} style={{ width:"100%", textAlign:"left", padding:"8px 10px", marginBottom:5, border:`1.5px solid ${T.border}`, borderRadius:8, background:T.bg, fontSize:12.5, color:T.dark, cursor:"pointer", fontFamily:"inherit", lineHeight:1.45, fontWeight:500 }}>{s}</button>)}
          </Card>
          <Card>
            <div style={{ fontSize:13, fontWeight:800, color:T.dark, marginBottom:9 }}>Capabilities</div>
            {["📖 Explain any concept","💻 Write code examples","❓ Practice questions","📊 Study strategies","🔍 Topic summaries","🧮 Solve problems"].map((c,i)=>(
              <div key={i} style={{ fontSize:12.5, color:T.muted, marginBottom:6, display:"flex", gap:6 }}>{c}</div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STUDENT OVERVIEW
══════════════════════════════════════════════════════ */
function StudentOverview({ user }) {
  return (
    <div>
      <SecHead title={`Hello, ${user.name.split(" ")[0]} 👋`} sub="Here's your academic snapshot for today" action={<Tag color="violet">7th Semester · CSE-AI</Tag>}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <Stat icon="✅" label="Attendance"          value="92%"  sub="Above 75% req."   gradient={GR.mint}   />
        <Stat icon="📝" label="Pending Assignments"  value="3"    sub="Due this week"    gradient={GR.amber}  />
        <Stat icon="🧪" label="Upcoming Exams"       value="2"    sub="Next 7 days"      gradient={GR.coral}  />
        <Stat icon="⭐" label="Current GPA"          value="8.7"  sub="Rank #3 in class" gradient={GR.violet} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Upcoming Deadlines</div>
          {[{t:"Neural Network Implementation",sub:"AI",due:"Apr 15",c:T.coral},{t:"SQL Query Optimization",sub:"DBMS",due:"Apr 20",c:T.amber},{t:"CNN Architecture Report",sub:"ML",due:"Apr 25",c:T.violet}].map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ width:4, height:36, background:a.c, borderRadius:3, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.dark }}>{a.t}</div>
                <div style={{ fontSize:11.5, color:T.muted }}>{a.sub} · Due {a.due}</div>
              </div>
              <Btn v="primary" sz="sm">Submit</Btn>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Performance Chart</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={RADAR_DATA.slice(0,5)}>
              <PolarGrid stroke={T.border}/><PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fill:T.muted }}/>
              <Radar dataKey="A" stroke={T.violet} fill={T.violet} fillOpacity={0.2}/>
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Today's Classes</div>
          {[["9:00 AM","AI — Prof. Juhi","CS-201",T.violet],["11:00 AM","DSA Lab — Dr. Ramesh","Lab 3",T.coral],["2:00 PM","ML — Prof. Anita","CS-202",T.mint]].map(([t,sub,room,c],i)=>(
            <div key={i} style={{ display:"flex", gap:10, padding:"9px 11px", background:T.bg, borderRadius:10, marginBottom:8, borderLeft:`3px solid ${c}`, borderRadius:"0 10px 10px 0" }}>
              <div style={{ fontWeight:800, fontSize:12, color:c, minWidth:58 }}>{t}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.dark }}>{sub}</div>
                <div style={{ fontSize:11, color:T.muted }}>{room}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STUDENT ATTENDANCE
══════════════════════════════════════════════════════ */
function StudentAttendance() {
  const subjects=[{s:"Artificial Intelligence",total:30,att:28,pct:93},{s:"Machine Learning",total:28,att:26,pct:93},{s:"Data Structures",total:32,att:28,pct:88},{s:"Database Systems",total:26,att:22,pct:85},{s:"Operating Systems",total:28,att:20,pct:71}];
  return (
    <div>
      <SecHead title="My Attendance" sub="Track your presence across all subjects"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:18 }}>
        <Stat icon="✅" label="Overall Attendance" value="92%"  gradient={GR.mint}   />
        <Stat icon="📅" label="Classes Attended"   value="46/50" gradient={GR.violet} />
        <Stat icon="⚠️" label="Absences"           value="4"    sub="Max: 12 allowed" gradient={GR.amber}  />
      </div>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <THead cols={["Subject","Total Classes","Attended","Absent","Percentage","Status"]}/>
          <tbody>
            {subjects.map((s,i)=>(
              <tr key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
                <td style={{ padding:"12px 14px", fontSize:14, fontWeight:700, color:T.dark }}>{s.s}</td>
                <td style={{ padding:"12px 14px", fontSize:13, textAlign:"center" }}>{s.total}</td>
                <td style={{ padding:"12px 14px", fontSize:13, textAlign:"center", fontWeight:700, color:T.success }}>{s.att}</td>
                <td style={{ padding:"12px 14px", fontSize:13, textAlign:"center", fontWeight:700, color:T.danger }}>{s.total-s.att}</td>
                <td style={{ padding:"12px 14px", minWidth:160 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1 }}><ProgressBar value={s.pct} color={s.pct>=75?T.success:T.danger}/></div>
                    <span style={{ fontSize:12.5, fontWeight:800, color:s.pct>=75?T.success:T.danger }}>{s.pct}%</span>
                  </div>
                </td>
                <td style={{ padding:"12px 14px" }}><Tag color={s.pct>=75?"mint":"coral"}>{s.pct>=75?"Safe":"Low"}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STUDENT TESTS
══════════════════════════════════════════════════════ */
function StudentTests() {
  const [active,setActive]=useState(null); const [ans,setAns]=useState({}); const [done,setDone]=useState(false);
  const qs=[
    {id:1,q:"Which activation function is used in output layer for binary classification?",opts:["ReLU","Sigmoid","Tanh","Softmax"],correct:1},
    {id:2,q:"Which algorithm trains neural networks through gradient descent?",opts:["Backpropagation","Bubble Sort","Binary Search","DFS"],correct:0},
    {id:3,q:"What does CNN stand for in deep learning?",opts:["Computed Neural Net","Convolutional Neural Network","Connected Net","Circular NN"],correct:1},
    {id:4,q:"Which layer is always the last in a neural network?",opts:["Hidden Layer","Input Layer","Output Layer","Dropout Layer"],correct:2},
  ];

  if(active&&!done){
    return (
      <div>
        <SecHead title={`🧪 ${active.title}`} action={<Tag color="coral">⏱ 20:00 remaining</Tag>}/>
        <Card>
          <div style={{ marginBottom:18 }}>
            <ProgressBar value={Object.keys(ans).length} max={qs.length} color={T.violet} height={8}/>
            <div style={{ fontSize:12.5, color:T.muted, marginTop:6 }}>{Object.keys(ans).length} of {qs.length} answered</div>
          </div>
          {qs.map((q,i)=>(
            <div key={q.id} style={{ marginBottom:24, paddingBottom:24, borderBottom:i<qs.length-1?`1px solid ${T.border}`:"none" }}>
              <div style={{ fontSize:15, fontWeight:700, color:T.dark, marginBottom:13 }}>Q{i+1}. {q.q}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {q.opts.map((o,j)=>(
                  <button key={j} onClick={()=>setAns(p=>({...p,[q.id]:j}))} style={{ padding:"11px 14px", border:`2px solid ${ans[q.id]===j?T.violet:T.border}`, borderRadius:10, background:ans[q.id]===j?T.violet+"14":T.bgCard, color:ans[q.id]===j?T.violetD:T.dark, cursor:"pointer", textAlign:"left", fontSize:13.5, fontFamily:"inherit", fontWeight:ans[q.id]===j?700:400 }}>{String.fromCharCode(65+j)}. {o}</button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <Btn v="ghost" onClick={()=>{setActive(null);setAns({});}}>← Exit</Btn>
            <Btn v="primary" sz="lg" onClick={()=>setDone(true)} disabled={Object.keys(ans).length<qs.length}>Submit Test →</Btn>
          </div>
        </Card>
      </div>
    );
  }

  if(done){
    const score=qs.filter(q=>ans[q.id]===q.correct).length; const pct=Math.round(score/qs.length*100);
    return (
      <div>
        <SecHead title="Test Result"/>
        <Card style={{ textAlign:"center", padding:"60px 32px" }}>
          <div style={{ width:100, height:100, borderRadius:"50%", background:pct>=75?GR.mint:GR.coral, display:"flex", alignItems:"center", justifyContent:"center", fontSize:46, margin:"0 auto 24px" }}>{pct>=75?"🏆":"📚"}</div>
          <div style={{ fontSize:48, fontWeight:800, color:T.dark, marginBottom:8 }}>{score}/{qs.length}</div>
          <div style={{ fontSize:20, color:T.muted, marginBottom:20 }}>{pct}% Score</div>
          <Tag color={pct>=60?"mint":"coral"}>{pct>=60?"Passed — Well Done!":"Needs Improvement"}</Tag>
          <div style={{ marginTop:28 }}><Btn v="ghost" onClick={()=>{setActive(null);setDone(false);setAns({});}}>← Back to Tests</Btn></div>
        </Card>
      </div>
    );
  }

  const tests=[
    {title:"AI & Neural Networks Quiz",  sub:"AI",   qs:4,  dur:20, status:"available"},
    {title:"Data Structures Mid-Term",   sub:"DSA",  qs:30, dur:90, status:"upcoming",  date:"Apr 12"},
    {title:"DBMS Unit Test — Completed", sub:"DBMS", qs:15, dur:45, status:"completed", score:"78%"},
  ];
  return (
    <div>
      <SecHead title="Online Tests & Exams" sub="Practice quizzes, unit tests, and major exams"/>
      <div style={{ display:"grid", gap:11 }}>
        {tests.map((t,i)=>(
          <Card key={i} style={{ borderLeft:`4px solid ${t.status==="available"?T.mint:t.status==="upcoming"?T.amber:T.muted}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:15.5, fontWeight:800, color:T.dark, marginBottom:5 }}>{t.title}</div>
                <div style={{ fontSize:13, color:T.muted }}>📚 {t.sub} · ❓ {t.qs} questions · ⏱ {t.dur} mins{t.date?` · 📅 ${t.date}`:""}</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {t.score&&<Tag color="mint">{t.score}</Tag>}
                <Tag color={t.status==="available"?"mint":t.status==="upcoming"?"amber":"gray"}>{t.status}</Tag>
                {t.status==="available"&&<Btn v="primary" sz="sm" onClick={()=>setActive(t)}>Start →</Btn>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STUDENT RESULTS
══════════════════════════════════════════════════════ */
function StudentResults() {
  const tot=RESULTS.reduce((a,r)=>a+r.total,0); const max=RESULTS.reduce((a,r)=>a+r.max,0);
  const chartData=RESULTS.map(r=>({sub:r.subject.split(" ")[0],pct:Math.round(r.total/r.max*100)}));
  const gradeColors={"A+":T.mint,"A":T.success,"A-":T.cyan,"B+":T.violet,"B":T.amber,"B-":T.warning};
  return (
    <div>
      <SecHead title="Results & Grades" sub="Semester 7 academic results" action={<Btn v="ghost" sz="sm">📥 Download Report Card</Btn>}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:18 }}>
        <Stat icon="⭐" label="Overall GPA"  value="8.7"         gradient={GR.amber}  />
        <Stat icon="🏆" label="Total Score"  value={`${tot}/${max}`} sub={`${Math.round(tot/max*100)}%`} gradient={GR.mint}/>
        <Stat icon="📊" label="Class Rank"   value="#3"          sub="Out of 60" gradient={GR.violet}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:14, marginBottom:14 }}>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Subject-wise Results</div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <THead cols={["Subject","Mid /50","End /100","Int /20","Total","Grade"]}/>
            <tbody>
              {RESULTS.map((r,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"11px 12px", fontSize:13.5, fontWeight:700, color:T.dark }}>{r.subject}</td>
                  <td style={{ padding:"11px 12px", fontSize:13, textAlign:"center" }}>{r.mid}</td>
                  <td style={{ padding:"11px 12px", fontSize:13, textAlign:"center" }}>{r.end}</td>
                  <td style={{ padding:"11px 12px", fontSize:13, textAlign:"center" }}>{r.int}</td>
                  <td style={{ padding:"11px 12px", fontWeight:800, fontSize:14 }}>{r.total}</td>
                  <td style={{ padding:"11px 12px" }}><Tag color={r.grade.startsWith("A")?"mint":"violet"}>{r.grade}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.dark, marginBottom:14 }}>Score Visualization</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="sub" tick={{ fontSize:11, fill:T.muted }}/><YAxis domain={[0,100]} tick={{ fontSize:11, fill:T.muted }}/><Tooltip formatter={v=>`${v}%`}/>
              <Bar dataKey="pct" radius={[6,6,0,0]}>{chartData.map((_,i)=><Cell key={i} fill={[T.mint,T.violet,T.cyan,T.amber,T.coral][i%5]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ADMIN CLASSES
══════════════════════════════════════════════════════ */
function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [viewClass, setViewClass] = useState(null);
  const [manageClass, setManageClass] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchClasses = () => {
    fetch("http://localhost:5001/classes", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setClasses(data); })
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchClasses(); }, []);

  const openManage = (c) => {
    setManageClass(c);
    setEditData({ name: c.name, subject: c.subject, semester: c.semester, branch: c.branch, teacher: c.teacher, room: c.room, students: c.students, avg: c.avg });
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5001/classes/${manageClass._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Update failed"); return; }
      alert("Class updated successfully!");
      setManageClass(null);
      fetchClasses();
    } catch (err) { alert("Error: " + err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class? This cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5001/classes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Delete failed"); return; }
      alert("Class deleted.");
      setManageClass(null);
      fetchClasses();
    } catch (err) { alert("Error: " + err.message); }
  };

  const Overlay = ({ children, onClose }) => (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:T.bgCard, borderRadius:18, padding:30, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(108,78,245,0.2)" }}>
        {children}
      </div>
    </div>
  );

  const colors = [T.violet, T.coral, T.mint, T.amber];

  return (
    <div>
      {/* VIEW DETAILS MODAL */}
      {viewClass && (
        <Overlay onClose={() => setViewClass(null)}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div style={{ fontSize:18, fontWeight:800, color:T.dark }}>📋 Class Details</div>
            <Btn v="ghost" sz="sm" onClick={() => setViewClass(null)}>✕ Close</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              ["Class Name", viewClass.name],
              ["Subject", viewClass.subject || "—"],
              ["Semester", viewClass.semester || "—"],
              ["Branch", viewClass.branch || "—"],
              ["Teacher", viewClass.teacher || "—"],
              ["Room", viewClass.room || "TBA"],
              ["Total Students", viewClass.students ?? 0],
              ["Average Score", `${viewClass.avg ?? 0}%`],
            ].map(([label, val]) => (
              <div key={label} style={{ background:T.bg, borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:11.5, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:15, fontWeight:800, color:T.dark }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, display:"flex", gap:8 }}>
            <Btn v="primary" sz="sm" onClick={() => { setViewClass(null); openManage(viewClass); }}>✏️ Edit Class</Btn>
            <Btn v="danger" sz="sm" onClick={() => { setViewClass(null); handleDelete(viewClass._id); }}>🗑️ Delete</Btn>
          </div>
        </Overlay>
      )}

      {/* MANAGE MODAL */}
      {manageClass && (
        <Overlay onClose={() => setManageClass(null)}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div style={{ fontSize:18, fontWeight:800, color:T.dark }}>⚙️ Manage Class</div>
            <Btn v="ghost" sz="sm" onClick={() => setManageClass(null)}>✕ Close</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
            <Inp label="Class Name" value={editData.name || ""} onChange={v => setEditData({...editData, name:v})} />
            <Inp label="Subject" value={editData.subject || ""} onChange={v => setEditData({...editData, subject:v})} />
            <Inp label="Semester" value={editData.semester || ""} onChange={v => setEditData({...editData, semester:v})} />
            <Inp label="Branch" value={editData.branch || ""} onChange={v => setEditData({...editData, branch:v})} />
            <Inp label="Teacher" value={editData.teacher || ""} onChange={v => setEditData({...editData, teacher:v})} />
            <Inp label="Room" value={editData.room || ""} onChange={v => setEditData({...editData, room:v})} />
            <Inp label="Total Students" type="number" value={editData.students ?? 0} onChange={v => setEditData({...editData, students:Number(v)})} />
            <Inp label="Average Score (%)" type="number" value={editData.avg ?? 0} onChange={v => setEditData({...editData, avg:Number(v)})} />
          </div>
          <div style={{ display:"flex", gap:8, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
            <Btn v="primary" sz="md" onClick={handleUpdate} disabled={saving}>{saving ? "Saving..." : "💾 Save Changes"}</Btn>
            <Btn v="danger" sz="md" onClick={() => handleDelete(manageClass._id)}>🗑️ Delete Class</Btn>
            <Btn v="ghost" sz="md" onClick={() => setManageClass(null)}>Cancel</Btn>
          </div>
        </Overlay>
      )}

      <AddClassForm onAdd={fetchClasses} />
      <SecHead title="Class Management" sub={`${classes.length} active classes`} />

      {classes.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:T.muted }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🏫</div>
          <div style={{ fontWeight:700, fontSize:15 }}>No classes yet.</div>
          <div style={{ fontSize:13 }}>Use "Expand Form" above to add your first class.</div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {classes.map((c, i) => (
          <Card key={c._id || i} style={{ borderTop:`4px solid ${colors[i % colors.length]}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:T.dark }}>{c.name}</div>
                <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>👨‍🏫 {c.teacher} · 📚 {c.subject || "—"}</div>
                <div style={{ fontSize:12, color:T.light, marginTop:2 }}>🌿 {c.branch || "—"} · Sem {c.semester || "—"}</div>
              </div>
              <Tag color="violet">Room {c.room || "TBA"}</Tag>
            </div>
            <div style={{ display:"flex", gap:20, marginBottom:14 }}>
              <div><div style={{ fontSize:20, fontWeight:800, color:T.dark }}>{c.students ?? 0}</div><div style={{ fontSize:11, color:T.muted }}>Students</div></div>
              <div><div style={{ fontSize:20, fontWeight:800, color:T.violetD }}>{c.avg ?? 0}%</div><div style={{ fontSize:11, color:T.muted }}>Avg Score</div></div>
            </div>
            <ProgressBar value={c.avg ?? 0} color={colors[i % colors.length]} height={5} />
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <Btn v="ghost" sz="sm" style={{ flex:1 }} onClick={() => setViewClass(c)}>View Details</Btn>
              <Btn v="primary" sz="sm" style={{ flex:1 }} onClick={() => openManage(c)}>Manage →</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [user,setUser]=useState(null);
  const [nav,setNav]=useState("overview");
  const [showNotifs,setShowNotifs]=useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        fetch("http://localhost:5001/dashboard/summary", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        }).then(res => res.json()).then(data => {
          if (!data.error) {
            setNotifs([
              { id: 1, text: `${data.totalStudents || 0} students currently enrolled.`, time: "Just now", read: false, type: "info" },
              { id: 2, text: `System managing ${data.totalTeachers || 0} faculty members.`, time: "Just now", read: false, type: "info" },
              { id: 3, text: `Server backup completed successfully`, time: "2h ago", read: false, type: "success" }
            ]);
          }
        }).catch(() => {});
      } else {
        setNotifs([
          { id: 1, text: `Welcome back, ${user.name}!`, time: "Just now", read: false, type: "success" },
          { id: 2, text: `You have new pending tasks.`, time: "1h ago", read: false, type: "warn" }
        ]);
      }
    }
  }, [user]);

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const notifCount=notifs.filter(n=>!n.read).length;

  const login=u=>{setUser(u);setNav("overview");};
  const logout=()=>{setUser(null);setNav("overview");};

  if(!user) return <AuthScreen onLogin={login}/>;

  const render=()=>{
    /* ADMIN */
    if(user.role==="admin"){
      const v={overview:<AdminOverview onNavigate={setNav}/>,students:<AdminStudents/>,teachers:<AdminTeachers/>,classes:<AdminClasses/>,subjects:<AdminSubjects/>,timetable:<TimetableView/>,events:<EventsCalendar/>,noticeboard:<NoticeBoard user={user}/>,analytics:<AdminAnalytics/>};
      return v[nav]||<AdminOverview onNavigate={setNav}/>;
    }
    /* TEACHER */
    if(user.role==="teacher"){
      const G = ({children}) => <TeacherVerificationGate>{children}</TeacherVerificationGate>;
      const v={
        overview:    <G><TeacherOverview user={user}/></G>,
        students:    <G><TeacherStudents/></G>,
        attendance:  <G><AttendanceMark/></G>,
        assignments: <G><TeacherAssignments user={user}/></G>,
        materials:   <G><MaterialsView role="teacher"/></G>,
        gradebook:   <G><Gradebook/></G>,
        tests:       <G><OnlineTests/></G>,
        performance: <G><PerformanceView/></G>,
        noticeboard: <NoticeBoard user={user}/>,
        lessonplanner:<LessonPlanner/>,
        questiongen: <QuestionGen/>,
        aichat:      <AIChat user={user}/>,
      };
      return v[nav]||<G><TeacherOverview user={user}/></G>;
    }
    /* STUDENT */
    if(user.role==="student"){
      const v={overview:<StudentOverview user={user}/>,profile:<StudentProfile user={user}/>,attendance:<StudentAttendance/>,materials:<MaterialsView role="student"/>,assignments:<TeacherAssignments user={user}/>,tests:<StudentTests/>,results:<StudentResults/>,library:<LibraryView role="student"/>,leaderboard:<Leaderboard/>,noticeboard:<NoticeBoard user={user}/>,aichat:<AIChat user={user}/>};
      return v[nav]||<StudentOverview user={user}/>;
    }
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Plus Jakarta Sans',sans-serif", background:T.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <Sidebar user={user} active={nav} setActive={n=>{setNav(n);setShowNotifs(false);}} onLogout={logout} notifCount={notifCount}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar user={user} notifs={notifs} markAllAsRead={markAllAsRead} showNotifs={showNotifs} setShowNotifs={setShowNotifs}/>
        <main style={{ flex:1, overflowY:"auto", padding:"28px 32px" }} onClick={()=>showNotifs&&setShowNotifs(false)}>
          {render()}
        </main>
      </div>
    </div>
  );
}

function AddStudentForm({ onAdd }) {
  const [show, setShow] = useState(false);
  const [student, setStudent] = useState({
    name: "", class: "", semester: "", attendance: "", gpa: "",
    rollNo: "", registrationNumber: "", batch: "", email: "", phone: "", address: "", dob: "", branch: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(student)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to add student");
        return;
      }
      alert("Student Added Successfully");
      setStudent({ name: "", class: "", semester: "", attendance: "", gpa: "", rollNo: "", registrationNumber: "", batch: "", email: "", phone: "", address: "", dob: "", branch: "" });
      setShow(false);
      if (onAdd) onAdd();
    } catch (error) {
      console.error(error);
      alert("An error occurred. Make sure the server is running.");
    }
  };

  return (
    <Card style={{ marginBottom: 20, borderLeft: `4px solid ${T.violet}` }}>
      <SecHead 
        title="➕ Add & Verify Student" 
        sub="Enter the student's email (used for login) to auto-verify them" 
        action={<Btn v="ghost" sz="sm" onClick={() => setShow(!show)}>{show ? "Cancel" : "Expand Form"}</Btn>}
      />
      {show && (
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Inp label="Student Email / Username *" value={student.name} onChange={(val) => setStudent({...student, name: val})} />
          <Inp label="Roll No" value={student.rollNo} onChange={(val) => setStudent({...student, rollNo: val})} />
          <Inp label="Registration No" value={student.registrationNumber} onChange={(val) => setStudent({...student, registrationNumber: val})} />
          <Inp label="Branch" value={student.branch} onChange={(val) => setStudent({...student, branch: val})} />
          <Inp label="Semester" value={student.semester} onChange={(val) => setStudent({...student, semester: val})} />
          <Inp label="Batch" value={student.batch} onChange={(val) => setStudent({...student, batch: val})} />
          <Inp label="Email" value={student.email} onChange={(val) => setStudent({...student, email: val})} />
          <Inp label="Phone" value={student.phone} onChange={(val) => setStudent({...student, phone: val})} />
          <Inp label="DOB" type="date" value={student.dob} onChange={(val) => setStudent({...student, dob: val})} />
          <Inp label="Address" value={student.address} onChange={(val) => setStudent({...student, address: val})} />
          <Inp label="Initial Attendance (%)" type="number" value={student.attendance} onChange={(val) => setStudent({...student, attendance: val})} />
          <Inp label="Initial GPA" type="number" value={student.gpa} onChange={(val) => setStudent({...student, gpa: val})} />
          <div style={{ gridColumn: "span 2", marginTop: 10 }}>
            <Btn v="primary" sz="md" type="submit">Verify & Save Student</Btn>
          </div>
        </form>
      )}
    </Card>
  );
}

function AddTeacherForm({ onAdd }) {
  const [teacher, setTeacher] = useState({
    name: "",
    subject: "",
    dept: "",
    exp: "",
    rating: 0,
    students: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(teacher)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to add teacher");
        return;
      }
      alert("Teacher Added Successfully");
      setTeacher({ name: "", subject: "", dept: "", exp: "", rating: 0, students: 0 });
      if (onAdd) onAdd();
    } catch (error) {
      console.error(error);
      alert("An error occurred. Make sure the server is running.");
    }
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <SecHead title="➕ Add & Verify Faculty Profile" sub="Enter the teacher's email (used for login) to auto-verify them" />
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Inp label="Teacher Email / Username *" value={teacher.name} onChange={val => setTeacher({...teacher, name: val})} />
        <Inp label="Subject Specialization" value={teacher.subject} onChange={val => setTeacher({...teacher, subject: val})} />
        <Inp label="Department (e.g. CSE)" value={teacher.dept} onChange={val => setTeacher({...teacher, dept: val})} />
        <Inp label="Experience (e.g. 5 Years)" value={teacher.exp} onChange={val => setTeacher({...teacher, exp: val})} />
        <div style={{ gridColumn: "span 2" }}>
          <Btn v="primary" sz="md" type="submit">Verify & Add Teacher</Btn>
        </div>
      </form>
    </Card>
  );
}

function AddClassForm({ onAdd }) {
  const [show, setShow] = useState(false);
  const [cls, setCls] = useState({
    name: "", subject: "", semester: "", branch: "", teacher: "", room: "", students: 0, avg: 0
  });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/teachers", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTeachers(data); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cls.name || !cls.subject || !cls.semester || !cls.branch || !cls.teacher) {
      alert("Please fill in all required fields (Name, Subject, Semester, Branch, Teacher).");
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(cls)
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to add class"); return; }
      alert("Class Added Successfully");
      setCls({ name: "", subject: "", semester: "", branch: "", teacher: "", room: "", students: 0, avg: 0 });
      setShow(false);
      if (onAdd) onAdd();
    } catch (error) {
      console.error(error);
      alert("An error occurred. Make sure the server is running.");
    }
  };

  return (
    <Card style={{ marginBottom: 20, borderLeft: `4px solid ${T.violet}` }}>
      <SecHead title="➕ Add Class" action={<Btn v="ghost" sz="sm" onClick={() => setShow(!show)}>{show ? "Cancel" : "Expand Form"}</Btn>} />
      {show && (
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Inp label="Class Name (e.g. B.Tech CSE 7th Sem) *" value={cls.name} onChange={val => setCls({...cls, name: val})} />
          <Inp label="Subject *" value={cls.subject} onChange={val => setCls({...cls, subject: val})} />
          <Inp label="Semester (e.g. 7th) *" value={cls.semester} onChange={val => setCls({...cls, semester: val})} />
          <Inp label="Branch (e.g. CSE-AI) *" value={cls.branch} onChange={val => setCls({...cls, branch: val})} />
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: T.dark }}>Assign Teacher *</label>
            <select value={cls.teacher} onChange={e => setCls({...cls, teacher: e.target.value})}
              style={{ padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13.5, fontFamily: "inherit", outline: "none" }} required>
              <option value="">-- Select Teacher --</option>
              {teachers.map(t => <option key={t._id} value={t.name}>{t.name} ({t.subject || t.dept})</option>)}
            </select>
          </div>
          <Inp label="Room Number" value={cls.room} onChange={val => setCls({...cls, room: val})} />
          <Inp label="Total Students" type="number" value={cls.students} onChange={val => setCls({...cls, students: Number(val)})} />
          <Inp label="Average Score (%)" type="number" value={cls.avg} onChange={val => setCls({...cls, avg: Number(val)})} />
          <div style={{ gridColumn: "span 2", marginTop: 10 }}>
            <Btn v="primary" sz="md" type="submit">Save Class</Btn>
          </div>
        </form>
      )}
    </Card>
  );
}


function AddSubjectForm({ onAdd, teachers = [] }) {
  const [subj, setSubj] = useState({
    code: "",
    name: "",
    credits: 0,
    teacher: "",
    sem: "",
    dept: "",
    classes: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5001/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(subj)
      });
      alert("Subject Added Successfully");
      if (onAdd) onAdd();
      setSubj({ code: "", name: "", credits: 0, teacher: "", sem: "", dept: "", classes: 0 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <SecHead title="➕ Add Subject" />
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Inp label="Subject Code (e.g. CS701)" value={subj.code} onChange={val => setSubj({...subj, code: val})} />
        <Inp label="Subject Name" value={subj.name} onChange={val => setSubj({...subj, name: val})} />
        <Inp label="Department (e.g. CSE-AI)" value={subj.dept} onChange={val => setSubj({...subj, dept: val})} />
        <Inp label="Semester (e.g. 7th Sem)" value={subj.sem} onChange={val => setSubj({...subj, sem: val})} />
        <Inp label="Credits" type="number" value={subj.credits} onChange={val => setSubj({...subj, credits: Number(val)})} />
        <Inp label="Number of Classes" type="number" value={subj.classes} onChange={val => setSubj({...subj, classes: Number(val)})} />
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <label style={{ fontSize:13, fontWeight:700, color:T.dark }}>Faculty / Teacher *</label>
          <select value={subj.teacher} onChange={e => setSubj({...subj, teacher: e.target.value})} style={{ padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }} required>
            <option value="">-- Select Teacher --</option>
            {teachers.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "span 2", marginTop: 10 }}>
          <Btn v="primary" sz="md" type="submit">Add Subject</Btn>
        </div>
      </form>
    </Card>
  );
}
