import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  content: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  grade: { type: String, default: null }
}, { _id: false })

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: String, required: true },
  
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  submissions: [submissionSchema]
}, { timestamps: true })

export default mongoose.model("Assignment", assignmentSchema)
