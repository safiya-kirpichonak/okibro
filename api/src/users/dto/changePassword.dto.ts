import { IsNotEmpty, IsStrongPassword, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @MaxLength(20)
  @IsStrongPassword()
  oldPassword: string;

  @IsNotEmpty()
  @MaxLength(20)
  @IsStrongPassword()
  newPassword: string;
}
