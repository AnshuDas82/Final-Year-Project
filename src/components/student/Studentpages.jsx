import { useState } from "react";
import { Avatar, Tag, Card, SectionHeader, Button, TableHead, ProgressBar, StatCard } from "../shared/Primitives";
import { STUDENTS, RESULTS, RADAR_DATA, ATTENDANCE_CHART } from "../../data/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

/* ── Student Dashboard ────────────────────────────────────────────────────── */
export function StudentOverview({ user }) {
  return (
    <div>
      <SectionHeader title={`Hello, ${user.name.split(" ")[0]} 👋`} sub="Here's your academic snapshot for today" action={<Tag color="violet">7th Semester · CSE-AI</Tag>} />
      <div className="grid grid-cols-4 gap-3.5 mb-5">
        <StatCard icon="✅" label="Attendance"          value="92%"  sub="Above 75% req."   gradientClass="gr-mint"   />
        <StatCard icon="📝" label="Pending Assignments"  value="3"    sub="Due this week"    gradientClass="gr-amber"  />
        <StatCard icon="🧪" label="Upcoming Exams"       value="2"    sub="Next 7 days"      gradientClass="gr-coral"  />
        <StatCard icon="⭐" label="Current GPA"          value="8.7"  sub="Rank #3 in class" gradientClass="gr-violet" />
      </div>
      <div className="grid grid-cols-3 gap-3.5">
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Upcoming Deadlines</div>
          {[{t:"Neural Network Implementation",sub:"AI",due:"Apr 15",c:"#FF6B6B"},{t:"SQL Query Optimization",sub:"DBMS",due:"Apr 20",c:"#F5A623"},{t:"CNN Architecture Report",sub:"ML",due:"Apr 25",c:"#6C4EF5"}].map((a,i) => (
            <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-[#E8E6F5]">
              <div className="w-1 h-9 rounded-sm flex-shrink-0" style={{ background: a.c }} />
              <div className="flex-1">
                <div className="text-[13px] font-bold text-[#1A1540]">{a.t}</div>
                <div className="text-[11.5px] text-[#7B789E]">{a.sub} · Due {a.due}</div>
              </div>
              <Button variant="primary" size="sm">Submit</Button>
            </div>
          ))}
        </Card>
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Performance Chart</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={RADAR_DATA.slice(0,5)}>
              <PolarGrid stroke="#E8E6F5" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fill:"#7B789E" }} />
              <Radar dataKey="A" stroke="#6C4EF5" fill="#6C4EF5" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Today's Classes</div>
          {[["9:00 AM","AI — Prof. Juhi","CS-201","#6C4EF5"],["11:00 AM","DSA Lab — Dr. Ramesh","Lab 3","#FF6B6B"],["2:00 PM","ML — Prof. Anita","CS-202","#00C9A7"]].map(([t,sub,room,c],i) => (
            <div key={i} className="flex gap-2.5 px-3 py-2.5 bg-[#F4F3FF] rounded-r-[10px] mb-2 border-l-[3px]" style={{ borderLeftColor: c }}>
              <div className="font-extrabold text-[12px] min-w-[58px]" style={{ color: c }}>{t}</div>
              <div><div className="text-[13px] font-bold text-[#1A1540]">{sub}</div><div className="text-[11px] text-[#7B789E]">{room}</div></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ── Student Profile ──────────────────────────────────────────────────────── */
export function StudentProfile({ user }) {
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
      <SectionHeader title="👤 My Profile" />
      <div className="grid grid-cols-[320px_1fr] gap-4.5">
        <div>
          <Card className="text-center !px-6 !py-8">
            <div className="w-[90px] h-[90px] gr-violet rounded-full flex items-center justify-center text-[36px] font-extrabold text-white mx-auto mb-3.5">
              {(profileUser.name || "Student").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div className="text-[19px] font-extrabold text-[#1A1540]">{profileUser.name}</div>
            <div className="text-[13.5px] text-[#7B789E] my-1">Roll No: {profileUser.rollNo || "N/A"}</div>
            <Tag color="violet">{profileUser.branch || "B.Tech CSE-AI"} · {profileUser.semester || "1st"} Semester</Tag>
            <div className="grid grid-cols-2 gap-2.5 mt-4.5">
              <div className="bg-[#F4F3FF] rounded-[10px] p-3">
                <div className="text-[20px] font-extrabold text-[#4F38C2]">{profileUser.gpa || "N/A"}</div>
                <div className="text-[11px] text-[#7B789E]">Current GPA</div>
              </div>
              <div className="bg-[#F4F3FF] rounded-[10px] p-3">
                <div className="text-[20px] font-extrabold text-[#10C98F]">{profileUser.attendance || 0}%</div>
                <div className="text-[11px] text-[#7B789E]">Attendance</div>
              </div>
            </div>
          </Card>
          <Card className="mt-3.5">
            <div className="text-[14px] font-extrabold text-[#1A1540] mb-3.5">Contact Info</div>
            {[["📧 Email", profileUser.email || "N/A"], ["📱 Phone", profileUser.phone || "N/A"], ["🏠 Address", profileUser.address || "N/A"], ["🎂 DOB", profileUser.dob || "N/A"]].map(([l,v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-[#E8E6F5] text-[13px]">
                <span className="text-[#7B789E]">{l}</span><span className="font-semibold text-[#1A1540]">{v}</span>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <Card className="mb-3.5">
            <div className="text-[15px] font-extrabold text-[#1A1540] mb-4">Academic Performance</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#E8E6F5" /><PolarAngleAxis dataKey="subject" tick={{ fontSize:12, fill:"#7B789E" }} />
                <Radar name="Performance" dataKey="A" stroke="#6C4EF5" fill="#6C4EF5" fillOpacity={0.18} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <div className="text-[15px] font-extrabold text-[#1A1540] mb-4">Academic Details</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[["Program", profileUser.branch || "B.Tech CSE-AI"], ["Class", profileUser.class || "N/A"], ["Semester", profileUser.semester || "1st"], ["Roll No", profileUser.rollNo || "N/A"]].map(([l,v]) => (
                <div key={l} className="bg-[#F4F3FF] rounded-[10px] p-3">
                  <div className="text-[11.5px] text-[#7B789E] mb-0.5">{l}</div>
                  <div className="text-[14px] font-bold text-[#1A1540]">{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── Student Attendance ───────────────────────────────────────────────────── */
export function StudentAttendance() {
  const subjects = [
    {s:"Artificial Intelligence",total:30,att:28,pct:93},{s:"Machine Learning",total:28,att:26,pct:93},
    {s:"Data Structures",total:32,att:28,pct:88},{s:"Database Systems",total:26,att:22,pct:85},
    {s:"Operating Systems",total:28,att:20,pct:71},
  ];
  return (
    <div>
      <SectionHeader title="My Attendance" sub="Track your presence across all subjects" />
      <div className="grid grid-cols-3 gap-3.5 mb-4.5">
        <StatCard icon="✅" label="Overall Attendance" value="92%"   gradientClass="gr-mint"   />
        <StatCard icon="📅" label="Classes Attended"   value="46/50" gradientClass="gr-violet" />
        <StatCard icon="⚠️" label="Absences"           value="4"    sub="Max: 12 allowed"  gradientClass="gr-amber"  />
      </div>
      <Card>
        <table className="w-full border-collapse">
          <TableHead cols={["Subject","Total Classes","Attended","Absent","Percentage","Status"]} />
          <tbody>
            {subjects.map((s,i) => (
              <tr key={i} className="border-b border-[#E8E6F5]">
                <td className="px-3.5 py-3 text-[14px] font-bold text-[#1A1540]">{s.s}</td>
                <td className="px-3.5 py-3 text-[13px] text-center">{s.total}</td>
                <td className="px-3.5 py-3 text-[13px] text-center font-bold text-[#10C98F]">{s.att}</td>
                <td className="px-3.5 py-3 text-[13px] text-center font-bold text-[#FF5757]">{s.total-s.att}</td>
                <td className="px-3.5 py-3 min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><ProgressBar value={s.pct} colorClass={s.pct>=75?"bg-[#10C98F]":"bg-[#FF5757]"} /></div>
                    <span className={`text-[12.5px] font-extrabold ${s.pct>=75?"text-[#10C98F]":"text-[#FF5757]"}`}>{s.pct}%</span>
                  </div>
                </td>
                <td className="px-3.5 py-3"><Tag color={s.pct>=75?"mint":"coral"}>{s.pct>=75?"Safe":"Low"}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── Student Tests ────────────────────────────────────────────────────────── */
export function StudentTests() {
  const [active, setActive] = useState(null);
  const [ans,    setAns]    = useState({});
  const [done,   setDone]   = useState(false);

  const qs = [
    { id:1, q:"Which activation function is used in output layer for binary classification?", opts:["ReLU","Sigmoid","Tanh","Softmax"],          correct:1 },
    { id:2, q:"Which algorithm trains neural networks through gradient descent?",              opts:["Backpropagation","Bubble Sort","Binary Search","DFS"], correct:0 },
    { id:3, q:"What does CNN stand for in deep learning?",                                     opts:["Computed Neural Net","Convolutional Neural Network","Connected Net","Circular NN"], correct:1 },
    { id:4, q:"Which layer is always the last in a neural network?",                           opts:["Hidden Layer","Input Layer","Output Layer","Dropout Layer"], correct:2 },
  ];

  if (active && !done) {
    return (
      <div>
        <SectionHeader title={`🧪 ${active.title}`} action={<Tag color="coral">⏱ 20:00 remaining</Tag>} />
        <Card>
          <div className="mb-4.5">
            <ProgressBar value={Object.keys(ans).length} max={qs.length} colorClass="bg-[#6C4EF5]" height="h-2" />
            <div className="text-[12.5px] text-[#7B789E] mt-1.5">{Object.keys(ans).length} of {qs.length} answered</div>
          </div>
          {qs.map((q,i) => (
            <div key={q.id} className={`mb-6 pb-6 ${i<qs.length-1?"border-b border-[#E8E6F5]":""}`}>
              <div className="text-[15px] font-bold text-[#1A1540] mb-3.5">Q{i+1}. {q.q}</div>
              <div className="grid grid-cols-2 gap-2">
                {q.opts.map((o,j) => (
                  <button key={j} onClick={() => setAns(p => ({...p,[q.id]:j}))}
                    className={`px-3.5 py-3 border-2 rounded-[10px] text-left text-[13.5px] cursor-pointer transition-all
                      ${ans[q.id]===j ? "border-[#6C4EF5] bg-[#6C4EF5]/[0.08] text-[#4F38C2] font-bold" : "border-[#E8E6F5] bg-white text-[#1A1540] font-normal hover:border-[#6C4EF5]"}`}>
                    {String.fromCharCode(65+j)}. {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => { setActive(null); setAns({}); }}>← Exit</Button>
            <Button variant="primary" size="lg" onClick={() => setDone(true)} disabled={Object.keys(ans).length < qs.length}>Submit Test →</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (done) {
    const score = qs.filter(q => ans[q.id] === q.correct).length;
    const pct   = Math.round(score/qs.length*100);
    return (
      <div>
        <SectionHeader title="Test Result" />
        <Card className="text-center !py-16 !px-8">
          <div className={`w-[100px] h-[100px] rounded-full flex items-center justify-center text-[46px] mx-auto mb-6 ${pct>=75?"gr-mint":"gr-coral"}`}>{pct>=75?"🏆":"📚"}</div>
          <div className="text-[48px] font-extrabold text-[#1A1540] mb-2">{score}/{qs.length}</div>
          <div className="text-[20px] text-[#7B789E] mb-5">{pct}% Score</div>
          <Tag color={pct>=60?"mint":"coral"}>{pct>=60?"Passed — Well Done!":"Needs Improvement"}</Tag>
          <div className="mt-7"><Button variant="ghost" onClick={() => { setActive(null); setDone(false); setAns({}); }}>← Back to Tests</Button></div>
        </Card>
      </div>
    );
  }

  const tests = [
    { title:"AI & Neural Networks Quiz",  sub:"AI",   qs:4,  dur:20, status:"available" },
    { title:"Data Structures Mid-Term",   sub:"DSA",  qs:30, dur:90, status:"upcoming", date:"Apr 12" },
    { title:"DBMS Unit Test — Completed", sub:"DBMS", qs:15, dur:45, status:"completed", score:"78%" },
  ];
  return (
    <div>
      <SectionHeader title="Online Tests & Exams" sub="Practice quizzes, unit tests, and major exams" />
      <div className="flex flex-col gap-3">
        {tests.map((t,i) => (
          <Card key={i} className={`border-l-4 ${t.status==="available"?"border-l-[#00C9A7]":t.status==="upcoming"?"border-l-[#F5A623]":"border-l-[#B8B5D4]"}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[15.5px] font-extrabold text-[#1A1540] mb-1.5">{t.title}</div>
                <div className="text-[13px] text-[#7B789E]">📚 {t.sub} · ❓ {t.qs} questions · ⏱ {t.dur} mins{t.date?` · 📅 ${t.date}`:""}</div>
              </div>
              <div className="flex gap-2 items-center">
                {t.score && <Tag color="mint">{t.score}</Tag>}
                <Tag color={t.status==="available"?"mint":t.status==="upcoming"?"amber":"gray"}>{t.status}</Tag>
                {t.status==="available" && <Button variant="primary" size="sm" onClick={() => setActive(t)}>Start →</Button>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Student Results ──────────────────────────────────────────────────────── */
export function StudentResults() {
  const tot = RESULTS.reduce((a,r) => a+r.total, 0);
  const max = RESULTS.reduce((a,r) => a+r.max, 0);
  const chartData = RESULTS.map(r => ({ sub:r.subject.split(" ")[0], pct:Math.round(r.total/r.max*100) }));
  return (
    <div>
      <SectionHeader title="Results & Grades" sub="Semester 7 academic results" action={<Button variant="ghost" size="sm">📥 Download Report Card</Button>} />
      <div className="grid grid-cols-3 gap-3.5 mb-4.5">
        <StatCard icon="⭐" label="Overall GPA"  value="8.7"          gradientClass="gr-amber"  />
        <StatCard icon="🏆" label="Total Score"  value={`${tot}/${max}`} sub={`${Math.round(tot/max*100)}%`} gradientClass="gr-mint" />
        <StatCard icon="📊" label="Class Rank"   value="#3"            sub="Out of 60" gradientClass="gr-violet" />
      </div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-3.5 mb-3.5">
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Subject-wise Results</div>
          <table className="w-full border-collapse">
            <TableHead cols={["Subject","Mid /50","End /100","Int /20","Total","Grade"]} />
            <tbody>
              {RESULTS.map((r,i) => (
                <tr key={i} className="border-b border-[#E8E6F5]">
                  <td className="px-3 py-3 text-[13.5px] font-bold text-[#1A1540]">{r.subject}</td>
                  <td className="px-3 py-3 text-[13px] text-center">{r.mid}</td>
                  <td className="px-3 py-3 text-[13px] text-center">{r.end}</td>
                  <td className="px-3 py-3 text-[13px] text-center">{r.int}</td>
                  <td className="px-3 py-3 font-extrabold text-[14px]">{r.total}</td>
                  <td className="px-3 py-3"><Tag color={r.grade.startsWith("A")?"mint":"violet"}>{r.grade}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Score Visualization</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="sub" tick={{ fontSize:11, fill:"#7B789E" }} />
              <YAxis domain={[0,100]} tick={{ fontSize:11, fill:"#7B789E" }} />
              <Tooltip formatter={v => `${v}%`} />
              <Bar dataKey="pct" radius={[6,6,0,0]}>
                {chartData.map((_,i) => <Cell key={i} fill={["#00C9A7","#6C4EF5","#38BDF8","#F5A623","#FF6B6B"][i%5]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ── Leaderboard ──────────────────────────────────────────────────────────── */
export function Leaderboard() {
  const sorted = [...STUDENTS].sort((a,b) => b.gpa-a.gpa);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div>
      <SectionHeader title="🏆 Class Leaderboard" sub="Rankings based on GPA, attendance & performance" />
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {sorted.slice(0,3).map((s,i) => (
          <Card key={s.id} className={`text-center !py-7 !px-5 border-2 ${i===0?"border-[#F5A623]":i===1?"border-[#B8B5D4]":"border-[#FF6B6B]"}`}>
            <div className="text-[42px] mb-2.5">{medals[i]}</div>
            <div className="flex justify-center">
              <Avatar name={s.name} size="xl" variant={i===0?"amber":i===1?"violet":"coral"} />
            </div>
            <div className="mt-2.5">
              <div className="text-[15px] font-extrabold text-[#1A1540]">{s.name}</div>
              <div className="text-[12.5px] text-[#7B789E] mb-2.5">{s.id} · {s.class}</div>
              <div className={`text-[26px] font-extrabold ${i===0?"text-[#C27A0A]":"text-[#4F38C2]"}`}>{s.gpa} GPA</div>
              <div className="text-[12px] text-[#7B789E]">Attendance: {s.att}%</div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <table className="w-full border-collapse">
          <TableHead cols={["Rank","Student","Roll No","Class","GPA","Attendance","Status"]} />
          <tbody>
            {sorted.map((s,i) => (
              <tr key={s.id} className={`border-b border-[#E8E6F5] ${i<3?"bg-[rgba(108,78,245,0.03)]":""}`}>
                <td className={`px-3.5 py-3 font-extrabold text-[17px] ${i===0?"text-[#C27A0A]":i===1?"text-[#4F38C2]":i===2?"text-[#FF6B6B]":"text-[#7B789E]"}`}>
                  {medals[i]||`#${i+1}`}
                </td>
                <td className="px-3.5 py-3"><div className="flex items-center gap-2.5"><Avatar name={s.name} size="sm" /><span className="text-[14px] font-bold text-[#1A1540]">{s.name}</span></div></td>
                <td className="px-3.5 py-3 text-[13px] text-[#7B789E] font-bold">{s.id}</td>
                <td className="px-3.5 py-3 text-[13px] text-[#7B789E]">{s.class}</td>
                <td className="px-3.5 py-3 font-extrabold text-[16px] text-[#4F38C2]">{s.gpa}</td>
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20"><ProgressBar value={s.att} colorClass={s.att>=75?"bg-[#10C98F]":"bg-[#FF5757]"} /></div>
                    <span className={`text-[12.5px] font-bold ${s.att>=75?"text-[#10C98F]":"text-[#FF5757]"}`}>{s.att}%</span>
                  </div>
                </td>
                <td className="px-3.5 py-3"><Tag color={s.att>=75&&s.gpa>=8?"mint":s.gpa>=7?"violet":"coral"}>{s.att>=75&&s.gpa>=8?"Excellent":s.gpa>=7?"Good":"Needs Help"}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}