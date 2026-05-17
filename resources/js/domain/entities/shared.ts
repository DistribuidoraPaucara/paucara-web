// Frontend Domain Layer: shared types

export type Id = number | string;

export type Filters = {
  q?: string;
  [key: string]: string | number | boolean | undefined;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Pagination<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  links?: PaginationLink[];
};
