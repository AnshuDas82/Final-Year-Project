import mongoose from "mongoose"

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  students: { type: Number, default: 0 },
  teacher: { type: String, required: true },
  room: { type: String, required: true },
  avg: { type: Number, default: 0 },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model("Class", classSchema)
