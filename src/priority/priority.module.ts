import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Priority } from './priority.entity';
import { PriorityResolver } from './priority.resolver';
import { PriorityService } from './priority.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Priority])
    ],
    exports: [PriorityService],
    providers: [PriorityResolver, PriorityService],
    
})
export class PriorityModule {}
