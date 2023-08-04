import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Error enum

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

  // async registerUser(
  //   username: string,
  //   password: string,
  //   email: string,
  //   displayName: string,
  // ): Promise<User | undefined> {
  //   const checker: Promise<boolean>[] = [
  //     this.checkUsername(username),
  //     this.checkEmail(email),
  //   ];
  //   const [nameCheck, emailCheck] = await Promise.all(checker);
  //   console.log(nameCheck, emailCheck);
  //   if (!nameCheck) {
  //     return [undefined, ErrorCode.UsernameAlreadyExists];
  //   }
  //   if (!emailCheck) {
  //     return [undefined, ErrorCode.EmailAlreadyExists];
  //   }
  //   const now = new Date().toISOString();
  //   const hashedPassword = await hash(password, 10);
  //   const user = this.userRepository.create({
  //     username,
  //     password: hashedPassword,
  //     email,
  //     displayName,
  //   });
  //   return [await this.userRepository.save(user), ErrorCode.Success];
  // }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
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

  async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }

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

  // async login(nameOrEmail: string, password: string): Promise<[User| undefined, ErrorCode]> {
  //   const user = await this.userRepository.findOne({
  //     where: [{ username: nameOrEmail }, { email: nameOrEmail }],
  //   });
  //   if (!user) {
  //     return [undefined, ErrorCode.UserNotFound];
  //   }
  //   const match = await compare(password, user.password);
  //   if (!match) {
  //     return [undefined, ErrorCode.InvalidPassword];
  //   }
  //   return [user, ErrorCode.Success];
  // }
}
