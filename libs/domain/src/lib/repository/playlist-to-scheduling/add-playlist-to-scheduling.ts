import { AddPlaylistToSchedulingDto } from '../../dto';

export interface AddPlaylistToSchedulingRepository {
  add(input: AddPlaylistToSchedulingDto): Promise<string>;
}
