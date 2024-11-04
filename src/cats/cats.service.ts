import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    return this.catModel.create(createCatDto);
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findOne(id: string): Promise<Cat> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(['invalid ID format']);
    }
    return this.catModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(['invalid ID format']);
    }
    return this.catModel
      .findByIdAndUpdate({ _id: id }, { ...updateCatDto }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Cat> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(['invalid ID format']);
    }
    const deletedCat = await this.catModel.findByIdAndDelete(id).exec();
    return deletedCat;
  }
}
