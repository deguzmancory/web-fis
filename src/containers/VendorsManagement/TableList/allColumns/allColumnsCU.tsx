import { Box, Stack, Typography } from '@mui/material';
import cn from 'classnames';
import { MUIDataTableColumn, MUIDataTableMeta } from 'mui-datatables';
import { PATHS } from 'src/appConfig/paths';
import TypographyLink from 'src/components/TypographyLink';
import { EllipsisTypographyTooltip } from 'src/components/common';
import { VENDOR_REGISTRATION_NAVIGATE_FROM } from 'src/containers/Vendors/VendorRegistration/enums';
import { VENDOR_KEY, VenderItem } from 'src/queries/Vendors';
import { Navigator } from 'src/services';
import { localTimeToHawaii } from 'src/utils';
import { isEmpty } from 'src/validations';
import ActionsButton from '../actionsButton';

export const allColumnsCU = (): MUIDataTableColumn[] => [
  {
    name: VENDOR_KEY.CODE,
    label: 'Code',
    options: {
      filter: false,
      sort: true,
      customBodyRender: (
        _value: any,
        meta: MUIDataTableMeta | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: VenderItem[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as VenderItem;
        const isVendorRegistration = rowData.vendorRegistrationExists;
        return (
          <Stack direction="row" alignItems={'center'}>
            <Box
              sx={{
                minWidth: 60,
                maxWidth: 60,
              }}
              className={cn({ 'marquee-left': _value?.length > 10 })}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();

                Navigator.navigate(`${PATHS.addVendorRegistration}/${rowData.code}`, {
                  isViewOnly: true,
                  isFromForm: VENDOR_REGISTRATION_NAVIGATE_FROM.VIEW_VENDOR_REGISTRATION,
                });
              }}
            >
              {isVendorRegistration ? (
                <TypographyLink
                  variant="body2"
                  className={_value?.length > 10 ? 'marquee-left__text' : ''}
                >
                  {_value ?? '--'}
                </TypographyLink>
              ) : (
                <Typography
                  variant="body2"
                  className={_value?.length > 10 ? 'marquee-left__text' : ''}
                >
                  {_value ?? '--'}
                </Typography>
              )}
            </Box>
            <ActionsButton VenderItem={rowData} />
          </Stack>
        );
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
  {
    name: VENDOR_KEY.PURGED,
    label: 'Purge',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
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
        meta: MUIDataTableMeta | (Omit<MUIDataTableMeta, 'tableData'> & { tableData: VenderItem[] })
      ) => {
        const rowData = meta.tableData[meta.rowIndex] as VenderItem;
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
    name: VENDOR_KEY.SSN,
    label: 'TIN/SSN',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        if (!value) return '--';
        return (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'nowrap',
            }}
          >
            {value}
          </Typography>
        );
      },
    },
  },

  {
    name: VENDOR_KEY.CREATED,
    label: 'Create Dt',
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
    name: VENDOR_KEY.UPDATED,
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
    name: VENDOR_KEY.UH_EMP_NUMBER,
    label: 'Emp ID',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: string) => {
        return <Typography variant="body2">{value ?? '--'}</Typography>;
      },
    },
  },
];
