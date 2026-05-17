import mongoose from "mongoose"

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  questions: [{
    type: {
      type: String,
      enum: ['mcq', 'long_answer'],
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    options: [{
      type: String
    }],
    correctOption: {
      type: Number
    },
    marks: {
      type: Number,
      required: true
    }
  }],
  totalTestMarks: {
    type: Number,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("Test", testSchema)
