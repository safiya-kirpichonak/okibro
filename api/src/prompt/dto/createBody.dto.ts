import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBodyDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
