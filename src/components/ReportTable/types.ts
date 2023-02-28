import { SxProps } from '@mui/system';

export enum DEFAULT_TABLE_VALUE {
  COL_SPAN = 1,
  ROW_SPAN = 1,
}

export interface BaseReportTableItem {
  content: string | React.ReactNode;
  name?: string;
  subContent?: string | React.ReactNode;
  rowSpan?: number;
  colSpan?: number;
  style?: React.CSSProperties;
  className?: string;
}

export interface HeaderColumn extends BaseReportTableItem {}

export interface HeaderRow {
  columns: HeaderColumn[];
  style?: SxProps;
  className?: string;
}

export type HeaderRows = HeaderRow[];

export interface BodyColumn extends BaseReportTableItem {
  isHeaderColumn?: boolean;
}

export interface BodyRow {
  columns: BodyColumn[];
  style?: SxProps;
  className?: string;
  isHeaderRow?: boolean;
}

export type BodyRows = BodyRow[];
