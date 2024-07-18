import { Inject } from '@nestjs/common';
import {
  CreateSchedulingDto,
  CreateSchedulingRepository,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateSchedulingRepositoryImpl
  implements CreateSchedulingRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateSchedulingDto): Promise<string> {
    const { loggedUserId, name, startTime, endTime, lopping, priority } = input;
    const schedulingResult = await this.prismaService.scheduling.create({
      data: {
        user_id: loggedUserId,
        name,
        start_time: new Date(startTime),
        end_time: new Date(endTime),
        looping: lopping,
        priority,
      },
    });

    return schedulingResult.scheduling_id;
  }
}
