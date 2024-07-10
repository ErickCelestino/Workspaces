export interface FindFileInFileToPlaylistRepository {
  find(id: string): Promise<string>;
}
