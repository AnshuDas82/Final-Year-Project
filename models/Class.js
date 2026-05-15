import mongoose from "mongoose"

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: String, required: true },
  branch: { type: String, required: true },
  students: { type: Number, default: 0 },
  teacher: { type: String, required: true }, // Username of the teacher
  room: { type: String, default: "TBA" },
  avg: { type: Number, default: 0 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model("Class", classSchema)
