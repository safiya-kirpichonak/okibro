import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class EmailBodyDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(40)
  email: string;
}
