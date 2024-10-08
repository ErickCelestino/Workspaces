import { Inject } from '@nestjs/common';
import {
  CreateDirectoryDto,
  CreateDirectoryRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateDirectoryRepositoryImpl
  implements CreateDirectoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async create(input: CreateDirectoryDto): Promise<string> {
    const { body, loggedUserId, companyId } = input;

    const createdDirectory = await this.prismaService.directory.create({
      data: {
        name: body.name,
        user_id: loggedUserId,
        company_id: companyId,
      },
    });

    return createdDirectory.directory_id;
  }
}
