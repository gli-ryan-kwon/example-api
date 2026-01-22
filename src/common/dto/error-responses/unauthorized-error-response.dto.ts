import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedErrorResponseDto {
  @ApiProperty({
    example: 'Unauthorized',
    description: 'the error message',
    type: String,
  })
  message: string;

  @ApiProperty({ example: 401, description: 'The status code' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'The error name' })
  error: string;
}
