import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { uri, mongooseModuleOptions } from './config/mongoose.config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(uri, mongooseModuleOptions),
    TasksModule,
    AuthModule
  ],
})
export class AppModule { }
