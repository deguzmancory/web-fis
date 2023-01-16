import { Box, Grid } from '@mui/material';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import React from 'react';
import { Button, DatePicker, Select } from 'src/components/common';
import { useSearchProjects, useSearchUsers } from 'src/queries/Users';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps, CRUUSER_KEY, getErrorMessage } from '../../helper';
import {
  addDelegationFormSchema,
  AddDelegationFormValue,
  ADD_DELEGATION_KEY,
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
    const payload = {
      isEdit: false,
      delegatedUserId: user?.id,
      username: user?.username,
      fullName: user?.fullName,
      roleName: values.userType,
      projectNumber: values.projectNumber,
      startDate: values.startDate.toISOString(),
      startDateTemp: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      endDateTemp: values.endDate.toISOString(),
      isAllProjects: false,
    };
    const delegateAccess = valuesFormik.delegateAccess;
    delegateAccess.unshift(payload);

    setFieldValueFormik(CRUUSER_KEY.DELEGATE_ACCESS, delegateAccess);

    setTimeout(() => {
      resetForm();
    }, 10);
  };

  const {
    values,
    errors,
    getFieldProps,
    touched,
    setFieldTouched,
    setFieldValue,
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
    search: searchUsers,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchUsersValue = React.useCallback(debounce(setSearchUsers, 200), []);

  const [searchProjects, setSearchProjects] = React.useState('');

  const { projects, isLoading: isLoadingSearchProjects } = useSearchProjects({
    search: searchProjects,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchProjectsValue = React.useCallback(debounce(setSearchProjects, 200), []);

  return (
    <Box mb={2}>
      <Grid container spacing={1} alignItems={'flex-start'}>
        <Grid item xs={3}>
          <Select
            {...getFieldProps(ADD_DELEGATION_KEY.EXISTING_USER_ACCOUNT)}
            label="Existing User Account"
            placeholder={'Search by 3 characters'}
            options={
              users
                ? users.map((user) => ({
                    label: `${user.fullName}(${user.username})`,
                    value: user.id,
                  }))
                : []
            }
            isLoading={isLoadingSearchUsers}
            value={values.existingUserAccount}
            name={ADD_DELEGATION_KEY.EXISTING_USER_ACCOUNT}
            onInputChange={(value: string) => {
              if (value.length > 2) {
                debounceSearchUsersValue(value);
              }
            }}
            required
            hideSearchIcon
            isClearable={false}
            onChange={setFieldValue}
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
                ? users
                    .find((user) => user.id === values.existingUserAccount)
                    ?.roles.map((role) => ({
                      label: role.displayName,
                      value: role.name,
                    }))
                : []
            }
            hideSearchIcon
            required
            isClearable={false}
            isDisabled={isEmpty(values.existingUserAccount)}
            value={values.userType}
            name={ADD_DELEGATION_KEY.USER_TYPE}
            onChange={setFieldValue}
            errorMessage={_getErrorMessage(ADD_DELEGATION_KEY.USER_TYPE)}
          />
        </Grid>
        <Grid item xs={2}>
          <Select
            {...getFieldProps(ADD_DELEGATION_KEY.PROJECT_NUMBER)}
            label="Project Number"
            placeholder={'Search'}
            options={
              projects
                ? projects.map((project) => ({
                    label: `${project.projectNumber}`,
                    value: project.projectNumber,
                  }))
                : []
            }
            required
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
            isDisabled={isEmpty(values.existingUserAccount)}
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
            required
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
            required
            disabled={isEmpty(values.existingUserAccount)}
          />
        </Grid>
        <Grid item xs={1}>
          <Box
            sx={{
              transform: 'translateY(27px)',
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
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
};

export default AddDelegation;
