import { Inject } from '@nestjs/common';
import { CreateDeviceDto, CreateDeviceRepository } from '@workspaces/domain';
import { PrismaService } from '../../../../application';

export class CreateDeviceRepositoryImpl implements CreateDeviceRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async create(input: CreateDeviceDto): Promise<string> {
    const {
      body: { name },
      loggedUserId,
      companyId,
    } = input;

    const createdDevice = await this.prismaService.generalPrisma.device.create({
      data: {
        name: name,
        user_id: loggedUserId,
        company_id: companyId,
      },
    });

    return createdDevice.device_id;
  }
}
