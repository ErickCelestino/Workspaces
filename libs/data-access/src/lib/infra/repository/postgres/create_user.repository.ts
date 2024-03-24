import { Inject } from '@nestjs/common';
import { CreateUserDto, CreateUserRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateUserRepositoryImpl implements CreateUserRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async create(input: CreateUserDto): Promise<void> {
    const { name, nickname, birthDate } = input;
    await this.prismaService.user.create({
      data: {
        name: name,
        nick_name: nickname,
        birth_date: new Date(birthDate),
      },
    });

    return undefined;
  }
}
