import { Inject } from '@nestjs/common';
import {
  Device,
  ListDeviceDto,
  ListDeviceRepository,
  ListDeviceResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListDeviceRepositoryImpl implements ListDeviceRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(input: ListDeviceDto): Promise<ListDeviceResponseDto> {
    const { loggedUserId, companyId, filter } = input;

    const skip = input?.skip || 0;
    const take = input?.take || 6;

    const whereClause = {
      user_id: loggedUserId,
      company_id: companyId,
      ...(filter !== ''
        ? {
            name: {
              contains: filter,
              mode: 'insensitive' as const,
            },
          }
        : {}),
    };

    const [devices, filteredTotal, total] =
      await this.prismaService.$transaction([
        this.prismaService.device.findMany({
          where: whereClause,
          select: {
            device_id: true,
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
        this.prismaService.device.count({
          where: whereClause,
        }),
        this.prismaService.device.count({
          where: {
            user_id: loggedUserId,
          },
        }),
      ]);

    const totalPages = Math.ceil(filteredTotal / take);

    const mappedDevices: Device[] = devices.map((device) => ({
      createdAt: device.created_at ?? new Date(),
      createdBy: device.user?.nick_name ?? '',
      id: device.device_id ?? '',
      name: device.name ?? '',
    }));

    return {
      devices: mappedDevices,
      filteredTotal,
      total,
      totalPages,
    };
  }
}
