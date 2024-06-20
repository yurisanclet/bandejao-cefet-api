import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Pagination } from '../helpers/decorators/paginationParam.decorator';
import { PaginatedResource } from 'src/common/interface/paginate.interface';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const existingMenu = await this.menuRepository.findOne({
      where: { date: createMenuDto.date },
    });

    if (existingMenu) {
      throw new Error('A menu already exists for this date');
    }

    return this.menuRepository.save(createMenuDto);
  }

  async findAll({
    limit,
    page,
    offset,
    size,
  }: Pagination): Promise<PaginatedResource<Partial<Menu>>> {
    const [menus, total] = await this.menuRepository.findAndCount({
      order: {
        date: 'ASC',
      },
      take: limit,
      skip: offset,
    });

    return {
      totalItems: total,
      items: menus,
      page,
      size,
    };
  }

  async findOne(id: string): Promise<Menu> {
    return await this.menuRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const existingMenu = await this.findOne(id);

    if (!existingMenu) {
      throw new Error('Menu not found');
    }

    return await this.menuRepository.update(id, updateMenuDto);
  }

  async remove(id: string) {
    const existingMenu = await this.findOne(id);

    if (!existingMenu) {
      throw new Error('Menu not found');
    }

    return await this.menuRepository.delete(id);
  }
}
