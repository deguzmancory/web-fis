import { Box, Stack, Typography } from '@mui/material';
import { capitalize, isEmpty, upperFirst } from 'lodash';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { Button } from 'src/components/common';
import TypographyLink from 'src/components/TypographyLink';
import { PurchaseOrdersList, PURCHASE_ORDER_KEY } from 'src/queries/PurchasingListing';
import { Callback } from 'src/redux/types';
import { getDateDisplay, localTimeToHawaii } from 'src/utils';
import { transformDocumentType } from '../../helper';

export const allApprovedColumns = ({
  handleViewFinalPDF,
  handlePrintedId,
  handleGetPurchaseOrderDetail,
}: {
  handleViewFinalPDF: Callback;
  handlePrintedId: Callback;
  handleGetPurchaseOrderDetail: Callback;
}): MUIDataTableColumn[] => [
  {
    name: PURCHASE_ORDER_KEY.NUMBER,
    label: 'PO Num',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (
        _value: any,
        meta:
          | MUIDataTableMeta
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: PurchaseOrdersList[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex];

        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 80,
                maxWidth: 80,
              }}
            >
              <TypographyLink onClick={() => handleGetPurchaseOrderDetail(rowData)} variant="body2">
                {_value ?? '--'}
              </TypographyLink>
            </Box>
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
    name: PURCHASE_ORDER_KEY.PAYMENT_REQUEST_NUMBER,
    label: 'P Req No',
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
    name: PURCHASE_ORDER_KEY.PROJECT_NUMBER,
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
    name: PURCHASE_ORDER_KEY.VENDOR_NAME,
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
    name: PURCHASE_ORDER_KEY.TOTAL_AMOUNT,
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
    name: PURCHASE_ORDER_KEY.CHECK_DATE,
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
    name: PURCHASE_ORDER_KEY.CHECK_NUMBER,
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
    name: PURCHASE_ORDER_KEY.PAYMENT_METHOD,
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
    name: PURCHASE_ORDER_KEY.RCUH_APPROVED_DATE,
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
              minWidth: 100,
              maxWidth: 100,
            }}
          >
            <Typography variant="body2">{value ?? '--'}</Typography>
          </Box>
        );
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.PRINTED_DATE,
    label: 'Printed Date',
    options: {
      filter: false,
      sort: true,
      setCellHeaderProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      setCellProps: () => ({ style: { paddingLeft: '8px', paddingRight: '0' } }),
      customBodyRender: (
        value: string,
        meta:
          | MUIDataTableMeta
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: PurchaseOrdersList[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex];

        return (
          <Box
            sx={{
              minWidth: 140,
              maxWidth: 140,
            }}
          >
            <Typography variant="body2">
              {!isEmpty(value) ? (
                localTimeToHawaii(value)
              ) : (
                <Button className="px-4" onClick={() => handlePrintedId(rowData)}>
                  Mark as Printed
                </Button>
              )}
            </Typography>
          </Box>
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
    name: PURCHASE_ORDER_KEY.PI_NAME,
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
    name: PURCHASE_ORDER_KEY.HAS_FINAL_PDF,
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
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: PurchaseOrdersList[] })
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
