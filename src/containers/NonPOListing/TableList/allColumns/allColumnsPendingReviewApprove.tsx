import { Box, Stack, Typography } from '@mui/material';
import { isEmpty, upperFirst } from 'lodash';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { PurchaseOrderItem } from 'src/queries/PurchasingListing';
import { localTimeToHawaii } from 'src/utils';
import { getPOLinkByDocumentType, getPOStatus, transformDocumentType } from '../helpers';
import { NON_PO_LISTING_ITEM_KEY } from 'src/queries/NonPOListing';

export const allColumnsPendingReviewApprove = (): MUIDataTableColumn[] => [
  {
    name: NON_PO_LISTING_ITEM_KEY.REQUEST_NUMBER,
    label: 'Req No',
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
    name: NON_PO_LISTING_ITEM_KEY.DOCUMENT_NUMBER,
    label: 'Doc No',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.DOCUMENT_TYPE,
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
    name: NON_PO_LISTING_ITEM_KEY.LISTED_PROJECT_NUMBER,
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
    name: NON_PO_LISTING_ITEM_KEY.VENDOR_NAME,
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
    name: NON_PO_LISTING_ITEM_KEY.TOTAL,
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
    name: NON_PO_LISTING_ITEM_KEY.STATUS,
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
    name: NON_PO_LISTING_ITEM_KEY.UPDATED_AT,
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
    name: NON_PO_LISTING_ITEM_KEY.FA_STAFF_REVIEWER,
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
    name: NON_PO_LISTING_ITEM_KEY.PI_NAME,
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
