import { PARAMS_SPLITTER } from 'src/appConfig/constants';
import { MyProfile, PO_DETAIL_STATUS, PO_MODE } from 'src/queries';
import { ROLE_NAME, isCU, isFA, isPI, isSU } from 'src/queries/Profile/helpers';
import {
  isFAAdditionalInfoRequestedPOStatus,
  isFAPendingApprovalPOStatus,
  isFinalPOStatus,
  isPIAdditionalInfoRequestedPOStatus,
  isPIDisapprovedPOStatus,
  isPIPendingSubmittalPOStatus,
  isRCUHPendingRCUHApprovalPOStatus,
} from 'src/queries/PurchaseOrders/helpers';

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
        isPIAdditionalInfoRequestedPOStatus(poStatus) ||
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
