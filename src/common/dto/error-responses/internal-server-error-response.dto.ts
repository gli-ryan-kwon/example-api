import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorResponseDto {
  @ApiProperty({
    example: 'Internal server error',
    description: 'the error message',
    type: String,
  })
  message: string;

  @ApiProperty({ example: 500, description: 'The status code' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'The error name' })
  error: string;
}
