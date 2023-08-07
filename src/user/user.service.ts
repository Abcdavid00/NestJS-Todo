import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindOneOptions, In, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async checkUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    return user == undefined || user == null;
  }

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user == undefined || user == null;
  }

  async createUser(
    username: string,
    hashedPassword: string,
    email: string,
    displayName: string,
  ) : Promise<User> {
    const checker: Promise<boolean>[] = [
      this.checkUsername(username),
      this.checkEmail(email),
    ]
    const [nameCheck, emailCheck] = await Promise.all(checker);
    if (!nameCheck) {
      throw new ConflictException('Username already exists');
    }
    if (!emailCheck) {
      throw new ConflictException('Email already exists');
    }
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      displayName,
    });
    return this.userRepository.save(user);
  }

  userRelationOptions: FindOneOptions<User> = {
    relations: {
      administratingSprints: true,
      joinedSprints: true,
      tasks: true,
    }
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, ...this.userRelationOptions});
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async getUsers(id: string[]): Promise<User[]> {
    return await this.userRepository.findBy({ id: In(id)});
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username }, ...this.userRelationOptions});
    console.log("User: ", user)
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email }, ...this.userRelationOptions });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateUsername(
    id: string,
    username: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const nameCheck = await this.checkUsername(username);
    if (!nameCheck) {
      throw new ConflictException("Username already exists");
    }
    user.username = username;
    return await this.userRepository.save(user);
  }

  async updateEmail(
    id: string,
    email: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const emailCheck = await this.checkEmail(email);
    if (!emailCheck) {
      throw new ConflictException("Email already exists");
    }
    user.email = email;
    return await this.userRepository.save(user);
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const isPasswordCorrect = await compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException("Password is incorrect");
    }
    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }

  // async updatePassword(id: string, password: string): Promise<User> {
  //   const user = await this.userRepository.findOne({ where: { id } });
  //   if (!user) {
  //     throw new NotFoundException("User not found");
  //   }
  //   const hashedPassword = await hash(password, 10);
  //   user.password = hashedPassword;
  //   return await this.userRepository.save(user);
  // }

  async updateDisplayName(id: string, displayName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.displayName = displayName;
    return await this.userRepository.save(user);
  }

  async updatePhone(id: string, phone: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.phone = phone;
    return await this.userRepository.save(user);
  }

  async getByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });
  }
}
