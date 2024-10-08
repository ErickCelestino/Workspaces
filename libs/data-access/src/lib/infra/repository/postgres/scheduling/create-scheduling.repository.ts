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
    const {
      loggedUserId,
      companyId,
      body: { name, priority, startTime, endTime, lopping },
    } = input;

    const schedulingResult = await this.prismaService.scheduling.create({
      data: {
        user_id: loggedUserId,
        company_id: companyId,
        name,
        start_time: startTime,
        end_time: endTime,
        looping: lopping,
        priority: parseInt(priority),
      },
    });

    return schedulingResult.scheduling_id;
  }
}
