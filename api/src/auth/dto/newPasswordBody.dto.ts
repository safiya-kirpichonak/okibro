import { IsNotEmpty, IsStrongPassword, MaxLength } from 'class-validator';

export class NewPasswordBodyDto {
  @IsNotEmpty()
  @MaxLength(300)
  token: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MaxLength(20)
  password: string;
}
