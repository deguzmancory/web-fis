import { Delete } from '@mui/icons-material';
import { IconButton, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { UserFisCode } from 'src/queries/Users/types';
import { Callback } from 'src/redux/types';
import { isEmpty } from 'src/validations';

const ManageCodesTable: React.FC<Props> = ({ rows, type, onDeleteCode }) => {
  return (
    <TableContainer
      sx={{
        minHeight: '300px',
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
        <TableHead>
          <TableRow>
            {[
              { title: type === ROLE_NAME.FA ? 'FA Code' : 'PI Code', width: '90%' },
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
              const codeInfo = type === ROLE_NAME.FA ? `${row.code}` : `${row.code}, ${row.piName}`;
              return (
                <StyledTableRow key={`${row.code}-${row.codeType}-${index}`}>
                  <StyledTableCell width={'90%'}>
                    {codeInfo.length > 10 ? `${codeInfo.substring(0, 10)}...` : codeInfo}
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

export default React.memo(ManageCodesTable);
