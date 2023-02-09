import { Check } from '@mui/icons-material';
import { IconButton, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { DateFormat } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps } from '../../helper';
import { EmptyTableDelegation } from '../helpers';

const TableGrantDelegation: React.FC<Props> = ({ formikProps }) => {
  const { values } = formikProps;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rows = values.delegatedAccess;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {['Username', 'Full Name', 'User Type', 'Project #', 'Start Date', 'End Date', ' '].map(
              (item) => (
                <StyledTableCell key={item}>{item}</StyledTableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(rows) ? (
            <EmptyTableDelegation />
          ) : (
            rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.user.username}</StyledTableCell>
                <StyledTableCell>{row.user.fullName}</StyledTableCell>
                <StyledTableCell>{row.userRole.role.displayName}</StyledTableCell>
                <StyledTableCell>{row.projectNumber}</StyledTableCell>
                <StyledTableCell>
                  {row.startDate ? dayjs(row.startDate).format(DateFormat) : '--'}
                </StyledTableCell>
                <StyledTableCell>
                  {row.endDate ? dayjs(row.endDate).format(DateFormat) : '--'}
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    size="small"
                    sx={{
                      p: 0,
                      mr: 1,
                      opacity: 0,
                    }}
                    disabled
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      p: 0,
                      opacity: 0,
                    }}
                    disabled
                  >
                    <Check />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
};

export default TableGrantDelegation;
