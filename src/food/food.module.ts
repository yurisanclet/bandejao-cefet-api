import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [FoodController],
  providers: [FoodService],
  imports: [TypeOrmModule.forFeature([Food]), AuthModule, UserModule],
})
export class FoodModule {}
