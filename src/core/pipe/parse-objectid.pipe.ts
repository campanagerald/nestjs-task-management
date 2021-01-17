import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { isValidObjectId, Types } from "mongoose";

export class ParseObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
  transform(value: string, metadata: ArgumentMetadata): Types.ObjectId {
    const isObjectId = isValidObjectId(value);

    if (!isObjectId) {
      throw new BadRequestException(`${metadata.type} ${metadata.data} is not a valid ObjectId`);
    }

    return new Types.ObjectId(value);
  }
}