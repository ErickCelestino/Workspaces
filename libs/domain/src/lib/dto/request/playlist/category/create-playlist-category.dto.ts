import { CreatePlaylistCategoryBodyDto } from './create-playlist-category-body.dto';

export interface CreatePlaylistCategoryDto {
  loggedUserId: string;
  body: CreatePlaylistCategoryBodyDto;
}
