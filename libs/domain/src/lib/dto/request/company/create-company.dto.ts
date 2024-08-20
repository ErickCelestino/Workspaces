import { BodyCompanyDto } from './body-company.dto';

export interface CreateCompanyDto {
  body: BodyCompanyDto;
  loggedUserId: string;
}
