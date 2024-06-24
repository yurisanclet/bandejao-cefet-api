import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Not, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Pagination } from '../helpers/decorators/paginationParam.decorator';
import { PaginatedResource } from 'src/common/interface/paginate.interface';
import { Filtering } from 'src/helpers/decorators/filteringParam.decorator';
import { getWhere } from 'src/helpers/getOrderWhere';

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

  async findAll(
    { limit, page, offset, size }: Pagination,
    filter?: Filtering[],
  ): Promise<PaginatedResource<Partial<Menu>>> {
    const where = getWhere(filter);

    const [menus, total] = await this.menuRepository.findAndCount({
      where,
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

  async findByDate(): Promise<Menu> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to 00:00:00

    const menu = await this.menuRepository.findOne({
      where: { date: today },
    });

    if (!menu) {
      throw new Error('No menu found for today');
    }

    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const existingMenu = await this.menuRepository.findOne({
      where: {
        id,
      },
    });

    if (!existingMenu) {
      throw new NotFoundException('Menu not found');
    }

    const menuWithSameDate = await this.menuRepository.findOne({
      where: {
        date: updateMenuDto.date,
        id: Not(Equal(id)),
      },
    });

    if (menuWithSameDate) {
      throw new ConflictException('A menu already exists for this date');
    }

    // Procede com a atualização se não houver conflito de datas
    await this.menuRepository.update(id, updateMenuDto);
    return await this.menuRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const existingMenu = await this.findOne(id);

    if (!existingMenu) {
      throw new Error('Menu not found');
    }

    return await this.menuRepository.delete(id);
  }
}
