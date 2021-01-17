import { IsEnum, isEnum } from "class-validator";
import { TaskStatus } from "../task.enum";

export class UpdateTaskDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}