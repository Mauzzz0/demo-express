import { IsString } from 'class-validator';

export class Login {
  @IsString()
  nick: string;

  @IsString()
  password: string;
}

export class User extends Login {
  id: number;
}

export class Token {
  @IsString()
  token: string;
}
