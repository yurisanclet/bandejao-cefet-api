/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { Response } from 'express';
import { UserResponseDto } from './dto/user-response-dto';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/helper/roles.decorator';
import { UserRoles } from './enum/user-roles.enum';
import { RolesGuard } from 'src/auth/guard/role.auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST, UserRoles.USER)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.userService.create(createUserDto);
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message})
    }
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST, UserRoles.USER)
  @Get('/email/:email')
  async findOneByEmail(@Param('email') email: string) {
    const user = await this.userService.findOneByEmail(email);
    const userResponse = plainToClass(UserResponseDto, user);
    return userResponse;
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST, UserRoles.USER)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST, UserRoles.USER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST, UserRoles.USER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() user: Response) {
    try {
      await this.userService.update(id, updateUserDto);
      return user.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      return user.status(400).json({ message: error.message });
    }
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST, UserRoles.USER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
