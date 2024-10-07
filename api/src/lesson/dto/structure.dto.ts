import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class StructureDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'infinity-conversation-lesson',
    'universal-expressions-lesson',
    'wise-proverbs-lesson',
    'phrasal-verbs-lesson',
  ])
  structure: string;
}
