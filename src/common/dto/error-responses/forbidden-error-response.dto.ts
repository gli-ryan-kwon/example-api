import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenErrorResponseDto {
  @ApiProperty({
    example: 'Forbidden',
    description: 'the error message',
    type: String,
  })
  message: string;

  @ApiProperty({ example: 403, description: 'The status code' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'The error name' })
  error: string;
}
