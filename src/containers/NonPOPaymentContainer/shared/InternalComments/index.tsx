import { Box, Grid } from '@mui/material';
import React from 'react';
import { TextareaAutosize } from 'src/components/common';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';

const InternalComments = ({
  formikProps,
  internalCommentPrefix = 'internalComments',
  disabled = false,
}: Props) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <TextareaAutosize
            label={'Internal Comments'}
            errorMessage={_getErrorMessage(internalCommentPrefix)}
            {...getUncontrolledFieldProps(internalCommentPrefix)}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: CommonFormikProps<any>;
  internalCommentPrefix?: string;
  disabled?: boolean;
};

export default React.memo(InternalComments, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender: [nextProps.internalCommentPrefix],
    })
  );
});
