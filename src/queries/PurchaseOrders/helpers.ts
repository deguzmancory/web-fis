import { PO_ACTION, PO_DETAIL_STATUS, PO_DOCUMENT_TYPE, PO_MODE } from './enums';

export const isPOSaveAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.SAVE;
};
export const isPOSubmitAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.SUBMIT;
};
export const isPOApprovedAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.APPROVE;
};
export const isPODisapproveAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.DISAPPROVE;
};
export const isPOAdditionalInfoAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.ADDITIONAL_INFO;
};

export const isPIPendingSubmittalPOStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.PI_PENDING_SUBMITTAL;
};
export const isFAPendingApprovalPOStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.FA_PENDING_APPROVAL;
};
export const isPIAdditionalInfoRequestedPOStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.PI_ADDITIONAL_INFO_REQUESTED;
};
export const isPIDisapprovedPOStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.PI_DISAPPROVED;
};
export const isFAAdditionalInfoRequestedPOStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.FA_ADDITIONAL_INFO_REQUESTED_RCUH;
};
export const isRCUHPendingRCUHApprovalPOStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.RCUH_PENDING_RCUH_APPROVAL;
};
export const isFinalPOStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.FINAL;
};

export const isCreatePOMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.CREATE;
};
export const isPiSuEditPOMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.PI_SU_EDIT_PENDING_SUBMITTAL;
};
export const isViewOnlyPOMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.VIEW_ONLY;
};
export const isFinalPOMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.FINAL;
};
export const isFAReviewPOMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.FA_REVIEW;
};
export const isCUReviewPOMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.CU_REVIEW;
};

export const isPODocumentType = (currentDocumentType: PO_DOCUMENT_TYPE) => {
  return currentDocumentType === PO_DOCUMENT_TYPE.PURCHASE_ORDER;
};
export const isPOChangeDocumentType = (currentDocumentType: PO_DOCUMENT_TYPE) => {
  return currentDocumentType === PO_DOCUMENT_TYPE.PO_CHANGE;
};
export const isPOPaymentDocumentType = (currentDocumentType: PO_DOCUMENT_TYPE) => {
  return currentDocumentType === PO_DOCUMENT_TYPE.PO_PAYMENT;
};
