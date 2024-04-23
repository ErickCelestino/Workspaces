import { CreateAddressDto } from '../address';

export interface CreateCompanyAddressDto {
  address: CreateAddressDto;
  company_id: string;
}
