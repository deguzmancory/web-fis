import { PO_ACTION, PO_DETAIL_STATUS, PO_DOCUMENT_TYPE, PO_MODE } from './enums';

export const isSaveAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.SAVE;
};
export const isSubmitAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.SUBMIT;
};
export const isApprovedAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.APPROVE;
};
export const isDisapproveAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.DISAPPROVE;
};
export const isAdditionalInfoAction = (currentAction: PO_ACTION) => {
  return currentAction === PO_ACTION.ADDITIONAL_INFO;
};

export const isPIPendingSubmittalStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.PI_PENDING_SUBMITTAL;
};
export const isFAPendingApprovalStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.FA_PENDING_APPROVAL;
};
export const isPIAdditionalInfoRequestedStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.PI_ADDITIONAL_INFO_REQUESTED;
};
export const isPIDisapprovedStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.PI_DISAPPROVED;
};
export const isFAAdditionalInfoRequestedStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.FA_ADDITIONAL_INFO_REQUESTED_RCUH;
};
export const isRCUHPendingRCUHApprovalStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.RCUH_PENDING_RCUH_APPROVAL;
};
export const isFinalStatus = (currentPOStatus: PO_DETAIL_STATUS) => {
  return currentPOStatus === PO_DETAIL_STATUS.FINAL;
};

export const isCreateMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.CREATE;
};
export const isPiSuEditMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.PI_SU_EDIT_PENDING_SUBMITTAL;
};
export const isViewOnlyMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.VIEW_ONLY;
};
export const isFinalMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.FINAL;
};
export const isFAReviewMode = (currentMode: PO_MODE) => {
  return currentMode === PO_MODE.FA_REVIEW;
};
export const isCUReviewMode = (currentMode: PO_MODE) => {
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
