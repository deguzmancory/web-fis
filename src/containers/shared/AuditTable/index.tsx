import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { Accordion } from 'src/components/common';
import { POAuditTrails } from 'src/queries';
import { localTimeToHawaii } from 'src/utils/dayjsUtils';
import { isEmpty } from 'src/validations';

const AuditTable = ({ audits = [] }: Props) => {
  return (
    <Accordion title="Audit Information">
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
                  label: 'User Type',
                  width: '20%',
                },
                {
                  label: 'Action',
                  width: '40%',
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
              audits.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell width={'20%'}>
                    {localTimeToHawaii(row.createdAt)}
                  </StyledTableCell>
                  <StyledTableCell width={'20%'}>
                    {row.user} ({row.username})
                  </StyledTableCell>
                  <StyledTableCell width={'20%'}>{row.userType}</StyledTableCell>
                  <StyledTableCell width={'40%'}>{row.action}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Accordion>
  );
};
type Props = {
  audits: POAuditTrails[];
};

export default React.memo(AuditTable, (prevProps, nextProps) => {
  return isEqual(prevProps.audits, nextProps.audits);
});
