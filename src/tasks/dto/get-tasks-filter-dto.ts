import { TaskStatus } from "../task.enum";

export class GetTasksFilterDTO {
  status: TaskStatus;
  search: string;
}