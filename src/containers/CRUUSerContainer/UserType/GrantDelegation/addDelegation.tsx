import { Box, Grid, Stack } from '@mui/material';
import { useFormik } from 'formik';
import { debounce, get } from 'lodash';
import React from 'react';
import { PARAMS_SPLITTER } from 'src/appConfig/constants';
import { Button, DatePicker, Select } from 'src/components/common';
import { getRoleNamePayload, ROLE_NAME } from 'src/queries/Profile/helpers';
import { useSearchUsers } from 'src/queries/Users';
import { useGetFinancialProjects } from 'src/queries/Users/useGetFinancialProjects';
import { formatDateUtc } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CRUUSER_KEY, CRUUSER_USER_TYPE_KEY } from '../../enums';
import { CRUUserFormikProps, getErrorMessage, isEqualPrevAndNextObjByPath } from '../../helper';
import {
  addDelegationFormSchema,
  AddDelegationFormValue,
  ADD_DELEGATION_KEY,
  getAfterDate,
  getDelegateUserTypeOptions,
  initialAddDelegationFormValue,
} from './helpers';

const AddDelegation: React.FC<Props> = ({ formikProps }) => {
  const { setFieldValue: setFieldValueFormik, values: valuesFormik } = formikProps;

  //search users
  const [searchUsers, setSearchUsers] = React.useState('');
  const { users, isLoading: isLoadingSearchUsers } = useSearchUsers({
    name: searchUsers,
    exclude: valuesFormik.username,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchUsersValue = React.useCallback(debounce(setSearchUsers, 200), []);

  //search projects
  const [searchProjects, setSearchProjects] = React.useState('');
  const {
    financialProjects,
    isLoading: isLoadingSearchProjects,
    setParams,
  } = useGetFinancialProjects({
    enabled: !!searchProjects,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchProjectsValue = React.useCallback(debounce(setSearchProjects, 200), []);

  const _getErrorMessage = (fieldName: ADD_DELEGATION_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  //form
  const getInitialValues = React.useMemo(() => {
    return {
      ...initialAddDelegationFormValue,
    };
  }, []);

  const handleAddDelegation = (values: AddDelegationFormValue) => {
    const user = users.find((user) => user.id === values.existingUserAccount);

    if (
      valuesFormik.delegateAccess.some((row) => {
        return (
          row.delegatedUserId === user?.id && values.userType === getRoleNamePayload(row.roleName)
        );
      })
    ) {
      setFieldError(ADD_DELEGATION_KEY.USER_TYPE, 'Access has been granted to current user type.');
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

      setTimeout(() => {
        resetForm();
      }, 10);
    }
  };

  const {
    values,
    errors,
    touched,
    getFieldProps,
    setFieldTouched,
    setFieldValue,
    setFieldError,
    handleSubmit,
    resetForm,
  } = useFormik<AddDelegationFormValue>({
    initialValues: getInitialValues,
    validationSchema: addDelegationFormSchema,
    enableReinitialize: true,
    onSubmit: handleAddDelegation,
  });

  //search projects
  const prefix = React.useMemo(() => {
    const selectedUserType = values.userType as ROLE_NAME;

    switch (selectedUserType) {
      case ROLE_NAME.SU:
        return CRUUSER_KEY.FIS_SU_INFO;
      case ROLE_NAME.PI:
        return CRUUSER_KEY.FIS_PI_INFO;
      case ROLE_NAME.FA:
        return CRUUSER_KEY.FIS_FA_INFO;

      default:
        return '';
    }
  }, [values.userType]);

  const userFisCodes = React.useMemo(() => {
    if (!prefix) return [];

    return get(valuesFormik, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix]);
  console.log('userFisCodes: ', userFisCodes);

  const userFisProjects = React.useMemo(() => {
    if (!prefix) return [];

    return get(valuesFormik, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix]);

  const filteredProjects = React.useMemo(() => {
    if (!searchProjects && !values.projectNumber) {
      return [];
    }

    return financialProjects;
  }, [financialProjects, searchProjects, values.projectNumber]);

  //search project after debouncing input
  React.useEffect(() => {
    if (!values.userType && !searchProjects) return;

    setParams({
      search: searchProjects,
      userType: values.userType as ROLE_NAME,
      codes: userFisCodes.map((code) => code.code).join(PARAMS_SPLITTER),
      projectNumbers: userFisProjects.map((project) => project.projectNumber).join(PARAMS_SPLITTER),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchProjects]);

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
              menuStyle={{
                width: '300px',
              }}
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
              menuStyle={{
                width: '200px',
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              {...getFieldProps(ADD_DELEGATION_KEY.PROJECT_NUMBER)}
              label="Project Number"
              placeholder={'Search'}
              options={
                filteredProjects
                  ? filteredProjects.map((project) => ({
                      label: `${project.number}`,
                      value: project.number,
                      subLabel: project.name,
                    }))
                  : []
              }
              isLoading={isLoadingSearchProjects}
              value={values.projectNumber}
              name={ADD_DELEGATION_KEY.PROJECT_NUMBER}
              onInputChange={(value: string) => {
                debounceSearchProjectsValue(value);
              }}
              hideSearchIcon
              isClearable={false}
              isDisabled={isEmpty(values.userType)}
              optionWithSubLabel
              onChange={setFieldValue}
              errorMessage={_getErrorMessage(ADD_DELEGATION_KEY.PROJECT_NUMBER)}
              menuStyle={{
                width: '400px',
              }}
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

export default React.memo(AddDelegation, (prevProps, nextProps) => {
  const prevValues = prevProps.formikProps.values;
  const nextValues = nextProps.formikProps.values;

  return (
    isEqualPrevAndNextObjByPath(
      prevValues,
      nextValues,
      `${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`
    ) &&
    isEqualPrevAndNextObjByPath(
      prevValues,
      nextValues,
      `${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`
    ) &&
    isEqualPrevAndNextObjByPath(
      prevValues,
      nextValues,
      `${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`
    ) &&
    isEqualPrevAndNextObjByPath(
      prevValues,
      nextValues,
      `${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`
    ) &&
    isEqualPrevAndNextObjByPath(
      prevValues,
      nextValues,
      `${CRUUSER_KEY.FIS_PI_INFO}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`
    ) &&
    isEqualPrevAndNextObjByPath(
      prevValues,
      nextValues,
      `${CRUUSER_KEY.FIS_PI_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`
    )
  );
});
