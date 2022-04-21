import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signup(auth: AuthCredentialsDto): Promise<User> {
    const { username, password, email } = auth;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      const user = this.create({ username, password: hashedPassword, email });
      return await this.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  // async signIn(loginDto: LoginDto): Promise<User> {
  //
  // }
}
