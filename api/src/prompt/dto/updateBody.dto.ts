import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBodyDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
