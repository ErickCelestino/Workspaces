export interface ValidateCNPJRepository {
  validate(input: string): Promise<boolean>;
}
