import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import CustomTable from 'src/components/CustomTable';
import { BodyRows, CellType } from 'src/components/CustomTable/types';
import { IRootState } from 'src/redux/rootReducer';

const TableTop: React.FC<Props> = ({ formData }) => {
  const bodyList: BodyRows = [
    {
      style: {
        textAlign: 'center',
      },
      columns: [
        {
          content: (
            <Typography variant="body2" fontWeight="bold">
              Date
            </Typography>
          ),
          rowSpan: 2,
          type: CellType.PRINT_CELL,
          subContent: <Typography variant="body2">{formData?.date}</Typography>,
        },
        {
          content: (
            <Stack>
              <Grid container flexDirection="row" flexWrap="nowrap" sx={{ alignItems: 'center' }}>
                <Grid item sx={{ mr: 2 }}>
                  <Typography fontWeight="bold" variant="h5">
                    IMPORTANT
                  </Typography>
                </Grid>

                <Grid item container flexDirection="column" sx={{ alignItems: 'flex-start' }}>
                  <Grid item>
                    <Typography variant="body1" style={{ display: 'contents' }}>
                      OUR PURCHASE ORDER NUMBER{' '}
                      <Typography variant="body2" style={{ display: 'contents' }} fontWeight="bold">
                        MUST
                      </Typography>{' '}
                      <Typography style={{ display: 'contents' }} variant="body2">
                        APPEAR
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <svg
                      width="350"
                      height="18"
                      viewBox="0 0 515 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M515 9L500 0.339746V6.00004L0 6V7.5V10.5V12L500 12V17.6603L515 9Z"
                        fill="black"
                      />
                    </svg>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">ON ALL INVOICES AND PACKAGES</Typography>
                  </Grid>
                </Grid>

                <Grid item>{}</Grid>
              </Grid>
            </Stack>
          ),
          type: CellType.PRINT_CELL,
        },
        {
          content: (
            <Typography variant="body2" fontWeight="bold">
              PURCHASE ORDER NO.
            </Typography>
          ),
          rowSpan: 2,
          type: CellType.PRINT_CELL,
          subContent: <Typography variant="body2">{formData?.number}</Typography>,
        },
      ],
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(TableTop);
