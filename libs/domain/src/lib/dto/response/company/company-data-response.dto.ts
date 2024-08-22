import { CompanyAddressResponseDto } from './company-address-response.dto';
import { companySimpleResponseDto } from './company-simple-response.dto';

export interface CompanyDataResponseDto {
  id: string;
  port: string;
  opening: string;
  situation: string;
  legalNature: string;
  phone: string;
  responsibleEmail: string;
  simple: companySimpleResponseDto;
  address: CompanyAddressResponseDto[];
}
