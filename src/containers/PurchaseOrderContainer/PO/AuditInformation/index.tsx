import React from 'react';
import {
  UpdatePOPaymentFormValue,
  UpdatePOPaymentFormikProps,
} from 'src/containers/PurchaseOrderContainer/POPayment/types';
import AuditTable from 'src/containers/shared/AuditTable';
import { isEqualPrevAndNextFormikValues } from 'src/utils';
import { isEmpty } from 'src/validations';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormValue, UpsertPOFormikProps } from '../types';

const AuditInformation = <T extends UpsertPOFormikProps | UpdatePOPaymentFormikProps>({
  formikProps,
}: Props<T>) => {
  const audits = React.useMemo(() => {
    if (isEmpty(formikProps.values.auditTrails)) return [];

    return formikProps.values.auditTrails.slice().sort((cur, next) => {
      return cur.createdAt < next.createdAt ? 1 : -1;
    });
  }, [formikProps.values.auditTrails]);

  return <AuditTable audits={audits} />;
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
