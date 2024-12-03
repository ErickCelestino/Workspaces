import { Inject } from '@nestjs/common';
import { CreateAuthDto, CreateAuthRepository } from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class CreateAuthRepositoryImpl implements CreateAuthRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async create(input: CreateAuthDto): Promise<void> {
    await this.prismaService.generalPrisma.auth.create({
      data: {
        email: input.email,
        password: input.password,
        user_id: input.userId,
      },
    });

    return undefined;
  }
}
