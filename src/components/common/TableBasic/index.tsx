import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import cn from 'classnames';
import MUIDataTable, {
  MUIDataTableOptions,
  MUIDataTableProps,
  MUIDataTableState,
} from 'mui-datatables';
import React, { memo, useMemo } from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Loading, View } from 'src/components/common';
import CustomFooterRender from './customFooterRender';
import CustomSearchRender from './customSearchRender';
import './styles.scss';

const TableBasic: React.FC<Props> = ({
  isLoading,
  containerClassName,
  onTableChange,
  currentPage,
  options,
  total,
  emptyComponent = 'No data',
  data,
  ...props
}) => {
  const tableOptions: MUIDataTableOptions = {
    serverSide: true,
    searchOpen: false,
    search: true,
    download: false,
    filter: true,
    print: false,
    viewColumns: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    textLabels: {
      body: {
        noMatch: isLoading ? <Loading variant="primary" /> : emptyComponent,
      },
    },
    jumpToPage: false,
    rowHover: true,
    onTableChange,
    customSearchRender: (searchText: string, handleSearch: (text: string) => void) => {
      return (
        <CustomSearchRender
          searchText={searchText}
          onSearch={handleSearch}
          placeholder={options.searchPlaceholder}
        />
      );
    },
    customFooter: (
      count: number,
      page: number,
      rowsPerPage: number,
      changeRowsPerPage: (page: string | number) => void,
      changePage: (newPage: number) => void
    ) => {
      return (
        <CustomFooterRender
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
          theme={getMuiTheme()}
        />
      );
    },

    ...options,
  };

  const hasRowClickAction = !!options?.onRowClick;
  const getMuiTheme = () =>
    createTheme({
      primary: {
        main: COLOR_CODE.PRIMARY,
        dark: COLOR_CODE.PRIMARY_DARK,
        light: COLOR_CODE.PRIMARY_LIGHT,
      },
      secondary: {
        main: COLOR_CODE.SECONDARY,
      },
      typography: {
        fontFamily: ['Arial'].join(','),
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            elevation4: {
              boxShadow: 'none',
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            hover: {
              cursor: hasRowClickAction ? 'pointer' : 'default',
            },
            root: {
              '&:nth-of-type(even)': {
                backgroundColor: COLOR_CODE.PRIMARY_50,
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: '4px 16px',
            },
            body: {
              cursor: hasRowClickAction ? 'pointer' : 'default',
            },
            head: {
              '&.MuiTableCell-root': {
                backgroundColor: COLOR_CODE.PRIMARY_800,
                color: 'white',
                fontWeight: 'bold',
                padding: '0 16px',
              },
              '&.MuiTableCell-root span button': {
                color: 'white',
                fontWeight: 'bold',
              },
              '&.MuiTableCell-root span button div, &.MuiTableCell-root span button div span svg': {
                color: 'white !important',
                fontWeight: 'bold',
              },
            },
            footer: {
              '&.MuiTableCell-root': {
                borderBottom: 'none',
                padding: '6px 0',
              },
            },
          },
        },
        MuiTableBody: {
          styleOverrides: {
            root: {
              opacity: isLoading ? 0.3 : 1,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              // Hide Chip filter
              '&.MuiChip-filled.MuiChip-colorDefault.MuiChip-deletable': {
                display: 'none !important',
              },
            },
          },
        },
      },
    } as ThemeOptions);

  const muiDataTable = useMemo(
    () => {
      return <MUIDataTable options={tableOptions} data={data} {...props} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, isLoading]
  );

  // More info: https://github.com/gregnb/mui-datatables
  return (
    <View className={cn('cmp-table-basic', containerClassName)} flexGrow={1}>
      <ThemeProvider theme={getMuiTheme()}>
        {muiDataTable}
        {/* <MUIDataTable options={tableOptions} {...props} /> */}
      </ThemeProvider>
    </View>
  );
};

type Props = MUIDataTableProps & {
  containerClassName?: string;
  currentPage?: number;
  total?: number;
  onTableChange: (action: string, tableState: MUIDataTableState) => void;
  isLoading?: boolean;
  emptyComponent?: React.ReactNode;
};

export default memo(TableBasic);
