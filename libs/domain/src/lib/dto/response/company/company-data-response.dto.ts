import { CompanyAddressResponseDto } from './company-address-response.dto';
import { companySimpleResponseDto } from './company-simple-response.dto';

export interface CompanyDataResponseDto {
  port: string;
  opening: string;
  situation: string;
  legalNature: string;
  phone: string;
  simple: companySimpleResponseDto;
  address: CompanyAddressResponseDto;
}
