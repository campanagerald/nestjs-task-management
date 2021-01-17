import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { User } from './user.schema';
import { AuthTokenHeaderInterceptor } from 'src/core/interceptor/auth-token-headers.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/core/decorator/current-user.decorator';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() userCredentialsDTO: UserCredentialsDTO): Promise<User> {
    return this.authService.signUp(userCredentialsDTO);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  @UseInterceptors(AuthTokenHeaderInterceptor)
  async signIn(
    @Body() userCredentialsDTO: UserCredentialsDTO): Promise<any> {
    return await this.authService.signIn(userCredentialsDTO);
  }

  @Get('/current-user')
  @UseGuards(AuthGuard())
  async getCurrentUser(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }
}
