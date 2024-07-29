import {
  ListPlaylistBySchedulingIdDto,
  ListPlaylistReponseDto,
  ListSchedulesReponseDto,
} from '../../dto';

export interface ListPlaylistBySchedulingIdRepository {
  list(input: ListPlaylistBySchedulingIdDto): Promise<ListPlaylistReponseDto>;
}
