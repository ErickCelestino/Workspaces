import { Inject } from '@nestjs/common';
import { CreateUserDto, CreateUserRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateUserRepositoryImpl implements CreateUserRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async create(input: CreateUserDto): Promise<string> {
    const { name, nickname, birthDate, appId } = input;

    await this.prismaService.user.create({
      data: {
        name: name,
        nick_name: nickname,
        birth_date: new Date(birthDate),
      },
    });
    const resultUser = await this.prismaService.user.findFirst({
      where: {
        nick_name: nickname,
      },
    });

    const id = resultUser?.user_id == undefined ? '' : resultUser?.user_id;

    await this.prismaService.user_X_Application.create({
      data: {
        app_id: appId,
        user_id: id,
      },
    });

    return id;
  }
}
