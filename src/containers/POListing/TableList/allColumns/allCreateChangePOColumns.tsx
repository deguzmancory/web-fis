import { Box, Stack, Typography } from '@mui/material';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import TypographyLink from 'src/components/TypographyLink';
import { Callback } from 'src/redux/types';
import cn from 'classnames';
import { PurchaseOrdersList, PURCHASE_ORDER_KEY } from 'src/queries/PurchasingListing';
import { isEmpty } from 'lodash';
import { localTimeToHawaii } from 'src/utils';
import { transformDocumentType } from '../../helper';

export const allCreateChangePOColumns = ({
  typeStatus,
  handlePOChangeOrPaymentDetailClick,
}: {
  typeStatus: string;
  handlePOChangeOrPaymentDetailClick: Callback;
}): MUIDataTableColumn[] => [
  {
    name: '',
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
            >
              <TypographyLink onClick={() => handlePOChangeOrPaymentDetailClick(rowData)}>
                {typeStatus === 'poChange' ? 'Create PO Chg' : 'Create PO Pm'}
              </TypographyLink>
            </Box>
          </Stack>
        );
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.NUMBER,
    label: 'PO Number',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 100,
                maxWidth: 100,
              }}
              className={cn({ 'marquee-left': value.length > 10 })}
            >
              <Typography>{value ?? '--'}</Typography>
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
              className={cn({ 'marquee-left': value.length > 10 })}
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
    label: 'Orig Amount',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{`$${value}` ?? '--'}</Typography>;
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
        return <Typography variant="body2">{`$${value}` ?? '--'}</Typography>;
      },
    },
  },

  {
    name: PURCHASE_ORDER_KEY.FA_APPROVED_DATE,
    label: 'Approved Date',
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
    name: PURCHASE_ORDER_KEY.PRINTED_DATE,
    label: 'Printed Date',
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
