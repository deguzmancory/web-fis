import { Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import CustomTable from 'src/components/CustomTable';
import { BodyRows, CellType } from 'src/components/CustomTable/types';
import { EllipsisTooltipInputCurrency } from 'src/components/common';
import { IRootState } from 'src/redux/rootReducer';
import {
  emptyRow,
  getRecordTableFormHeader,
  getRecordTableTitleOriginalHeader,
  reportEstimatedShipping,
  reportSubtotal,
  reportTax,
  reportTotal,
} from '../../Table/helpers';

const TableOriginalLineItem: React.FC<Props> = ({ formData }) => {
  const reportPOChangeFormList: BodyRows =
    formData?.originalLineItems?.map((reportRow, index) => {
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

  const bodyList: BodyRows = [
    ...getRecordTableTitleOriginalHeader('ORIGINAL ORDER READS'),
    ...getRecordTableFormHeader(),
    ...reportPOChangeFormList,
    ...emptyRow(),
    reportSubtotal(formData?.subtotal),
    reportTax(formData?.taxTotal),
    reportEstimatedShipping(formData?.shippingTotal),
    reportTotal(formData?.total),
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

export default connect(mapStateToProps, mapDispatchToProps)(TableOriginalLineItem);
