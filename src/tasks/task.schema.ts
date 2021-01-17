import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";
import { TaskStatus } from "./task.enum";

export type TaskDocument = Task & Document;

@Schema({
  timestamps: true
})
export class Task {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({
    enum: [TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN],
    default: TaskStatus.OPEN
  })
  status: TaskStatus;

  @Prop({
    required: true,
    type: Types.ObjectId
  })
  author: ObjectId
}

export const TaskSchema = SchemaFactory.createForClass(Task);


