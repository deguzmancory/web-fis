import { PARAMS_SPLITTER } from 'src/appConfig/constants';
import { MyProfile, PO_DETAIL_STATUS } from 'src/queries';
import { isCU, isFA, isPI, isSU, ROLE_NAME } from 'src/queries/Profile/helpers';
import { PO_ACTION, PO_MODE } from '../enums';

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

export const checkIsPiOrSuEditMode = ({
  poStatus,
  currentRole,
}: {
  poStatus: PO_DETAIL_STATUS;
  currentRole: ROLE_NAME;
}) => {
  if (!poStatus) return false;

  const isAccessableRole = isPI(currentRole) || isSU(currentRole);

  if (!isAccessableRole) return false;

  return (
    isPIPendingSubmittalPOStatus(poStatus) ||
    isPIDisapprovedPOStatus(poStatus) ||
    isPIAdditionalInfoRequestedPOStatus(poStatus)
  );
};

export const checkIsViewOnlyMode = ({
  poStatus,
  currentRole,
}: {
  poStatus: PO_DETAIL_STATUS;
  currentRole: ROLE_NAME;
}) => {
  if (!poStatus) return false;

  switch (currentRole) {
    case ROLE_NAME.SU:
    case ROLE_NAME.PI:
      return isFAPendingApprovalPOStatus(poStatus) || isRCUHPendingRCUHApprovalPOStatus(poStatus);
    case ROLE_NAME.FA:
      return (
        isPIPendingSubmittalPOStatus(poStatus) ||
        isRCUHPendingRCUHApprovalPOStatus(poStatus) ||
        isFAAdditionalInfoRequestedPOStatus(poStatus) ||
        isPIDisapprovedPOStatus(poStatus)
      );
    case ROLE_NAME.CU:
      return (
        isPIPendingSubmittalPOStatus(poStatus) ||
        isFAPendingApprovalPOStatus(poStatus) ||
        isFAAdditionalInfoRequestedPOStatus(poStatus) ||
        isPIDisapprovedPOStatus(poStatus)
      );

    default:
      return false;
  }
};

export const checkIsFinalMode = ({ poStatus }: { poStatus: PO_DETAIL_STATUS }) => {
  return isFinalPOStatus(poStatus);
};

export const checkIsFAReviewMode = ({
  poStatus,
  currentRole,
}: {
  poStatus: PO_DETAIL_STATUS;
  currentRole: ROLE_NAME;
}) => {
  return (
    isFA(currentRole) &&
    (isFAPendingApprovalPOStatus(poStatus) || isFAAdditionalInfoRequestedPOStatus(poStatus))
  );
};

export const checkIsCUReviewMode = ({
  poStatus,
  currentRole,
}: {
  poStatus: PO_DETAIL_STATUS;
  currentRole: ROLE_NAME;
}) => {
  return isCU(currentRole) && isRCUHPendingRCUHApprovalPOStatus(poStatus);
};

export const getCurrentPOEditMode = ({
  id,
  poStatus,
  currentRole,
}: {
  id: string;
  poStatus: PO_DETAIL_STATUS;
  currentRole: ROLE_NAME;
}) => {
  if (!id) {
    return PO_MODE.CREATE;
  }
  if (checkIsFinalMode({ poStatus })) {
    return PO_MODE.FINAL;
  }
  if (checkIsPiOrSuEditMode({ poStatus, currentRole })) {
    return PO_MODE.PI_SU_EDIT_PENDING_SUBMITTAL;
  }
  if (checkIsFAReviewMode({ poStatus, currentRole })) {
    return PO_MODE.FA_REVIEW;
  }
  if (checkIsCUReviewMode({ poStatus, currentRole })) {
    return PO_MODE.CU_REVIEW;
  }
  if (checkIsViewOnlyMode({ poStatus, currentRole })) {
    return PO_MODE.VIEW_ONLY;
  }
};

export const getSearchProjectsParamsByRole = ({
  role,
  profile,
}: {
  role: ROLE_NAME;
  profile: MyProfile;
}): { codes: string; projectNumbers: string } | null => {
  let roleInfo;

  switch (role) {
    case ROLE_NAME.PI:
      roleInfo = profile.fisPiInfo;
      break;
    case ROLE_NAME.SU:
      roleInfo = profile.fisSuInfo;
      break;

    default:
      break;
  }

  if (!roleInfo) return null;

  const codes = isPI(role)
    ? profile.fisPiInfo.piCode
    : roleInfo.userFisCodes?.map((code) => code.code).join(PARAMS_SPLITTER) ?? '';
  const projectNumbers =
    roleInfo.userFisProjects?.map((project) => project.projectNumber).join(PARAMS_SPLITTER) ?? '';

  return { codes, projectNumbers };
};
