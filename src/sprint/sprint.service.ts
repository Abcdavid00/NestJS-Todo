import { Injectable } from '@nestjs/common';
import { Sprint } from './sprint.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class SprintService {
    constructor(
        @InjectRepository(Sprint)
        private readonly sprintRepository: Repository<Sprint>,
        private readonly userService: UserService
    ) {}

    async createSprint(description: string, admin: User): Promise<Sprint> {
        admin = await this.userService.getUser(admin.id)
        const members: User[] = [admin]
        const sprint = this.sprintRepository.create({
            description,
            admin,
            members
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
