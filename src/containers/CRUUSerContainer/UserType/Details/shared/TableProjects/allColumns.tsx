import { Delete } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { Button } from 'src/components/common';
import { USER_MODE } from 'src/containers/CRUUSerContainer/enums';
import { isEditProfileMode } from 'src/containers/CRUUSerContainer/helper';
import { UserFiCode } from 'src/queries/Contents/types';
import { isFA, ROLE_NAME } from 'src/queries/Profile/helpers';
import { FinancialProject } from 'src/queries/Projects/types';
import { FINANCIAL_PROJECT_KEY } from 'src/queries/Users/types';
import { Callback } from 'src/redux/types';
import { getDateDisplay } from 'src/utils/dayjsUtils';

export const allColumns = ({
  onRowDelete,
  userFisCodes,
  userType,
  formMode,
  isViewOnly,
}: {
  onRowDelete: Callback;
  userFisCodes: UserFiCode[];
  userType: ROLE_NAME;
  formMode: USER_MODE;
  isViewOnly?: boolean;
}): MUIDataTableColumn[] => [
  {
    name: isFA(userType) ? FINANCIAL_PROJECT_KEY.FA_CODE : FINANCIAL_PROJECT_KEY.PI_CODE,
    label: isFA(userType) ? 'FA Code' : 'PI Code',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        const isUnlinkProject = userFisCodes.every((code) => code.code !== value);

        return <Typography variant="body2">{isUnlinkProject ? 'Unlinked' : value}</Typography>;
      },
      setCellHeaderProps: () => ({
        style: {
          whiteSpace: 'nowrap',
        },
      }),
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
      setCellHeaderProps: () => ({
        style: {
          whiteSpace: 'nowrap',
        },
      }),
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
            {getDateDisplay(rowData.startDate)} - {getDateDisplay(rowData.endDate)}
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
      display: isEditProfileMode(formMode) || isViewOnly ? 'false' : 'true',
      customBodyRender: (
        _value: any,
        meta:
          | MUIDataTableMeta
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: FinancialProject[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as FinancialProject;
        const targetCode = isFA(userType) ? rowData.faCode : rowData.piCode;
        const isUnlinkProject = userFisCodes.every((code) => code.code !== targetCode);

        if (!isUnlinkProject) return null;
        if (isEditProfileMode(formMode)) return null;
        if (isViewOnly) return null;
        return (
          <Box
            sx={{
              minWidth: 15,
              maxWidth: 15,
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
