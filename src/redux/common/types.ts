export interface Content {
  id: number;
  createdAt: string;
  updatedAt: string;
  value: string;
  displayName: string;
}

export type ContentStore = {
  shipVia: Content[];
};
