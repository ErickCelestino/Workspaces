import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@workspaces/prisma/marketing';

@Injectable()
export class PrismaMarketingService implements OnModuleDestroy {
  private prisma = new PrismaClient();

  constructor() {
    this.prisma.$connect().then(() => console.log('Marketing DB connected'));
  }

  get marketingPrisma(): PrismaClient {
    return this.prisma;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('Marketing DB disconnected');
  }
}
