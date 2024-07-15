import { MoveFilesToAnotherPlaylistDto } from '../../dto';

export interface MoveFileToAnotherPlaylistRepository {
  move(input: MoveFilesToAnotherPlaylistDto): Promise<void>;
}
