import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  name: string;
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
