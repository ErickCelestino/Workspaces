import { Inject } from '@nestjs/common';
import {
  UnauthorizeUserToCompanyDto,
  UnauthorizeUserToCompanyRepository,
} from '@workspaces/domain';
import { PrismaService } from '../../../../../application';

export class UnauthorizeUserToCompanyRepositoryImpl
  implements UnauthorizeUserToCompanyRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async auth(input: UnauthorizeUserToCompanyDto): Promise<string> {
    const { companyId, userId } = input;

    const unauthorizedUserCompany =
      await this.prismaService.generalPrisma.user_X_Company.delete({
        where: {
          user_id_company_id: {
            company_id: companyId,
            user_id: userId,
          },
        },
      });

    if (unauthorizedUserCompany) {
      const unauthorizedUserAuth =
        await this.prismaService.generalPrisma.auth.deleteMany({
          where: {
            user_id: userId,
          },
        });

      if (unauthorizedUserAuth.count > 0) {
        const userToApp =
          await this.prismaService.generalPrisma.user_X_Application.deleteMany({
            where: {
              user_id: userId,
            },
          });

        if (userToApp.count > 0) {
          await this.prismaService.generalPrisma.user.delete({
            where: {
              user_id: userId,
            },
          });
        }
      }
    }

    return unauthorizedUserCompany?.user_id ? `${userId}-${companyId}` : '';
  }
}
