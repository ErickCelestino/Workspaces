import { PlaylistCategoryBodyDto } from './create-playlist-category-body.dto';

export interface CreatePlaylistCategoryDto {
  loggedUserId: string;
  body: PlaylistCategoryBodyDto;
}
