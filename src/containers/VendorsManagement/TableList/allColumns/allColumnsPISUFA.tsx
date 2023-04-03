import { Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { EllipsisTypographyTooltip } from 'src/components/common';
import { VENDOR_KEY, Vendor } from 'src/queries';

export const allColumnsPISUFA = (): MUIDataTableColumn[] => [
  {
    name: VENDOR_KEY.CODE,
    label: 'Code',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (
        value: any,
        meta: MUIDataTableMeta | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: Vendor[] })
      ) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },

  {
    name: VENDOR_KEY.LINE1,
    label: 'Vendor Name',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <EllipsisTypographyTooltip lengthShowTooltip={27} maxLine={2}>
            {value}
          </EllipsisTypographyTooltip>
        );
      },
    },
  },

  {
    name: VENDOR_KEY.LINE2,
    label: 'Additional Info',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value: string) => {
        return (
          <EllipsisTypographyTooltip lengthShowTooltip={27} maxLine={2}>
            {value}
          </EllipsisTypographyTooltip>
        );
      },
      setCellHeaderProps: () => ({
        style: {
          whiteSpace: 'nowrap',
        },
      }),
    },
  },

  {
    name: VENDOR_KEY.ADDRESS1,
    label: 'Address',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (
        value: any,
        meta: MUIDataTableMeta | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: Vendor[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as Vendor;
        const getAddress = () => {
          const string = [];
          if (!isEmpty(rowData.address1)) {
            string.push(rowData.address1);
          }
          if (!isEmpty(rowData.address2)) {
            string.push(rowData.address2);
          }
          if (!isEmpty(rowData.address3)) {
            string.push(rowData.address3);
          }
          return string.join(' ');
        };

        const address = getAddress();
        return (
          <EllipsisTypographyTooltip lengthShowTooltip={37} maxLine={2}>
            {address}
          </EllipsisTypographyTooltip>
        );
      },
    },
  },

  {
    name: VENDOR_KEY.W9,
    label: 'ST',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },

  {
    name: VENDOR_KEY.TYPE,
    label: 'T/C',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },

  {
    name: VENDOR_KEY.PAYMENT_TYPE,
    label: 'Pmt Type',
    options: {
      filter: false,
      sort: false,
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
];
