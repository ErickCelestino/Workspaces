import { Inject } from '@nestjs/common';
import {
  ListSchedulesDto,
  ListSchedulesReponseDto,
  ListSchedulesRepository,
  Scheduling,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListSchedulesRepositoryImpl implements ListSchedulesRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  transformTime(time: Date) {
    const horas: number = time.getHours();
    const minutos: number = time.getMinutes();
    return `${horas}:${minutos ? minutos === 0 : '00'}`;
  }

  async list(input: ListSchedulesDto): Promise<ListSchedulesReponseDto> {
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
        endTime: this.transformTime(scheduling.end_time),
        lopping: scheduling.looping,
        name: scheduling.name,
        priority: `${scheduling.priority}`,
        startTime: this.transformTime(scheduling.start_time),
      };
    });

    return {
      schedules: mappedScheduling,
      filteredTotal,
      total,
      totalPages,
    };
  }
}
