import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import _, { get } from 'lodash';
import { MUIDataTableOptions } from 'mui-datatables';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { muiResponsive, PARAMS_SPLITTER } from 'src/appConfig/constants';
import { Table } from 'src/components/common';
import EmptyTable from 'src/components/EmptyTable';
import { CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import { UserFiCode } from 'src/queries/Contents/types';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { FinancialProject, GetPropertiesParams } from 'src/queries/Users/types';
import { useGetFinancialProjects } from 'src/queries/Users/useGetFinancialProjects';
import { handleShowErrorMsg } from 'src/utils';
import { isEmpty } from 'src/validations';
import { allColumns } from './allColumns';
import HeaderTableUserType, { SEARCH_PROJECT_KEY } from './header';

const TableProjects: React.FC<Props> = ({ formikProps, prefix = '', type, isLoading }) => {
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchProjectName = React.useMemo(
    () => query.get(SEARCH_PROJECT_KEY.SEARCH_NAME) || undefined,
    [query]
  );

  const { values, setFieldValue } = formikProps;
  const currentFormMode = values.mode;
  const isTabletScreen = useMediaQuery(muiResponsive.TABLET);

  const isViewOnly = React.useMemo(() => {
    return values.isViewOnly;
  }, [values.isViewOnly]);

  const userFisCodes: UserFiCode[] = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) || [],
    [prefix, values]
  );

  const userFisProjects = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [],
    [prefix, values]
  );

  // in case empty userFisCodes and userFisProjects => no records
  const hideTableRecords = React.useMemo(
    () => isEmpty(userFisCodes) && isEmpty(userFisProjects),
    [userFisCodes, userFisProjects]
  );

  const {
    financialProjects,
    totalRecords,
    isLoading: isLoadingGetProjects,
    currentParams,
    setParams,
  } = useGetFinancialProjects({
    onError: (error) => handleShowErrorMsg(error),
    enabled: !hideTableRecords, //TODO: tin_pham refactor, API call 2 times
  });

  const filteredFinancialProjects = React.useMemo(() => {
    if (hideTableRecords || !currentParams) {
      return [];
    }

    return financialProjects;
  }, [financialProjects, hideTableRecords, currentParams]);

  const handleRefetchFinancialProjects = React.useCallback(
    (params: GetPropertiesParams) => {
      let newParams = {
        ...params,
        searchName: searchProjectName,
        userType: type,
        codes: userFisCodes.map((code) => code.code).join(PARAMS_SPLITTER),
        projectNumbers: userFisProjects
          .map((project) => project.projectNumber)
          .join(PARAMS_SPLITTER),
      };

      const sort = params?.sort;
      if (sort) {
        newParams = {
          ...newParams,
          order: `${newParams.sort}:${newParams.order}`,
        };
        delete newParams.sort;
      }

      setParams(newParams);
    },
    [setParams, type, userFisCodes, userFisProjects, searchProjectName]
  );

  const tableOptions: MUIDataTableOptions = React.useMemo(
    () => ({
      count: hideTableRecords ? 0 : totalRecords,
      rowHover: true,
      filter: false,
      searchAlwaysOpen: false,
      searchOpen: false,
      search: false,
      tableBodyHeight: isTabletScreen ? '100%' : 'calc(100vh - 450px)', // content height
    }),
    [isTabletScreen, totalRecords, hideTableRecords]
  );

  const handleRowDelete = React.useCallback(
    (rowData: FinancialProject) => {
      const updatedFisProjects = userFisProjects.filter(
        (project) => project.projectNumber !== rowData.number
      );

      setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`, updatedFisProjects);

      //reset data in <TableProjects />
      history.push({ search: query.toString() });
    },
    [prefix, setFieldValue, userFisProjects, history, query]
  );

  const columns = React.useMemo(
    () =>
      allColumns({
        onRowDelete: (rowData) => handleRowDelete(rowData),
        userFisCodes,
        userType: type,
        formMode: currentFormMode,
        isViewOnly: isViewOnly,
      }),
    [userFisCodes, type, currentFormMode, isViewOnly, handleRowDelete]
  );

  return (
    <Box>
      <HeaderTableUserType />
      <Table
        title={''}
        onAction={handleRefetchFinancialProjects}
        isLoading={isLoading || isLoadingGetProjects || !currentParams}
        data={filteredFinancialProjects}
        tableOptions={tableOptions}
        columns={columns}
        emptyComponent={
          <EmptyTable
            style={{
              height: isTabletScreen ? '100%' : 'calc(100vh - 597px)',
            }}
          />
        }
      />
      <Stack alignItems={'flex-end'} mt={2}>
        <Typography variant="body2">(Only unlinked projects can be removed)</Typography>
      </Stack>
    </Box>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
  prefix: string;
  type: ROLE_NAME;
};
export default React.memo(TableProjects, (prevProps, nextProps) => {
  const prevPropsFormikValues = prevProps.formikProps.values;
  const nextPropsFormikValues = nextProps.formikProps.values;
  const type = nextProps.type;

  const prevPropsUserFisProjects =
    get(prevPropsFormikValues, `${prevProps.prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) ||
    [];
  const nextPropsUserFisProjects =
    get(nextPropsFormikValues, `${nextProps.prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) ||
    [];

  switch (type) {
    case ROLE_NAME.PI:
      const prevPropsUserPiCode =
        get(prevPropsFormikValues, `${prevProps.prefix}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`) || null;
      const nextPropsUserPiCode =
        get(nextPropsFormikValues, `${prevProps.prefix}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`) || null;

      return (
        _.isEqual(prevPropsUserPiCode, nextPropsUserPiCode) &&
        prevPropsUserFisProjects?.length === nextPropsUserFisProjects?.length
      );

    default:
      const prevPropsUserFisCodes =
        get(prevPropsFormikValues, `${prevProps.prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) ||
        [];
      const nextPropsUserFisCodes =
        get(nextPropsFormikValues, `${nextProps.prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) ||
        [];

      return (
        prevPropsUserFisCodes?.length === nextPropsUserFisCodes?.length &&
        prevPropsUserFisProjects?.length === nextPropsUserFisProjects?.length
      );
  }
});
