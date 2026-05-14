// ─── Users ───────────────────────────────────────────────────────────────────
export const USERS = [
  { id:1, email:"admin@mce.edu",   password:"admin123",   role:"admin",   name:"Dr. S.K. Sharma",   dept:"Administration" },
  { id:2, email:"teacher@mce.edu", password:"teacher123", role:"teacher", name:"Prof. Juhi Kumari", dept:"CSE-AI" },
  { id:3, email:"student@mce.edu", password:"student123", role:"student", name:"Anshu Kumar Das",   dept:"CSE-AI", rollNo:"22510", semester:"7th" },
];

// ─── Students ─────────────────────────────────────────────────────────────────
export const STUDENTS = [
  { id:"22510", name:"Anshu Kumar Das",    class:"B.Tech CSE-AI", sem:"7th", att:92, gpa:8.7, fee:"Paid",    rank:3 },
  { id:"22526", name:"Devanshu Raj",       class:"B.Tech CSE-AI", sem:"7th", att:87, gpa:8.2, fee:"Paid",    rank:5 },
  { id:"22529", name:"SatyaPrakash Verma", class:"B.Tech CSE-AI", sem:"7th", att:95, gpa:9.1, fee:"Paid",    rank:1 },
  { id:"22533", name:"Ritesh Kumar",       class:"B.Tech CSE-AI", sem:"7th", att:78, gpa:7.8, fee:"Pending", rank:7 },
  { id:"22541", name:"Priya Singh",        class:"B.Tech CSE",    sem:"5th", att:91, gpa:8.5, fee:"Paid",    rank:4 },
  { id:"22545", name:"Rohit Sharma",       class:"B.Tech CSE",    sem:"5th", att:65, gpa:6.9, fee:"Overdue", rank:12 },
  { id:"22551", name:"Neha Gupta",         class:"B.Tech IT",     sem:"3rd", att:88, gpa:8.0, fee:"Paid",    rank:6 },
  { id:"22558", name:"Vikram Yadav",       class:"B.Tech IT",     sem:"3rd", att:72, gpa:7.2, fee:"Pending", rank:10 },
];

// ─── Teachers ─────────────────────────────────────────────────────────────────
export const TEACHERS = [
  { id:"T001", name:"Prof. Juhi Kumari", subject:"Artificial Intelligence", dept:"CSE-AI", exp:"8 yrs",  rating:4.8, students:120 },
  { id:"T002", name:"Dr. Ramesh Gupta",  subject:"Data Structures",         dept:"CSE",    exp:"12 yrs", rating:4.6, students:180 },
  { id:"T003", name:"Prof. Anita Sinha", subject:"Machine Learning",        dept:"CSE-AI", exp:"6 yrs",  rating:4.9, students:80  },
  { id:"T004", name:"Dr. Vijay Kumar",   subject:"Database Systems",        dept:"CSE",    exp:"15 yrs", rating:4.5, students:140 },
];

// ─── Charts ───────────────────────────────────────────────────────────────────
export const ATTENDANCE_CHART = [
  { month:"Jan", present:92, absent:8  }, { month:"Feb", present:88, absent:12 },
  { month:"Mar", present:95, absent:5  }, { month:"Apr", present:90, absent:10 },
  { month:"May", present:93, absent:7  }, { month:"Jun", present:86, absent:14 },
];

export const PERF_CHART = [
  { sub:"AI", score:87 }, { sub:"ML", score:85 }, { sub:"DSA", score:92 },
  { sub:"DBMS", score:78 }, { sub:"OS", score:88 }, { sub:"CN", score:82 },
];

export const DEPT_CHART = [
  { dept:"CSE-AI", avg:88, students:240 }, { dept:"CSE", avg:83, students:320 },
  { dept:"IT", avg:80, students:180 },     { dept:"ECE", avg:85, students:210 },
];

