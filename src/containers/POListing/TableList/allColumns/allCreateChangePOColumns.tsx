import { Box, Stack, Typography } from '@mui/material';
import cn from 'classnames';
import { isEmpty } from 'lodash';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { PURCHASE_ORDER_KEY, PurchaseOrderItem } from 'src/queries/PurchasingListing';
import { localTimeToHawaii } from 'src/utils';
import { getCreatePOChangeOrPaymentLink, transformDocumentType } from '../helpers';

export const allCreateChangePOColumns = ({
  typeStatus,
  onCreatePOPayment,
}: {
  typeStatus: string;
  onCreatePOPayment: (poId: string) => void;
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
          | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: PurchaseOrderItem[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as PurchaseOrderItem;

        return (
          <Stack direction="row" alignItems={'center'}>
            <Box>
              {getCreatePOChangeOrPaymentLink({
                poItem: rowData,
                typeStatus: typeStatus as PO_DOCUMENT_TYPE,
                onCreatePOPayment: () => onCreatePOPayment(rowData.id),
              })}
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
