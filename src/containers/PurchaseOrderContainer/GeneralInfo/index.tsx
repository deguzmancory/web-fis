import { Add } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { EllipsisTooltipInput, Input, Link, TextArea } from 'src/components/common';
import { getErrorMessage } from 'src/utils';
import { PO_FORM_KEY } from '../enums';
import { UpsertPOFormikProps } from '../types';

const GeneralInfo: React.FC<Props> = ({ formikProps, disabled }) => {
  const { errors, touched, getUncontrolledFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: PO_FORM_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleCreateNewVenderLinkClick = () => {
    console.log('createNewVenderLinkClick');
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <EllipsisTooltipInput
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <Input
              label={'Project Title'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_TITLE)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.PROJECT_TITLE)}
              disabled={disabled}
              footer={
                <Typography variant="body2">
                  Use “Various" if you want to use multiple projects.
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input
              label={'Project Title'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_TITLE)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.PROJECT_TITLE)}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <Input
              label={'Project Title'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_TITLE)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.PROJECT_TITLE)}
              disabled={disabled}
              footer={
                <Link
                  type="icon-link"
                  icon={<Add fontSize="small" />}
                  textVariant="body2"
                  onClick={handleCreateNewVenderLinkClick}
                >
                  Create New Vendor
                </Link>
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input
              label={'Project Title'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_TITLE)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.PROJECT_TITLE)}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextArea
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextArea
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Input
              label={'Project Title'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_TITLE)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.PROJECT_TITLE)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Input
              label={'Project Title'}
              required
              errorMessage={_getErrorMessage(PO_FORM_KEY.PROJECT_TITLE)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.PROJECT_TITLE)}
              disabled={disabled}
              footer={
                <Link
                  type="icon-link"
                  icon={<Add fontSize="small" />}
                  textVariant="body2"
                  onClick={handleCreateNewVenderLinkClick}
                >
                  Create New Vendor
                </Link>
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Input
              label={'Login Name'}
              errorMessage={_getErrorMessage(PO_FORM_KEY.LOGIN_NAME)}
              {...getUncontrolledFieldProps(PO_FORM_KEY.LOGIN_NAME)}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpsertPOFormikProps;
  disabled: boolean;
};

export default React.memo(GeneralInfo);
