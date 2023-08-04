import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './auth.module';
import * as request from 'supertest';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private JwtService: JwtService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = GqlExecutionContext.create(context).getContext().req;
    const token = request.headers.authorization;
    console.log("Token: ", token);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.JwtService.verifyAsync(
        token.replace('Bearer ', ''),
        {
          secret: JWT_SECRET,
        }
      );
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}

