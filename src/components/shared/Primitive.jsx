// Shared primitive UI components using Tailwind CSS

export function Avatar({ name = "?", size = "md", variant = "violet" }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const sizeMap = { sm: "w-7 h-7 text-xs", md: "w-8 h-8 text-sm", lg: "w-10 h-10 text-base", xl: "w-14 h-14 text-xl" };
  const variantMap = {
    violet:  "gr-violet text-white",
    amber:   "gr-amber text-[#0D0B26]",
    mint:    "gr-mint text-white",
    coral:   "gr-coral text-white",
  };
  return (
    <div className={`${sizeMap[size] || sizeMap.md} ${variantMap[variant] || variantMap.violet} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export function Tag({ children, color = "violet" }) {
  const map = {
    violet:  "bg-[#EDE9FE] text-[#4F38C2]",
    amber:   "bg-[#FEF3C7] text-[#92400E]",
    coral:   "bg-[#FFE4E4] text-[#9B1C1C]",
    mint:    "bg-[#D1FAF0] text-[#064E3B]",
    cyan:    "bg-[#E0F2FE] text-[#0C4A6E]",
    gray:    "bg-[#F1F0F9] text-[#4B4580]",
    success: "bg-[#D1FAF0] text-[#064E3B]",
    danger:  "bg-[#FFE4E4] text-[#9B1C1C]",
    warning: "bg-[#FEF3C7] text-[#92400E]",
  };
  return (
    <span className={`${map[color] || map.violet} px-2.5 py-0.5 rounded-full text-[11.5px] font-bold whitespace-nowrap inline-block`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-[#E8E6F5] ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#1A1540] m-0">{title}</h2>
        {sub && <p className="text-[13px] text-[#7B789E] mt-1 mb-0">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", size = "md", disabled = false, className = "", type = "button", ...props }) {
  const variants = {
    primary: "gr-violet text-white border-0",
    amber:   "gr-amber text-[#0D0B26] border-0",
    coral:   "gr-coral text-white border-0",
    mint:    "gr-mint text-white border-0",
    ghost:   "bg-transparent text-[#4B4580] border border-[#E8E6F5]",
    danger:  "gr-coral text-white border-0",
    ink:     "gr-ink text-white border-0",
  };
  const sizes = {
    sm: "px-3.5 py-1.5 text-[12.5px]",
    md: "px-4.5 py-2.5 text-[13.5px]",
    lg: "px-6.5 py-3 text-[15px]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} rounded-[10px] cursor-pointer font-bold transition-opacity ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="mb-3.5">
      {label && <label className="block text-[12.5px] font-bold text-[#1A1540] mb-1.5">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="edu-input w-full px-3.5 py-2.5 border-[1.5px] border-[#E8E6F5] rounded-[10px] text-[13.5px] text-[#1A1540] bg-white transition-colors focus:border-[#6C4EF5] outline-none"
      />
    </div>
  );
}

export function TableHead({ cols }) {
  return (
    <thead>
      <tr className="bg-[#F4F3FF]">
        {cols.map(c => (
          <th key={c} className="px-3.5 py-2.5 text-left text-[11px] font-extrabold text-[#7B789E] uppercase tracking-wider">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function ProgressBar({ value, max = 100, colorClass = "bg-[#6C4EF5]", height = "h-1.5" }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className={`${height} bg-[#E8E6F5] rounded-full overflow-hidden`}>
      <div className={`${colorClass} h-full rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function StatCard({ icon, label, value, sub, gradientClass = "gr-violet" }) {
  return (
    <div className="bg-white rounded-2xl p-[18px_20px] border border-[#E8E6F5] flex items-center gap-3.5 relative overflow-hidden">
      <div className={`absolute -right-3.5 -top-3.5 w-20 h-20 rounded-full ${gradientClass} opacity-[0.07]`} />
      <div className={`w-[50px] h-[50px] rounded-[14px] ${gradientClass} flex items-center justify-center text-[22px] flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-[12px] text-[#7B789E] mb-0.5 font-semibold tracking-wide">{label}</div>
        <div className="text-[22px] font-extrabold text-[#1A1540] leading-tight">{value}</div>
        {sub && <div className="text-[11.5px] text-[#B8B5D4] mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}