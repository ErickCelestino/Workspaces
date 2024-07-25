import {
  ListPlaylistBySchedulingIdDto,
  ListSchedulesReponseDto,
} from '../../dto';

export interface ListPlaylistBySchedulingIdRepository {
  list(input: ListPlaylistBySchedulingIdDto): Promise<ListSchedulesReponseDto>;
}
