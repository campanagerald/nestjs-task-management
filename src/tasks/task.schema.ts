import { Document, ObjectId, Schema, Types } from "mongoose";
import { TaskStatus } from "./task.enum";

export const TaskModelName = 'Task';

export interface Task {
  title: string;
  description: string;
  status: TaskStatus;
  author: ObjectId;
}

export interface TaskDocument extends Task, Document { }

export const TaskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
      default: TaskStatus.OPEN
    },
    author: {
      type: Types.ObjectId,
      enum: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
      default: TaskStatus.OPEN
    }
  },
  {
    timestamps: true
  }
);