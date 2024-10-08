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

  @IsString()
  email: string;
}

export class TokenDto {
  @IsString()
  token: string;
}

export class RestorePasswordDto {
  @IsString()
  email: string;
}

export class ChangePasswordDto {
  @IsString()
  email: string;

  @IsString()
  restoreKey: string;

  @IsString()
  password: string;
}
