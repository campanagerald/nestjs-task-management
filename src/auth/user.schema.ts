import { Document, Model, Schema, } from "mongoose";

export const UserModelName = 'User';

export interface User {
  username: string;
  password: string;
}

export interface UserDocument extends User, Document { }

export interface UserModel extends Model<UserDocument> {
  findOneByUsernameAndSelect(username: string, select?: { password: 0 | 1 }): Promise<UserDocument>
}

export const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

UserSchema.statics.findOneByUsernameAndSelect = async function (username: string, select?: { password: 0 | 1 }): Promise<UserDocument> {
  return this.findOne({ username }).select(select);
}

