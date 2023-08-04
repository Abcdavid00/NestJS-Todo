import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo'
import { CoffeeModule } from './coffee/coffee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from './entities';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { SprintModule } from './sprint/sprint.module';
import { PriorityModule } from './priority/priority.module';
import { AuthModule } from './auth/auth.module';

const DATABASE = process.env.MYSQL_DATABASE;
const DATABASE_USER = process.env.MYSQL_USER;
const DATABASE_PASSWORD = process.env.MYSQL_PASSWORD;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE,
      entities: ENTITIES,
      synchronize: true,

    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      // typePaths: ['./**/*.graphql'],
      driver: ApolloDriver,
    }),
    // CoffeeModule,
    UserModule,
    TaskModule,
    SprintModule,
    PriorityModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
