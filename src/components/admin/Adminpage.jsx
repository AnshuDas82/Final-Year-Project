import { useState, useEffect } from "react";
import { Avatar, Tag, Card, SectionHeader, Button, Input, TableHead, ProgressBar, StatCard } from "../shared/Primitives";
import { STUDENTS, TEACHERS, FEES, NOTICES, EVENTS, DEPT_CHART, ATTENDANCE_CHART, PERF_CHART, TIMETABLE } from "../../data/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, AreaChart, Area
} from "recharts";

/* ── Admin Dashboard ──────────────────────────────────────────────────────── */
export function AdminOverview() {
  return (
    <div>
      <SectionHeader
        title="Admin Dashboard"
        sub="System-wide overview of Motihari College of Engineering"
        action={<Tag color="mint">● All Systems Operational</Tag>}
      />
      <div className="grid grid-cols-4 gap-3.5 mb-5">
        <StatCard icon="👨‍🎓" label="Total Students"  value="2,340" sub="+12 this month"  gradientClass="gr-violet" />
        <StatCard icon="👨‍🏫" label="Total Teachers" value="156"   sub="7 departments"   gradientClass="gr-amber"  />
        <StatCard icon="📚"   label="Subjects Active" value="42"    sub="This semester"   gradientClass="gr-coral"  />
        <StatCard icon="💳"   label="Fee Collection"  value="₹8.4L" sub="94% recovery"    gradientClass="gr-mint"   />
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-3.5 mb-3.5">
        <Card>
          <div className="text-[14.5px] font-extrabold text-dark mb-3.5">Department Performance</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEPT_CHART} barSize={32}>
              <XAxis dataKey="dept" tick={{ fontSize:12, fill:"#7B789E" }} />
              <YAxis domain={[70,100]} tick={{ fontSize:11, fill:"#7B789E" }} />
              <Tooltip cursor={{ fill:"rgba(108,78,245,0.07)" }} />
              <Bar dataKey="avg" radius={[6,6,0,0]}>
                {DEPT_CHART.map((_,i) => <Cell key={i} fill={["#6C4EF5","#F5A623","#FF6B6B","#00C9A7"][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="text-[14.5px] font-extrabold text-dark mb-3.5">Quick Actions</div>
          {[["➕","Add New Student","violet"],["👨‍🏫","Add New Teacher","amber"],["📅","Update Timetable","mint"],["📢","Post Announcement","coral"],["📊","Generate Reports","cyan"],["💳","View Fee Status","violet"]].map(([ic,l]) => (
            <button key={l} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border-[1.5px] border-border bg-page cursor-pointer mb-2 text-dark text-[13.5px] font-semibold text-left hover:border-[#6C4EF5] transition-colors">
              <span className="text-base">{ic}</span>{l}
            </button>
          ))}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Monthly Attendance Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={ATTENDANCE_CHART}>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#7B789E" }} />
              <YAxis tick={{ fontSize:11, fill:"#7B789E" }} />
              <Tooltip />
              <Area type="monotone" dataKey="present" stroke="#00C9A7" fill="rgba(0,201,167,0.13)" strokeWidth={2} />
              <Area type="monotone" dataKey="absent"  stroke="#FF6B6B" fill="rgba(255,107,107,0.13)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Recent Alerts</div>
          {[{t:"6 students below 75% attendance",c:"#FF5757"},{t:"Fee overdue for 3 students",c:"#FFAA00"},{t:"4 assignments not graded",c:"#F5A623"},{t:"Server backup completed ✓",c:"#10C98F"}].map((a,i) => (
            <div key={i} className="flex gap-2.5 items-start py-2.5 border-b border-[#E8E6F5]">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.c }} />
              <span className="text-[13.5px] text-[#1A1540]">{a.t}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ── Admin Students ───────────────────────────────────────────────────────── */
export function AdminStudents() {
  const [q, setQ] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/students")
      .then(r => r.json())
      .then(d => setStudents(d))
      .catch(() => {});
  }, []);

  const list = students.filter(s =>
    s.name?.toLowerCase().includes(q.toLowerCase()) || s._id?.includes(q)
  );

  return (
    <div>
      <AddStudentForm />
      <SectionHeader
        title="Student Management"
        sub={`${students.length} students enrolled`}
        action={<Button variant="primary" size="sm">+ Enroll Student</Button>}
      />
      <Card>
        <div className="flex gap-2.5 mb-4">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍  Search by name or roll number..."
            className="flex-1 px-3.5 py-2.5 border-[1.5px] border-[#E8E6F5] rounded-[10px] text-[13.5px] outline-none focus:border-[#6C4EF5] transition-colors" />
          <Button variant="ghost" size="sm">Filter ▾</Button>
          <Button variant="ghost" size="sm">Export CSV</Button>
        </div>
        <table className="w-full border-collapse">
          <TableHead cols={["Roll No","Name","Class","Sem","Attendance","GPA","Status","Action"]} />
          <tbody>
            {list.map(s => (
              <tr key={s._id} className="border-b border-[#E8E6F5]">
                <td className="px-3.5 py-3 font-bold text-[12.5px] text-[#7B789E]">{s._id?.slice(-5)}</td>
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} size="sm" />
                    <span className="font-bold text-[13.5px] text-[#1A1540]">{s.name}</span>
                  </div>
                </td>
                <td className="px-3.5 py-3 text-[13px]">{s.class}</td>
                <td className="px-3.5 py-3 text-[13px]">{s.semester}</td>
                <td className="px-3.5 py-3 text-[13px]">{s.attendance}%</td>
                <td className="px-3.5 py-3 font-bold text-[13px]">{s.gpa}</td>
                <td className="px-3.5 py-3"><Tag color="mint">Active</Tag></td>
                <td className="px-3.5 py-3"><Button variant="ghost" size="sm">View →</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AddStudentForm() {
  const [student, setStudent] = useState({ name:"", class:"", semester:"", attendance:"", gpa:"" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5001/students", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(student)
      });
      alert("Student Added Successfully");
      window.location.reload();
      setStudent({ name:"", class:"", semester:"", attendance:"", gpa:"" });
    } catch (err) { console.error(err); }
  };

  return (
    <Card className="mb-5">
      <SectionHeader title="➕ Add Student" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Student Name" value={student.name} onChange={v => setStudent({...student, name:v})} />
          <Input label="Class" value={student.class} onChange={v => setStudent({...student, class:v})} />
          <Input label="Semester" value={student.semester} onChange={v => setStudent({...student, semester:v})} />
          <Input label="Attendance" value={student.attendance} onChange={v => setStudent({...student, attendance:v})} />
        </div>
        <Input label="GPA" value={student.gpa} onChange={v => setStudent({...student, gpa:v})} />
        <Button type="submit" variant="primary" size="md">Add Student</Button>
      </form>
    </Card>
  );
}

/* ── Admin Teachers ───────────────────────────────────────────────────────── */
export function AdminTeachers() {
  return (
    <div>
      <SectionHeader title="Teacher Management" sub={`${TEACHERS.length} faculty members`} action={<Button variant="primary" size="sm">+ Add Faculty</Button>} />
      <div className="grid grid-cols-2 gap-3.5">
        {TEACHERS.map(t => (
          <Card key={t.id} className="border-t-4 border-t-[#6C4EF5]">
            <div className="flex items-start gap-3.5 mb-3.5">
              <Avatar name={t.name} size="lg" variant="violet" />
              <div className="flex-1">
                <div className="text-[15.5px] font-extrabold text-[#1A1540]">{t.name}</div>
                <div className="text-[13px] text-[#F5A623] font-bold mt-0.5">{t.subject}</div>
                <div className="text-[12px] text-[#7B789E] mt-1">🏷️ {t.dept} · 🕐 {t.exp}</div>
              </div>
              <div className="text-right">
                <div className="text-[18px] font-extrabold text-[#1A1540]">⭐ {t.rating}</div>
                <div className="text-[11px] text-[#7B789E]">Rating</div>
              </div>
            </div>
            <div className="flex gap-2.5 py-3 border-t border-[#E8E6F5]">
              {[["Students", t.students], ["Classes", 3], ["Subjects", 6]].map(([l, v], i) => (
                <>
                  {i > 0 && <div key={`d${i}`} className="w-px bg-[#E8E6F5]" />}
                  <div key={l} className="flex-1 text-center">
                    <div className="text-[17px] font-extrabold text-[#4F38C2]">{v}</div>
                    <div className="text-[11px] text-[#7B789E]">{l}</div>
                  </div>
                </>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="sm" className="flex-1">View Profile</Button>
              <Button variant="primary" size="sm" className="flex-1">Message</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Admin Analytics ──────────────────────────────────────────────────────── */
export function AdminAnalytics() {
  return (
    <div>
      <SectionHeader title="Analytics & Insights" sub="Institution-wide academic performance data" action={<Button variant="ghost" size="sm">📥 Export PDF</Button>} />
      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Subject-wise Avg Scores</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PERF_CHART} barSize={36}>
              <XAxis dataKey="sub" tick={{ fontSize:12, fill:"#7B789E" }} />
              <YAxis domain={[60,100]} tick={{ fontSize:11, fill:"#7B789E" }} />
              <Tooltip />
              <Bar dataKey="score" fill="#6C4EF5" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Attendance Trend (6 months)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ATTENDANCE_CHART}>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#7B789E" }} />
              <YAxis tick={{ fontSize:11, fill:"#7B789E" }} />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#00C9A7" strokeWidth={2.5} dot={{ fill:"#00C9A7", r:4 }} />
              <Line type="monotone" dataKey="absent"  stroke="#FF6B6B" strokeWidth={2.5} dot={{ fill:"#FF6B6B", r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-3.5">
        {[["8.2", "Institute Average GPA", "↑ 0.3 from last semester", "text-[#4F38C2]"],
          ["89%", "Overall Attendance",    "Above 75% threshold",       "text-[#10C98F]"],
          ["94%", "Fee Recovery Rate",     "₹8.4L collected this sem",  "text-[#C27A0A]"]].map(([v,t,s,c]) => (
          <Card key={t} className="text-center p-6">
            <div className={`text-[38px] font-extrabold ${c}`}>{v}</div>
            <div className="text-[14px] font-bold text-[#1A1540]">{t}</div>
            <div className="text-[12px] text-[#7B789E]">{s}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Admin Subjects ───────────────────────────────────────────────────────── */
export function AdminSubjects() {
  const subjs = [
    { code:"CS701", name:"Artificial Intelligence",      credits:4, teacher:"Prof. Juhi Kumari", sem:"7th", students:120 },
    { code:"CS702", name:"Machine Learning",             credits:4, teacher:"Prof. Anita Sinha",  sem:"7th", students:80  },
    { code:"CS501", name:"Data Structures & Algorithms", credits:4, teacher:"Dr. Ramesh Gupta",   sem:"5th", students:180 },
    { code:"CS502", name:"Database Management Systems",  credits:3, teacher:"Dr. Vijay Kumar",    sem:"5th", students:140 },
  ];
  return (
    <div>
      <SectionHeader title="Subjects & Courses" action={<Button variant="primary" size="sm">+ Add Subject</Button>} />
      <Card>
        <table className="w-full border-collapse">
          <TableHead cols={["Code","Subject Name","Credits","Semester","Faculty","Students","Action"]} />
          <tbody>
            {subjs.map(s => (
              <tr key={s.code} className="border-b border-[#E8E6F5]">
                <td className="px-3.5 py-3 font-extrabold text-[13px] text-[#4F38C2]">{s.code}</td>
                <td className="px-3.5 py-3 text-[14px] font-bold text-[#1A1540]">{s.name}</td>
                <td className="px-3.5 py-3"><Tag color="violet">{s.credits} Cr</Tag></td>
                <td className="px-3.5 py-3 text-[13px]">{s.sem} Sem</td>
                <td className="px-3.5 py-3 text-[13px] text-[#7B789E]">{s.teacher}</td>
                <td className="px-3.5 py-3 text-[13px]">{s.students}</td>
                <td className="px-3.5 py-3"><Button variant="ghost" size="sm">Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── Admin Classes ────────────────────────────────────────────────────────── */
export function AdminClasses() {
  const cls = [
    { name:"B.Tech CSE-AI 7th Sem", students:60, teacher:"Prof. Juhi Kumari", room:"CS-201", avg:88 },
    { name:"B.Tech CSE 5th Sem",    students:65, teacher:"Dr. Ramesh Gupta",   room:"CS-101", avg:83 },
    { name:"B.Tech CSE-AI 5th Sem", students:58, teacher:"Prof. Anita Sinha",  room:"CS-202", avg:85 },
    { name:"B.Tech IT 3rd Sem",     students:62, teacher:"Dr. Vijay Kumar",    room:"IT-101", avg:80 },
  ];
  const colors = ["#6C4EF5","#FF6B6B","#00C9A7","#F5A623"];
  return (
    <div>
      <SectionHeader title="Class Management" action={<Button variant="primary" size="sm">+ Add Class</Button>} />
      <div className="grid grid-cols-2 gap-3.5">
        {cls.map((c,i) => (
          <Card key={i} className="border-t-4" style={{ borderTopColor: colors[i] }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-extrabold text-[#1A1540]">{c.name}</div>
                <div className="text-[13px] text-[#7B789E] mt-0.5">👨‍🏫 {c.teacher}</div>
              </div>
              <Tag color="violet">Room {c.room}</Tag>
            </div>
            <div className="flex gap-5 mb-3.5">
              <div><div className="text-[20px] font-extrabold text-[#1A1540]">{c.students}</div><div className="text-[11px] text-[#7B789E]">Students</div></div>
              <div><div className="text-[20px] font-extrabold text-[#4F38C2]">{c.avg}%</div><div className="text-[11px] text-[#7B789E]">Avg Score</div></div>
            </div>
            <ProgressBar value={c.avg} colorClass={["bg-[#6C4EF5]","bg-[#FF6B6B]","bg-[#00C9A7]","bg-[#F5A623]"][i]} height="h-1.5" />
            <div className="flex gap-2 mt-3.5">
              <Button variant="ghost" size="sm" className="flex-1">View Details</Button>
              <Button variant="primary" size="sm" className="flex-1">Manage →</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Fee Management ───────────────────────────────────────────────────────── */
export function FeeManagement() {
  const total = FEES.reduce((a,f) => a+f.paid, 0);
  const due   = FEES.reduce((a,f) => a+(f.tuition+f.hostel+f.misc-f.paid), 0);
  return (
    <div>
      <SectionHeader title="💳 Fee Management" sub="Track tuition, hostel, and miscellaneous fee payments" action={<Button variant="amber" size="sm">Generate Report</Button>} />
      <div className="grid grid-cols-4 gap-3.5 mb-5">
        <StatCard icon="💰" label="Total Collected" value={`₹${(total/1000).toFixed(0)}K`} sub="This semester"         gradientClass="gr-mint"   />
        <StatCard icon="⏳" label="Pending Amount"  value={`₹${(due/1000).toFixed(0)}K`}   sub="Across 4 students"     gradientClass="gr-coral"  />
        <StatCard icon="✅" label="Fully Paid"       value={FEES.filter(f=>f.status==="Paid").length}    sub={`of ${FEES.length} students`} gradientClass="gr-violet" />
        <StatCard icon="🚨" label="Overdue"          value={FEES.filter(f=>f.status==="Overdue").length} sub="Requires action"               gradientClass="gr-amber"  />
      </div>
      <Card>
        <table className="w-full border-collapse">
          <TableHead cols={["Roll No","Student","Semester","Tuition","Hostel","Misc","Paid","Balance","Status","Action"]} />
          <tbody>
            {FEES.map(f => {
              const tot = f.tuition+f.hostel+f.misc; const bal = tot-f.paid;
              return (
                <tr key={f.id} className="border-b border-[#E8E6F5]">
                  <td className="px-3.5 py-3 text-[12.5px] text-[#7B789E] font-bold">{f.id}</td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-2"><Avatar name={f.name} size="sm" /><span className="text-[13.5px] font-bold text-[#1A1540]">{f.name}</span></div>
                  </td>
                  <td className="px-3.5 py-3 text-[13px]">{f.sem} Sem</td>
                  <td className="px-3.5 py-3 text-[13px]">₹{f.tuition.toLocaleString()}</td>
                  <td className="px-3.5 py-3 text-[13px]">₹{f.hostel.toLocaleString()}</td>
                  <td className="px-3.5 py-3 text-[13px]">₹{f.misc.toLocaleString()}</td>
                  <td className="px-3.5 py-3 text-[13px] font-bold text-[#10C98F]">₹{f.paid.toLocaleString()}</td>
                  <td className={`px-3.5 py-3 text-[13px] font-bold ${bal>0 ? "text-[#FF5757]" : "text-[#10C98F]"}`}>₹{bal.toLocaleString()}</td>
                  <td className="px-3.5 py-3"><Tag color={f.status==="Paid"?"success":f.status==="Pending"?"warning":"coral"}>{f.status}</Tag></td>
                  <td className="px-3.5 py-3"><Button variant="ghost" size="sm">Send Reminder</Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── Notice Board ─────────────────────────────────────────────────────────── */
export function NoticeBoard() {
  const typeIc    = { exam:"📋", event:"🎉", general:"📌", academic:"📚", placement:"💼" };
  const typeColor = { exam:"coral", event:"violet", general:"gray", academic:"cyan", placement:"mint" };
  return (
    <div>
      <SectionHeader title="📢 Notice Board" sub="Official announcements from the college administration" action={<Button variant="primary" size="sm">+ Post Notice</Button>} />
      <div className="flex flex-col gap-3">
        {NOTICES.map(n => (
          <Card key={n.id} className={`border-l-4 !p-4 ${n.priority==="high" ? "border-l-[#FF6B6B]" : n.priority==="medium" ? "border-l-[#F5A623]" : "border-l-[#E8E6F5]"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-[10px] bg-[#F4F3FF] flex items-center justify-center text-xl flex-shrink-0">{typeIc[n.type]||"📌"}</div>
                <div>
                  <div className="text-[15px] font-bold text-[#1A1540] leading-[1.4]">{n.title}</div>
                  <div className="text-[12.5px] text-[#7B789E] mt-1">📅 {n.date}</div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <Tag color={typeColor[n.type]||"gray"}>{n.type}</Tag>
                {n.priority==="high" && <Tag color="coral">Urgent</Tag>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Events Calendar ──────────────────────────────────────────────────────── */
export function EventsCalendar() {
  const typeIc = { exam:"📋", event:"🎉", placement:"💼", training:"🎓", sports:"🏃" };
  return (
    <div>
      <SectionHeader title="🗓️ Events & Calendar" sub="Upcoming academic events, exams, and activities" action={<Button variant="primary" size="sm">+ Add Event</Button>} />
      <div className="grid grid-cols-3 gap-3">
        {EVENTS.map(e => (
          <Card key={e.id} className="border-t-4" style={{ borderTopColor: e.color }}>
            <div className="text-[26px] mb-2.5">{typeIc[e.type]||"📅"}</div>
            <div className="text-[15px] font-extrabold text-[#1A1540] mb-1.5">{e.title}</div>
            <div className="text-[13px] text-[#7B789E] mb-1">📅 {e.date}</div>
            <div className="text-[13px] text-[#7B789E] mb-3.5">⏰ {e.time}</div>
            <Tag color={e.type==="exam"?"coral":e.type==="placement"?"mint":e.type==="event"?"violet":"amber"}>{e.type}</Tag>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Timetable ────────────────────────────────────────────────────────────── */
export function TimetableView() {
  const dayColors = { Monday:"#6C4EF5", Tuesday:"#FF6B6B", Wednesday:"#00C9A7", Thursday:"#F5A623", Friday:"#38BDF8" };
  return (
    <div>
      <SectionHeader title="Weekly Timetable" sub="B.Tech CSE-AI — 7th Semester" action={<Button variant="primary" size="sm">Edit Schedule</Button>} />
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(TIMETABLE).map(([day, slots]) => (
          <Card key={day} className="!p-4 border-t-4" style={{ borderTopColor: dayColors[day] }}>
            <div className="text-[12px] font-extrabold uppercase tracking-wider mb-3" style={{ color: dayColors[day] }}>{day}</div>
            {slots.map((s,i) => (
              <div key={i} className="bg-[#F4F3FF] rounded-lg px-2.5 py-2 mb-1.5 text-[12.5px] text-[#1A1540] font-semibold border-l-[3px] rounded-l-none" style={{ borderLeftColor: dayColors[day] }}>
                {s}
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Library View ─────────────────────────────────────────────────────────── */
import { LIBRARY } from "../../data/constants";
export function LibraryView({ role }) {
  return (
    <div>
      <SectionHeader title="📖 Library Management" sub="Browse, borrow, and return books" action={role==="admin" && <Button variant="primary" size="sm">+ Add Book</Button>} />
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <StatCard icon="📚" label="Total Books"  value="847"  gradientClass="gr-violet" />
        <StatCard icon="✅" label="Available"    value="612"  sub="Ready to borrow"  gradientClass="gr-mint"  />
        <StatCard icon="📤" label="Borrowed"     value="235"  sub="Due this week: 18" gradientClass="gr-amber" />
      </div>
      <div className="flex flex-col gap-2.5">
        {LIBRARY.map(b => (
          <Card key={b.id} className="!p-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-[50px] h-[60px] rounded-[6px] flex items-center justify-center text-2xl flex-shrink-0 ${b.available===0 ? "bg-[#F4F3FF]" : "gr-violet"}`}>📕</div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-[#1A1540]">{b.title}</div>
                <div className="text-[13px] text-[#7B789E] mt-0.5">✍️ {b.author}</div>
                {b.borrowed && b.due && <div className="text-[12.5px] text-[#FFAA00] mt-1 font-bold">⏰ Due: {b.due}</div>}
                <div className="mt-2.5">
                  <ProgressBar value={b.available} max={b.total} colorClass={b.available===0?"bg-[#FF5757]":"bg-[#10C98F]"} />
                  <div className="text-[11.5px] text-[#7B789E] mt-1">{b.available}/{b.total} copies available</div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Tag color={b.available===0?"coral":"mint"}>{b.available===0?"Unavailable":"Available"}</Tag>
                {role==="student" && (
                  b.borrowed ? <Button variant="ghost" size="sm">Return</Button>
                  : b.available>0 ? <Button variant="primary" size="sm">Borrow</Button>
                  : <Button variant="ghost" size="sm" disabled>Reserved</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}