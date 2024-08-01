import { Inject } from '@nestjs/common';
import { CreateDeviceDto, CreateDeviceRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateDeviceRepositoryImpl implements CreateDeviceRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateDeviceDto): Promise<string> {
    const {
      body: { name },
      loggedUserId,
    } = input;

    const createdDevice = await this.prismaService.device.create({
      data: {
        name: name,
        user_id: loggedUserId,
      },
    });

    return createdDevice.device_id;
  }
}
