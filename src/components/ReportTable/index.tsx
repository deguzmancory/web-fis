import {
  SxProps,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { isEmpty } from 'src/validations';
import { StyledTableCell } from '../CustomTable';
import EmptyTable from '../EmptyTable';
import { BodyRows, DEFAULT_TABLE_VALUE, HeaderRows } from './types';

const ReportTable: React.FC<Props> = ({
  tableSx,
  showBorder = false,
  headerList,
  stickyHeader,
  headerSx,
  bodyList,
}) => {
  const renderRows = React.useCallback(
    <
      T extends BodyRows &
        HeaderRows & {
          isHeaderRow?: boolean;
        }
    >(
      data: T
    ) => {
      if (isEmpty(data)) return null;

      return data.map((row, rowIndex) => (
        <TableRow sx={row.style} className={row.className} key={`row-table-${rowIndex}`}>
          {row.columns?.map((cell, cellIndex) => {
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

            return (
              <StyledTableCell
                key={`cell-table-${cellIndex}`}
                sx={{
                  [`&.${tableCellClasses.root}`]: cell.style,
                  border: showBorder ? COLOR_CODE.DEFAULT_BORDER : undefined,
                }}
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
      ));
    },
    [showBorder]
  );

  const emptyTableBody = React.useMemo(() => {
    if (!isEmpty(headerList) && !isEmpty(bodyList)) return null;

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
  }, [headerList, bodyList]);

  return (
    <TableContainer>
      <Table stickyHeader={stickyHeader} sx={tableSx}>
        <TableHead sx={headerSx}>{renderRows(headerList)}</TableHead>
        <TableBody>{isEmpty(bodyList) ? emptyTableBody : renderRows(bodyList)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export interface Props {
  tableSx?: SxProps;
  showBorder?: boolean;

  headerList?: HeaderRows;
  headerSx?: SxProps;
  stickyHeader?: boolean;

  bodyList: BodyRows;
}

export default ReportTable;
