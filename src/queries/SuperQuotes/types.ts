export interface SuperQuote {
  quoteNumber: string;
  bidId: string;
  buyerName: string;
}

export interface SearchQuoteParams {
  search: string;
  poId?: string;
}
