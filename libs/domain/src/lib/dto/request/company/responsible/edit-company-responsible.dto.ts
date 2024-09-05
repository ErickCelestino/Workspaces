import { CompanyBodyResponsibleDto } from './company-body-responsible.dto';

export interface EditCompanyResponsibleDto {
  loggedUserId: string;
  companyResponsibleId: string;
  body: CompanyBodyResponsibleDto;
}
