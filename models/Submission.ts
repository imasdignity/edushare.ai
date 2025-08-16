import { Schema, model, models } from 'mongoose';

const SubmissionSchema = new Schema({
  assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  files: [{
    name: { type: String, required: true },
    path: { type: String, required: true }
  }],
  grade: { type: Number, min: 0, max: 100 },
  feedback: String,
  submittedAt: { type: Date, default: Date.now },
  gradedAt: Date
});

export default models?.Submission || model('Submission', SubmissionSchema);
