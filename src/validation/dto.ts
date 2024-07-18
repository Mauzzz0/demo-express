import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class IdNumberDto {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
