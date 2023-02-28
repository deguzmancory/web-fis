import { Delete } from '@mui/icons-material';
import {
  IconButton,
  Table,
  TableBody,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import cn from 'classnames';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { isFA, ROLE_NAME } from 'src/queries/Profile/helpers';
import { UserFisCode } from 'src/queries/Users/types';
import { Callback } from 'src/redux/types';
import { isEmpty } from 'src/validations';

const TableCodes: React.FC<Props> = ({ rows, type, readonly, onDeleteCode }) => {
  return (
    <TableContainer
      sx={{
        height: 'calc(100vh - 490px)',
        overflow: 'auto',
        border: `${COLOR_CODE.DEFAULT_BORDER}`,
        [`.${tableCellClasses.body}`]: {
          padding: '4px 8px !important',
        },
        [`.${tableCellClasses.head}`]: {
          padding: '4px 8px !important',
        },
      }}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {[
              { title: isFA(type) ? 'FA Code' : 'PI Code', width: '90%' },
              { title: ' ', width: '10%' },
            ].map((item) => (
              <StyledTableCell key={item.title} width={item.width}>
                {item.title}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!isEmpty(rows) &&
            rows.map((row, index) => {
              const codeInfo = isFA(type) ? `${row.code}` : `${row.code}, ${row.piName}`;
              return (
                <StyledTableRow key={`${row.code}-${row.codeType}-${index}`}>
                  <StyledTableCell
                    sx={{
                      minWidth: 100,
                      maxWidth: 100,
                    }}
                    className={cn({ 'marquee-left': codeInfo.length > 10 })}
                  >
                    <Typography
                      variant="body2"
                      className={codeInfo.length > 10 ? 'marquee-left__text--hover' : ''}
                    >
                      {codeInfo}
                    </Typography>
                  </StyledTableCell>
                  {!readonly && (
                    <StyledTableCell width={'10%'}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          onDeleteCode(row.code);
                        }}
                        sx={{
                          p: 0,
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type Props = {
  rows: UserFisCode[];
  type: ROLE_NAME.PI | ROLE_NAME.FA;
  readonly?: boolean;
  onDeleteCode: Callback;
};

export default React.memo(TableCodes);
