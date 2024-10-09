import { Inject } from '@nestjs/common';
import { EditProfileDto, EditProfileRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class EditProfileRepositoryImpl implements EditProfileRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async edit(input: EditProfileDto): Promise<string> {
    const {
      body: { name, birthDate, nickname },
      userId,
    } = input;

    const editedProfile = await this.prismaService.user.update({
      where: {
        user_id: userId,
      },
      data: {
        name,
        ...(Object.keys({ birthDate }).length > 1
          ? { birth_date: birthDate }
          : {}),
        nick_name: nickname,
        updated_at: new Date(),
      },
    });

    return editedProfile?.user_id ?? '';
  }
}
