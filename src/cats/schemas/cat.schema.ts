import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema({ timestamps: true })
export class Cat {
  @ApiProperty({ type: String, description: 'The name of the cat' })
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @ApiProperty({ type: Number, description: 'The age of the cat' })
  @Prop({
    type: Number,
    required: true,
  })
  age: number;

  @ApiProperty({
    type: String,
    description: 'The breed of the cat',
    required: false,
  })
  @Prop({
    type: String,
  })
  breed?: string;

  @ApiProperty({
    type: Date,
    description: 'The date the cat was created',
    readOnly: true,
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'The date the cat was last updated',
    readOnly: true,
  })
  @Prop()
  updatedAt: Date;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
