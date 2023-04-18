import { Grid, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import CustomTable from 'src/components/CustomTable';
import { BodyRow, BodyRows, CellType } from 'src/components/CustomTable/types';
import { IRootState } from 'src/redux/rootReducer';

const TableMiddle: React.FC<Props> = ({ formData }) => {
  const tableNote: BodyRow = {
    columns: [
      {
        content: (
          <Typography variant="body2">
            Note: An employee record has been selected. Employee records are for
            employee/project-related business expenses only. Refer to Policy 2.703 Employee Business
            Expense Reimbursements (AFP Form).
          </Typography>
        ),
        type: CellType.PRINT_CELL,
        colSpan: 5,
      },
    ],
  };

  const tableVendorAndShip: BodyRow = {
    style: {
      alignItems: 'flex-start',
    },
    columns: [
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            VENDOR
          </Typography>
        ),
        type: CellType.PRINT_CELL,
        subContent: (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {formData?.vendorAddress}
          </Typography>
        ),
        colSpan: 3,
      },
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            SHIP ITEMS TO
          </Typography>
        ),
        type: CellType.PRINT_CELL,
        subContent: (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {formData?.shipTo}
          </Typography>
        ),
        colSpan: 3,
      },
    ],
  };

  const tableProjectTitle: BodyRow = {
    style: {
      alignItems: 'flex-start',
    },
    columns: [
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Project Title
          </Typography>
        ),
        type: CellType.PRINT_CELL,
        subContent: <Typography variant="body2">{formData?.projectTitle}</Typography>,
        style: {
          maxWidth: '100px',
          minWidth: '100px',
        },
      },
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Ship Via
          </Typography>
        ),
        type: CellType.PRINT_CELL,
        subContent: (
          <Grid container sx={{ flexDirection: 'column' }}>
            <Grid item>
              <Typography variant="body2">{formData?.shipVia}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" fontWeight="bold">
                Delivery Required By:
              </Typography>
              <Typography variant="body2">{formData?.deliveryBy}</Typography>
            </Grid>
          </Grid>
        ),
      },
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Discount Terms:
          </Typography>
        ),
        type: CellType.PRINT_CELL,
        subContent: <Typography variant="body2">{formData?.discountTerms}</Typography>,
      },
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Quotation:
          </Typography>
        ),
        type: CellType.PRINT_CELL,
        subContent: <Typography variant="body2">{formData?.quotationNumber}</Typography>,
      },
      {
        content: (
          <Typography variant="body2" fontWeight="bold">
            Direct Inquiries On This Order To:
          </Typography>
        ),
        type: CellType.PRINT_CELL,
        subContent: <Typography variant="body2">{formData?.directInquiriesTo}</Typography>,
      },
    ],
  };

  const bodyList: BodyRows = [tableNote, tableVendorAndShip, tableProjectTitle];

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

export default connect(mapStateToProps, mapDispatchToProps)(TableMiddle);
