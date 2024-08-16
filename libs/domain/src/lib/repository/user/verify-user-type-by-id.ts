export interface VerifyUserTypeByIdRepository {
  verify(id: string): Promise<string>;
}
