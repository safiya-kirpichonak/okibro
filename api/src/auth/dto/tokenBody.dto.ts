import { IsNotEmpty, MaxLength } from 'class-validator';

export class TokenBodyDto {
  @IsNotEmpty()
  @MaxLength(300)
  token: string;
}
