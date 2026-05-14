// models/student.js  — replace your existing file with this
import mongoose from "mongoose"

const attendanceRecordSchema = new mongoose.Schema({
  date:      { type: String, required: true },
  status:    { type: String, enum: ['Present', 'Absent'], required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false })

const studentSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  class:      { type: String },
  semester:   { type: String },
  attendance: { type: Number, default: 0 },
  gpa:        { type: Number, default: 0 },

  // Which admin's institution this student belongs to
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // Which teacher added this student (null = added directly by admin)
  // This is the key field that isolates each teacher's student list
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  attendanceRecords: [attendanceRecordSchema]
}, { timestamps: true })

export default mongoose.model("Student", studentSchema)
