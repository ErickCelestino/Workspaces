export interface CreateAddressDto {
  city_id: string;
  district: string;
  street: string;
  number: string;
  complement?: string;
  zipcode: string;
}
