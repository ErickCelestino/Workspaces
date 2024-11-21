import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as GeneralPrismaClient } from '@workspaces/prisma/general';
import { PrismaClient as MarketingPrismaClient } from '@workspaces/prisma/marketing';

@Injectable()
export class PrismaService implements OnModuleInit {
  generalPrisma: GeneralPrismaClient;
  marketingPrisma: MarketingPrismaClient;

  constructor() {
    this.generalPrisma = new GeneralPrismaClient();
    this.marketingPrisma = new MarketingPrismaClient();
  }

  async onModuleInit() {
    await this.generalPrisma.$connect();
    await this.marketingPrisma.$connect();
    console.log('open alls banks');
  }

  async onModuleDestroy() {
    await this.generalPrisma.$disconnect();
    await this.marketingPrisma.$disconnect();
    console.log('closed alls banks');
  }
}
