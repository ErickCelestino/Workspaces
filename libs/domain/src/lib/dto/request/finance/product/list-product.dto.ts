export interface ListProductDto {
  userInput: string;
  loggedUserId: string;
  take?: number;
  skip?: number;
}
