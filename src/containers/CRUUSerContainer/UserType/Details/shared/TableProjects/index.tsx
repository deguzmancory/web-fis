import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { MUIDataTableOptions } from 'mui-datatables';
import React from 'react';
import { connect } from 'react-redux';
import { muiResponsive, PARAMS_SPLITTER } from 'src/appConfig/constants';
import { Table } from 'src/components/common';
import EmptyTable from 'src/components/EmptyTable';
import { FinancialProject, GetPropertiesParams } from 'src/queries/Users/types';
import { IRootState } from 'src/redux/rootReducer';
import { allColumns } from './allColumns';
import { useGetFinancialProjects } from 'src/queries/Users/useGetFinancialProjects';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { get } from 'lodash';
import { UserFiCode } from 'src/queries/Contents/types';
import { CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import { handleShowErrorMsg } from 'src/utils';
import { useHistory, useLocation } from 'react-router';
import { isEmpty } from 'src/validations';

const TableProjects: React.FC<Props> = ({ formikProps, prefix = '', type, isLoading }) => {
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);

  const { values, setFieldValue } = formikProps;
  const isTabletScreen = useMediaQuery(muiResponsive.TABLET);

  const userFisCodes: UserFiCode[] = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) || [],
    [prefix, values]
  );

  const userFisProjects = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [],
    [prefix, values]
  );

  const {
    financialProjects,
    totalRecords,
    isLoading: isLoadingGetProjects,
    setParams,
  } = useGetFinancialProjects({
    onError: (error) => handleShowErrorMsg(error),
    enabled: !isEmpty(userFisCodes) || !isEmpty(userFisProjects),
  });

  const filteredFinancialProjects = React.useMemo(() => {
    if (isEmpty(userFisCodes) && isEmpty(userFisProjects)) {
      return [];
    }

    return financialProjects;
  }, [financialProjects, userFisCodes, userFisProjects]);

  const handleRefetchFinancialProjects = React.useCallback(
    (params: GetPropertiesParams) => {
      const newParams = {
        ...params,
        userType: type,
        codes: userFisCodes.map((code) => code.code).join(PARAMS_SPLITTER),
        projectNumbers: userFisProjects
          .map((project) => project.projectNumber)
          .join(PARAMS_SPLITTER),
      };

      setParams(newParams);
    },
    [setParams, type, userFisCodes, userFisProjects]
  );

  const tableOptions: MUIDataTableOptions = React.useMemo(
    () => ({
      count: totalRecords,
      rowHover: true,
      filter: false,
      searchAlwaysOpen: false,
      searchOpen: false,
      search: false,
      tableBodyHeight: isTabletScreen ? '100%' : 'calc(100vh - 420px)', // content height
    }),
    [isTabletScreen, totalRecords]
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
      }),
    [userFisCodes, type, handleRowDelete]
  );

  return (
    <Box>
      <Table
        title={''}
        onAction={handleRefetchFinancialProjects}
        isLoading={isLoading || isLoadingGetProjects}
        data={filteredFinancialProjects}
        tableOptions={tableOptions}
        columns={columns}
        emptyComponent={
          <EmptyTable
            style={{
              height: isTabletScreen ? '100%' : 'calc(100vh - 420px)',
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

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    formikProps: CRUUserFormikProps;
    isLoading: boolean;
    prefix: string;
    type: ROLE_NAME;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  React.memo(TableProjects, (prevProps, nextProps) => {
    const prevPropsFormikValues = prevProps.formikProps.values;
    const nextPropsFormikValues = nextProps.formikProps.values;

    const prevPropsUserFisCodes =
      get(prevPropsFormikValues, `${prevProps.prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) ||
      [];
    const nextPropsUserFisCodes =
      get(nextPropsFormikValues, `${nextProps.prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) ||
      [];
    const prevPropsUserFisProjects =
      get(
        prevPropsFormikValues,
        `${prevProps.prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`
      ) || [];
    const nextPropsUserFisProjects =
      get(
        nextPropsFormikValues,
        `${nextProps.prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`
      ) || [];

    return (
      prevPropsUserFisCodes?.length === nextPropsUserFisCodes?.length &&
      prevPropsUserFisProjects?.length === nextPropsUserFisProjects?.length
    );
  })
);
