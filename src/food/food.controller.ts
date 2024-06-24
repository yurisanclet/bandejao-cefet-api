/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParam.decorator';
import { Response } from 'express';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortParam.decorator';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParam.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/role.auth.guard';
import { UserRoles } from 'src/user/enum/user-roles.enum';
import { Roles } from 'src/auth/helper/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST)
  @Post()
  async create(@Body() createFoodDto: CreateFoodDto, @Res() res: Response) {
    try {
      await this.foodService.create(createFoodDto);
      return res.status(201).json({ message: 'Food created successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST, UserRoles.USER)
  @Get()
  async findAll(
    @PaginationParams() paginationParams : Pagination,
    @SortingParams(['expiryDate']) sort?: Sorting,
    @FilteringParams(['name', 'expiryDate']) filter?: Filtering[],
    @Res() res?: Response
  ) {
    const paginationResults = await this.foodService.findAll(paginationParams, sort, filter);
    return res.status(200).json(paginationResults);
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST, UserRoles.USER)
  @Get(':name')
  async findOne(@Param('name') name: string) {
    return await this.foodService.findOne(name);
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(id, updateFoodDto);
  }

  @Roles(UserRoles.ADMIN, UserRoles.NUTRICIONIST)
  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(id)
    return this.foodService.remove(id);
  }
}
