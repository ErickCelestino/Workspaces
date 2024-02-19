export interface HashGenerator {
  hash(input: string): Promise<string>;
}
