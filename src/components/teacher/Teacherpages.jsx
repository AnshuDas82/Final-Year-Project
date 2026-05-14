import { useState, useRef, useEffect } from "react";
import { Avatar, Tag, Card, SectionHeader, Button, Input, TableHead, ProgressBar, StatCard } from "../shared/Primitives";
import { STUDENTS, GRADEBOOK, ASSIGNMENTS, MATERIALS, ATTENDANCE_CHART, PERF_CHART, RADAR_DATA } from "../../data/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

/* ── Teacher Dashboard ────────────────────────────────────────────────────── */
export function TeacherOverview({ user }) {
  return (
    <div>
      <SectionHeader title={`Welcome, ${user.name.split(" ")[1]||user.name} 👋`} sub="Here's your teaching summary for today" />
      <div className="grid grid-cols-4 gap-3.5 mb-5">
        <StatCard icon="👨‍🎓" label="Total Students" value="145"  sub="3 Classes"          gradientClass="gr-violet" />
        <StatCard icon="📝"   label="Assignments"    value="24"   sub="6 pending review"   gradientClass="gr-amber"  />
        <StatCard icon="🧪"   label="Exams Held"     value="8"    sub="This semester"       gradientClass="gr-coral"  />
        <StatCard icon="⭐"   label="Avg Rating"     value="4.8"  sub="Student feedback"    gradientClass="gr-mint"   />
      </div>
      <div className="grid grid-cols-[1.3fr_1fr] gap-3.5">
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Recent Submissions</div>
          {[{n:"Anshu Kumar Das",a:"Neural Network Implementation",st:"Submitted",g:"Pending"},
            {n:"Devanshu Raj",a:"CNN Architecture Report",st:"Submitted",g:"A"},
            {n:"SatyaPrakash Verma",a:"Neural Network Impl.",st:"Late",g:"B+"},
            {n:"Priya Singh",a:"SQL Query Optimization",st:"Submitted",g:"A+"}
          ].map((s,i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#E8E6F5]">
              <div className="flex items-center gap-2.5">
                <Avatar name={s.n} size="sm" />
                <div>
                  <div className="text-[13.5px] font-bold text-[#1A1540]">{s.n}</div>
                  <div className="text-[11.5px] text-[#7B789E]">{s.a}</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Tag color={s.st==="Late"?"warning":"mint"}>{s.st}</Tag>
                <Tag color={s.g==="Pending"?"gray":"violet"}>{s.g}</Tag>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Today's Schedule</div>
          {[{t:"9:00 AM",sub:"AI — Room CS-201",type:"Lecture"},{t:"11:00 AM",sub:"DSA Lab — Lab 3",type:"Lab"},{t:"2:00 PM",sub:"ML — Room CS-202",type:"Lecture"}].map((s,i) => (
            <div key={i} className="flex gap-3 px-3 py-2.5 bg-[#F4F3FF] rounded-[10px] mb-2 items-center">
              <div className="font-extrabold text-[12.5px] text-[#4F38C2] min-w-[62px]">{s.t}</div>
              <div className="flex-1 text-[13.5px] font-bold text-[#1A1540]">{s.sub}</div>
              <Tag color={s.type==="Lab"?"amber":"violet"}>{s.type}</Tag>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ── Attendance Mark ──────────────────────────────────────────────────────── */
export function AttendanceMark() {
  const [marked, setMarked] = useState({});
  const [done,   setDone]   = useState(false);
  const toggle = id => setMarked(p => ({...p, [id]: !p[id]}));
  const pres   = Object.values(marked).filter(Boolean).length;
  return (
    <div>
      <SectionHeader title="Mark Attendance" sub="B.Tech CSE-AI · 7th Sem · Artificial Intelligence" action={<Tag color="violet">{new Date().toDateString()}</Tag>} />
      <Card className="mb-3.5">
        <div className="flex justify-between items-center flex-wrap gap-2.5">
          <div className="flex gap-3.5 text-[13.5px]">
            <span className="text-[#10C98F] font-bold">✅ Present: {pres}</span>
            <span className="text-[#FF5757] font-bold">❌ Absent: {STUDENTS.length - pres}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setMarked(Object.fromEntries(STUDENTS.map(s=>[s.id,true])))}>Mark All Present</Button>
            <Button variant="mint" size="sm" onClick={() => setDone(true)} disabled={done}>{done ? "✓ Submitted" : "Submit Attendance"}</Button>
          </div>
        </div>
        {done && <div className="bg-[#D1FAF0] text-[#064E3B] px-3.5 py-3 rounded-[10px] mt-3.5 font-bold text-[13.5px]">✓ Attendance saved — {pres} present, {STUDENTS.length-pres} absent</div>}
      </Card>
      <div className="grid grid-cols-3 gap-2.5">
        {STUDENTS.map(s => (
          <div key={s.id} onClick={() => !done && toggle(s.id)}
            className={`flex items-center gap-2.5 px-3.5 py-3 border-2 rounded-xl transition-all ${done?"cursor-default":"cursor-pointer"} ${marked[s.id] ? "border-[#10C98F] bg-[#D1FAF0]" : "border-[#E8E6F5] bg-white"}`}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-white text-[13px] flex-shrink-0 transition-all ${marked[s.id] ? "border-[#10C98F] bg-[#10C98F]" : "border-[#E8E6F5] bg-transparent"}`}>
              {marked[s.id] ? "✓" : ""}
            </div>
            <Avatar name={s.name} size="sm" />
            <div><div className="text-[13.5px] font-bold text-[#1A1540]">{s.name}</div><div className="text-[11px] text-[#7B789E]">{s.id}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Gradebook ────────────────────────────────────────────────────────────── */
export function Gradebook() {
  const gradeColor = { "A":"mint","A+":"mint","A-":"cyan","B+":"violet","B":"amber" };
  return (
    <div>
      <SectionHeader title="📒 Gradebook" sub="Subject-wise marks & grades for all students" action={<Button variant="ghost" size="sm">Export Excel</Button>} />
      <Card>
        <table className="w-full border-collapse">
          <TableHead cols={["Student","AI /100","ML /100","DSA /100","DBMS /100","OS /100","Total /500","Grade"]} />
          <tbody>
            {GRADEBOOK.map((g,i) => (
              <tr key={i} className="border-b border-[#E8E6F5]">
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-2.5"><Avatar name={g.student} size="sm" /><span className="text-[13.5px] font-bold text-[#1A1540]">{g.student}</span></div>
                </td>
                {[g.AI,g.ML,g.DSA,g.DBMS,g.OS].map((v,j) => (
                  <td key={j} className={`px-3.5 py-3 text-center font-bold text-[14px] ${v>=85?"text-[#10C98F]":v>=75?"text-[#4F38C2]":"text-[#FFAA00]"}`}>{v}</td>
                ))}
                <td className="px-3.5 py-3 font-extrabold text-[15px] text-[#1A1540]">{g.total}</td>
                <td className="px-3.5 py-3"><Tag color={gradeColor[g.grade]||"violet"}>{g.grade}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── Teacher Assignments ──────────────────────────────────────────────────── */
export function TeacherAssignments() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <SectionHeader title="Assignments" sub="Manage and grade student assignments" action={<Button variant="primary" size="sm" onClick={() => setShow(!show)}>+ New Assignment</Button>} />
      {show && (
        <Card className="mb-3.5 border-l-4 border-l-[#6C4EF5]">
          <div className="text-[15px] font-extrabold text-[#1A1540] mb-3.5">Create New Assignment</div>
          <div className="grid grid-cols-2 gap-2.5">
            <Input label="Title" value="" onChange={() => {}} placeholder="Assignment title" />
            <Input label="Due Date" type="date" value="" onChange={() => {}} />
          </div>
          <div className="mb-3.5">
            <label className="block text-[12.5px] font-bold text-[#1A1540] mb-1.5">Description</label>
            <textarea rows={3} className="w-full px-3.5 py-2.5 border-[1.5px] border-[#E8E6F5] rounded-[10px] text-[13.5px] resize-y outline-none focus:border-[#6C4EF5] transition-colors" placeholder="Assignment instructions..." />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => setShow(false)}>Create</Button>
            <Button variant="ghost"   size="sm" onClick={() => setShow(false)}>Cancel</Button>
          </div>
        </Card>
      )}
      <div className="flex flex-col gap-2.5">
        {ASSIGNMENTS.map(a => (
          <Card key={a.id}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[15.5px] font-extrabold text-[#1A1540] mb-1.5">{a.title}</div>
                <div className="text-[13px] text-[#7B789E]">📚 {a.subject} · 📅 Due: {a.due}</div>
              </div>
              <Tag color={a.status==="graded"?"mint":a.status==="active"?"violet":"amber"}>{a.status}</Tag>
            </div>
            <div className="mt-3.5">
              <div className="flex justify-between text-[12.5px] text-[#7B789E] mb-1">
                <span>Submissions</span><span className="font-bold text-[#1A1540]">{a.subs}/{a.total}</span>
              </div>
              <ProgressBar value={a.subs} max={a.total} colorClass="bg-[#6C4EF5]" />
            </div>
            <div className="flex gap-2 mt-3.5">
              <Button variant="ghost" size="sm">View Submissions</Button>
              <Button variant="primary" size="sm">Grade</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function MaterialsView({ role }) {
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
      <SectionHeader title="Study Materials" sub="Lecture notes, slides, and reference materials" action={
        <div className="flex gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 Search..." className="px-3 py-2 border-[1.5px] border-[#E8E6F5] rounded-[10px] text-[13px] outline-none focus:border-[#6C4EF5] w-48 transition-colors" />
          {role==="teacher" && <Button variant="primary" size="sm" onClick={() => setShow(!show)}>+ Upload</Button>}
        </div>
      } />
      
      {show && role === "teacher" && (
        <Card className="mb-3.5 border-l-4 border-l-[#6C4EF5]">
          <div className="text-[15px] font-extrabold text-[#1A1540] mb-3.5">Upload New Material</div>
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <Input label="Title" value={newMaterial.title} onChange={(val) => setNewMaterial({...newMaterial, title: val})} placeholder="Material title" />
            <Input label="Subject" value={newMaterial.subject} onChange={(val) => setNewMaterial({...newMaterial, subject: val})} placeholder="e.g. Mathematics" />
          </div>
          <div className="mb-2.5">
            <Input label="File URL / Link" value={newMaterial.fileUrl} onChange={(val) => setNewMaterial({...newMaterial, fileUrl: val})} placeholder="https://..." />
          </div>
          <div className="mb-3.5">
            <label className="block text-[12.5px] font-bold text-[#1A1540] mb-1.5">Description</label>
            <textarea value={newMaterial.description} onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})} rows={3} className="w-full px-3.5 py-2.5 border-[1.5px] border-[#E8E6F5] rounded-[10px] text-[13.5px] resize-y outline-none focus:border-[#6C4EF5] transition-colors" placeholder="Material description..." />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleUpload}>Upload</Button>
            <Button variant="ghost"   size="sm" onClick={() => setShow(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-10 text-[#7B789E]">Loading materials...</div>
      ) : list.length === 0 ? (
        <Card className="text-center py-10 text-[#7B789E]">No materials found.</Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {list.map(m => {
             const mType = m.fileUrl?.endsWith(".pdf") ? "PDF" : m.fileUrl?.endsWith(".ppt") ? "PPT" : "URL";
             return (
               <Card key={m._id} className="!p-4">
                 <div className="flex items-center gap-3.5">
                   <div className="w-[50px] h-[56px] rounded-[10px] flex items-center justify-center text-[26px] flex-shrink-0" style={{ background: typeBg[mType]||"#F4F3FF" }}>📄</div>
                   <div className="flex-1">
                     <div className="text-[14.5px] font-bold text-[#1A1540]">{m.title}</div>
                     <div className="text-[12.5px] text-[#7B789E] mt-0.5">{m.subject} · Uploaded on {new Date(m.createdAt).toLocaleDateString()}</div>
                     <div className="text-[12px] text-[#7B789E] mt-1">{m.description}</div>
                   </div>
                   <div className="flex gap-2 items-center flex-col md:flex-row">
                     <Tag color={typeColors[mType]||"gray"}>{mType}</Tag>
                     {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noreferrer" className="text-[12.5px] font-bold text-[#6C4EF5] hover:underline px-3 py-1.5 border border-[#6C4EF5] rounded-[8px]">View/Download</a>}
                     {role === "teacher" && (
                       <Button variant="ghost" size="sm" onClick={() => handleDelete(m._id)}><span className="text-[#FF5757]">Delete</span></Button>
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

/* ── Performance View ─────────────────────────────────────────────────────── */
export function PerformanceView() {
  return (
    <div>
      <SectionHeader title="Student Performance Analytics" sub="Data-driven insights for your classes" />
      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Subject Performance (%)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PERF_CHART} layout="vertical" barSize={18}>
              <XAxis type="number" domain={[60,100]} tick={{ fontSize:11, fill:"#7B789E" }} />
              <YAxis type="category" dataKey="sub" tick={{ fontSize:12, fill:"#7B789E" }} width={36} />
              <Tooltip />
              <Bar dataKey="score" radius={[0,6,6,0]}>
                {PERF_CHART.map((_,i) => <Cell key={i} fill={["#6C4EF5","#FF6B6B","#00C9A7","#F5A623","#38BDF8","#8A70FF"][i%6]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Attendance Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ATTENDANCE_CHART}>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#7B789E" }} />
              <YAxis tick={{ fontSize:11, fill:"#7B789E" }} />
              <Tooltip />
              <Area type="monotone" dataKey="present" stroke="#00C9A7" fill="rgba(0,201,167,0.13)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="absent"  stroke="#FF6B6B" fill="rgba(255,107,107,0.13)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Student Rankings</div>
        <table className="w-full border-collapse">
          <TableHead cols={["Rank","Student","GPA","Attendance","Performance","Status"]} />
          <tbody>
            {[...STUDENTS].sort((a,b) => b.gpa-a.gpa).map((s,i) => (
              <tr key={s.id} className="border-b border-[#E8E6F5]">
                <td className={`px-3.5 py-3 font-extrabold text-[18px] ${i===0?"text-[#C27A0A]":i===1?"text-[#4F38C2]":i===2?"text-[#FF6B6B]":"text-[#7B789E]"}`}>
                  {["🥇","🥈","🥉"][i]||`#${i+1}`}
                </td>
                <td className="px-3.5 py-3"><div className="flex items-center gap-2.5"><Avatar name={s.name} size="sm" /><span className="text-[13.5px] font-bold text-[#1A1540]">{s.name}</span></div></td>
                <td className="px-3.5 py-3 font-extrabold text-[16px] text-[#4F38C2]">{s.gpa}</td>
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[70px]"><ProgressBar value={s.att} colorClass={s.att>=75?"bg-[#10C98F]":"bg-[#FF5757]"} /></div>
                    <span className={`text-[12.5px] font-bold ${s.att>=75?"text-[#10C98F]":"text-[#FF5757]"}`}>{s.att}%</span>
                  </div>
                </td>
                <td className="px-3.5 py-3 w-28"><ProgressBar value={s.gpa*10} max={100} colorClass="bg-[#6C4EF5]" height="h-2" /></td>
                <td className="px-3.5 py-3"><Tag color={s.att>=75&&s.gpa>=8?"mint":s.gpa>=7?"violet":"coral"}>{s.att>=75&&s.gpa>=8?"Excellent":s.gpa>=7?"Good":"At Risk"}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── Online Tests ─────────────────────────────────────────────────────────── */
export function OnlineTests() {
  const [show, setShow] = useState(false);
  const tests = [
    { title:"Mid-Term: Artificial Intelligence", class:"7th Sem CSE-AI", date:"Apr 12, 2025", dur:90, qs:30, status:"upcoming"  },
    { title:"Unit Test: Data Structures",        class:"5th Sem CSE",   date:"Apr 05, 2025", dur:45, qs:15, status:"completed" },
    { title:"Quiz: Machine Learning",            class:"7th Sem CSE-AI", date:"Apr 18, 2025", dur:30, qs:10, status:"upcoming"  },
  ];
  return (
    <div>
      <SectionHeader title="Online Tests" sub="Create, schedule, and review exams" action={<Button variant="primary" size="sm" onClick={() => setShow(!show)}>+ Create Test</Button>} />
      {show && (
        <Card className="mb-3.5 border-l-4 border-l-[#6C4EF5]">
          <div className="text-[15px] font-extrabold text-[#1A1540] mb-3.5">Configure New Test</div>
          <div className="grid grid-cols-3 gap-2.5">
            <Input label="Test Title" value="" onChange={() => {}} placeholder="Test name" />
            <Input label="Date & Time" type="datetime-local" value="" onChange={() => {}} />
            <Input label="Duration (mins)" type="number" value="" onChange={() => {}} placeholder="60" />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => setShow(false)}>Create Test</Button>
            <Button variant="ghost"   size="sm" onClick={() => setShow(false)}>Cancel</Button>
          </div>
        </Card>
      )}
      <div className="flex flex-col gap-2.5">
        {tests.map((t,i) => (
          <Card key={i}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[15.5px] font-extrabold text-[#1A1540] mb-1.5">{t.title}</div>
                <div className="text-[13px] text-[#7B789E]">👥 {t.class} · 📅 {t.date} · ⏱ {t.dur} mins · ❓ {t.qs} questions</div>
              </div>
              <Tag color={t.status==="completed"?"mint":"violet"}>{t.status}</Tag>
            </div>
            <div className="flex gap-2 mt-3">
              {t.status==="completed" && <Button variant="ghost" size="sm">View Results</Button>}
              <Button variant="ghost" size="sm">Preview</Button>
              <Button variant="primary" size="sm">Manage</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── AI Lesson Planner ────────────────────────────────────────────────────── */
export function LessonPlanner() {
  const [topic,    setTopic]    = useState("");
  const [subject,  setSubject]  = useState("");
  const [duration, setDuration] = useState("60");
  const [level,    setLevel]    = useState("undergraduate");
  const [plan,     setPlan]     = useState("");
  const [loading,  setLoading]  = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setPlan("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:`Create a detailed ${duration}-minute lesson plan for:\nTopic: ${topic}\nSubject: ${subject||"Computer Science"}\nLevel: ${level} B.Tech engineering students\n\nInclude:\n🎯 Learning Objectives (3-4 points)\n📋 Prerequisites\n🗒️ Lesson Outline with time allocations\n💡 Teaching Methods & Activities\n📊 Assessment Strategy\n📚 Resources Needed\n🏠 Homework Assignment\n\nMake it practical, engaging, and well-structured.`}]
        })
      });
      const d = await res.json();
      setPlan(d.content?.map(c=>c.text||"").join("")||"Could not generate plan.");
    } catch { setPlan("⚠️ Connection error. Please try again."); }
    setLoading(false);
  };

  const quickTopics = ["Neural Networks","Binary Search Trees","SQL Joins","Operating Systems","Machine Learning","Computer Networks"];

  return (
    <div>
      <SectionHeader title="🤖 AI Lesson Planner" sub="Generate detailed, structured lesson plans instantly" action={<Tag color="violet">Powered by Claude AI</Tag>} />
      <div className="grid grid-cols-[1fr_1.4fr] gap-3.5">
        <div>
          <Card>
            <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-4">Configure Lesson</div>
            <Input label="Topic / Chapter" value={topic} onChange={setTopic} placeholder="e.g., Neural Networks, Binary Trees..." />
            <Input label="Subject" value={subject} onChange={setSubject} placeholder="e.g., Artificial Intelligence" />
            <div className="grid grid-cols-2 gap-2.5">
              <Input label="Duration (mins)" value={duration} onChange={setDuration} type="number" />
              <div className="mb-3.5">
                <label className="block text-[12.5px] font-bold text-[#1A1540] mb-1.5">Level</label>
                <select value={level} onChange={e=>setLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-[#E8E6F5] rounded-[10px] text-[13.5px] outline-none focus:border-[#6C4EF5]">
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="diploma">Diploma</option>
                </select>
              </div>
            </div>
            <button onClick={generate} disabled={loading||!topic.trim()}
              className={`w-full py-3.5 rounded-xl text-[14px] font-extrabold border-0 transition-opacity ${loading||!topic.trim() ? "bg-[#E8E6F5] text-[#7B789E] cursor-not-allowed" : "gr-violet text-white cursor-pointer hover:opacity-90"}`}>
              {loading ? "⏳ Generating..." : "🤖 Generate Lesson Plan"}
            </button>
          </Card>
          <Card className="mt-3.5">
            <div className="text-[13px] font-extrabold text-[#7B789E] mb-2.5 uppercase tracking-wider">Quick Topics</div>
            <div className="flex flex-wrap gap-1.5">
              {quickTopics.map(t => (
                <button key={t} onClick={() => setTopic(t)} className="px-3 py-1.5 border-[1.5px] border-[#E8E6F5] rounded-full bg-[#F4F3FF] text-[12.5px] cursor-pointer text-[#1A1540] font-medium hover:border-[#6C4EF5] transition-colors">{t}</button>
              ))}
            </div>
          </Card>
        </div>
        <Card className="flex flex-col min-h-[460px]">
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Generated Plan</div>
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-[70px] h-[70px] gr-violet rounded-full flex items-center justify-center text-[32px]">🤖</div>
              <div className="text-[15px] text-[#7B789E] font-semibold">Crafting your lesson plan...</div>
              <div className="w-[200px] h-1.5 bg-[#E8E6F5] rounded-full overflow-hidden">
                <div className="w-2/3 h-full gr-violet rounded-full" />
              </div>
            </div>
          ) : plan ? (
            <>
              <div className="flex-1 whitespace-pre-wrap text-[13.5px] leading-[1.85] text-[#1A1540] overflow-y-auto max-h-[390px]">{plan}</div>
              <div className="flex gap-1.5 mt-3.5 pt-3.5 border-t border-[#E8E6F5]">
                <Button variant="ghost" size="sm">📋 Copy</Button>
                <Button variant="ghost" size="sm">📥 Save as PDF</Button>
                <Button variant="ghost" size="sm" onClick={() => setPlan("")}>🔄 Clear</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#B8B5D4]">
              <div className="text-[56px]">📋</div>
              <div className="text-[15px] font-semibold">Enter a topic and click Generate</div>
              <div className="text-[12.5px]">AI will create a complete structured lesson plan</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ── Question Generator ───────────────────────────────────────────────────── */
export function QuestionGen() {
  const [topic,   setTopic]   = useState("");
  const [type,    setType]    = useState("mcq");
  const [count,   setCount]   = useState("5");
  const [qs,      setQs]      = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setQs("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:`Generate ${count} ${type==="mcq"?"Multiple Choice Questions (4 options each, mark correct with ✓)":type==="short"?"Short Answer Questions":"True/False Questions"} on the topic: "${topic}" for B.Tech CSE undergraduate students. Number them clearly and format nicely.`}]
        })
      });
      const d = await res.json();
      setQs(d.content?.map(c=>c.text||"").join("")||"Could not generate questions.");
    } catch { setQs("⚠️ Error. Please try again."); }
    setLoading(false);
  };

  return (
    <div>
      <SectionHeader title="❓ Auto Question Generator" sub="AI-powered question bank creation" action={<Tag color="amber">AI Powered</Tag>} />
      <div className="grid grid-cols-[1fr_1.4fr] gap-3.5">
        <Card>
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-4">Configure</div>
          <Input label="Topic" value={topic} onChange={setTopic} placeholder="e.g., Backpropagation, Sorting..." />
          <div className="mb-3.5">
            <label className="block text-[12.5px] font-bold text-[#1A1540] mb-1.5">Question Type</label>
            <div className="flex gap-2">
              {[["mcq","MCQ"],["short","Short Answer"],["tf","True/False"]].map(([v,l]) => (
                <button key={v} onClick={() => setType(v)}
                  className={`flex-1 py-2.5 rounded-[10px] border-2 text-[12.5px] font-bold cursor-pointer transition-all ${type===v ? "border-[#F5A623] bg-[#F5A623]/10 text-[#C27A0A]" : "border-[#E8E6F5] bg-transparent text-[#1A1540] font-medium"}`}>{l}</button>
              ))}
            </div>
          </div>
          <Input label="Number of Questions" value={count} onChange={setCount} type="number" />
          <button onClick={generate} disabled={loading||!topic.trim()}
            className={`w-full py-3.5 rounded-xl text-[14px] font-extrabold border-0 transition-opacity ${loading||!topic.trim() ? "bg-[#E8E6F5] text-[#7B789E] cursor-not-allowed" : "gr-amber text-[#0D0B26] cursor-pointer hover:opacity-90"}`}>
            {loading ? "⏳ Generating..." : "❓ Generate Questions"}
          </button>
        </Card>
        <Card className="min-h-[320px] flex flex-col">
          <div className="text-[14.5px] font-extrabold text-[#1A1540] mb-3.5">Generated Questions</div>
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3.5"><div className="text-[50px]">🧪</div><div className="text-[14px] text-[#7B789E] font-semibold">Generating questions...</div></div>
          ) : qs ? (
            <>
              <div className="flex-1 whitespace-pre-wrap text-[13.5px] leading-[1.85] text-[#1A1540] overflow-y-auto max-h-[360px]">{qs}</div>
              <div className="flex gap-1.5 mt-3 pt-3 border-t border-[#E8E6F5]">
                <Button variant="ghost" size="sm">📋 Copy</Button>
                <Button variant="amber" size="sm">📤 Add to Test</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#B8B5D4]">
              <div className="text-[52px]">❓</div>
              <div className="text-[14px] font-semibold">Enter a topic to generate questions</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ── AI Chat ──────────────────────────────────────────────────────────────── */
export function AIChat({ user }) {
  const isTeacher = user.role === "teacher";
  const [msgs,    setMsgs]    = useState([{ role:"assistant", content:`Hi ${user.name.split(" ")[0]}! 👋 I'm your AI ${isTeacher?"teaching":"learning"} assistant. Ask me anything about your coursework, get code examples, solve problems, or explore any CS topic! 🎓` }]);
  const [inp,     setInp]     = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);

  const send = async () => {
    if (!inp.trim() || loading) return;
    const text = inp.trim(); setInp("");
    setMsgs(p => [...p, { role:"user", content:text }]);
    setLoading(true);
    try {
      const history = msgs.map(m => ({ role:m.role, content:m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`You are an expert AI academic assistant for ${user.name}, a ${user.role} at Motihari College of Engineering (B.Tech CSE-AI). Be helpful, concise, and educational. Focus on: AI, ML, Data Structures, DBMS, OS, Networks, Algorithms. Use examples and code snippets where helpful.`,
          messages:[...history, { role:"user", content:text }]
        })
      });
      const d = await res.json();
      setMsgs(p => [...p, { role:"assistant", content:d.content?.map(c=>c.text||"").join("")||"Sorry, try again." }]);
    } catch { setMsgs(p => [...p, { role:"assistant", content:"⚠️ Connection issue. Please try again." }]); }
    setLoading(false);
  };

  const suggs = isTeacher
    ? ["Generate quiz on backpropagation","Create rubric for AI assignment","Explain transformer architecture","Design a lesson on recursion"]
    : ["Explain neural networks simply","What is recursion with example?","Help me with SQL queries","Explain Big O notation"];

  return (
    <div>
      <SectionHeader title={isTeacher ? "🤖 AI Teaching Assistant" : "🤖 AI Learning Assistant"} sub="Powered by Claude AI — Ask anything about your coursework" action={<Tag color="mint">● Online</Tag>} />
      <div className="grid grid-cols-[1fr_260px] gap-3.5">
        <Card className="!p-0 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: 480 }}>
          {/* Chat header */}
          <div className="px-5 py-3.5 gr-ink flex items-center gap-3">
            <div className="w-[38px] h-[38px] gr-amber rounded-full flex items-center justify-center text-[20px]">🤖</div>
            <div>
              <div className="text-white font-extrabold text-[14px]">EduAI Assistant</div>
              <div className="text-[#FFCA6B] text-[11.5px]">Always learning, always helping</div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#00C9A7] rounded-full" />
              <span className="text-[#6EE7D4] text-[12px]">Online</span>
            </div>
          </div>
          {/* Messages */}
          <div ref={ref} className="flex-1 overflow-y-auto px-4.5 py-4 flex flex-col gap-3 bg-[#F4F3FF]">
            {msgs.map((m,i) => (
              <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"} gap-2`}>
                {m.role==="assistant" && <div className="w-7 h-7 gr-violet rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🤖</div>}
                <div className={`max-w-[76%] px-3.5 py-3 text-[13.5px] leading-[1.75] whitespace-pre-wrap shadow-sm
                  ${m.role==="user" ? "gr-violet text-white rounded-[16px_16px_3px_16px]" : "bg-white text-[#1A1540] rounded-[16px_16px_16px_3px]"}`}>
                  {m.content}
                </div>
                {m.role==="user" && <Avatar name={user.name} size="sm" variant="amber" />}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 gr-violet rounded-full flex items-center justify-center text-sm">🤖</div>
                <div className="bg-white px-3.5 py-3 rounded-[16px_16px_16px_3px] text-[13.5px] text-[#7B789E] shadow-sm">Thinking...</div>
              </div>
            )}
          </div>
          {/* Input */}
          <div className="px-4 py-3 border-t border-[#E8E6F5] flex gap-2.5 bg-white">
            <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key==="Enter"&&!e.shiftKey&&send()}
              placeholder="Ask anything about your coursework..."
              className="flex-1 px-4 py-2.5 border-[1.5px] border-[#E8E6F5] rounded-3xl text-[13.5px] outline-none focus:border-[#6C4EF5] transition-colors" />
            <button onClick={send} disabled={loading||!inp.trim()}
              className={`w-11 h-11 rounded-full border-0 cursor-pointer text-[18px] flex items-center justify-center text-white transition-opacity ${loading||!inp.trim() ? "bg-[#E8E6F5] cursor-not-allowed" : "gr-violet hover:opacity-90"}`}>➤</button>
          </div>
        </Card>
        <div>
          <Card className="mb-2.5">
            <div className="text-[13px] font-extrabold text-[#1A1540] mb-2.5">Quick Questions</div>
            {suggs.map((s,i) => (
              <button key={i} onClick={() => setInp(s)} className="w-full text-left px-2.5 py-2 mb-1.5 border-[1.5px] border-[#E8E6F5] rounded-lg bg-[#F4F3FF] text-[12.5px] text-[#1A1540] cursor-pointer leading-[1.45] font-medium hover:border-[#6C4EF5] transition-colors">{s}</button>
            ))}
          </Card>
          <Card>
            <div className="text-[13px] font-extrabold text-[#1A1540] mb-2.5">Capabilities</div>
            {["📖 Explain any concept","💻 Write code examples","❓ Practice questions","📊 Study strategies","🔍 Topic summaries","🧮 Solve problems"].map((c,i) => (
              <div key={i} className="text-[12.5px] text-[#7B789E] mb-1.5">{c}</div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}