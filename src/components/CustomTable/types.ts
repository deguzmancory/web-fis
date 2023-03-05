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
}

export interface BaseTableCell {
  content: string | React.ReactNode;
  name?: string;
  subContent?: string | React.ReactNode;
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
}

export type BodyBasicRows = BodyBasicRow[];