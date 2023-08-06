import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { hash, compare } from 'bcrypt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async registerUser(username: string, password: string, email: string, displayName: string) {
        const checker: Promise<boolean>[] = [
            this.userService.checkUsername(username),
            this.userService.checkEmail(email),
        ]
        const [nameCheck, emailCheck] = await Promise.all(checker);
        if (!nameCheck) {
            throw new ConflictException('Username already exists');
        }
        if (!emailCheck) {
            throw new ConflictException('Email already exists');
        }
        const hashedPassword = await hash(password, 10);
        const user = await this.userService.createUser(username, hashedPassword, email, displayName);
        return user;
    }

    async LogIn(usernameOrEmail: string, password: string): Promise<[User, string]> {
        const user = await this.userService.getByUsernameOrEmail(usernameOrEmail);
        if (!user) {
            throw new NotFoundException('Invalid username or email');
        }
        const passwordValid = await compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        const payload = { username: user.username, sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        return [user, token]
    }

}
