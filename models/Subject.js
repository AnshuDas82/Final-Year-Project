import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  teacher: { type: String, required: true },
  sem: { type: String, required: true },
  dept: { type: String },
  classes: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model("Subject", subjectSchema)
