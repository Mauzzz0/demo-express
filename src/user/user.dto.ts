import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  nick: string;

  @IsString()
  password: string;
}

export class User extends LoginDto {
  id: number;
}

export class TokenDto {
  @IsString()
  token: string;
}
