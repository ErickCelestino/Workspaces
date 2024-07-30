import {
  ListPlaylistBySchedulingIdDto,
  ListPlaylistResponseDto,
  ListSchedulesReponseDto,
} from '../../dto';

export interface ListPlaylistBySchedulingIdRepository {
  list(input: ListPlaylistBySchedulingIdDto): Promise<ListPlaylistResponseDto>;
}
