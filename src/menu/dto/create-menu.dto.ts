import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  accompaniment: string;

  @IsNotEmpty()
  @IsString()
  garnish: string;

  @IsNotEmpty()
  @IsString()
  mainCourse: string;

  @IsNotEmpty()
  @IsString()
  dessert: string;
}
