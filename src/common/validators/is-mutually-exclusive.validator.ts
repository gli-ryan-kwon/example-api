import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validates that only one of the specified fields is defined.
 * Useful for mutually exclusive fields where exactly one must be provided.
 */
@ValidatorConstraint({ name: 'IsMutuallyExclusive', async: false })
export class IsMutuallyExclusiveConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown, args: ValidationArguments): boolean {
    const object = args.object as Record<string, unknown>;
    const [relatedPropertyNames] = args.constraints;
    const properties = [args.property, ...relatedPropertyNames];

    // Count how many of the specified properties have a defined value (not null or undefined)
    const definedCount = properties.filter(
      (prop) => object[prop] !== null && object[prop] !== undefined,
    ).length;

    // Exactly one property should be defined
    return definedCount === 1;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyNames] = args.constraints;
    const properties = [args.property, ...relatedPropertyNames];
    return `Exactly one of [${properties.join(', ')}] must be provided`;
  }
}

/**
 * Decorator to ensure mutually exclusive fields.
 *
 * @param properties - Array of property names that are mutually exclusive with the decorated property
 * @param validationOptions - Optional validation options
 *
 * @example
 * ```typescript
 * class MyDto {
 *   @IsMutuallyExclusive(['pattern'])
 *   recipeCode?: string;
 *
 *   @IsMutuallyExclusive(['recipeCode'])
 *   pattern?: string;
 * }
 * ```
 */
export function IsMutuallyExclusive(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsMutuallyExclusive',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties],
      options: validationOptions,
      validator: IsMutuallyExclusiveConstraint,
    });
  };
}
