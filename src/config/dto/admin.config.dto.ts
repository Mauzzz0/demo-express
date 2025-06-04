import { IsString } from 'class-validator';

export class AdminConfigDto {
  @IsString()
  password: string;

  @IsString()
  email: string;
}
