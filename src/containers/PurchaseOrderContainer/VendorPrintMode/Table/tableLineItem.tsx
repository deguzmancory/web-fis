import { Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import CustomTable from 'src/components/CustomTable';
import { BodyRow, BodyRows, CellType } from 'src/components/CustomTable/types';
import { EllipsisTooltipInputCurrency } from 'src/components/common';
import { IRootState } from 'src/redux/rootReducer';
import { VARIOUS_PROJECT_LABEL } from '../../GeneralInfo/helpers';

const TableLineItem: React.FC<Props> = ({ formData }) => {
  const getRecordTableHeader = (): BodyRows => [
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
          hide: formData?.projectTitle !== VARIOUS_PROJECT_LABEL,
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

  const reportList: BodyRows =
    formData?.lineItems?.map((reportRow, index) => {
      return {
        style: {
          textAlign: 'center',
        },
        columns: [
          {
            content: index + 1,
            type: CellType.PRINT_CELL,
          },
          {
            content: <Typography variant="body2">{reportRow?.itemProjectNumber}</Typography>,
            type: CellType.PRINT_CELL,
            hide: formData?.projectTitle !== VARIOUS_PROJECT_LABEL,
          },
          {
            content: <Typography variant="body2">{reportRow?.subProject}</Typography>,
            type: CellType.PRINT_CELL,
          },
          {
            content: <Typography variant="body2">{reportRow?.budgetCategory}</Typography>,
            type: CellType.PRINT_CELL,
          },
          {
            content: <Typography variant="body2">{reportRow?.subBudgetCategory}</Typography>,
            type: CellType.PRINT_CELL,
          },
          {
            content: <Typography variant="body2">{reportRow?.description}</Typography>,
            type: CellType.PRINT_CELL,
          },
          {
            content: <Typography variant="body2">{reportRow?.quantity}</Typography>,
            type: CellType.PRINT_CELL,
          },
          {
            content: <Typography variant="body2">{reportRow?.unit}</Typography>,
            type: CellType.PRINT_CELL,
          },
          {
            content: (
              <EllipsisTooltipInputCurrency
                value={reportRow?.unitPrice}
                name=""
                style={{ padding: '0 4px' }}
                disabled
              />
            ),
            style: {
              padding: 0,
              maxWidth: '40px',
              minWidth: '40px',
            },
            type: CellType.PRINT_CELL,
          },
          {
            content: <EllipsisTooltipInputCurrency value={reportRow?.ext} name="" disabled />,
            style: {
              padding: 0,
              maxWidth: '50px',
              minWidth: '50px',
            },
            type: CellType.PRINT_CELL,
          },
        ],
      };
    }) || [];

  const getConfirmationRow = (): BodyRows => [
    {
      style: {
        textAlign: 'start',
      },
      columns: [
        {
          content: (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {formData?.confirming === true && (
                <Typography variant="body2">
                  CONFIRMING (Vendor - Do not duplicate order) <br />
                </Typography>
              )}
              This order is subject to the terms and conditions attached
            </Typography>
          ),
          subContent: (
            <>
              {formData?.attachment31 === true && (
                <Typography variant="body2">
                  - Attachment 31, General Terms and Conditions Applicable to All Purchase Orders
                </Typography>
              )}
              <Typography variant="body2">- {formData?.fedAttachment}</Typography>
              {formData?.getExempt === true && (
                <>
                  <Typography variant="body2" fontWeight="bold" style={{ display: 'content' }}>
                    EXEMPTION OF PURCHASE FROM STATE OF HAWAII GENERAL EXCISE TAX{' '}
                  </Typography>
                  <Typography variant="body2" style={{ display: 'content' }}>
                    The Research Corporation of the University of Hawaii considers this purchase to
                    be exempt from the payment of the State of Hawaii general excise tax in
                    accordance with Section 237-26, HRS, as amended.
                  </Typography>
                </>
              )}

              <Typography variant="body2" mt={1}>
                Acceptance of this Purchase Order by Vendor, whether by written confirmation,
                shipping or otherwise initiating an action to provide goods or services ordered, is
                an acknowledgement and acceptance by Vendor that the attached team and condition are
                controlling over this purchase. Any and all other terms and conditions of Vendor
                shall not apply to this Purchase order, unless the terms and conditions are agreed
                to by both RCUH and Vendor in writing, prior to Vendor's acceptance of this Purchase
                Order.
              </Typography>
            </>
          ),
          type: CellType.PRINT_CELL,
          rowSpan: 6,
          colSpan: formData?.projectTitle === VARIOUS_PROJECT_LABEL ? 6 : 5,
        },
      ],
    },
  ];

  const reportSubtotal: BodyRow = {
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
        content: <EllipsisTooltipInputCurrency value={formData?.subtotal} name="" disabled />,
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

  const reportTaxRate: BodyRow = {
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
        content: <EllipsisTooltipInputCurrency value={formData?.taxRate} name="" disabled />,
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

  const reportTax: BodyRow = {
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
        content: <EllipsisTooltipInputCurrency value={formData?.taxTotal} name="" disabled />,
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

  const reportEstimatedShipping: BodyRow = {
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
        content: <EllipsisTooltipInputCurrency value={formData?.shippingTotal} name="" disabled />,
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

  const reportTotal: BodyRow = {
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
        content: <EllipsisTooltipInputCurrency value={formData?.total} name="" disabled />,
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

  const bodyList: BodyRows = [
    ...getRecordTableHeader(),
    ...reportList,
    ...getConfirmationRow(),
    reportSubtotal,
    reportTaxRate,
    reportTax,
    reportEstimatedShipping,
    reportTotal,
  ];

  return (
    <>
      <CustomTable.Layout showBorder bodyList={bodyList} />
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TableLineItem);
