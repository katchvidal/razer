export interface IStripeCustomer {
  id: string;
  name: string;
  emaail: string;
  description?: string;
  default_source?: string;
  currency?: string;
  phone?: string;
}
