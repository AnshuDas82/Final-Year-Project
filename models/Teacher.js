import mongoose from "mongoose"

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  dept: { type: String, required: true },
  exp: { type: String, required: true },
  rating: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  classes: { type: Number, default: 0 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model("Teacher", teacherSchema)
