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
    private jwtService: JwtService
  ) {
    this.jwtOptions = {
      secret: 'defaultSecretKey' || 'defaultSecretKey',
      verify: { algorithms: ['HS256'] }
    };
  }

  async login(user: LoginDTO) {
    const payload = { email: user.email, password: user.password };
    const result = await this.validateUser(payload);
    return {
      access_token: await this.jwtService.signAsync(result, { expiresIn: '1h' })
    };
  }

  async validateUser(payload: any) {
    const user = await this.userService.findOneByEmail(payload.email);
    if (!bcrypt.compare(payload.password, user.password)) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    
    return result;
  }

}
