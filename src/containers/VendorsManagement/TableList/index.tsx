import { Box, useMediaQuery } from '@mui/material';
import { MUIDataTableOptions } from 'mui-datatables';
import React from 'react';
import { connect } from 'react-redux';
import { muiResponsive } from 'src/appConfig/constants';
import { Table } from 'src/components/common';
import EmptyTable from 'src/components/EmptyTable';
import { useGetAllVendors } from 'src/queries';
import { GetPropertiesParams } from 'src/queries/helpers';
import { IRootState } from 'src/redux/rootReducer';
import { handleShowErrorMsg } from 'src/utils';
// import {
//   FILTER_USERS_INDEX,
//   getUsersUpdatedParams,
//   PREFIX_FILTER_USERS,
// } from './CustomFilter/helpers';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { RoleService } from 'src/services';
import { allColumnsCU, allColumnsPISUFA } from './allColumns';
import HeaderTable from './header';

const TableList: React.FC<Props> = () => {
  const isTabletScreen = useMediaQuery(muiResponsive.TABLET);
  const currentUserRole = RoleService.getCurrentRole() as ROLE_NAME;

  // const location = useLocation();
  // const query = new URLSearchParams(location.search);
  // const filter = query.getAll(QUERY_KEY.filter) as string[];

  const { vendors, totalRecords, setParams, isFetching, onGetAllVendors } = useGetAllVendors({
    onError: (error) => handleShowErrorMsg(error),
  });

  const handleGetVendors = (params: GetPropertiesParams) => {
    // const userTypes = filter[FILTER_USERS_INDEX.USER_TYPE]
    //   ?.replaceAll(PREFIX_FILTER_USERS.USER_TYPE, '')
    //   .split(',');

    // const newParams = getUsersUpdatedParams(params, {
    //   userTypesKey: userTypes,
    // });
    let newParams = {
      ...params,
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
  };
  const handleViewVendorDetail = React.useCallback(
    (_value: string[], meta: { rowIndex: number }) => {
      // const index = meta.rowIndex;
      // const vendor = vendors[`${index}`];
      // Navigator.navigate(`${PATHS.editVendorMaster}/${vendor.code}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vendors]
  );

  const tableOptions: MUIDataTableOptions = React.useMemo(
    () => ({
      count: totalRecords,
      onRowClick: handleViewVendorDetail,
      rowHover: true,
      filter: false,
      searchAlwaysOpen: false,
      searchOpen: false,
      search: false,
      tableBodyMaxHeight: isTabletScreen ? '100%' : 'calc(100vh - 314px)', // content height
    }),
    [handleViewVendorDetail, isTabletScreen, totalRecords]
  );

  const columns = React.useMemo(() => {
    switch (currentUserRole) {
      case ROLE_NAME.PI:
      case ROLE_NAME.SU:
      case ROLE_NAME.FA:
        return allColumnsPISUFA();
      case ROLE_NAME.CU:
        return allColumnsCU();
      default:
        return null;
    }
  }, [currentUserRole]);

  return (
    <Box>
      <HeaderTable onRefreshTable={() => onGetAllVendors()} isLoading={isFetching} />
      <Table
        title={''}
        onAction={handleGetVendors}
        isLoading={isFetching}
        data={vendors}
        tableOptions={tableOptions}
        columns={columns}
        emptyComponent={<EmptyTable />}
      />
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TableList);
