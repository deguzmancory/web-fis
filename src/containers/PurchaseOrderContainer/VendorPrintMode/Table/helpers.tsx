import { Typography } from '@mui/material';
import { BodyRow, BodyRows, CellType } from 'src/components/CustomTable/types';
import { EllipsisTooltipInputCurrency } from 'src/components/common';

export const getRecordTableTitleOriginalHeader = (title: string): BodyRows => [
  {
    style: {
      textAlign: 'center',
    },
    columns: [
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            {title}
          </Typography>
        ),
        type: CellType.PRINT_CELL,
      },
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
      {
        content: '',
        type: CellType.PRINT_CELL,
      },
    ],
  },
];

export const getRecordTableFormHeader = (): BodyRows => [
  {
    style: {
      textAlign: 'center',
    },
    columns: [
      {
        content: 'Line',
        type: CellType.PRINT_CELL,
      },
      {
        content: 'Proj #',
        type: CellType.PRINT_CELL,
      },
      {
        content: 'Sub Proj',
        type: CellType.PRINT_CELL,
      },
      {
        content: 'B/C',
        type: CellType.PRINT_CELL,
      },
      {
        content: 'Sub B/C',
        type: CellType.PRINT_CELL,
      },
      {
        content: 'Description',
        style: {
          minWidth: '220px',
          maxWidth: '220px',
        },
        type: CellType.PRINT_CELL,
      },
      {
        content: 'Qty.',
        type: CellType.PRINT_CELL,
      },
      {
        content: 'Unit',
        type: CellType.PRINT_CELL,
      },
      {
        content: 'Unit Price',
        type: CellType.PRINT_CELL,
      },
      {
        content: 'Extension',
        type: CellType.PRINT_CELL,
      },
    ],
  },
];

export const emptyRow = (): BodyRows => [
  {
    columns: [
      {
        content: '',
        type: CellType.PRINT_CELL,
        rowSpan: 6,
        colSpan: 6,
      },
    ],
  },
];

export const reportSubtotal = (value: string): BodyRow => {
  return {
    style: {
      textAlign: 'end',
    },
    columns: [
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Subtotal
          </Typography>
        ),
        colSpan: 3,
        type: CellType.PRINT_CELL,
      },
      {
        content: <EllipsisTooltipInputCurrency value={value} name="" disabled />,
        colSpan: 1,
        rowSpan: 1,
        style: {
          padding: 0,
          maxWidth: '40px',
          minWidth: '40px',
        },
        type: CellType.PRINT_CELL_RIGHT,
      },
    ],
  };
};

export const reportTax = (value: string): BodyRow => {
  return {
    style: {
      textAlign: 'end',
    },
    columns: [
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Tax
          </Typography>
        ),
        colSpan: 3,
        rowSpan: 1,
        type: CellType.PRINT_CELL,
      },
      {
        content: <EllipsisTooltipInputCurrency value={value} name="" disabled />,
        colSpan: 1,
        rowSpan: 1,
        style: {
          padding: 0,
          maxWidth: '40px',
          minWidth: '40px',
        },
        type: CellType.PRINT_CELL,
      },
    ],
  };
};

export const reportEstimatedShipping = (value: string): BodyRow => {
  return {
    style: {
      textAlign: 'end',
    },
    columns: [
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Estimated Shipping
          </Typography>
        ),
        colSpan: 3,
        rowSpan: 1,
        type: CellType.PRINT_CELL,
      },
      {
        content: <EllipsisTooltipInputCurrency value={value} name="" disabled />,
        colSpan: 1,
        rowSpan: 1,
        style: {
          padding: 0,
          maxWidth: '40px',
          minWidth: '40px',
        },
        type: CellType.PRINT_CELL,
      },
    ],
  };
};

export const reportTotal = (value: string): BodyRow => {
  return {
    style: {
      textAlign: 'end',
    },
    columns: [
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            TOTAL
          </Typography>
        ),
        colSpan: 3,
        rowSpan: 1,
        type: CellType.PRINT_CELL,
      },
      {
        content: <EllipsisTooltipInputCurrency value={value} name="" disabled />,
        colSpan: 1,
        rowSpan: 1,
        style: {
          padding: 0,
          maxWidth: '40px',
          minWidth: '40px',
        },
        type: CellType.PRINT_CELL,
      },
    ],
  };
};

export const reportTaxRate = (value: string): BodyRow => {
  return {
    style: {
      textAlign: 'end',
    },
    columns: [
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Tax Rate
          </Typography>
        ),
        colSpan: 3,
        rowSpan: 1,
        type: CellType.PRINT_CELL,
      },
      {
        content: <EllipsisTooltipInputCurrency value={value} name="" disabled />,
        colSpan: 1,
        rowSpan: 1,
        style: {
          padding: 0,
          maxWidth: '40px',
          minWidth: '40px',
        },
        type: CellType.PRINT_CELL,
      },
    ],
  };
};
