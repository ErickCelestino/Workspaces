import { SignInDto } from '../../dto';

export interface SignInRepository {
  sign(input: SignInDto): Promise<string>;
}
