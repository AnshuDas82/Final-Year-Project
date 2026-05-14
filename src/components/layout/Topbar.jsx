import { Avatar, Tag } from "../shared/Primitives";
import { NOTIFS } from "../../data/constants";

export default function Topbar({ user, notifCount, showNotifs, setShowNotifs }) {
  return (
    <div className="bg-white border-b border-[#E8E6F5] px-7 py-3 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
      <div className="text-[13px] text-[#7B789E]">
        📅 {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
      </div>

      <div className="flex items-center gap-3.5">
        {/* Notification bell */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="bg-[#F4F3FF] border-[1.5px] border-[#E8E6F5] rounded-[10px] w-9 h-9 cursor-pointer text-[17px] flex items-center justify-center relative hover:border-[#6C4EF5] transition-colors">
            🔔
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white rounded-full text-[9px] font-extrabold w-4 h-4 flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-[360px] bg-white border border-[#E8E6F5] rounded-[14px] shadow-xl z-50">
              <div className="px-4 py-3.5 border-b border-[#E8E6F5] flex justify-between items-center">
                <div className="font-extrabold text-[#1A1540] text-sm">Notifications</div>
                <Tag color="violet">{notifCount} new</Tag>
              </div>
              {NOTIFS.map(n => (
                <div key={n.id}
                  className={`px-4 py-3 border-b border-[#E8E6F5] flex gap-2.5 items-start ${!n.read ? "bg-[#6C4EF5]/[0.04]" : ""}`}>
                  <span className="text-base">{n.type==="warn" ? "⚠️" : n.type==="success" ? "✅" : "ℹ️"}</span>
                  <div className="flex-1">
                    <div className={`text-[13px] text-[#1A1540] leading-[1.5] ${!n.read ? "font-bold" : "font-normal"}`}>{n.text}</div>
                    <div className="text-[11px] text-[#B8B5D4] mt-0.5">{n.time}</div>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 bg-[#6C4EF5] rounded-full flex-shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User chip */}
        <div className="flex items-center gap-2.5 bg-[#F4F3FF] rounded-[10px] px-3 py-1.5 pl-1.5 border-[1.5px] border-[#E8E6F5]">
          <Avatar name={user.name} size="sm" variant="violet" />
          <span className="text-[13px] font-bold text-[#1A1540]">{user.name.split(" ")[0]}</span>
        </div>
      </div>
    </div>
  );
}