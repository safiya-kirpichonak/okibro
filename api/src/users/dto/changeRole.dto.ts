import { IsNotEmpty, IsIn } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsIn(['student', 'admin'])
  name: string;
}
