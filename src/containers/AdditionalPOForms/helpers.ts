import { PATHS } from 'src/appConfig/paths';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { Navigator } from 'src/services';
import urljoin from 'url-join';
import { PO_FORM_ELEMENT_ID, PO_FORM_PARAMS } from '../PurchaseOrderContainer/PO/enums';

export const handleNavigateBackToMainForm = ({
  documentId,
  documentType,
  hrefNavigationForm,
}: {
  documentId: string;
  documentType: PO_DOCUMENT_TYPE;
  hrefNavigationForm: string;
  isViewMode?: boolean;
}) => {
  if (hrefNavigationForm) {
    Navigator.navigate(hrefNavigationForm);
    return;
  }

  if (!documentId) {
    Navigator.navigate(
      `${PATHS.createPurchaseOrders}?${PO_FORM_PARAMS.SCROLL_TO}=${PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS}`
    );
    return;
  }

  let path = '';

  switch (documentType) {
    case PO_DOCUMENT_TYPE.PURCHASE_ORDER:
      path = PATHS.purchaseOrderDetail;
      break;
    case PO_DOCUMENT_TYPE.PO_CHANGE:
      path = PATHS.poChangeForm;
      break;
    case PO_DOCUMENT_TYPE.PO_PAYMENT:
      path = PATHS.poPaymentForm;
      break;

    default:
      break;
  }

  if (!path) return;

  if (documentId) {
    Navigator.navigate(
      `${urljoin(path, documentId)}?${PO_FORM_PARAMS.SCROLL_TO}=${
        PO_FORM_ELEMENT_ID.ADDITIONAL_FORMS
      }`
    );
  }
};
