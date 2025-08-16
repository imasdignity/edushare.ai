import { Schema, model, models } from 'mongoose';

const AssignmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default models?.Assignment || model('Assignment', AssignmentSchema);
