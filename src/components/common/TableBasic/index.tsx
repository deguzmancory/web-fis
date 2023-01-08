import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import cn from 'classnames';
import MUIDataTable, {
  debounceSearchRender,
  MUIDataTableOptions,
  MUIDataTableProps,
  MUIDataTableState,
} from 'mui-datatables';
import React, { memo, useMemo } from 'react';
import { LoadingCommon, View } from 'src/components/common';
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
        noMatch: isLoading ? <LoadingCommon /> : emptyComponent,
      },
    },
    jumpToPage: false,
    rowHover: true,
    onTableChange,
    customSearchRender: debounceSearchRender(500),
    ...options,
  };

  const hasRowClickAction = !!options?.onRowClick;
  const getMuiTheme = () =>
    createTheme({
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
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: '16px 24px',
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
        MuiPopover: {
          styleOverrides: {
            paper: {
              minWidth: 300,
            },
          },
        },
        // MUIDataTableSearch: {
        //   main: {
        //     '& button': {
        //       display: 'none !important',
        //     },
        //     '& svg': {
        //       transform: 'translateY(0px) !important',
        //       marginTop: '0px !important',
        //     },
        //     padding: '2px 8px !important',
        //     borderRadius: '4px !important',
        //     alignItems: 'center !important',
        //   },
        //   searchText: {
        //   },
        // },
      },
    } as ThemeOptions);

  const muiDataTable = useMemo(
    () => {
      return <MUIDataTable options={tableOptions} data={data} {...props} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
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
