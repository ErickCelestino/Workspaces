export interface ListPlaylistDto {
  userInput: string;
  loggedUserId: string;
  take?: number;
  skip?: number;
}
