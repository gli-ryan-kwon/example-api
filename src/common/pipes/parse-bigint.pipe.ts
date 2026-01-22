import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    if (!value) {
      throw new BadRequestException('ID parameter is required');
    }

    // Check if the value is a valid integer string
    if (!/^-?\d+$/.test(value)) {
      throw new BadRequestException(
        `Invalid ID format. Expected a valid integer, received: ${value}`,
      );
    }

    try {
      const bigIntValue = BigInt(value);

      // Optionally validate that it's positive (if IDs should be positive)
      if (bigIntValue <= 0n) {
        throw new BadRequestException('ID must be a positive integer');
      }

      return bigIntValue;
    } catch {
      throw new BadRequestException(
        `Invalid ID format. Could not parse as BigInt: ${value}`,
      );
    }
  }
}
