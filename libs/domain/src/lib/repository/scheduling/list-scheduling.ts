import { ListSchedulingDto, ListSchedulingReponseDto } from '../../dto';

export interface ListSchedulingRepository {
  list(input: ListSchedulingDto): Promise<ListSchedulingReponseDto>;
}
