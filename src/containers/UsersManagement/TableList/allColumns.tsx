import { Box, Typography } from '@mui/material';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import TypographyLink from 'src/components/TypographyLink';
import { User, USER_KEY } from 'src/queries/Users/types';
import { localTimeToHawaii } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import ActionsButton from './actionsButton';
import cn from 'classnames';

export const allColumns = (): MUIDataTableColumn[] => [
  {
    name: USER_KEY.USERNAME,
    label: 'Username',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 100,
              maxWidth: 100,
            }}
            className={cn({ 'marquee-left': value.length > 20 })}
          >
            <TypographyLink
              variant="body2"
              className={value.length > 20 ? 'marquee-left__text' : ''}
            >
              {value ?? '--'}
            </TypographyLink>
          </Box>
        );
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
        return (
          <Box
            sx={{
              minWidth: 140,
              maxWidth: 140,
            }}
            className={cn({ 'marquee-left': value.length > 24 })}
          >
            <Typography variant="body2" className={value.length > 24 ? 'marquee-left__text' : ''}>
              {value ?? '--'}
            </Typography>
          </Box>
        );
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
    name: USER_KEY.SYSTEM,
    label: 'System',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: USER_KEY.DISPLAY_NAME,
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
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <Typography variant="body2">
            {!isEmpty(value) ? localTimeToHawaii(value) : '--'}
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
