import { Injectable } from '@nestjs/common';
import { Sprint } from './sprint.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class SprintService {
    constructor(
        @InjectRepository(Sprint)
        private readonly sprintRepository: Repository<Sprint>,
    ) {}

    createSprint(description: string, admin: User): Promise<Sprint> {
        const sprint = this.sprintRepository.create({
            description,
            admin,
        })
        return this.sprintRepository.save(sprint)
    }

    async getSprint(id: string): Promise<Sprint> {
        const sprint = await this.sprintRepository.findOne({ where: { id } })
        if (!sprint) {
            throw new Error("Sprint not found")
        }
        return sprint
    }

    
}
