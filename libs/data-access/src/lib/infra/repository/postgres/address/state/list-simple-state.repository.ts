import { Inject } from '@nestjs/common';
import {
  ListSimpleStateDto,
  ListSimpleStateRepository,
  ListSimpleStateResponseDto,
} from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ListSimpleStateRepositoryImpl
  implements ListSimpleStateRepository
{
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async list(input: ListSimpleStateDto): Promise<ListSimpleStateResponseDto[]> {
    const listStates = await this.prismaService.state.findMany({
      where: {
        coutry_id: input.countryId,
      },
      select: {
        ur: true,
        name: true,
        state_id: true,
      },
    });

    const mappedSimpleState: ListSimpleStateResponseDto[] = listStates.map(
      (state) => {
        return {
          id: state.state_id,
          name: state.name,
          uf: state.ur,
        };
      }
    );

    return mappedSimpleState;
  }
}
