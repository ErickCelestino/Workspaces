import { EntityNotEmpty, EntityNotExists } from '../error';
import { FindPlaylistByIdRepository } from '../repository';
import { left, right } from '../shared/either';

export async function ValidationPlaylistId(
  id: string,
  findPlaylistByIdRepository: FindPlaylistByIdRepository
) {
  if (Object.keys(id).length < 1) {
    return left(new EntityNotEmpty('Playlist ID'));
  }

  const filteredPlaylist = await findPlaylistByIdRepository.find(id);

  if (Object.keys(filteredPlaylist?.id ?? filteredPlaylist).length < 1) {
    return left(new EntityNotExists('Playlist'));
  }

  return right(undefined);
}
