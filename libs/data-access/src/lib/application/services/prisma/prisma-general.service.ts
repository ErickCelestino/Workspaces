import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@workspaces/prisma/general';

@Injectable()
export class PrismaGeneralService implements OnModuleDestroy {
  private prisma = new PrismaClient();

  constructor() {
    this.prisma.$connect().then(() => console.log('General DB connected'));
  }

  get generalPrisma(): PrismaClient {
    return this.prisma;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('General DB disconnected');
  }
}
