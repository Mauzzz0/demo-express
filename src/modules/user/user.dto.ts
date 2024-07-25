import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '../../database/models';

export class LoginDto {
  @IsString()
  nick: string;

  @IsString()
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class TokenDto {
  @IsString()
  token: string;
}
