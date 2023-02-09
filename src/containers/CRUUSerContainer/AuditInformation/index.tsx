import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { UserDetail } from 'src/queries/Users/types';
import { localTimeToHawaii } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps } from '../helper';

const AuditInformation: React.FC<Props> = ({ formikProps, userAuditTrails, isLoading }) => {
  const audits = userAuditTrails.slice().sort((cur, next) => {
    return cur.createdAt < next.createdAt ? 1 : -1;
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {[
              {
                label: 'Date/Time',
                width: '20%',
              },
              {
                label: 'User',
                width: '20%',
              },
              {
                label: 'Action',
                width: '50%',
              },
            ].map((item) => (
              <StyledTableCell key={item.label} width={item.width}>
                {item.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(audits) ? (
            <StyledTableRow>
              <StyledTableCell>
                <Box minHeight={'100px'}>&nbsp;</Box>
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            audits.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell width={'20%'}>{localTimeToHawaii(row.createdAt)}</StyledTableCell>
                <StyledTableCell width={'30%'}>
                  {row.fullName} ({row.username})
                </StyledTableCell>
                <StyledTableCell width={'50%'}>{row.action}</StyledTableCell>
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
  userAuditTrails: UserDetail['userAuditTrails'];
  isLoading: boolean;
};
export default AuditInformation;
