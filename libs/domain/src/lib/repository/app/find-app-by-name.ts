import { App } from '../../entity';

export interface FindAppByNameRepository {
  find(input: string): Promise<App[]>;
}
