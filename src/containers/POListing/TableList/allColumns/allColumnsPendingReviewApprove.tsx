import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { PurchaseOrdersList, PURCHASE_ORDER_KEY } from 'src/queries/PurchasingListing';
import { Callback } from 'src/redux/types';
import { Box, Stack, Typography } from '@mui/material';
import TypographyLink from 'src/components/TypographyLink';
import cn from 'classnames';
import { isEmpty, upperFirst } from 'lodash';
import { formatValue, transformDocumentType } from '../../helper';
import { localTimeToHawaii } from 'src/utils';

export const allColumnsPendingReviewApprove = ({
  handleGetPurchaseOrderDetail,
}: {
  handleGetPurchaseOrderDetail: Callback;
}): MUIDataTableColumn[] => [
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
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: PurchaseOrdersList[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex];
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 100,
                maxWidth: 100,
              }}
              className={cn({ 'marquee-left': _value.length > 10 })}
            >
              <TypographyLink onClick={() => handleGetPurchaseOrderDetail(rowData)}>
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
                {formatValue(value)}
              </Typography>
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
