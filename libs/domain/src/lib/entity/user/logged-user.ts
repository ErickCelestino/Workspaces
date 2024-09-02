import { companySimpleResponseDto } from '../../dto';

export interface LoggedUser {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  selectedCompany: companySimpleResponseDto;
  companies: companySimpleResponseDto[];
}
