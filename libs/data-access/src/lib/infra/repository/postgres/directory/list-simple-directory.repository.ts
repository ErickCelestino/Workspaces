import { Inject } from '@nestjs/common';
import {
  ListDirectoryNameResponseDto,
  ListSimpleDirectoryDto,
  ListSimpleDirectoryRepository,
  ListSimpleDirectoryResponseDto,
} from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class ListSimpleDirectoryRepositoryImpl
  implements ListSimpleDirectoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(
    input: ListSimpleDirectoryDto
  ): Promise<ListSimpleDirectoryResponseDto> {
    const { loggedUserId, companyId, userInput } = input;
    const skip = input?.skip || 0;
    const take = input?.take || 6;
    const whereClause = {
      user_id: loggedUserId,
      company_id: companyId,
      ...(userInput !== ''
        ? {
            name: {
              contains: userInput,
              mode: 'insensitive' as const,
            },
          }
        : {}),
    };

    const [directories, filteredTotal, total] =
      await this.prismaService.generalPrisma.$transaction([
        this.prismaService.generalPrisma.directory.findMany({
          where: whereClause,
          select: {
            name: true,
            directory_id: true,
          },
          skip: parseInt(skip.toString()),
          take: parseInt(take.toString()),
        }),
        this.prismaService.generalPrisma.directory.count({
          where: whereClause,
        }),
        this.prismaService.generalPrisma.directory.count({
          where: {
            user_id: loggedUserId,
            company_id: companyId,
          },
        }),
      ]);

    const totalPages = Math.ceil(filteredTotal / take);

    const mappedDirectoryList: ListDirectoryNameResponseDto[] = directories.map(
      (directory) => {
        return {
          id: directory.directory_id,
          name: directory.name,
        };
      }
    );

    return {
      directories: mappedDirectoryList,
      filteredTotal,
      total,
      totalPages,
    };
  }
}
