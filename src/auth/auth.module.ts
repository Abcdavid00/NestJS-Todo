import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

export const JWT_SECRET = process.env.JWT_SECRET;

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    })
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService]
})
export class AuthModule {}
