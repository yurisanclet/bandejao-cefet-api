/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Res() res: Response) {
    try {
      const authToken = await this.authService.login(loginDto);
      return res.status(200).json(authToken);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
