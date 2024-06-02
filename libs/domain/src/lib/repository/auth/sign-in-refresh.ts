import { SignInDto } from '../../dto';
// import { AccessToken } from '../../entity';

export interface SignInRefreshRepository {
  sign(input: SignInDto): Promise<string>;
}
