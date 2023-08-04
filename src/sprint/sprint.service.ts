import { Injectable } from '@nestjs/common';
import { Sprint } from './sprint.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SprintService {
    constructor(
        @InjectRepository(Sprint)
        private readonly sprintRepository: Repository<Sprint>,
    ) {}
}
