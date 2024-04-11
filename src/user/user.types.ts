export type User = {
  id: number;
  nick: string;
  password: string;
};

export type LoginDto = Pick<User, 'nick' | 'password'>;

export type TokenDto = {
  token: string;
};
