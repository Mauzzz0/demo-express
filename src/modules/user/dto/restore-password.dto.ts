import { IsString } from 'class-validator';

export class RestorePasswordDto {
  @IsString()
  email: string;
}
