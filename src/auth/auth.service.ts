import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/core/interface/JWTPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }

  async signUp(userCredentialsDTO: UserCredentialsDTO): Promise<User> {
    try {
      const { username, password } = userCredentialsDTO;

      const hashedPassword = await this.hashPassword(password);
      const user = await this.userModel.create({ username, password: hashedPassword });

      return this.userModel.findById(user._id).select({ password: 0 });
    } catch (error) {
      const isMongoDuplicateError = error.name === 'MongoError' && error.code === 11000;

      if (isMongoDuplicateError) {
        throw new ConflictException('username already exists');
      }

      throw new InternalServerErrorException();
    }
  }

  async signIn(userCredentialsDTO: UserCredentialsDTO): Promise<{ user: User, token: string }> {
    const { username, password } = userCredentialsDTO;

    await this.validateUserCredentials(username, password);

    const user = await this.userModel.findOne({ username }).select({ password: 0 });

    const payload = { username: user.username };

    const token = await this.generateAuthToken(payload);

    return { user, token };
  }

  async generateAuthToken(payload: JWTPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private async validateUserCredentials(username: string, password: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username });

    const isPasswordValid = await this.validatePassword(password, user.password);
    const isValidUser = user && isPasswordValid;

    if (!isValidUser) {
      throw new UnauthorizedException('invalid username or password');
    }

    return true;
  }

  private validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
