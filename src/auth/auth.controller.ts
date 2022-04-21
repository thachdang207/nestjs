import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtLoginSuccessfulInterface } from './interfaces/jwt-login-successful.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() auth: AuthCredentialsDto): Promise<User> {
    return this.authService.signup(auth);
  }

  @Post('/login')
  signIn(@Body() login: LoginDto): Promise<JwtLoginSuccessfulInterface> {
    return this.authService.signIn(login);
  }
}
