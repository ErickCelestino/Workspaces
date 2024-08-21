export interface CompanyAddressResponseDto {
  number: string;
  district: string;
  city: string;
  state: string;
  street: string;
  zipcode: string;
  country: string;
  complement?: string;
}
