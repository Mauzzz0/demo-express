import { IsString, MinLength } from 'class-validator';

export class CreateDepartmentBodyDto {
  @IsString()
  @MinLength(3)
  title: string;
}
