import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatsService } from './cats.service';
import { Cat } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { BadRequestException } from '@nestjs/common';

const mockCat = {
  _id: '507f191e810c19729de860ea',
  name: 'Test Cat',
  age: 2,
  breed: 'Test Breed',
};

const mockCatModel = {
  create: jest.fn().mockResolvedValue(mockCat),
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockCat]),
  }),
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockCat),
  }),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockCat),
  }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockCat),
  }),
};

describe('CatsService', () => {
  let service: CatsService;
  let model: Model<Cat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getModelToken(Cat.name),
          useValue: mockCatModel,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    model = module.get<Model<Cat>>(getModelToken(Cat.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a cat', async () => {
    const createCatDto: CreateCatDto = {
      name: 'Test Cat',
      age: 2,
      breed: 'Test Breed',
    };
    const result = await service.create(createCatDto);
    expect(result).toEqual(mockCat);
    expect(model.create).toHaveBeenCalledWith(createCatDto);
  });

  it('should return all cats', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockCat]);
    expect(model.find).toHaveBeenCalled();
  });

  it('should return a cat by id', async () => {
    const result = await service.findOne('507f191e810c19729de860ea');
    expect(result).toEqual(mockCat);
    expect(model.findOne).toHaveBeenCalledWith({
      _id: '507f191e810c19729de860ea',
    });
  });

  it('should throw an error if invalid id format', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a cat', async () => {
    const updateCatDto: UpdateCatDto = {
      name: 'Updated Cat',
      age: 3,
      breed: 'Updated Breed',
    };
    const result = await service.update(
      '507f191e810c19729de860ea',
      updateCatDto,
    );
    expect(result).toEqual(mockCat);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: '507f191e810c19729de860ea' },
      { ...updateCatDto },
      { new: true },
    );
  });

  it('should delete a cat', async () => {
    const result = await service.remove('507f191e810c19729de860ea');
    expect(result).toEqual(mockCat);
    expect(model.findByIdAndDelete).toHaveBeenCalledWith(
      '507f191e810c19729de860ea',
    );
  });

  it('should throw an error if invalid id format on update', async () => {
    const updateCatDto: UpdateCatDto = {
      name: 'Updated Cat',
      age: 3,
      breed: 'Updated Breed',
    };
    await expect(service.update('invalid-id', updateCatDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error if invalid id format on delete', async () => {
    await expect(service.remove('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
  });
});
