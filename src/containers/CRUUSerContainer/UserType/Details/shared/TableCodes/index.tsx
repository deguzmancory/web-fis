import { Delete } from '@mui/icons-material';
import {
  IconButton,
  Table,
  TableBody,
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

const TableCodes: React.FC<Props> = ({ rows, type, onDeleteCode }) => {
  return (
    <TableContainer
      sx={{
        height: 'calc(100vh - 460px)',
        overflow: 'auto',
        border: `${COLOR_CODE.DEFAULT_BORDER}`,
        '.MuiTableCell-body': {
          padding: '4px 8px !important',
        },
        '.MuiTableCell-head': {
          padding: '4px 8px !important',
        },
      }}
    >
      <Table>
        <TableHead sx={{ position: 'sticky', top: 0 }}>
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
                      className={codeInfo.length > 10 ? 'marquee-left__text' : ''}
                    >
                      {codeInfo}
                    </Typography>
                  </StyledTableCell>
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
  onDeleteCode: Callback;
};

export default React.memo(TableCodes);
