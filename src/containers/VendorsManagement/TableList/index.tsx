import { Box, useMediaQuery } from '@mui/material';
import { MUIDataTableOptions } from 'mui-datatables';
import React from 'react';
import { connect } from 'react-redux';
import { muiResponsive } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { Table } from 'src/components/common';
import EmptyTable from 'src/components/EmptyTable';
import { GetPropertiesParams } from 'src/queries/helpers';
import { useGetAllVendors } from 'src/queries/Vendors/useGetAllVendors';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import { allColumns } from './allColumns';
// import {
//   FILTER_USERS_INDEX,
//   getUsersUpdatedParams,
//   PREFIX_FILTER_USERS,
// } from './CustomFilter/helpers';
import HeaderTable from './header';

const TableList: React.FC<Props> = () => {
  const isTabletScreen = useMediaQuery(muiResponsive.TABLET);
  // const location = useLocation();
  // const query = new URLSearchParams(location.search);
  // const filter = query.getAll(QUERY_KEY.filter) as string[];

  const { vendors, totalRecords, setParams, isFetching, onGetAllVendors } = useGetAllVendors({
    onError: (error) => handleShowErrorMsg(error),
  });

  const handleGetAccounts = (params: GetPropertiesParams) => {
    // const userTypes = filter[FILTER_USERS_INDEX.USER_TYPE]
    //   ?.replaceAll(PREFIX_FILTER_USERS.USER_TYPE, '')
    //   .split(',');

    // const newParams = getUsersUpdatedParams(params, {
    //   userTypesKey: userTypes,
    // });

    setParams(params);
  };
  const handleViewVendorDetail = React.useCallback(
    (_value: string[], meta: { rowIndex: number }) => {
      const index = meta.rowIndex;
      // eslint-disable-next-line security/detect-object-injection
      const vendor = vendors[index];
      Navigator.navigate(`${PATHS.vendorDetail}/${vendor.code}`);
    },
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
      tableBodyMaxHeight: isTabletScreen ? '100%' : 'calc(100vh - 366px)', // content height
    }),
    [handleViewVendorDetail, isTabletScreen, totalRecords]
  );

  const columns = React.useMemo(() => allColumns(), []);

  return (
    <Box>
      <HeaderTable onRefreshTable={() => onGetAllVendors()} isLoading={isFetching} />
      <Table
        title={''}
        onAction={handleGetAccounts}
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