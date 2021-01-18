import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { TaskModelName, TaskSchema } from './task.schema';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TaskModelName, schema: TaskSchema }]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule { }
