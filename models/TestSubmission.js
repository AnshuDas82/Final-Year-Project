import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  answers: [{
    questionIndex: Number,
    selectedOption: Number, // For MCQ
    textAnswer: String,     // For Long Answer
    marksAwarded: { type: Number, default: 0 }
  }],
  totalScore: { type: Number, default: 0 },
  isGraded: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
})

export default mongoose.model('TestSubmission', submissionSchema)
