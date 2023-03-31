import { Box, Typography } from '@mui/material';
import React from 'react';
import { TextareaAutosize } from 'src/components/common';
import { POSoleSourcePayload } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_SOLE_SOURCE_FORM_KEY } from '../enum';

const SoleSourceStatement: React.FC<Props> = ({ formikProps, disabled }) => {
  const { errors, touched, getFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: PO_SOLE_SOURCE_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Typography variant="h5">STATEMENT:</Typography>
      <Typography variant="body1">
        I request sole source procurement based on the following criteria. (Attach additional sheets
        as necessary.)
      </Typography>

      <Box>
        <Typography variant="body1" mt={2}>
          <Typography variant="h5" style={{ display: 'contents' }}>
            I.
          </Typography>{' '}
          The requested goods or services have unique or special design/performance features,
          characteristics, or capabilities, which are essential and required in order to accomplish
          my objective. Complete IA and IB.
        </Typography>
      </Box>

      <Box px={5}>
        <Typography variant="body1" mt={2}>
          A. These are the unique or special features and the reasons why each is essential to my
          need
        </Typography>
        <Box px={3} mt={1}>
          <TextareaAutosize
            maxLength={5000}
            resize="none"
            {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.STATEMENT_REASONS)}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.STATEMENT_REASONS)}
            disabled={disabled}
          />
        </Box>
      </Box>

      <Box px={5}>
        <Typography variant="body1" mt={2}>
          B. In addition to the goods or services requested, I have contacted other suppliers and
          considered their good or service of similar capabilities. I find their good or service
          unacceptable for the following reasons. (Identify companies contacted, model number, if
          applicable, and specific technical deficiency.)
        </Typography>
        <Box px={3} mt={1}>
          <TextareaAutosize
            maxLength={5000}
            resize="none"
            {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.SERVICE_UNACCEPTABLE_REASONS)}
            errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.SERVICE_UNACCEPTABLE_REASONS)}
            disabled={disabled}
          />
        </Box>
      </Box>

      <Box>
        <Typography variant="body1" mt={2}>
          <Typography variant="h5" style={{ display: 'contents' }}>
            II.
          </Typography>{' '}
          If sole source approval is deferred or denied, it will have the following impact on the
          program/project.
        </Typography>
      </Box>
      <Box px={3} mt={1}>
        <TextareaAutosize
          maxLength={5000}
          resize="none"
          {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.EXPLANATION)}
          errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.EXPLANATION)}
          disabled={disabled}
        />
      </Box>

      <Box>
        <Typography variant="body1" mt={2}>
          <Typography variant="h5" style={{ display: 'contents' }}>
            III.
          </Typography>{' '}
          The requested good or service is available only from
        </Typography>
      </Box>
      <Box px={3} mt={1}>
        <TextareaAutosize
          maxLength={5000}
          resize="none"
          {...getFieldProps(PO_SOLE_SOURCE_FORM_KEY.STATEMENT_FROM)}
          errorMessage={_getErrorMessage(PO_SOLE_SOURCE_FORM_KEY.STATEMENT_FROM)}
          disabled={true}
        />
      </Box>
    </Box>
  );
};

type Props = {
  formikProps: CommonFormikProps<POSoleSourcePayload>;
  disabled: boolean;
};

export default React.memo(SoleSourceStatement, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_SOLE_SOURCE_FORM_KEY.STATEMENT_REASONS,
    PO_SOLE_SOURCE_FORM_KEY.SERVICE_UNACCEPTABLE_REASONS,
    PO_SOLE_SOURCE_FORM_KEY.EXPLANATION,
    PO_SOLE_SOURCE_FORM_KEY.STATEMENT_FROM,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<POSoleSourcePayload>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
