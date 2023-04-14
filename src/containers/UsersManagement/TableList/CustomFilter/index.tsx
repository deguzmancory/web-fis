import { useFormik } from 'formik';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import CustomFilter from 'src/components/CustomFilter';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { PermissionsService } from 'src/services';
import { capitalizeWords } from 'src/utils';
import { isEmpty } from 'src/validations';
import { USERS_MANAGEMENT_QUERY_KEY } from '../../helpers';
import {
  CustomFilterUSersFormValue,
  CUSTOM_FILTER_USERS_KEY,
  FILTER_USERS_INDEX,
  PREFIX_FILTER_USERS,
  userTypeOptions,
} from './helpers';

const CustomFilterUsersManagement = () => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const filter = query.getAll(USERS_MANAGEMENT_QUERY_KEY.FILTER) as string[];

  const getUserTypes = (value: string) => {
    const prefixRemoved = value.replaceAll(PREFIX_FILTER_USERS.USER_TYPE, '');
    return prefixRemoved.replaceAll(' ', '_').toUpperCase().split(',');
  };

  const getUsersTypeDisplay = (userTypes: string[]) => {
    return userTypes
      .map(
        (r) =>
          `${PREFIX_FILTER_USERS.USER_TYPE}${capitalizeWords(r.toLowerCase().replace(/_/g, ' '))}`
      )
      .join(',');
  };

  const initialFilter = Array.from({ length: FILTER_USERS_INDEX.length }, (v) => '');

  const applyFilterQuery = (filters: string[]) => {
    query.delete(USERS_MANAGEMENT_QUERY_KEY.FILTER);
    filters.forEach((f) => query.append(USERS_MANAGEMENT_QUERY_KEY.FILTER, f ? f : ''));
  };

  const handleSubmitFilter = (values: CustomFilterUSersFormValue) => {
    const updateFilter = isEmpty(filter) ? initialFilter : filter;
    updateFilter[FILTER_USERS_INDEX.USER_TYPE] = getUsersTypeDisplay(values?.userTypes);

    applyFilterQuery(updateFilter);

    history.push({ search: query.toString() });
  };

  const handleClearAll = () => {
    setFieldValue(CUSTOM_FILTER_USERS_KEY.USER_TYPES, []);

    applyFilterQuery(initialFilter);
    history.push({ search: query.toString() });
  };

  const initialFormValue: CustomFilterUSersFormValue = {
    userTypes: !isEmpty(filter?.[FILTER_USERS_INDEX.USER_TYPE])
      ? getUserTypes(filter?.[FILTER_USERS_INDEX.USER_TYPE])
      : [],
  };

  const { errors, setFieldValue, handleSubmit, getFieldProps, touched } = useFormik({
    initialValues: initialFormValue,
    enableReinitialize: true,
    onSubmit: handleSubmitFilter,
  });

  const nonCuPermission = React.useMemo(() => {
    return !PermissionsService.userCU().canUpdate;
  }, []);

  const filterUserTypeOptions = React.useMemo(() => {
    if (nonCuPermission) {
      return userTypeOptions.filter((role) => role.value !== ROLE_NAME.CU);
    }
    return userTypeOptions;
  }, [nonCuPermission]);

  return (
    <CustomFilter.Container
      clearVariant="outline"
      onApply={() => handleSubmit()}
      onClear={handleClearAll}
      filterForm={
        <>
          <CustomFilter.CheckBox
            label={'User Type'}
            options={filterUserTypeOptions}
            name={CUSTOM_FILTER_USERS_KEY.USER_TYPES}
            {...getFieldProps(CUSTOM_FILTER_USERS_KEY.USER_TYPES)}
            onChange={setFieldValue}
            errorMessage={touched?.userTypes ? (errors?.userTypes as string) : ''}
          />
        </>
      }
    />
  );
};

export default CustomFilterUsersManagement;
