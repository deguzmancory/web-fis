import { Typography } from '@mui/material';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { USER_KEY } from 'src/queries/Users/types';
import ActionsButton from './actionsButton';
import DatePickerEdit from './datePickerEdit';

export const allColumns = (setRows, rows): MUIDataTableColumn[] => [
  {
    name: USER_KEY.USERNAME,
    label: 'Username',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },

  {
    name: USER_KEY.FULL_NAME,
    label: 'Full Name',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: USER_KEY.DEFAULT_USER_TYPE,
    label: 'User Type',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: USER_KEY.PROJECT_NUMBER,
    label: 'Project #',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: USER_KEY.START_DATE,
    label: 'Start Date',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (
        value: string,
        meta: MUIDataTableMeta | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: any[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as any;
        return (
          <DatePickerEdit
            data={rowData}
            rowIndex={meta.rowIndex}
            setRows={setRows}
            keyValue={USER_KEY.START_DATE}
          />
        );
      },
    },
  },
  {
    name: USER_KEY.END_DATE,
    label: 'End Date',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (
        value: string,
        meta: MUIDataTableMeta | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: any[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as any;
        return (
          <DatePickerEdit
            data={rowData}
            rowIndex={meta.rowIndex}
            setRows={setRows}
            keyValue={USER_KEY.END_DATE}
          />
        );
      },
    },
  },

  {
    name: '',
    label: null,
    options: {
      filter: false,
      sort: true,
      customBodyRender: (
        _value: any,
        meta: MUIDataTableMeta | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: any[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as any;
        return <ActionsButton data={rowData} rowIndex={meta.rowIndex} setRows={setRows} />;
      },
    },
  },
];
