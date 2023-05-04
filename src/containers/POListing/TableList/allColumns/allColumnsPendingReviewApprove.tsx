import { Box, Stack, Typography } from '@mui/material';
import { isEmpty, upperFirst } from 'lodash';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { PURCHASE_ORDER_KEY, PurchaseOrderItem } from 'src/queries/PurchasingListing';
import { localTimeToHawaii } from 'src/utils';
import { getPOLinkByDocumentType, getPOStatus, transformDocumentType } from '../helpers';
import { ArrowDropDown } from '@mui/icons-material';

export const allColumnsPendingReviewApprove = (): MUIDataTableColumn[] => [
  {
    name: PURCHASE_ORDER_KEY.NUMBER,
    label: 'PO Number',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (
        _value: any,
        meta:
          | MUIDataTableMeta
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: PurchaseOrderItem[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as PurchaseOrderItem;
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box>{getPOLinkByDocumentType(rowData)}</Box>
          </Stack>
        );
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.DOCUMENT_TYPE,
    label: 'Type',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography>{transformDocumentType(value)}</Typography>;
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.PROJECT_NUMBER,
    label: 'Project #',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 80,
                maxWidth: 80,
              }}
            >
              <Typography fontWeight="bold" variant="body2">
                {value ?? '--'}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.VENDOR_NAME,
    label: 'Vendor Name',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.TOTAL_AMOUNT,
    label: 'Amount',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{!isEmpty(value) ? `$${value}` : '--'}</Typography>;
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.STATUS,
    label: 'Status',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 210,
                maxWidth: 210,
              }}
            >
              <Typography fontWeight="bold" variant="body2">
                {getPOStatus(value)}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.MODIFIED_DATE,
    label: 'Modified Date',
    options: {
      filter: false,
      sort: true,

      customHeadLabelRender: () => {
        return (
          <Stack>
            <Typography
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
                display: 'flex',
                transform: 'translateY(2px)',
              }}
            >
              Modified Date
              <ArrowDropDown sx={{ position: 'relative', transform: 'translateY(-3px)' }} />
            </Typography>
          </Stack>
        );
      },
      setCellHeaderProps: () => ({ style: { width: '200px' } }), // Set the width of the column

      customBodyRender: (value: string) => {
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 140,
                maxWidth: 140,
              }}
            >
              <Typography variant="body2">
                {!isEmpty(value) ? localTimeToHawaii(value) : '--'}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.FA_REVIEWER,
    label: 'FA Staff',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: (value) => ({ style: { paddingLeft: '14px', paddingRight: '6px' } }),
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{upperFirst(value) ?? '--'}</Typography>;
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.PI_NAME,
    label: 'PI Name',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
];
