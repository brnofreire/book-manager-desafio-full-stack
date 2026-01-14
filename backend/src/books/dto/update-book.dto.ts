import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O ano deve ser um número' })
  year?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
