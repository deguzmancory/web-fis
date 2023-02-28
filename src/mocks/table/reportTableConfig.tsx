import { Box, Typography } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Button } from 'src/components/common';
import { BodyRow, BodyRows, HeaderRows } from 'src/components/ReportTable/types';
import { Callback } from 'src/redux/types';

export const REPORT_TABLE_HEADER: HeaderRows = [
  {
    columns: [
      {
        content: 'Category',
        rowSpan: 2,
      },
      {
        content: 'Description',
        style: {
          minWidth: '150px',
          maxWidth: '150px',
        },
        subContent: '(Custom cell style)',
        rowSpan: 2,
      },
      {
        content: (
          <Typography sx={{ color: COLOR_CODE.WHITE, fontWeight: 'bold' }} variant="h3">
            Awarded
          </Typography>
        ),
        subContent: '(Custom title)',
        rowSpan: 2,
      },
      {
        content: 'Current Month Expended',
        style: {
          minWidth: '200px',
          maxWidth: '200px',
        },
        subContent: (
          <Box>
            <Button variant="outline" onClick={() => alert('The column just readonly!')}>
              Custom
            </Button>
          </Box>
        ),
        rowSpan: 2,
      },
      {
        content: 'Col span',
        colSpan: 4,
        subContent: '(Some description)',
      },
      {
        content: 'Available Balance',
        subContent: '(Some description)',
        rowSpan: 2,
      },
      {
        content: '',
        subContent: '(Empty col)',
        rowSpan: 2,
        style: {
          minWidth: '60px',
          maxWidth: '60px',
        },
      },
    ],
  },
  {
    columns: [
      {
        content: 'Total Expended',
        subContent: '(Some description)',
      },
      {
        content: 'Outstanding PO',
      },
      {
        content: 'Total Cost',
      },
      {
        content: 'KFS Suspense',
      },
    ],
  },
];

export const getRecordTableHeader = ({
  onToggleDisabled,
  disabled,
}: {
  onToggleDisabled: Callback;
  disabled: boolean;
}): BodyRows => [
  {
    isHeaderRow: true,
    style: {
      textAlign: 'center',
    },
    columns: [
      {
        content: 'Category',
        rowSpan: 2,
      },
      {
        content: 'Description',
        style: {
          minWidth: '160px',
          maxWidth: '160px',
        },
        subContent: '(Custom cell style)',
        rowSpan: 2,
      },
      {
        content: (
          <Typography sx={{ color: COLOR_CODE.WHITE, fontWeight: 'bold' }} variant="h3">
            Awarded
          </Typography>
        ),
        subContent: '(Custom title - Uncontrolled Input)',
        rowSpan: 2,
      },
      {
        content: 'Current Month Expended',
        style: {
          minWidth: '120px',
          maxWidth: '120px',
        },
        subContent: 'Readonly',
        rowSpan: 2,
      },
      {
        content: 'Editable Fields',
        colSpan: 4,
        subContent: '(States of input fields show case)',
      },
      {
        content: 'Available Balance',
        subContent: '(Some description)',
        rowSpan: 2,
      },
      {
        content: '',
        subContent: '(Empty col)',
        rowSpan: 2,
      },
    ],
  },
  {
    isHeaderRow: true,
    style: {
      textAlign: 'center',
    },
    columns: [
      {
        content: 'Total Expended',
        subContent: '(Control Input)',
      },
      {
        content: 'Outstanding PO',
        subContent: (
          <>
            <Box>
              <Button variant="outline" onClick={onToggleDisabled}>
                {disabled ? 'Edit' : 'Save'}
              </Button>
            </Box>
          </>
        ),
      },
      {
        content: 'Total Cost',
        subContent: '(Complex formula = Awarded + CME + TE + PO)',
      },
      {
        content: 'KFS Suspense',
        subContent: '(Auto generate new row)',
      },
    ],
  },
];

export const INDIRECT_COSTS: BodyRow = {
  columns: [
    {
      content: '',
    },
    {
      content: 'INDIRECT COSTS',
    },
    {
      content: '',
    },
    {
      content: '',
    },
    {
      content: '',
    },
    {
      content: '',
    },
    {
      content: '',
    },
    {
      content: '',
    },
    {
      content: '',
    },
    {
      content: '',
    },
  ],
};

export const REPORT_TABLE_HEADER_ROW_IN_FOOTER: BodyRows = [
  {
    isHeaderRow: true,
    style: {
      textAlign: 'center',
    },
    columns: [
      {
        content: '',
        colSpan: 2,
      },
      {
        content: 'Awarded',
      },
      {
        content: 'Current Month Expended',
      },
      {
        content: 'Total Expended',
      },
      {
        content: 'Outstanding PO',
      },
      {
        content: 'Total Cost',
      },
      {
        content: 'KFS Suspense',
      },
      {
        content: 'Available Balance',
      },
      {
        content: '',
      },
    ],
  },
];
