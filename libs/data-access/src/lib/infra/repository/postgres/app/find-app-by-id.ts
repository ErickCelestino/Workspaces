import { Inject } from '@nestjs/common';
import { App, FindAppByIdRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class FindAppByIdRepositoryImpl implements FindAppByIdRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async find(input: string): Promise<App> {
    const findedApp = await this.prismaService.application.findFirst({
      where: {
        app_id: input,
      },
      select: {
        app_id: true,
        name: true,
      },
    });

    const mappedApp: App = {
      id: findedApp?.app_id ?? '',
      name: findedApp?.name ?? '',
    };

    return mappedApp;
  }
}
