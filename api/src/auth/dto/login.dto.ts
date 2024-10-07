import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(40)
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MaxLength(20)
  password: string;
}
