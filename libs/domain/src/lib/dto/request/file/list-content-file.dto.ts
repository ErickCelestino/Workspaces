export interface ListContentFileDto {
  userInput: string;
  loggedUserId: string;
  directoryId: string;
  take?: number;
  skip?: number;
}
