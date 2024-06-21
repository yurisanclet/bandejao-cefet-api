import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Response } from 'express';

import {
  Pagination,
  PaginationParams,
} from '../helpers/decorators/paginationParam.decorator';
import {
  Filtering,
  FilteringParams,
} from 'src/helpers/decorators/filteringParam.decorator';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto, @Res() res: Response) {
    try {
      await this.menuService.create(createMenuDto);
      return res.status(201).json({ message: 'Menu created successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Get()
  async findAll(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams(['date']) filter?: Filtering[],
    @Res() res?: Response,
  ) {
    const paginationResults = await this.menuService.findAll(
      paginationParams,
      filter,
    );
    return res.status(200).json(paginationResults);
  }
  @Get('/today')
  async findToday(@Res() res: Response) {
    try {
      const menu = await this.menuService.findByDate();
      return res.status(200).json(menu);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
    @Res() res: Response,
  ) {
    try {
      await this.menuService.update(id, updateMenuDto);
      return res.status(200).json({ message: 'Menu updated successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.menuService.remove(id);
      return res.status(200).json({ message: 'Menu deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
