import { useFormik } from 'formik';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import CustomFilter from 'src/components/CustomFilter';
import { capitalizeWords } from 'src/utils';
import { isEmpty } from 'src/validations';
import { QUERY_KEY } from '../../helpers';
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

  const filter = query.getAll(QUERY_KEY.filter) as string[];

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
    query.delete(QUERY_KEY.filter);
    filters.forEach((f) => query.append(QUERY_KEY.filter, f ? f : ''));
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
    onSubmit: handleSubmitFilter,
    enableReinitialize: true,
  });

  return (
    <CustomFilter.Container
      clearVariant="outline"
      onApply={() => handleSubmit()}
      onClear={handleClearAll}
      filterForm={
        <>
          <CustomFilter.CheckBox
            label={'User Type'}
            options={userTypeOptions}
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
