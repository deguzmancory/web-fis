import { Delete } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { Button } from 'src/components/common';
import { UserFICode } from 'src/queries/Contents/types';
import { FinancialProject, FINANCIAL_PROJECT_KEY } from 'src/queries/Users/types';
import { Callback } from 'src/redux/types';

export const allColumns = ({
  onRowDelete,
  userFisCodes,
}: {
  onRowDelete: Callback;
  userFisCodes: UserFICode[];
}): MUIDataTableColumn[] => [
  {
    name: FINANCIAL_PROJECT_KEY.PI_CODE,
    label: 'PI Code',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        const isUnlinkProject = userFisCodes.every((code) => code.code !== value);

        return <Typography variant="body2">{isUnlinkProject ? 'Unlink' : value}</Typography>;
      },
    },
  },

  {
    name: FINANCIAL_PROJECT_KEY.PROJECT_NUMBER,
    label: 'Project #',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: FINANCIAL_PROJECT_KEY.PROJECT_NAME,
    label: 'Project Title',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
  {
    name: FINANCIAL_PROJECT_KEY.INACTIVATE,
    label: 'Inactive',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 20,
              maxWidth: 20,
            }}
          >
            <Typography variant="body2">{value ? 'X' : ''}</Typography>
          </Box>
        );
      },
    },
  },
  {
    name: '',
    label: 'Project Dates',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (
        _value: any,
        meta:
          | MUIDataTableMeta
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: FinancialProject[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as FinancialProject;
        return (
          <Typography variant="body2">
            {dayjs(rowData.startDate).format('MM/DD')} - {dayjs(rowData.endDate).format('MM/DD')}
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
        meta:
          | MUIDataTableMeta
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: FinancialProject[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as FinancialProject;
        const isUnlinkProject = userFisCodes.every((code) => code.code !== rowData.piCode);

        if (!isUnlinkProject) return null;

        return (
          <Box
            sx={{
              minWidth: 10,
              maxWidth: 10,
            }}
          >
            <Button
              variant="link-primary"
              fontWeightNormal
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                onRowDelete(rowData);
              }}
            >
              <Delete />
            </Button>
          </Box>
        );
      },
    },
  },
];