import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { JwtLoginSuccessfulInterface } from "./interfaces/jwt-login-successful.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signup(auth: AuthCredentialsDto): Promise<User> {
    return this.userRepository.signup(auth);
  }

  async signIn(login: LoginDto): Promise<JwtLoginSuccessfulInterface> {
    const { email, password } = login;
    const user = await this.userRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email, password };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException(
      'Please check your login credentials again',
    );
  }
}
