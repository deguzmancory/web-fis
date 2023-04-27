import { Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { Link } from '../../../../components/common';
import { NO_OPENER } from '../../../../appConfig/constants';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from 'src/queries';
import {
  isNonPOPersonalAutoPaymentType,
  isNonPOPettyCashPaymentType,
} from 'src/queries/NonPOPayment/helpers';

const HeaderOfSection: FC<Props> = ({ documentType }) => {
  const isPersonalAutoPaymentType = isNonPOPersonalAutoPaymentType(documentType);
  const isPettyCashPaymentType = isNonPOPettyCashPaymentType(documentType);
  const allowApproving = isPersonalAutoPaymentType || isPettyCashPaymentType;

  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent="end">
      <Typography>
        <span className="has-text-danger fw-bold text-is-16">**</span> = required to Save
      </Typography>
      <Typography mx={1}>
        <span className="has-text-danger fw-bold text-is-16">*</span> = required to Submit
        {allowApproving && <span>/Approve</span>}
      </Typography>
      {isPersonalAutoPaymentType && (
        <Link href="https://www.rcuh.com/2-000/2-200/2-201/" target={'_blank'} rel={NO_OPENER}>
          RCUH Policy 2.201
        </Link>
      )}
      {isPettyCashPaymentType && (
        <Link href="https://www.rcuh.com/2-000/2-700/2-704/" target={'_blank'} rel={NO_OPENER}>
          RCUH Policy 2.704
        </Link>
      )}
    </Stack>
  );
};

type Props = {
  documentType: NON_PO_PAYMENT_DOCUMENT_TYPE;
};

export default memo(HeaderOfSection);
