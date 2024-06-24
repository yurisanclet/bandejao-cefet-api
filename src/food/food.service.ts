import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './entities/food.entity';
import { PaginatedResource } from 'src/common/interface/paginate.interface';
import { Pagination } from 'src/helpers/decorators/paginationParam.decorator';
import { Sorting } from 'src/helpers/decorators/sortParam.decorator';
import { Filtering } from 'src/helpers/decorators/filteringParam.decorator';
import { getOrder, getWhere } from 'src/helpers/getOrderWhere';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private foodRepository: Repository<Food>,
  ) {}

  async create(createFoodDto: CreateFoodDto) {
    const existingFood = await this.foodRepository.findOne({
      where: { name: createFoodDto.name },
    });

    if (existingFood) {
      throw new Error('A food already exists with this name');
    }

    return this.foodRepository.save(createFoodDto);
  }

  private calculateStatus(expiryDate: Date | string): string {
    const today = new Date();
    const expiry =
      typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
    return expiry.toISOString() >= today.toISOString() ? 'InDate' : 'OutOfDate';
  }

  async findAll(
    { limit, page, offset, size }: Pagination,
    sort?: Sorting,
    filter?: Filtering[],
  ): Promise<PaginatedResource<Partial<Food>>> {
    const where = getWhere(filter);
    const order = getOrder(sort);

    const [foods, total] = await this.foodRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });

    const foodsWithStatus = foods.map((food) => ({
      ...food,
      status: this.calculateStatus(food.expiryDate),
    }));

    return {
      totalItems: total,
      items: foodsWithStatus,
      page,
      size,
    };
  }

  async findOne(name: string) {
    return await this.foodRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  async update(id: string, updateFoodDto: UpdateFoodDto) {
    const existingFood = await this.foodRepository.findOne({
      where: { id },
    });

    if (!existingFood) {
      throw new Error('Food not found');
    }

    const potentialDuplicate = await this.foodRepository.findOne({
      where: { name: updateFoodDto.name },
    });

    if (potentialDuplicate && potentialDuplicate.id !== id) {
      throw new Error('A food already exists with this name');
    }

    const updatedFood = { ...existingFood, ...updateFoodDto };

    return await this.foodRepository.save(updatedFood);
  }

  async remove(id: string) {
    const existingFood = await this.foodRepository.findOne({
      where: { id },
    });
    if (!existingFood) {
      throw new Error('Food not found');
    }

    return this.foodRepository.remove(existingFood);
  }
}
