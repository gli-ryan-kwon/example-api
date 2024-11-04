import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockCat = {
  _id: '507f191e810c19729de860ea',
  name: 'Test Cat',
  age: 2,
  breed: 'Test Breed',
};

const mockCatsService = {
  create: jest.fn().mockResolvedValue(mockCat),
  findAll: jest.fn().mockResolvedValue([mockCat]),
  findOne: jest.fn().mockResolvedValue(mockCat),
  update: jest.fn().mockResolvedValue(mockCat),
  remove: jest.fn().mockResolvedValue(mockCat),
};

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: mockCatsService,
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a cat', async () => {
    const createCatDto: CreateCatDto = {
      name: 'Test Cat',
      age: 2,
      breed: 'Test Breed',
    };
    const result = await controller.create(createCatDto);
    expect(result).toEqual(mockCat);
    expect(service.create).toHaveBeenCalledWith(createCatDto);
  });

  it('should return all cats', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockCat]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a cat by id', async () => {
    const result = await controller.findOne('507f191e810c19729de860ea');
    expect(result).toEqual(mockCat);
    expect(service.findOne).toHaveBeenCalledWith('507f191e810c19729de860ea');
  });

  it('should update a cat', async () => {
    const updateCatDto: UpdateCatDto = {
      name: 'Updated Cat',
      age: 3,
      breed: 'Updated Breed',
    };
    const result = await controller.update(
      '507f191e810c19729de860ea',
      updateCatDto,
    );
    expect(result).toEqual(mockCat);
    expect(service.update).toHaveBeenCalledWith(
      '507f191e810c19729de860ea',
      updateCatDto,
    );
  });

  it('should delete a cat', async () => {
    const result = await controller.remove('507f191e810c19729de860ea');
    expect(result).toEqual(mockCat);
    expect(service.remove).toHaveBeenCalledWith('507f191e810c19729de860ea');
  });

  it('should throw a BadRequestException if invalid id format on findOne', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValueOnce(new BadRequestException('Invalid ID format'));
    await expect(controller.findOne('invalid-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw a NotFoundException if cat not found on findOne', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValueOnce(new NotFoundException('Cat not found'));
    await expect(
      controller.findOne('507f191e810c19729de860eb'),
    ).rejects.toThrow(NotFoundException);
  });
});
