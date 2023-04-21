import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { isEqualPrevAndNextFormikValues } from 'src/utils';
import { localTimeToHawaii } from 'src/utils/dayjsUtils';
import { isEmpty } from 'src/validations';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormValue, UpsertPOFormikProps } from '../types';
import { Accordion } from 'src/components/common';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/PurchaseOrderContainer/POPayment/types';

const AuditInformation = <T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps>({
  formikProps,
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
type Props<T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps> = {
  formikProps: T extends UpsertPOFormikProps ? UpsertPOFormikProps : UpdatePOPaymentFormikProps;
};

export default React.memo(AuditInformation, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return isEqualPrevAndNextFormikValues<UpsertPOFormValue | UpdatePOPaymentFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender: [PO_FORM_KEY.AUDIT_TRAILS],
  });
});
