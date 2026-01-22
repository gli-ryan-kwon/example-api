import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'ArraysEqualLength', async: false })
export class ArraysEqualLength implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (!Array.isArray(value)) {
      return false;
    }

    const [relatedPropertyName1, relatedPropertyName2] = args.constraints;
    const object = args.object as Record<string, unknown>;

    const array1 = object[relatedPropertyName1];
    const array2 = object[relatedPropertyName2];

    // Check if all arrays exist and are arrays
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
      return false;
    }

    // Check if all arrays have the same length
    return value.length === array1.length && value.length === array2.length;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName1, relatedPropertyName2] = args.constraints;
    return `${args.property}, ${relatedPropertyName1}, and ${relatedPropertyName2} must have the same length`;
  }
}
