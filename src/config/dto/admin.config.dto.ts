import { IsString } from 'class-validator';

export class AdminConfigDto {
  @IsString()
  nick: string;

  @IsString()
  password: string;

  @IsString()
  email: string;
}
