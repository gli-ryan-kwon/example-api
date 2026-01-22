import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestResponseDto } from '../dto/error-responses/bad-request-response.dto';
import { InternalServerErrorResponseDto } from '../dto/error-responses/internal-server-error-response.dto';
import { UnauthorizedErrorResponseDto } from '../dto/error-responses/unauthorized-error-response.dto';
import { ForbiddenErrorResponseDto } from '../dto/error-responses/forbidden-error-response.dto';

@ApiBadRequestResponse({
  description: 'Bad Request',
  type: BadRequestResponseDto,
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: UnauthorizedErrorResponseDto,
})
@ApiForbiddenResponse({
  description: 'Forbidden',
  type: ForbiddenErrorResponseDto,
})
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error',
  type: InternalServerErrorResponseDto,
})
export class BaseController {}
