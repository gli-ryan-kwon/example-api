import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserAuthInfoDto {
  @ApiProperty({
    example: ['VM Admin'],
    description: 'The roles assigned to the user',
    type: [String],
  })
  roles: string[]; // "VM Admin"

  @ApiProperty({
    example: ['Gauss Labs'],
    description: 'The group the user belongs to',
    type: [String],
  })
  groups: string[]; // "Gauss Labs"

  @ApiProperty({
    example: '12345678',
    description: 'The user ID',
    type: String,
  })
  user_id: string;

  @ApiPropertyOptional({
    example: 'Ryan Kwon',
    description: 'The full name of the user',
    type: String,
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Ryan',
    description: 'The given name of the user',
    type: String,
  })
  given_name?: string;

  @ApiPropertyOptional({
    example: 'Kwon',
    description: 'The family name of the user',
    type: String,
  })
  family_name?: string;

  email?: string;
}
