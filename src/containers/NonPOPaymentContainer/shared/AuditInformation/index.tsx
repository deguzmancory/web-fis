import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { isEqualPrevAndNextFormikValues } from 'src/utils';
import { localTimeToHawaii } from 'src/utils/dayjsUtils';
import { isEmpty } from 'src/validations';
import { Accordion } from 'src/components/common';
import {
  UpsertAuthorizationPaymentFormikProps,
  UpsertAuthorizationFormValue,
} from '../../AuthorizationForPayment/types';
import { PO_MODE } from 'src/queries';

const AuditInformation = <T extends UpsertAuthorizationPaymentFormikProps>({
  formikProps,
  disabled,
  currentPOMode,
}: Props<T>) => {
  const audits = React.useMemo(() => {
    if (isEmpty(formikProps.values.auditTrails)) return [];

    return formikProps.values.auditTrails.slice().sort((cur, next) => {
      return cur.createdAt < next.createdAt ? 1 : -1;
    });
  }, [formikProps.values.auditTrails]);

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
type Props<T extends UpsertAuthorizationPaymentFormikProps> = {
  formikProps: UpsertAuthorizationPaymentFormikProps;
  disabled?: boolean;
  currentPOMode?: PO_MODE;
};

export default React.memo(AuditInformation, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return isEqualPrevAndNextFormikValues<UpsertAuthorizationFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender: [],
  });
});
