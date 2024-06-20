/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Pagination, PaginationParams } from 'src/helpers/decorators/paginationParam.decorator';
import { Response } from 'express';
import { Sorting, SortingParams } from 'src/helpers/decorators/sortParam.decorator';
import { Filtering, FilteringParams } from 'src/helpers/decorators/filteringParam.decorator';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  async create(@Body() createFoodDto: CreateFoodDto, @Res() res: Response) {
    try {
      await this.foodService.create(createFoodDto);
      return res.status(201).json({ message: 'Food created successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

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

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return await this.foodService.findOne(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }
}
