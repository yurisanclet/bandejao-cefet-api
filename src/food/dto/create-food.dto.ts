import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, Min, MinDate } from 'class-validator';

function getTodayAtMidnightBrazilTime() {
  const now = new Date();
  // Cria uma data representando agora em UTC
  const nowInUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  // Ajusta para o fuso horário brasileiro considerado como UTC-3
  const brazilOffset = 3 * 60 * 60 * 1000; // 3 horas em milissegundos
  const todayAtMidnightBrazil = new Date(nowInUTC.getTime() - brazilOffset);
  return todayAtMidnightBrazil;
}

export class CreateFoodDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  nutritionalData: string;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(getTodayAtMidnightBrazilTime(), {
    message: 'Expiry date cannot be in the past',
  })
  expiryDate: Date;
}
