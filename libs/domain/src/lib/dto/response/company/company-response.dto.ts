import { CompanyAddressResponseDto } from './company-address-response.dto';
import { CompanyDataResponseDto } from './company-data-response.dto';
import { CompanySimpleResponseDto } from './company-simple-response.dto';

export interface CompanyResponseDto {
  data: CompanyDataResponseDto;
  simple: CompanySimpleResponseDto;
  address: CompanyAddressResponseDto;
}
