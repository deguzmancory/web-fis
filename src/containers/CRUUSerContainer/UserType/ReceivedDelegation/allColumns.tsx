import { Add } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { MUIDataTableColumn } from 'mui-datatables';
import { USER_KEY } from 'src/queries/Users/types';
import { DateFormat } from 'src/utils/momentUtils';

export const allColumns = (): MUIDataTableColumn[] => [
  {
    name: USER_KEY.USERNAME,
    label: 'Username',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
      setCellProps: () => ({
        style: {
          minWidth: '122px',
        },
      }),
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
      setCellProps: () => ({
        style: {
          minWidth: '122px',
        },
      }),
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
      setCellProps: () => ({
        style: {
          minWidth: '122px',
        },
      }),
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
      customBodyRender: (value: string) => {
        return (
          <Typography variant="body2">{value ? dayjs(value).format(DateFormat) : '--'}</Typography>
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
      customBodyRender: (value: string) => {
        return (
          <Typography variant="body2">{value ? dayjs(value).format(DateFormat) : '--'}</Typography>
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
      customBodyRender: (_value: string) => {
        return (
          <IconButton
            size="small"
            sx={{
              p: 0,
              opacity: 0,
            }}
            disabled
          >
            <Add />
          </IconButton>
        );
      },
    },
  },
];