export const RADAR_DATA = [
  { subject:"Assignments", A:88, fullMark:100 }, { subject:"Attendance", A:92, fullMark:100 },
  { subject:"Tests",       A:85, fullMark:100 }, { subject:"Projects",   A:90, fullMark:100 },
  { subject:"Labs",        A:78, fullMark:100 }, { subject:"Seminar",    A:95, fullMark:100 },
];

// ─── Content ──────────────────────────────────────────────────────────────────
export const NOTICES = [
  { id:1, title:"Mid-Semester Examination Schedule Released",             date:"Apr 5, 2025",  type:"exam",      priority:"high"   },
  { id:2, title:"Annual Tech Fest 'InnovateX 2025' — Registrations Open", date:"Apr 3, 2025",  type:"event",     priority:"medium" },
  { id:3, title:"Library Closed on Apr 14 (Holiday)",                     date:"Apr 2, 2025",  type:"general",   priority:"low"    },
  { id:4, title:"NPTEL Online Course Enrollment Deadline: April 10",      date:"Apr 1, 2025",  type:"academic",  priority:"high"   },
  { id:5, title:"Campus Placement Drive — TCS & Infosys (April 20)",      date:"Mar 30, 2025", type:"placement", priority:"high"   },
];

export const LIBRARY = [
  { id:1, title:"Artificial Intelligence: A Modern Approach", author:"Russell & Norvig",  available:3, total:5, borrowed:false },
  { id:2, title:"Introduction to Algorithms (CLRS)",          author:"Cormen et al.",      available:0, total:4, borrowed:true, due:"Apr 12" },
  { id:3, title:"Deep Learning",                              author:"Goodfellow et al.",  available:2, total:3, borrowed:false },
  { id:4, title:"Database System Concepts",                   author:"Silberschatz",       available:1, total:6, borrowed:false },
  { id:5, title:"Operating System Concepts",                  author:"Galvin",             available:4, total:6, borrowed:false },
];

export const FEES = [
  { id:"22510", name:"Anshu Kumar Das",  sem:"7th", tuition:42000, hostel:18000, misc:3500, paid:63500, status:"Paid"    },
  { id:"22526", name:"Devanshu Raj",     sem:"7th", tuition:42000, hostel:18000, misc:3500, paid:30000, status:"Pending" },
  { id:"22529", name:"SatyaPrakash V.", sem:"7th", tuition:42000, hostel:0,     misc:3500, paid:45500, status:"Paid"    },
  { id:"22533", name:"Ritesh Kumar",     sem:"7th", tuition:42000, hostel:18000, misc:3500, paid:0,     status:"Overdue" },
  { id:"22541", name:"Priya Singh",      sem:"5th", tuition:40000, hostel:18000, misc:3500, paid:61500, status:"Paid"    },
  { id:"22545", name:"Rohit Sharma",     sem:"5th", tuition:40000, hostel:0,     misc:3500, paid:20000, status:"Overdue" },
];

export const EVENTS = [
  { id:1, title:"Mid-Term Exams Begin",       date:"Apr 12", time:"10:00 AM", type:"exam",      color:"#FF6B6B" },
  { id:2, title:"Tech Fest InnovateX 2025",   date:"Apr 18", time:"9:00 AM",  type:"event",     color:"#6C4EF5" },
  { id:3, title:"TCS Campus Placement",       date:"Apr 20", time:"9:00 AM",  type:"placement", color:"#00C9A7" },
  { id:4, title:"Faculty Development Program",date:"Apr 22", time:"2:00 PM",  type:"training",  color:"#F5A623" },
  { id:5, title:"Annual Sports Day",          date:"Apr 28", time:"8:00 AM",  type:"sports",    color:"#38BDF8" },
  { id:6, title:"End-Semester Exams",         date:"May 10", time:"9:00 AM",  type:"exam",      color:"#FF6B6B" },
];

