import { AddPlaylistToSchedulingDto } from '../../dto';

export interface AddPlaylistsToSchedulingRepository {
  add(input: AddPlaylistToSchedulingDto): Promise<string>;
}
