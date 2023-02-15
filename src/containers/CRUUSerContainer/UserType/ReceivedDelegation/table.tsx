import { Check } from '@mui/icons-material';
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { DateFormat, localTimeToHawaii } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps } from '../../helper';
import { EmptyTableDelegation } from '../helpers';

const TableGrantDelegation: React.FC<Props> = ({ formikProps }) => {
  const { values } = formikProps;
  const rows = values.delegatedAccess;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {[
              { title: 'Username', width: '15%' },
              { title: 'Full Name', width: '15%' },
              { title: 'User Type', width: '20%' },
              { title: 'Project #', width: '10%' },
              { title: 'Start Date', width: '15%' },
              { title: 'End Date', width: '15%' },
              { title: ' ', width: '5%' },
            ].map((item) => (
              <StyledTableCell key={item.title} width={item.width}>
                {item.title}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(rows) ? (
            <EmptyTableDelegation />
          ) : (
            rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell width={'15%'}>{row.user.username}</StyledTableCell>
                <StyledTableCell width={'15%'}>{row.user.fullName}</StyledTableCell>
                <StyledTableCell width={'20%'}>{row.userRole.role.displayName}</StyledTableCell>
                <StyledTableCell width={'10%'}>{row.projectNumber}</StyledTableCell>
                <StyledTableCell width={'15%'}>
                  {row.startDate ? localTimeToHawaii(row.startDate, DateFormat) : '--'}
                </StyledTableCell>
                <StyledTableCell width={'15%'}>
                  {row.endDate ? localTimeToHawaii(row.endDate, DateFormat) : '--'}
                </StyledTableCell>
                <StyledTableCell width={'5%'}>
                  <Stack flexDirection={'row'}>
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
                  </Stack>
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
