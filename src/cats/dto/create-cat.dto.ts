import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ example: 'Whiskers', description: 'The name of the cat' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2, description: 'The age of the cat' })
  @IsNumber()
  age: number;

  @ApiProperty({
    example: 'Siamese',
    description: 'The breed of the cat',
    required: false,
  })
  @IsString()
  @IsOptional()
  breed?: string;
}
