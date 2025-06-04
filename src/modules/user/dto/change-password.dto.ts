import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  email: string;

  @IsString()
  restoreKey: string;

  @IsString()
  password: string;
}
