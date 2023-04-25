import { Box, Stack, Typography } from '@mui/material';
import { capitalize, isEmpty, upperFirst } from 'lodash';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import TypographyLink from 'src/components/TypographyLink';
import { PurchaseOrderItem } from 'src/queries/PurchasingListing';
import { Callback } from 'src/redux/types';
import { getDateDisplay, localTimeToHawaii } from 'src/utils';
import { getPOLinkByDocumentType, transformDocumentType } from '../helpers';
import { NON_PO_LISTING_ITEM_KEY } from 'src/queries/NonPOListing';

export const allApprovedColumns = ({
  handleViewFinalPDF,
}: {
  handleViewFinalPDF: Callback;
}): MUIDataTableColumn[] => [
  {
    name: NON_PO_LISTING_ITEM_KEY.REQUEST_NUMBER,
    label: 'Req No',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
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
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 30,
              maxWidth: 30,
            }}
          >
            <Typography variant="body2">{transformDocumentType(value) ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.DOCUMENT_TYPE,
    label: 'Type',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 80,
              maxWidth: 80,
            }}
          >
            <Typography variant="body2">{value ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.LISTED_PROJECT_NUMBER,
    label: 'Project #',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
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
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 120,
              maxWidth: 120,
            }}
          >
            <Typography variant="body2">{value ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  // TODO: Check field value
  {
    name: NON_PO_LISTING_ITEM_KEY.TOTAL,
    label: 'Amount',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box>
            <Typography variant="body2">{`$${value}` ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.CHECK_DATE,
    label: 'Check Dt',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 80,
              maxWidth: 80,
            }}
          >
            <Typography variant="body2">{getDateDisplay(value) ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.CHECK_NUMBER,
    label: 'Check No',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 90,
              maxWidth: 90,
            }}
          >
            <Typography variant="body2">{value ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.PAYMENT_METHOD,
    label: 'Pmt Type',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 80,
              maxWidth: 80,
            }}
          >
            <Typography variant="body2">{upperFirst(value) ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.ACCEPTED_DATE,
    label: 'Approved Dt',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
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
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box>
            <Typography variant="body2">{value ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.PI_NAME,
    label: 'PI Name',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (value: string) => {
        return (
          <Box
            sx={{
              minWidth: 110,
              maxWidth: 150,
            }}
          >
            <Typography variant="body2">{capitalize(value)}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: NON_PO_LISTING_ITEM_KEY.HAS_FINAL_PDF,
    label: 'PDF',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (
        _value: any,
        meta:
          | MUIDataTableMeta
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: PurchaseOrderItem[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex];

        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 60,
                maxWidth: 60,
              }}
              onClick={(data) => {
                handleViewFinalPDF(rowData);
              }}
            >
              <TypographyLink>{_value ? 'View' : ''}</TypographyLink>
            </Box>
          </Stack>
        );
      },
    },
  },
];
