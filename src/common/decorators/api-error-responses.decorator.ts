import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestResponseDto } from '../dto/error-responses/bad-request-response.dto';
import { ForbiddenErrorResponseDto } from '../dto/error-responses/forbidden-error-response.dto';
import { InternalServerErrorResponseDto } from '../dto/error-responses/internal-server-error-response.dto';
import { UnauthorizedErrorResponseDto } from '../dto/error-responses/unauthorized-error-response.dto';

/**
 * Applies common error response documentation (Bad Request, Internal Server Error)
 * Use this on all endpoints
 */
export function ApiCommonErrors() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: BadRequestResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: InternalServerErrorResponseDto,
    }),
  );
}

/**
 * Applies authentication error response documentation (Unauthorized, Forbidden)
 * Use this on protected endpoints that require authentication
 */
export function ApiAuthErrors() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: UnauthorizedErrorResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: ForbiddenErrorResponseDto,
    }),
  );
}

/**
 * Applies all standard error responses
 * Convenience decorator that combines ApiCommonErrors and ApiAuthErrors
 */
export function ApiStandardErrors() {
  return applyDecorators(ApiCommonErrors(), ApiAuthErrors());
}
