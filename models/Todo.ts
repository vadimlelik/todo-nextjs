import mongoose, { Schema, model, models } from 'mongoose';

const todoSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export const Todo = models.Todo || model('Todo', todoSchema);
