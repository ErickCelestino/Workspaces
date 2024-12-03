import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as GeneralPrismaClient } from '@workspaces/prisma/general';
import { PrismaClient as MarketingPrismaClient } from '@workspaces/prisma/marketing';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  private _generalPrisma: GeneralPrismaClient | null = null;
  private _marketingPrisma: MarketingPrismaClient | null = null;

  get generalPrisma(): GeneralPrismaClient {
    if (!this._generalPrisma) {
      this._generalPrisma = new GeneralPrismaClient();
      this._generalPrisma
        .$connect()
        .then(() => console.log('General DB connected'));
    }
    return this._generalPrisma;
  }

  get marketingPrisma(): MarketingPrismaClient {
    if (!this._marketingPrisma) {
      this._marketingPrisma = new MarketingPrismaClient();
      this._marketingPrisma
        .$connect()
        .then(() => console.log('Marketing DB connected'));
    }
    return this._marketingPrisma;
  }

  async onModuleDestroy() {
    if (this._generalPrisma) {
      await this._generalPrisma.$disconnect();
      console.log('General DB disconnected');
    }
    if (this._marketingPrisma) {
      await this._marketingPrisma.$disconnect();
      console.log('Marketing DB disconnected');
    }
  }
}
