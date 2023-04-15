import { SxProps } from '@mui/system';

export enum DEFAULT_TABLE_VALUE {
  COL_SPAN = 1,
  ROW_SPAN = 1,
}

export enum CellType {
  DEFAULT = 'default',
  INPUT = 'input',
  CURRENCY_INPUT = 'currency-input',
  CURRENCY_VALUE = 'currency-value',
  PRINT_CELL = 'print-cell',
  PRINT_CELL_RIGHT = 'print-cell-right',
}

export interface BaseTableCell {
  hide?: boolean;
  content: React.ReactNode;
  name?: string;
  subContent?: React.ReactNode;
  rowSpan?: number;
  colSpan?: number;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
  type?: CellType;
}

/* Table Layout */
export interface HeaderColumn extends BaseTableCell {}

export interface HeaderRow {
  columns: HeaderColumn[];
  style?: SxProps;
  className?: string;
}

export type HeaderRows = HeaderRow[];

export interface BodyColumn extends BaseTableCell {
  isHeaderColumn?: boolean;
}

export interface BodyRow {
  columns: BodyColumn[];
  style?: SxProps;
  className?: string;
  isHeaderRow?: boolean;
  errorMessage?: string;
}

export type BodyRows = BodyRow[];

/* Basic Layout */
export interface BodyBasicColumn extends BaseTableCell {
  isHeaderColumn?: boolean;
  label?: string | React.ReactNode;
  headerStyle?: React.CSSProperties;
  headerClassName?: string;
}

export interface BodyBasicRow {
  columns: BodyBasicColumn[];
  style?: SxProps;
  className?: string;
  isHeaderRow?: boolean;
  errorMessage?: string;
}

export type BodyBasicRows = BodyBasicRow[];
