/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  private _generalPrisma: any = null;
  private _marketingPrisma: any = null;

  // Usamos getters para instanciar os clientes quando necessário
  get generalPrisma(): any {
    if (!this._generalPrisma) {
      this._generalPrisma = new (require('@workspaces/prisma/general')).PrismaClient();
      this._generalPrisma.$connect().then(() => console.log('General DB connected'));
    }
    return this._generalPrisma;
  }

  get marketingPrisma(): any {
    if (!this._marketingPrisma) {
      this._marketingPrisma = new (require('@workspaces/prisma/marketing')).PrismaClient();
      this._marketingPrisma.$connect().then(() => console.log('Marketing DB connected'));
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
