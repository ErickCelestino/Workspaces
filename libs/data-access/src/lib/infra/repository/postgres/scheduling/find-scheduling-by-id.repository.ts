import { Inject } from '@nestjs/common';
import {
  FindSchedulingByIdRepository,
  FormatDateInTime,
  Scheduling,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindSchedulingByIdRepositoryImpl
  implements FindSchedulingByIdRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async find(id: string): Promise<Scheduling> {
    const filteredScheduling = await this.prismaService.scheduling.findUnique({
      where: {
        scheduling_id: id,
      },
      select: {
        scheduling_id: true,
        name: true,
        looping: true,
        start_time: true,
        end_time: true,
        created_at: true,
        priority: true,
        user: {
          select: {
            nick_name: true,
          },
        },
      },
    });

    const mappedScheduling: Scheduling = {
      id: filteredScheduling?.scheduling_id ?? '',
      name: filteredScheduling?.name ?? '',
      endTime: FormatDateInTime(new Date(filteredScheduling?.end_time ?? '')),
      startTime: FormatDateInTime(
        new Date(filteredScheduling?.start_time ?? '')
      ),
      lopping: filteredScheduling?.looping ?? false,
      priority: `${filteredScheduling?.priority}` ?? '',
      createBy: filteredScheduling?.user?.nick_name ?? '',
      createdAt: filteredScheduling?.created_at ?? new Date(),
    };

    return mappedScheduling;
  }
}
