import { Box, Stack, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { PURCHASE_ORDER_KEY, PurchaseOrderItem } from 'src/queries/PurchasingListing';
import { localTimeToHawaii } from 'src/utils';
import { getPOLinkByDocumentType } from '../helpers';

export const allOutstandingColumns = (): MUIDataTableColumn[] => [
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
    name: PURCHASE_ORDER_KEY.SHORT_FORM_NAME,
    label: 'Type',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography>{value ?? '--'}</Typography>;
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

  // TODO: Check field value
  {
    name: PURCHASE_ORDER_KEY.TOTAL_AMOUNT,
    label: 'Orig Amount',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 110,
                maxWidth: 110,
              }}
            >
              <Typography variant="body2">{`$${value}` ?? '--'}</Typography>
            </Box>
          </Stack>
        );
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.BALANCE,
    label: 'Rem Balance',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 110,
                maxWidth: 110,
              }}
            >
              <Typography variant="body2">{`$${value}` ?? '--'}</Typography>
            </Box>
          </Stack>
        );
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.MODIFIED_DATE,
    label: 'Modified date',
    options: {
      filter: false,
      sort: true,
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
    name: PURCHASE_ORDER_KEY.FA_STAFF_REVIEWER,
    label: 'FA Staff',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
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
