/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private jwtOptions;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.jwtOptions = {
      secret: 'defaultSecretKey' || 'defaultSecretKey',
      verify: { algorithms: ['HS256'] },
    };
  }

  async login(user: LoginDTO) {
    const payload = { email: user.email, password: user.password };
    const result = await this.validateUser(payload);
    return {
      access_token: await this.jwtService.signAsync(result, {
        expiresIn: '1h',
      }),
      user: user.email
    };
  }

  async validateUser(payload: any) {
    const user = await this.userService.findOneByEmail(payload.email);
  
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
  
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  
    const { password, ...result } = user;
    return result;
  }
}
