import mongoose, { Schema, models } from 'mongoose';

const TodoSchema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Todo = models.Todo || mongoose.model('Todo', TodoSchema);
export default Todo;