export const GRADEBOOK = [
  { student:"Anshu Kumar Das",    AI:87, ML:85, DSA:92, DBMS:78, OS:88, total:430, grade:"A"  },
  { student:"SatyaPrakash Verma", AI:92, ML:91, DSA:95, DBMS:88, OS:93, total:459, grade:"A+" },
  { student:"Devanshu Raj",       AI:82, ML:80, DSA:88, DBMS:74, OS:84, total:408, grade:"A-" },
  { student:"Ritesh Kumar",       AI:74, ML:70, DSA:80, DBMS:68, OS:76, total:368, grade:"B+" },
  { student:"Priya Singh",        AI:88, ML:86, DSA:90, DBMS:82, OS:87, total:433, grade:"A"  },
];

export const ASSIGNMENTS = [
  { id:1, title:"Neural Network Implementation", subject:"AI",   due:"Apr 15", subs:18, total:60, status:"active" },
  { id:2, title:"Binary Search Tree Lab",        subject:"DSA",  due:"Apr 10", subs:34, total:60, status:"graded" },
  { id:3, title:"SQL Query Optimization",        subject:"DBMS", due:"Apr 20", subs:12, total:60, status:"active" },
  { id:4, title:"CNN Architecture Report",       subject:"ML",   due:"Apr 25", subs:8,  total:60, status:"active" },
];

export const MATERIALS = [
  { id:1, title:"Unit 1: Intro to AI & Agents",     subject:"AI",   type:"PDF", size:"2.4 MB", date:"Mar 15", dl:45 },
  { id:2, title:"Neural Networks — Lecture Slides", subject:"AI",   type:"PPT", size:"8.1 MB", date:"Mar 20", dl:38 },
  { id:3, title:"DSA Complete Notes",               subject:"DSA",  type:"PDF", size:"5.6 MB", date:"Mar 10", dl:67 },
  { id:4, title:"ML Algorithms Cheatsheet",         subject:"ML",   type:"PDF", size:"1.2 MB", date:"Mar 25", dl:52 },
  { id:5, title:"DBMS ER Diagrams",                 subject:"DBMS", type:"PDF", size:"3.1 MB", date:"Apr 1",  dl:29 },
];

export const RESULTS = [
  { subject:"Artificial Intelligence", mid:42, end:78, int:18, total:138, max:150, grade:"A"  },
  { subject:"Machine Learning",        mid:38, end:72, int:16, total:126, max:150, grade:"B+" },
  { subject:"Data Structures",         mid:45, end:82, int:19, total:146, max:150, grade:"A+" },
  { subject:"Database Systems",        mid:35, end:68, int:15, total:118, max:150, grade:"B"  },
  { subject:"Operating Systems",       mid:40, end:76, int:17, total:133, max:150, grade:"A-" },
];

export const NOTIFS = [
  { id:1, text:"Assignment 'Neural Network Implementation' due in 3 days", time:"2h ago", read:false, type:"warn"    },
  { id:2, text:"Your result for DSA Unit Test has been published",          time:"5h ago", read:false, type:"info"    },
  { id:3, text:"Mid-term exam schedule released — check Notice Board",     time:"1d ago", read:true,  type:"info"    },
  { id:4, text:"Attendance marked for AI class (Apr 7)",                   time:"1d ago", read:true,  type:"success" },
  { id:5, text:"New study material uploaded: Neural Networks Slides",      time:"2d ago", read:true,  type:"info"    },
];

export const TIMETABLE = {
  Monday:    ["AI (9:00 AM)","DSA Lab (11:00 AM)","ML (2:00 PM)"],
  Tuesday:   ["DBMS (9:00 AM)","OS (11:00 AM)","AI Lab (2:00 PM)"],
  Wednesday: ["ML (9:00 AM)","DS (11:00 AM)","Seminar (2:00 PM)"],
  Thursday:  ["AI (9:00 AM)","DBMS Lab (11:00 AM)","OS (2:00 PM)"],
  Friday:    ["ML (9:00 AM)","DSA (11:00 AM)","Project (2:00 PM)"],
};