import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { UserDetail } from 'src/queries/Users/types';
import { DateFormatDisplayMinute } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps } from '../helper';
import { StyledTableCell, StyledTableRow } from '../UserType/GrantDelegation/table';

const AuditInformation: React.FC<Props> = ({ formikProps, userAuditTrails, isLoading }) => {
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
          {isEmpty(userAuditTrails) ? (
            <StyledTableRow>
              <StyledTableCell>
                <Box minHeight={'100px'}>&nbsp;</Box>
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            userAuditTrails.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell width={'20%'}>
                  {dayjs(row.createdAt).format(DateFormatDisplayMinute)}
                </StyledTableCell>
                <StyledTableCell width={'30%'}>
                  {row.fullName}({row.username})
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
