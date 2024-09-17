import {
  ListUsersByCompanyIdDto,
  ListUsersByCompanyResponseDto,
} from '../../../dto';

export interface ListUsersByCompanyIdRepository {
  list(input: ListUsersByCompanyIdDto): Promise<ListUsersByCompanyResponseDto>;
}
