import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { User, USER_KEY } from 'src/queries/Users/types';
import { getDefaultSubsystemName } from 'src/utils';
import { DateFormatDisplayMinute } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import ActionsButton from './actionsButton';

export const allColumns = (): MUIDataTableColumn[] => [
  {
    name: USER_KEY.USERNAME,
    label: 'Username',
    options: {
      filter: false,
      sort: true,
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
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: USER_KEY.EMAIL,
    label: 'Email',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: USER_KEY.DEFAULT_SUB_SYSTEM_CODE,
    label: 'System',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{getDefaultSubsystemName(value)}</Typography>;
      },
    },
  },
  {
    name: USER_KEY.ROLE_DISPLAY_NAME,
    label: 'User Type',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: USER_KEY.LAST_LOGIN_DATE,
    label: 'Last Login',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return (
          <Typography variant="body2">
            {!isEmpty(value) ? dayjs(value).format(DateFormatDisplayMinute) : '--'}
          </Typography>
        );
      },
    },
  },

  {
    name: '',
    label: null,
    options: {
      filter: false,
      sort: false,
      customBodyRender: (
        _value: any,
        meta: MUIDataTableMeta | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: User[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as User;
        return <ActionsButton data={rowData} />;
      },
    },
  },
];
