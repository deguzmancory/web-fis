import { Box, Grid, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import React from 'react';
import { Button, DatePicker, Select } from 'src/components/common';
import { useSearchProjects, useSearchUsers } from 'src/queries/Users';
import { formatDateUtc } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CRUUSER_KEY } from '../../enums';
import { CRUUserFormikProps, getErrorMessage } from '../../helper';
import {
  addDelegationFormSchema,
  AddDelegationFormValue,
  ADD_DELEGATION_KEY,
  getDelegateUserTypeOptions,
  initialAddDelegationFormValue,
} from './helpers';

const AddDelegation: React.FC<Props> = ({ formikProps }) => {
  const { setFieldValue: setFieldValueFormik, values: valuesFormik } = formikProps;

  const getInitialValues = React.useMemo(() => {
    return {
      ...initialAddDelegationFormValue,
    };
  }, []);

  const handleAddDelegation = (values: AddDelegationFormValue) => {
    const user = users.find((user) => user.id === values.existingUserAccount);

    if (valuesFormik.delegateAccess.findIndex((row) => row.delegatedUserId === user?.id) > -1) {
      setFieldError(
        ADD_DELEGATION_KEY.EXISTING_USER_ACCOUNT,
        'Access has been granted to current user.'
      );
    } else {
      const payload = {
        isEdit: false,
        delegatedUserId: user?.id,
        username: user?.username,
        fullName: user?.fullName,
        roleName: values.userType,
        projectNumber: values.projectNumber,
        startDate: formatDateUtc(values.startDate),
        startDateTemp: formatDateUtc(values.startDate),
        endDate: formatDateUtc(values.endDate),
        endDateTemp: formatDateUtc(values.endDate),
        isAllProjects: false,
      };
      const delegateAccess = valuesFormik.delegateAccess;
      delegateAccess.unshift(payload);

      setFieldValueFormik(CRUUSER_KEY.DELEGATE_ACCESS, delegateAccess);
      setFieldValueFormik(CRUUSER_KEY.TEMP_DELEGATE_ACCESS, delegateAccess);

      setTimeout(() => {
        resetForm();
      }, 10);
    }
  };

  const {
    values,
    errors,
    getFieldProps,
    touched,
    setFieldTouched,
    setFieldValue,
    setFieldError,
    handleSubmit,
    resetForm,
  } = useFormik<AddDelegationFormValue>({
    initialValues: getInitialValues,
    onSubmit: handleAddDelegation,
    validationSchema: addDelegationFormSchema,
    enableReinitialize: true,
  });
  // console.log('values: ', values);
  // console.log('errors: ', errors);

  const _getErrorMessage = (fieldName: ADD_DELEGATION_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const getAfterDate = (value: Date, currentDate: Date) => {
    if (dayjs(value).isAfter(dayjs(currentDate))) {
      return value;
    } else {
      return currentDate;
    }
  };

  const [searchUsers, setSearchUsers] = React.useState('');

  const { users, isLoading: isLoadingSearchUsers } = useSearchUsers({
    name: searchUsers,
    exclude: valuesFormik.username,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchUsersValue = React.useCallback(debounce(setSearchUsers, 200), []);

  const [searchProjects, setSearchProjects] = React.useState('');

  const { projects, isLoading: isLoadingSearchProjects } = useSearchProjects({
    projectNumber: searchProjects,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchProjectsValue = React.useCallback(debounce(setSearchProjects, 200), []);

  return (
    <Box mb={2}>
      <Stack flexDirection={'row'}>
        <Grid container spacing={1} alignItems={'flex-start'}>
          <Grid item xs={3}>
            <Select
              {...getFieldProps(ADD_DELEGATION_KEY.EXISTING_USER_ACCOUNT)}
              label="Existing User Account"
              placeholder={'Search'}
              options={
                users
                  ? users.map((user) => ({
                      label: user.username,
                      value: user.id,
                      subLabel: user.fullName,
                    }))
                  : []
              }
              isLoading={isLoadingSearchUsers}
              value={values.existingUserAccount}
              name={ADD_DELEGATION_KEY.EXISTING_USER_ACCOUNT}
              onInputChange={(value: string) => {
                if (!isEmpty(value)) {
                  debounceSearchUsersValue(value);
                }
              }}
              required
              hideSearchIcon
              isClearable={true}
              optionWithSubLabel
              onChange={(name, value) => {
                setFieldValue(name, value);
                setFieldValue(ADD_DELEGATION_KEY.USER_TYPE, '');
              }}
              onBlur={setFieldTouched}
              errorMessage={_getErrorMessage(ADD_DELEGATION_KEY.EXISTING_USER_ACCOUNT)}
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              {...getFieldProps(ADD_DELEGATION_KEY.USER_TYPE)}
              label="User Type"
              placeholder={'Select'}
              options={
                users
                  ? getDelegateUserTypeOptions(
                      users
                        .find((user) => user.id === values.existingUserAccount)
                        ?.roles.map((role) => role.name),
                      valuesFormik.roles
                    )
                  : []
              }
              hideSearchIcon
              required
              isClearable={true}
              isDisabled={isEmpty(values.existingUserAccount)}
              value={values.userType}
              name={ADD_DELEGATION_KEY.USER_TYPE}
              onChange={(name, value) => {
                setFieldValue(name, value);
                setFieldValue(ADD_DELEGATION_KEY.PROJECT_NUMBER, '');
              }}
              onBlur={setFieldTouched}
              errorMessage={_getErrorMessage(ADD_DELEGATION_KEY.USER_TYPE)}
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              {...getFieldProps(ADD_DELEGATION_KEY.PROJECT_NUMBER)}
              label="Project Number"
              placeholder={'Search'}
              options={
                projects
                  ? projects.map((project) => ({
                      label: `${project.projectNumber}`,
                      value: project.projectNumber,
                      subLabel: project.projectNumber,
                    }))
                  : []
              }
              isLoading={isLoadingSearchProjects}
              value={values.projectNumber}
              name={ADD_DELEGATION_KEY.PROJECT_NUMBER}
              onInputChange={(value: string) => {
                if (value.length > 0) {
                  debounceSearchProjectsValue(value);
                }
              }}
              hideSearchIcon
              isClearable={false}
              isDisabled={isEmpty(values.userType)}
              optionWithSubLabel
              onChange={setFieldValue}
              errorMessage={_getErrorMessage(ADD_DELEGATION_KEY.PROJECT_NUMBER)}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              label="Start Date"
              {...getFieldProps(ADD_DELEGATION_KEY.START_DATE)}
              name={ADD_DELEGATION_KEY.START_DATE}
              selected={values.startDate}
              placeholder={'MM/DD/YYYY'}
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              errorMessage={_getErrorMessage(ADD_DELEGATION_KEY.START_DATE)}
              maxDate={values.endDate}
              disabled={isEmpty(values.existingUserAccount)}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              label="End Date"
              {...getFieldProps(ADD_DELEGATION_KEY.END_DATE)}
              name={ADD_DELEGATION_KEY.END_DATE}
              selected={values.endDate}
              placeholder={'MM/DD/YYYY'}
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              errorMessage={_getErrorMessage(ADD_DELEGATION_KEY.END_DATE)}
              minDate={getAfterDate(values.startDate, new Date())}
              disabled={isEmpty(values.existingUserAccount)}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            transform: 'translateY(27px)',
            ml: 1,
          }}
        >
          <Button
            onClick={() => {
              handleSubmit();
            }}
          >
            Add
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
};

export default AddDelegation;
