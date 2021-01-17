import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ParseObjectIdPipe } from 'src/core/pipe/parse-objectid.pipe';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter-dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task } from './task.schema';
import { TasksService } from './tasks.service';
import { UserDocument } from 'src/auth/user.schema';
import { CurrentUser } from 'src/core/decorator/current-user.decorator';
import { JWTGuard } from 'src/auth/guard/jwt.guard';

@Controller('tasks')
@UseGuards(JWTGuard)
export class TasksController {
  constructor(private taskService: TasksService) { }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @CurrentUser() currentUser: UserDocument
  ): Promise<Task> {
    return this.taskService.createTask(currentUser._id, createTaskDTO);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateTask(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @CurrentUser() currentUser: UserDocument
  ): Promise<Task> {
    return this.taskService.updateTask(currentUser._id, id, updateTaskDTO);
  }

  @Get()
  getTasks(
    @Query() getTasksFilterDTO: GetTasksFilterDTO,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<Task[]> {
    const hasFilter = Object.keys(getTasksFilterDTO).length > 0;

    if (hasFilter) {
      return this.taskService.getTasksWithFilter(currentUser._id, getTasksFilterDTO);
    } else {
      return this.taskService.getAllTasks(currentUser._id);
    }
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @CurrentUser() currentUser: UserDocument
  ): Promise<Task> {
    return this.taskService.getTaskById(currentUser._id, id);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @CurrentUser() currentUser: UserDocument
  ): Promise<void> {
    return this.taskService.deleteTask(currentUser._id, id);
  }
}
