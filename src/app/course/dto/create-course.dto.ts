import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  IsOptional,
  Min,
  IsMongoId,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(5000)
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  specialPrice?: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  topics: string[];

  @IsString()
  @IsOptional()
  image?: string;
}
