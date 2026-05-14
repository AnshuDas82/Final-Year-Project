import { useState } from "react";
import { USERS } from "../../data/constants";
import { Input } from "../shared/Primitives";

const FEATURES = [
  ["🤖", "AI-Powered", "Lesson planner, chatbot & question generator"],
  ["📊", "Live Analytics", "Real-time dashboards & performance insights"],
  ["🔒", "Secure Access", "JWT auth with role-based protected routes"],
  ["📱", "Responsive", "Works seamlessly on any device"],
];

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [err, setErr] = useState("");

  const doLogin = () => {
    const u = USERS.find((u) => u.email === email && u.password === pass);
    if (u) {
      onLogin(u);
      setErr("");
    } else setErr("Invalid credentials. Use the demo buttons below.");
  };

  const demo = (r) => onLogin(USERS.find((u) => u.role === r));

  return (
    <div className="h-screen w-screen flex gr-ink overflow-hidden">
      {/* ── Left Hero Panel ── */}
      <div className="flex-1 flex flex-col justify-center px-16 py-14 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(79,56,194,0.35) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(13,11,38,0.8) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-12 h-12 gr-amber rounded-[14px] flex items-center justify-center text-[26px]">
              🎓
            </div>
            <div>
              <div className="text-white font-extrabold text-[17px]">
                EduAI Pro
              </div>
              <div className="text-amber-l text-[11.5px]">
                Motihari College of Engineering
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-[1.15] mb-4">
            Smart Education
            <br />
            <span className="text-amber-l">Management System</span>
          </h1>

          <p className="text-[15.5px] text-white/65 leading-[1.8] max-w-120 mb-14">
            The complete AI-powered academic platform — automate attendance,
            manage assignments, track performance, and leverage generative AI
            for better learning outcomes.
          </p>

          <div className="grid grid-cols-2 gap-3.5 max-w-125">
            {FEATURES.map(([ic, t, d]) => (
              <div
                key={t}
                className="bg-white/6 border border-white/10 rounded-[14px] p-4"
              >
                <div className="text-2xl mb-2">{ic}</div>
                <div className="text-white font-bold text-[13.5px] mb-1">
                  {t}
                </div>
                <div className="text-[12px] text-white/50 leading-[1.55]">
                  {d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-110 bg-white/97 flex flex-col justify-center px-11 py-14 overflow-y-auto shrink-0">
        <div className="mb-7">
          <h2 className="text-[26px] font-extrabold text-dark mb-1.5">
            {mode === "login" ? "Welcome back 👋" : "Create account"}
          </h2>
          <p className="text-[13.5px] text-muted m-0">
            {mode === "login"
              ? "Sign in to your account"
              : "Join EduAI Pro today"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-page rounded-xl p-1 mb-7 gap-1">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-[9px] border-0 cursor-pointer text-[13.5px] font-sans transition-all
                ${mode === m ? "bg-white text-dark font-extrabold shadow-sm" : "bg-transparent text-muted font-medium"}`}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {mode === "register" && (
          <Input
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="Your full name"
          />
        )}
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="your@mce.edu"
        />
        <Input
          label="Password"
          type="password"
          value={pass}
          onChange={setPass}
          placeholder="••••••••"
        />

        {mode === "register" && (
          <div className="mb-3.5">
            <label className="block text-[12.5px] font-bold text-dark mb-1.5">
              Role
            </label>
            <div className="flex gap-2">
              {["student", "teacher", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-[10px] border-2 text-[12.5px] font-bold cursor-pointer capitalize transition-all
                    ${role === r ? "border-violet bg-violet/10 text-violet-d" : "border-border bg-transparent text-muted"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {err && (
          <div className="bg-[#FFF0F0] text-danger px-3.5 py-2.5 rounded-[10px] text-[13px] mb-3.5 border border-[#FFCDD2]">
            {err}
          </div>
        )}

        <button
          onClick={mode === "login" ? doLogin : () => {}}
          className="w-full py-3.5 gr-violet text-white border-0 rounded-xl text-[15px] font-extrabold cursor-pointer mb-5 hover:opacity-90 transition-opacity"
        >
          {mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        {/* Demo access */}
        <div className="border-t border-border pt-5">
          <div className="text-[12px] text-muted mb-2.5 font-semibold text-center uppercase tracking-wider">
            Quick Demo Access
          </div>
          <div className="flex gap-2">
            {[
              ["admin", "gr-violet", "text-white"],
              ["teacher", "gr-amber", "text-[#0D0B26]"],
              ["student", "gr-mint", "text-white"],
            ].map(([r, g, tc]) => (
              <button
                key={r}
                onClick={() => demo(r)}
                className={`flex-1 py-2.5 ${g} ${tc} border-0 rounded-[10px] text-[12.5px] font-extrabold cursor-pointer capitalize hover:opacity-90 transition-opacity`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
