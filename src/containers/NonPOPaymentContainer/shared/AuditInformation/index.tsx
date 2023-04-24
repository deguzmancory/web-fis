import { isEqual } from 'lodash';
import React from 'react';
import AuditTable from 'src/containers/shared/AuditTable';
import { POAuditTrails } from 'src/queries';
import { isEmpty } from 'src/validations';

const AuditInformation = ({ auditTrails }: Props) => {
  const audits = React.useMemo(() => {
    if (isEmpty(auditTrails)) return [];

    return auditTrails.slice().sort((cur, next) => {
      return cur.createdAt < next.createdAt ? 1 : -1;
    });
  }, [auditTrails]);

  return <AuditTable audits={audits} />;
};
type Props = {
  auditTrails: POAuditTrails[];
};

export default React.memo(AuditInformation, (prevProps, nextProps) => {
  return isEqual(prevProps.auditTrails, nextProps.auditTrails);
});
