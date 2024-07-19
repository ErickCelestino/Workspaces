import { Inject } from '@nestjs/common';
import {
  ListSchedulingDto,
  ListSchedulingReponseDto,
  ListSchedulingRepository,
  Scheduling,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListSchedulingRepositoryImpl implements ListSchedulingRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(input: ListSchedulingDto): Promise<ListSchedulingReponseDto> {
    const { loggedUserId, filter } = input;

    const skip = input?.skip || 0;
    const take = input?.take || 6;

    const whereClause = {
      user_id: loggedUserId,
      ...(filter !== ''
        ? {
            name: {
              contains: filter,
              mode: 'insensitive' as 'insensitive',
            },
          }
        : {}),
    };

    const [scheduling, filteredTotal, total] =
      await this.prismaService.$transaction([
        this.prismaService.scheduling.findMany({
          where: whereClause,
          select: {
            scheduling_id: true,
            created_at: true,
            name: true,
            start_time: true,
            end_time: true,
            looping: true,
            priority: true,
            user: {
              select: {
                nick_name: true,
              },
            },
          },
          skip: parseInt(skip.toString()),
          take: parseInt(take.toString()),
        }),
        this.prismaService.scheduling.count({
          where: whereClause,
        }),
        this.prismaService.scheduling.count({
          where: {
            user_id: loggedUserId,
          },
        }),
      ]);

    const totalPages = Math.ceil(filteredTotal / take);

    const mappedScheduling: Scheduling[] = scheduling.map((scheduling) => {
      return {
        id: scheduling.scheduling_id,
        createBy: scheduling.user.nick_name,
        createdAt: scheduling.created_at,
        endTime: `${scheduling.end_time}`,
        lopping: scheduling.looping,
        name: scheduling.name,
        priority: `${scheduling.priority}`,
        startTime: `${scheduling.start_time}`,
      };
    });

    return {
      scheduling: mappedScheduling,
      filteredTotal,
      total,
      totalPages,
    };
  }
}
