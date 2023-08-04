import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Coffee } from './coffee.entity';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee) private coffeeRepository: Repository<Coffee>,
  ) {}

  async findOneById(id: string): Promise<Coffee | undefined> {
    const options: FindOneOptions<Coffee> = { where: { id } };
    return this.coffeeRepository.findOne(options);
  }

  async findAll(): Promise<Coffee[]> {
    return this.coffeeRepository.find();
  }

  async create(
    name: string,
    sPrice: number,
    mPrice: number,
    lPrice: number,
    description: string,
  ): Promise<Coffee> {
    const coffee = this.coffeeRepository.create({
      name,
      sPrice,
      mPrice,
      lPrice,
      description,
      // createdAt: new Date().toISOString()
    });
    return this.coffeeRepository.save(coffee);
  }
}
