export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
}
