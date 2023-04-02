import { capitalize, startCase } from 'lodash';
import { PO_DOCUMENT_TYPE } from 'src/queries';

export const formatValue = (value: string) => {
  if (!value) return '--';
  return startCase(capitalize(value));
};

export const transformDocumentType = (value: string) => {
  if (!value) return '--';
  switch (value) {
    case PO_DOCUMENT_TYPE.PURCHASE_ORDER:
      return 'PO';
    case PO_DOCUMENT_TYPE.PO_CHANGE:
      return 'Chg';
    case PO_DOCUMENT_TYPE.PO_PAYMENT:
      return 'Pmt';
    default:
      return '';
  }
};
