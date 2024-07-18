import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class GenerateCommandOptions {
  @IsNumber()
  @IsPositive()
  @IsInt()
  count: number;
}
