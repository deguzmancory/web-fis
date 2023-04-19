import { PARAMS_SPLITTER } from 'src/appConfig/constants';
import { MyProfile, PO_DETAIL_STATUS, PO_MODE } from 'src/queries';
import { ROLE_NAME, isCU, isFA, isPI, isSU } from 'src/queries/Profile/helpers';
import {
  isFAAdditionalInfoRequestedStatus,
  isFAPendingApprovalStatus,
  isFinalStatus,
  isPIAdditionalInfoRequestedStatus,
  isPIDisapprovedStatus,
  isPIPendingSubmittalStatus,
  isRCUHPendingRCUHApprovalStatus,
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
    isPIPendingSubmittalStatus(poStatus) ||
    isPIDisapprovedStatus(poStatus) ||
    isPIAdditionalInfoRequestedStatus(poStatus)
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
      return isFAPendingApprovalStatus(poStatus) || isRCUHPendingRCUHApprovalStatus(poStatus);
    case ROLE_NAME.FA:
      return (
        isPIPendingSubmittalStatus(poStatus) ||
        isRCUHPendingRCUHApprovalStatus(poStatus) ||
        isFAAdditionalInfoRequestedStatus(poStatus) ||
        isPIAdditionalInfoRequestedStatus(poStatus) ||
        isPIDisapprovedStatus(poStatus)
      );
    case ROLE_NAME.CU:
      return (
        isPIPendingSubmittalStatus(poStatus) ||
        isFAPendingApprovalStatus(poStatus) ||
        isFAAdditionalInfoRequestedStatus(poStatus) ||
        isPIDisapprovedStatus(poStatus)
      );

    default:
      return false;
  }
};

export const checkIsFinalMode = ({ poStatus }: { poStatus: PO_DETAIL_STATUS }) => {
  return isFinalStatus(poStatus);
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
    (isFAPendingApprovalStatus(poStatus) || isFAAdditionalInfoRequestedStatus(poStatus))
  );
};

export const checkIsCUReviewMode = ({
  poStatus,
  currentRole,
}: {
  poStatus: PO_DETAIL_STATUS;
  currentRole: ROLE_NAME;
}) => {
  return isCU(currentRole) && isRCUHPendingRCUHApprovalStatus(poStatus);
};

export const getCurrentEditMode = ({
  id,
  status: poStatus,
  currentRole,
}: {
  id: string;
  status: PO_DETAIL_STATUS;
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
