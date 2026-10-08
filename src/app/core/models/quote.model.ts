export interface CreateQuoteDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  petName: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  hasPreExistingCondition: boolean;
  annualLimit: number;
  deductible: number;
  reimbursementPct: number;
  wellness: boolean;
}

export interface QuoteListItem {
  quoteId: number;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  petName: string;
  species: string;
  breed: string;
  status: string;
  finalPremium: number;
  createdDate: string;
  expiryDate: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardMetrics {
  totalQuotes: number;
  activeQuotes: number;
  convertedQuotes: number;
  expiredQuotes: number;
  cancelledQuotes: number;
  averagePremium: number;
  quotesByStatus: Record<string, number>;
}

export interface QuoteDetail {
  quoteId: number;
  quoteNumber: string;
  customerName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  petName: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  hasPreExistingCondition: boolean;
  status: string;
  createdDate: string;
  expiryDate: string;
  basePremium: number;
  ageAdjustment: number;
  wellnessAmount: number;
  discountAmount: number;
  finalPremium: number;
  annualLimit: number;
  deductible: number;
  reimbursementPct: number;
  wellness: boolean;
}