import { Inject } from '@nestjs/common';
import {
  ListDirectoryNameResponseDto,
  ListSimpleDirectoryDto,
  ListSimpleDirectoryRepository,
  ListSimpleDirectoryResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListSimpleDirectoryRepositoryImpl
  implements ListSimpleDirectoryRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(
    input: ListSimpleDirectoryDto
  ): Promise<ListSimpleDirectoryResponseDto> {
    const { loggedUserId, userInput } = input;
    const skip = input?.skip || 0;
    const take = input?.take || 6;
    const whereClause = {
      user_id: loggedUserId,
      ...(userInput !== ''
        ? {
            name: {
              contains: userInput,
              mode: 'insensitive' as 'insensitive',
            },
          }
        : {}),
    };

    const [directories, filteredTotal, total] =
      await this.prismaService.$transaction([
        this.prismaService.directory.findMany({
          where: whereClause,
          select: {
            name: true,
            directory_id: true,
          },
          skip: parseInt(skip.toString()),
          take: parseInt(take.toString()),
        }),
        this.prismaService.directory.count({
          where: whereClause,
        }),
        this.prismaService.directory.count({
          where: {
            user_id: loggedUserId,
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
