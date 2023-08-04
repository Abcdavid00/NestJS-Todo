import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintResolver } from './sprint.resolver';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from './sprint.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Sprint])
  ],
  providers: [SprintService, SprintResolver]
})
export class SprintModule {}
