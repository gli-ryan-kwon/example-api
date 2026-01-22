import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({
    example: [
      'name must be a string',
      'age must be a number conforming to the specified constraints',
    ],
    description: 'List of the error messages',
    type: [String],
  })
  message: string[];

  @ApiProperty({ example: 400, description: 'The status code' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'The error name' })
  error: string;
}
