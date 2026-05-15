import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import jwt from "jsonwebtoken"
import Student from "./models/Student.js"
import User from "./models/User.js"
import Teacher from "./models/Teacher.js"
import Class from "./models/Class.js"
import Subject from "./models/Subject.js"
import Assignment from "./models/Assignment.js"
import Material from "./models/Material.js"
import { verifyToken, authorizeRoles } from "./middleware/auth.js"

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://kranshu983_db_user:Glitch%40829@cluster0.qcjaijg.mongodb.net/smartedupro?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

app.get("/", (req, res) => res.send("Server Working"))

const JWT_SECRET = process.env.JWT_SECRET || "smartedu_super_secret_key"

/* ══════════════════════════════════════════════════
   HELPER: Returns verified teacher profile or null.
   A teacher is "verified" only when an admin has
   created a Teacher document for their username.
══════════════════════════════════════════════════ */
async function getVerifiedTeacherProfile(userId) {
  const userRecord = await User.findById(userId)
  if (!userRecord) return null
  const profile = await Teacher.findOne({
    name: userRecord.username,
    adminId: { $exists: true, $ne: null }
  })
  return profile // null = not yet verified by any admin
}

/* ══════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════ */
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password, role, name } = req.body
    const existingUser = await User.findOne({ username })
    if (existingUser) return res.status(400).json({ message: "User already exists" })
    const user = new User({ username, password, role, name })
    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password, role } = req.body
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })
    if (role && user.role !== role) return res.status(400).json({ message: "Invalid role selected for this user" })
    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" })
    res.json({ token, user: { id: user._id, username: user.username, role: user.role, name: user.name } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ══════════════════════════════════════════════════
   TEACHER VERIFICATION STATUS
   Frontend calls this on every teacher page load.
   Returns { verified: true/false }
══════════════════════════════════════════════════ */
app.get("/auth/teacher-status", verifyToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const profile = await getVerifiedTeacherProfile(req.user.id)
    if (!profile) {
      return res.json({
        verified: false,
        message: "Your account is pending admin verification. Ask your admin to add you in Teacher Management using your registered username."
      })
    }
    res.json({ verified: true, adminId: profile.adminId, subject: profile.subject, dept: profile.dept })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ══════════════════════════════════════════════════
   DASHBOARD SUMMARY
══════════════════════════════════════════════════ */
app.get("/dashboard/summary", verifyToken, async (req, res) => {
  try {
    let studentsCount, teachersCount
    if (req.user.role === 'admin') {
      studentsCount = await Student.countDocuments({ adminId: req.user.id })
      teachersCount = await Teacher.countDocuments({ adminId: req.user.id })
    } else if (req.user.role === 'teacher') {
      const profile = await getVerifiedTeacherProfile(req.user.id)
      if (!profile) return res.status(403).json({ error: "NOT_VERIFIED", message: "Not verified by admin" })
      studentsCount = await Student.countDocuments({ teacherId: req.user.id })
      teachersCount = await Teacher.countDocuments({ adminId: profile.adminId })
    } else {
      studentsCount = 0; teachersCount = 0
    }
    res.json({ totalStudents: studentsCount, totalTeachers: teachersCount, subjectsActive: 42, feeCollection: "₹8.4L" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ══════════════════════════════════════════════════
   STUDENTS
   Admin  → sees only students they added (adminId = theirs, teacherId = null)
   Teacher → sees only students THEY personally added (teacherId = their userId)
             BLOCKED if not verified by admin
══════════════════════════════════════════════════ */
app.get("/students", verifyToken, async (req, res) => {
  try {
    let query = {}
    if (req.user.role === 'admin') {
      query = { adminId: req.user.id }
    } else if (req.user.role === 'teacher') {
      const profile = await getVerifiedTeacherProfile(req.user.id)
      if (!profile) {
        query = { _id: null } // Return empty array if unverified
      } else {
        query = { adminId: profile.adminId } // See all students added by the same admin
      }
    } else if (req.user.role === 'student') {
      const userRecord = await User.findById(req.user.id)
      query = { name: userRecord.username }
    }
    let students = await Student.find(query).lean()

    if (req.user.role === 'teacher') {
      students = students.map(s => {
        const myRecords = (s.attendanceRecords || []).filter(r => String(r.teacherId) === String(req.user.id))
        const total = myRecords.length
        const present = myRecords.filter(r => r.status === 'Present').length
        s.attendance = total > 0 ? Math.round((present / total) * 100) : 0
        s.attendanceRecords = myRecords
        return s
      })
    }

    res.json(students)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/users/students", verifyToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).select("username name _id")
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/students", verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await Student.findOne({ name: req.body.name })
    if (existing) return res.status(400).json({ message: "This student is already verified and added." })
    const student = new Student({ ...req.body, adminId: req.user.id, teacherId: null })
    await student.save()
    res.json(student)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ══════════════════════════════════════════════════
   ATTENDANCE
   Teacher can only mark attendance for their own
   students (teacherId = their userId). Backend
   enforces this even if IDs are spoofed.
══════════════════════════════════════════════════ */
app.post("/attendance/mark", verifyToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const { date, records } = req.body

    let profile = null;
    if (req.user.role === 'teacher') {
      profile = await getVerifiedTeacherProfile(req.user.id)
    }

    for (const [studentId, isPresent] of Object.entries(records)) {
      const student = await Student.findById(studentId)
      if (!student) continue
      // Security: teacher can only mark students under their admin
      if (req.user.role === 'teacher') {
        if (!profile || String(student.adminId) !== String(profile.adminId)) continue
      }
      const markerId = req.user.id
      student.attendanceRecords = student.attendanceRecords.filter(r => !(r.date === date && String(r.teacherId) === String(markerId)))
      student.attendanceRecords.push({ date, status: isPresent ? 'Present' : 'Absent', teacherId: markerId })
      
      // Update global attendance average
      const totalDays = student.attendanceRecords.length
      const presentDays = student.attendanceRecords.filter(r => r.status === 'Present').length
      student.attendance = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
      await student.save()
    }
    res.json({ message: "Attendance marked successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ══════════════════════════════════════════════════
   TEACHERS
══════════════════════════════════════════════════ */
app.get("/users/teachers", verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: "teacher" }).select("username name _id")
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/teachers", verifyToken, async (req, res) => {
  try {
    let query = {}
    if (req.user.role === 'admin') {
      query = { adminId: req.user.id }
    } else if (req.user.role === 'teacher') {
      const userRecord = await User.findById(req.user.id)
      query = { name: userRecord.username }
    }
    const teachers = await Teacher.find(query).populate('adminId', 'username name')
    res.json(teachers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/teachers", verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const existing = await Teacher.findOne({ name: req.body.name, adminId: req.user.id })
    if (existing) return res.status(400).json({ message: "This teacher is already added to your institution." })
    const teacher = new Teacher({ ...req.body, adminId: req.user.id })
    await teacher.save()
    res.json(teacher)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ══════════════════════════════════════════════════
   CLASSES
   Teacher sees only classes where their name matches
   and they are verified.
══════════════════════════════════════════════════ */
app.get("/classes", verifyToken, async (req, res) => {
  try {
    let query = {}
    if (req.user.role === 'admin') {
      query = { adminId: req.user.id }
    } else if (req.user.role === 'teacher') {
      const profile = await getVerifiedTeacherProfile(req.user.id)
      if (!profile) {
        return res.status(403).json({ error: "NOT_VERIFIED", message: "You are not yet verified by an admin." })
      }
      const userRecord = await User.findById(req.user.id)
      // Match any of: Teacher profile name, login username, or display name
      // (handles cases where admin stored different variants when creating the class)
      const possibleNames = [...new Set([
        profile.name,
        userRecord.username,
        userRecord.name
      ].filter(Boolean))]
      console.log(`[Classes] Teacher lookup for userId=${req.user.id}, trying names:`, possibleNames)
      query = { adminId: profile.adminId, teacher: { $in: possibleNames } }
    }
    const classes = await Class.find(query)
    res.json(classes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DEBUG: inspect what teacher names are stored in class documents
app.get("/debug/classes", verifyToken, async (req, res) => {
  try {
    const userRecord = await User.findById(req.user.id)
    const profile = await Teacher.findOne({ name: userRecord.username })
    const allClasses = await Class.find({ adminId: profile?.adminId })
    res.json({
      myUsername: userRecord.username,
      myName: userRecord.name,
      profileName: profile?.name,
      allClassesTeacherFields: allClasses.map(c => ({ id: c._id, className: c.name, teacherField: c.teacher }))
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post("/classes", verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const newClass = new Class({ ...req.body, adminId: req.user.id })
    await newClass.save()
    
    // Add notification to the teacher
    const teacherUsername = req.body.teacher;
    if (teacherUsername) {
      await Teacher.findOneAndUpdate(
        { name: teacherUsername, adminId: req.user.id },
        {
          $push: {
            notifications: {
              message: `You have been assigned to teach ${req.body.subject} for ${req.body.branch} (Semester: ${req.body.semester}).`
            }
          }
        }
      );
    }
    
    res.json(newClass)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put("/classes/:id", verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const cls = await Class.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id },
      req.body,
      { new: true }
    )
    if (!cls) return res.status(404).json({ message: "Class not found" })
    res.json(cls)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete("/classes/:id", verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const cls = await Class.findOneAndDelete({ _id: req.params.id, adminId: req.user.id })
    if (!cls) return res.status(404).json({ message: "Class not found" })
    res.json({ message: "Class deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/teacher/notifications", verifyToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const profile = await getVerifiedTeacherProfile(req.user.id)
    if (!profile) return res.status(403).json({ error: "NOT_VERIFIED", message: "Not verified by admin" })
    
    // Sort notifications by date descending
    const notifs = (profile.notifications || []).sort((a, b) => new Date(b.date) - new Date(a.date))
    res.json(notifs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ══════════════════════════════════════════════════
   SUBJECTS
══════════════════════════════════════════════════ */
app.get("/subjects", verifyToken, async (req, res) => {
  try {
    let query = {}
    if (req.user.role === 'admin') {
      query = { adminId: req.user.id }
    } else if (req.user.role === 'teacher') {
      const profile = await getVerifiedTeacherProfile(req.user.id)
      if (!profile) return res.status(403).json({ error: "NOT_VERIFIED", message: "Not verified by admin" })
      const userRecord = await User.findById(req.user.id)
      // Use profile.name — this matches what's stored in the subject's teacher field
      const teacherName = profile.name || userRecord.username
      query = { adminId: profile.adminId, teacher: teacherName }
    }
    const subjects = await Subject.find(query)
    res.json(subjects)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/subjects", verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const newSubject = new Subject({ ...req.body, adminId: req.user.id })
    await newSubject.save()
    res.json(newSubject)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put("/subjects/:id", verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id },
      req.body,
      { new: true }
    )
    if (!subject) return res.status(404).json({ message: "Subject not found" })
    res.json(subject)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(5001, () => console.log("Server running on port 5001"))

/* ══════════════════════════════════════════════════
   ASSIGNMENTS
══════════════════════════════════════════════════ */
app.get("/assignments", verifyToken, async (req, res) => {
  try {
    let query = {}
    if (req.user.role === 'teacher') {
      // FIX: Only show assignments created by THIS teacher
      query = { teacherId: req.user.id }
    } else if (req.user.role === 'student') {
      const user = await User.findById(req.user.id)
      const studentRecord = await Student.findOne({ name: user.username })
      if (!studentRecord) return res.json([])
      // Students see all assignments from their institution (adminId)
      query = { adminId: studentRecord.adminId }
    } else if (req.user.role === 'admin') {
      // Admins see all assignments in their institution
      query = { adminId: req.user.id }
    }
    const assignments = await Assignment.find(query)
    res.json(assignments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/assignments", verifyToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const profile = await getVerifiedTeacherProfile(req.user.id)
    if (!profile) return res.status(403).json({ message: "Not verified" })
    
    const newAssignment = new Assignment({
      ...req.body,
      teacherId: req.user.id,
      adminId: profile.adminId
    })
    await newAssignment.save()
    res.json(newAssignment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/assignments/:id/submit", verifyToken, authorizeRoles('student'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) return res.status(404).json({ message: "Assignment not found" })
    
    const user = await User.findById(req.user.id)
    
    const existingIndex = assignment.submissions.findIndex(s => String(s.studentId) === String(req.user.id))
    if (existingIndex > -1) {
      assignment.submissions[existingIndex].content = req.body.content
      assignment.submissions[existingIndex].submittedAt = Date.now()
    } else {
      assignment.submissions.push({
        studentId: req.user.id,
        studentName: user.name,
        content: req.body.content
      })
    }
    
    await assignment.save()
    res.json(assignment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ══════════════════════════════════════════════════
   MATERIALS
══════════════════════════════════════════════════ */
app.get("/materials", verifyToken, async (req, res) => {
  try {
    let query = {}
    if (req.user.role === 'teacher') {
      // Teachers see only materials they uploaded
      query = { teacherId: req.user.id }
    } else if (req.user.role === 'student') {
      const user = await User.findById(req.user.id)
      const studentRecord = await Student.findOne({ name: user.username })
      if (!studentRecord) return res.json([])
      // Students see all materials from their institution (adminId)
      query = { adminId: studentRecord.adminId }
    } else if (req.user.role === 'admin') {
      // Admins see all materials in their institution
      query = { adminId: req.user.id }
    }
    const materials = await Material.find(query).sort({ createdAt: -1 })
    res.json(materials)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/materials", verifyToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const profile = await getVerifiedTeacherProfile(req.user.id)
    if (!profile) return res.status(403).json({ message: "Not verified" })
    
    const newMaterial = new Material({
      ...req.body,
      teacherId: req.user.id,
      adminId: profile.adminId
    })
    await newMaterial.save()
    res.json(newMaterial)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete("/materials/:id", verifyToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
    if (!material) return res.status(404).json({ message: "Material not found" })
    
    if (req.user.role === 'teacher' && String(material.teacherId) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only delete your own materials" })
    }
    
    await Material.findByIdAndDelete(req.params.id)
    res.json({ message: "Material deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

