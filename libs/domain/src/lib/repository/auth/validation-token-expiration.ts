export interface ValidationTokenExpirationRepository {
  validate(token: string): Promise<boolean>;
}
