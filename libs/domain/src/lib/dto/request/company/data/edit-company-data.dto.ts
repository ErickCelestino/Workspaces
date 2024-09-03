import { CompanyDataBodyDto } from './company-body-data.dto';

export interface EditCompanyDataDto {
  loggedUserId: string;
  companyId: string;
  body: CompanyDataBodyDto;
}
