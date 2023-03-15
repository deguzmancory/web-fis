import {
  SxProps,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import React, { Fragment } from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { isEmpty } from 'src/validations';
import Element from '../common/Element';
import EmptyTable from '../EmptyTable';
import {
  BodyBasicRows,
  BodyRows,
  CellType,
  DEFAULT_TABLE_VALUE,
  HeaderRow,
  HeaderRows,
} from './types';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: COLOR_CODE.PRIMARY_900,
    color: theme.palette.common.white,
    padding: '4px 16px',
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '4px 16px',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderBottom: COLOR_CODE.DEFAULT_BORDER,
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));

export const cellBaseStyles = {
  fontSize: 14,
};
export const cellCurrencyValueStyles = {
  ...cellBaseStyles,
  width: 140,
  maxWidth: 140,
  textAlign: 'right' as const,
};
export const cellCurrencyInputStyles = {
  ...cellCurrencyValueStyles,
  padding: '8px',
};
export const cellInputStyles = {
  ...cellBaseStyles,
  padding: '8px',
};

const getDefaultCellStyleByType = (cellType: CellType) => {
  switch (cellType) {
    case CellType.CURRENCY_INPUT:
      return cellCurrencyInputStyles;
    case CellType.CURRENCY_VALUE:
      return cellCurrencyValueStyles;
    case CellType.INPUT:
      return cellInputStyles;
    case CellType.DEFAULT:
      return {};

    default:
      return {};
  }
};

const renderRows = <
  T extends BodyRows &
    HeaderRows &
    BodyBasicRows & {
      isHeaderRow?: boolean;
    }
>(
  data: T,
  showBorder = false,
  hideRowError = false
) => {
  if (isEmpty(data)) return null;

  return data.map((row, rowIndex) => {
    const hasError = !isEmpty(row.errorMessage) && !hideRowError;

    return (
      <Fragment key={`row-table-${rowIndex}`}>
        <TableRow
          sx={{
            ...row.style,
            border: hasError ? COLOR_CODE.DEFAULT_TABLE_ERROR_BORDER : undefined,
          }}
          className={row.className}
        >
          {row.columns?.map((cell, cellIndex) => {
            if (cell.hide) return null;

            // render subContent
            let subContent;
            if (!cell.subContent) {
              subContent = null;
            } else {
              subContent =
                typeof cell.subContent === 'string' ? (
                  <Typography variant="subtitle1" sx={{ color: COLOR_CODE.WHITE }}>
                    {cell.subContent}
                  </Typography>
                ) : (
                  cell.subContent
                );
            }

            //render column as header column
            const isHeaderColumn = row?.isHeaderRow || cell?.isHeaderColumn;

            //get default cell style
            const defaultCellStyle = getDefaultCellStyleByType(cell?.type);

            return (
              <StyledTableCell
                key={`cell-table-${cellIndex}`}
                sx={{
                  [`&.${tableCellClasses.root}`]: { ...defaultCellStyle, ...cell.style },
                  border: showBorder ? COLOR_CODE.DEFAULT_BORDER : undefined,
                }}
                width={cell.width}
                height={cell.height}
                colSpan={cell.colSpan || DEFAULT_TABLE_VALUE.COL_SPAN}
                rowSpan={cell.rowSpan || DEFAULT_TABLE_VALUE.ROW_SPAN}
                className={cell.className}
                {...(isHeaderColumn && {
                  variant: 'head',
                })}
              >
                {cell.content}
                {subContent}
              </StyledTableCell>
            );
          })}
        </TableRow>
        {hasError && (
          <TableRow>
            <TableCell
              colSpan={row.columns?.length || DEFAULT_TABLE_VALUE.COL_SPAN}
              sx={{ padding: 1 }}
            >
              <Typography variant="subtitle1" color={'error'} width={'100%'}>
                {row.errorMessage}
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </Fragment>
    );
  });
};

const EmptyTableBody = ({ headerList }) => {
  if (!isEmpty(headerList)) return null;

  return (
    <TableRow>
      <TableCell
        colSpan={
          !isEmpty(headerList)
            ? // count total col of table
              headerList[0]?.columns?.reduce((output, col) => {
                const currentColSpan = col?.colSpan || DEFAULT_TABLE_VALUE.COL_SPAN;

                return output + currentColSpan;
              }, 0)
            : DEFAULT_TABLE_VALUE.COL_SPAN
        }
      >
        <EmptyTable />
      </TableCell>
    </TableRow>
  );
};

const Layout: React.FC<TableLayoutProps> = ({
  tableSx,
  showBorder = false,
  headerList,
  stickyHeader,
  headerSx,
  bodyList,
}) => {
  return (
    <TableContainer>
      <Table stickyHeader={stickyHeader} sx={tableSx}>
        <TableHead sx={headerSx}>{renderRows<HeaderRows>(headerList, showBorder)}</TableHead>
        <TableBody>
          {isEmpty(bodyList) ? (
            <EmptyTableBody headerList={headerList} />
          ) : (
            renderRows<BodyRows>(bodyList, showBorder)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Basic: React.FC<TableBasicProps> = ({
  tableSx,
  showBorder = false,
  stickyHeader,
  headerSx,
  bodyList,
  errorMessage,
}) => {
  const header: HeaderRow | null = React.useMemo(
    () =>
      !isEmpty(bodyList)
        ? {
            ...bodyList[0],
            columns: bodyList[0].columns.map((column) => {
              return {
                content: column.label,
                colSpan: column.colSpan,
                rowSpan: column.rowSpan,
                style: column.headerStyle,
                className: column.headerClassName,
                hide: column.hide,
              };
            }),
          }
        : null,
    [bodyList]
  );

  const headerList = React.useMemo(() => (header ? [header] : []), [header]);

  return (
    <TableContainer>
      <Element errorMessage={errorMessage}>
        <Table
          stickyHeader={stickyHeader}
          sx={{
            ...tableSx,
            border: errorMessage ? COLOR_CODE.DEFAULT_TABLE_ERROR_BORDER : undefined,
          }}
        >
          <TableHead sx={headerSx}>
            {renderRows<HeaderRows>(headerList, showBorder, true)}
          </TableHead>
          <TableBody>
            {isEmpty(bodyList) ? (
              <EmptyTableBody headerList={headerList} />
            ) : (
              renderRows<BodyBasicRows>(bodyList, showBorder)
            )}
          </TableBody>
        </Table>
      </Element>
    </TableContainer>
  );
};

export interface TableLayoutProps {
  tableSx?: SxProps;
  showBorder?: boolean;
  headerList?: HeaderRows;
  headerSx?: SxProps;
  stickyHeader?: boolean;
  bodyList: BodyRows;
  errorMessage?: string;
}
export interface TableBasicProps {
  tableSx?: SxProps;
  showBorder?: boolean;
  headerSx?: SxProps;
  stickyHeader?: boolean;
  bodyList: BodyBasicRows;
  errorMessage?: string;
}

export default { Layout, Basic };
