import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'O autor é obrigatório' })
  author: string;

  @IsOptional()
  @IsNumber({}, { message: 'O ano deve ser um número' })
  year?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
