import { Avatar } from "../shared/Primitives";

const NAV_ITEMS = {
  admin: [
    { k:"overview",     ic:"🏠", l:"Dashboard"    },
    { k:"students",     ic:"👤", l:"Students"      },
    { k:"teachers",     ic:"👥", l:"Teachers"      },
    { k:"classes",      ic:"🏫", l:"Classes"       },
    { k:"subjects",     ic:"📚", l:"Subjects"      },
    { k:"fees",         ic:"💳", l:"Fee Management"},
    { k:"library",      ic:"📖", l:"Library"       },
    { k:"timetable",    ic:"📅", l:"Timetable"     },
    { k:"events",       ic:"🗓️", l:"Events"        },
    { k:"noticeboard",  ic:"📢", l:"Notice Board"  },
    { k:"analytics",    ic:"📊", l:"Analytics"     },
  ],
  teacher: [
    { k:"overview",     ic:"🏠", l:"Dashboard"         },
    { k:"attendance",   ic:"✅", l:"Attendance"         },
    { k:"assignments",  ic:"📝", l:"Assignments"        },
    { k:"materials",    ic:"📁", l:"Materials"          },
    { k:"gradebook",    ic:"📒", l:"Gradebook"          },
    { k:"tests",        ic:"🧪", l:"Online Tests"       },
    { k:"performance",  ic:"📈", l:"Performance"        },
    { k:"noticeboard",  ic:"📢", l:"Notice Board"       },
    { k:"lessonplanner",ic:"🤖", l:"AI Lesson Planner"  },
    { k:"questiongen",  ic:"❓", l:"Question Generator" },
    { k:"aichat",       ic:"💬", l:"AI Assistant"       },
  ],
  student: [
    { k:"overview",     ic:"🏠", l:"Dashboard"       },
    { k:"profile",      ic:"👤", l:"My Profile"      },
    { k:"attendance",   ic:"✅", l:"Attendance"       },
    { k:"materials",    ic:"📁", l:"Study Materials"  },
    { k:"assignments",  ic:"📝", l:"Assignments"      },
    { k:"tests",        ic:"🧪", l:"Online Tests"     },
    { k:"results",      ic:"🏆", l:"Results & Grades" },
    { k:"library",      ic:"📖", l:"Library"          },
    { k:"leaderboard",  ic:"🥇", l:"Leaderboard"      },
    { k:"noticeboard",  ic:"📢", l:"Notice Board"     },
    { k:"aichat",       ic:"🤖", l:"AI Assistant"     },
  ],
};

const ROLE_AVATAR_VARIANT = { admin: "violet", teacher: "amber", student: "mint" };
const ROLE_COLOR = { admin: "text-[#8A70FF]", teacher: "text-[#FFCA6B]", student: "text-[#6EE7D4]" };

export default function Sidebar({ user, active, setActive, onLogout, notifCount }) {
  const items = NAV_ITEMS[user.role] || [];

  return (
    <div className="w-64 gr-ink h-full flex flex-col flex-shrink-0 overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-5 pb-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 gr-amber rounded-[12px] flex items-center justify-center text-[22px]">🎓</div>
          <div>
            <div className="text-white font-extrabold text-[15px]">EduAI Pro</div>
            <div className="text-[#FFCA6B] text-[10.5px] opacity-85">AI-Powered Platform</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-3.5 border-b border-white/[0.07]">
        <div className="bg-white/[0.06] rounded-xl px-3 py-3 flex items-center gap-2.5">
          <Avatar name={user.name} size="md" variant={ROLE_AVATAR_VARIANT[user.role] || "violet"} />
          <div className="overflow-hidden">
            <div className="text-white font-bold text-[13px] truncate">{user.name}</div>
            <div className={`${ROLE_COLOR[user.role]} text-[11px] capitalize mt-0.5`}>
              {user.role} · {user.dept || "MCE"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-2.5 overflow-y-auto">
        {items.map(item => {
          const isActive = active === item.k;
          return (
            <button key={item.k} onClick={() => setActive(item.k)}
              className={`nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border-0 cursor-pointer mb-0.5 text-left font-sans text-[13.5px] border-l-[3px] transition-all
                ${isActive
                  ? "bg-[rgba(108,78,245,0.25)] text-[#8A70FF] font-bold border-l-[#8A70FF]"
                  : "bg-transparent text-white/55 font-medium border-l-transparent"}`}>
              <span className="text-sm">{item.ic}</span>
              <span>{item.l}</span>
              {item.k === "overview" && notifCount > 0 && (
                <span className="ml-auto bg-[#FF6B6B] text-white rounded-full text-[10.5px] font-extrabold px-1.5 min-w-[18px] text-center">
                  {notifCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2.5 border-t border-white/[0.07]">
        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border border-white/10 cursor-pointer bg-[rgba(255,87,87,0.08)] text-[rgba(255,150,150,0.85)] text-[13px] font-semibold font-sans hover:bg-[rgba(255,87,87,0.15)] transition-colors">
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}