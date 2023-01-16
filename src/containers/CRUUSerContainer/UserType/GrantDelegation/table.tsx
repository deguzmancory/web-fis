import { Box } from '@mui/material';
import { MUIDataTableOptions } from 'mui-datatables';
import React from 'react';
import { Table } from 'src/components/common';
import EmptyTable from 'src/components/EmptyTable';
import { CRUUserFormikProps, CRUUSER_KEY, getErrorMessage } from '../../helper';
import { allColumns } from './allColumns';

const TableGrantDelegation: React.FC<Props> = ({ formikProps }) => {
  const { errors, touched, getFieldProps } = formikProps;

  const _getErrorMessage = (fieldName: CRUUSER_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const tableOptions: MUIDataTableOptions = React.useMemo(
    () => ({
      rowHover: true,
      filter: false,
      searchAlwaysOpen: false,
      searchOpen: false,
      search: false,
      customFooter(rowCount, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) {
        return null;
      },
    }),
    []
  );

  const initialRows = [
    {
      isEdit: false,
      username: 'zoia_stoytcheva',
      fullName: 'Zoia Stoytcheva',
      defaultUserType: 'Secondary User',
      projectNumber: '0001',
      startDate: new Date().toISOString(),
      startDateTemp: new Date().toISOString(),
      endDate: new Date().toISOString(),
      endDateTemp: new Date().toISOString(),
    },
    {
      isEdit: false,
      username: 'tin_pham',
      fullName: 'Tin Pham',
      defaultUserType: 'Central User',
      projectNumber: '0002',
      startDate: new Date().toISOString(),
      startDateTemp: new Date().toISOString(),
      endDate: new Date().toISOString(),
      endDateTemp: new Date().toISOString(),
    },
  ];

  const [rows, setRows] = React.useState(initialRows);

  const columns = React.useMemo(() => allColumns(setRows, rows), [rows]);

  return (
    <Box>
      <Table
        title={''}
        data={rows}
        onAction={() => {}}
        tableOptions={tableOptions}
        columns={columns}
        emptyComponent={<EmptyTable />}
      />
    </Box>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
};
export default TableGrantDelegation;
