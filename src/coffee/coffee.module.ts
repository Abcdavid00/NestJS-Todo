import { Module } from '@nestjs/common';
import { CoffeeResolver } from './coffee.resolver';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './coffee.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Coffee])
    ],
    providers: [CoffeeResolver, CoffeeService],
})
export class CoffeeModule {}
