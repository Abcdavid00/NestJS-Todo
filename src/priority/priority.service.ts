import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority } from './priority.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PriorityService {
    constructor(
        @InjectRepository(Priority) private priorityRepository: Repository<Priority>,
    ) {}

    async getAll(): Promise<Priority[]> {
        return this.priorityRepository.find();
    }

    async getPriority(id: string): Promise<Priority | undefined> {
        return this.priorityRepository.findOne({ where: { id } });
    }

    async create(name: string): Promise<Priority> {
       
        const priority = this.priorityRepository.create({
            name,
        });
        return this.priorityRepository.save(priority);
    }
}
