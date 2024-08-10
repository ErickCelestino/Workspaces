import { Inject } from '@nestjs/common';
import {
  Directory,
  ListDirectoryDto,
  ListDirectoryRepository,
  ListDirectoryResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListDirectoryRepositoryImpl implements ListDirectoryRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(input: ListDirectoryDto): Promise<ListDirectoryResponseDto> {
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
            directory_id: true,
            created_at: true,
            name: true,
            user: {
              select: {
                nick_name: true,
              },
            },
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

    const mappedDirectory: Directory[] = directories.map((directory) => {
      return {
        id: directory.directory_id,
        name: directory.name,
      };
    });

    return {
      filteredTotal,
      total,
      totalPages,
      directories: mappedDirectory,
    };
  }
}
