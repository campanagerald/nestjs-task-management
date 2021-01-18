import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument, TaskModelName } from './task.schema';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel(TaskModelName) private taskModel: Model<TaskDocument>) { }

  createTask(author: ObjectId, createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;

    return this.taskModel.create({
      title,
      author,
      description
    });
  }

  async updateTask(author: ObjectId, id: ObjectId, updateTaskDTO: UpdateTaskDTO): Promise<Task> {
    await this.isExists(author, id);
    return this.taskModel.findByIdAndUpdate(id, updateTaskDTO, { new: true });
  }

  async getAllTasks(author: ObjectId): Promise<Task[]> {
    return this.taskModel.find({
      author
    });
  }

  getTasksWithFilter(author: ObjectId, getTasksFilterDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { status, search } = getTasksFilterDTO;

    const query = this.taskModel.find({
      author
    });

    if (status) {
      query.find({ status });
    }

    if (search) {
      query.find({
        $or: [
          {
            title: new RegExp(search)
          },
          {
            description: new RegExp(search)
          }
        ]
      })
    }

    return query.exec();
  }

  async getTaskById(author: ObjectId, id: ObjectId): Promise<Task> {
    const task = await this.taskModel.findOne({
      _id: id,
      author
    });

    if (!task) {
      throw new NotFoundException(`task with id: ${id} not found`);
    }

    return task;
  }

  async deleteTask(author: ObjectId, id: ObjectId): Promise<void> {
    await this.isExists(author, id);
    await this.taskModel.findByIdAndRemove(id);
  }

  async isExists(author: ObjectId, id: ObjectId): Promise<boolean> {
    const exists = await this.taskModel.exists({ _id: id, author });

    if (!exists) {
      throw new NotFoundException(`task with id: ${id} not found`);
    }

    return true;
  }
}
