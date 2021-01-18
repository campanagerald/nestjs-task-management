import { MongooseModuleOptions } from "@nestjs/mongoose";
import * as config from 'config';

const mongodbConfig: any = config.get('mongodb');

export const uri = process.env.MONGODB_URI || mongodbConfig.uri;

export const mongooseModuleOptions: MongooseModuleOptions = {
  useCreateIndex: true
}