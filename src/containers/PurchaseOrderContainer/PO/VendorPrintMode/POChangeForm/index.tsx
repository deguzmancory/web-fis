import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { AiFillWarning } from 'react-icons/ai';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { TextareaAutosize } from 'src/components/common';
import { getTypeOfPOChange } from 'src/containers/PurchaseOrderContainer/POChange/POChangeForm/helpers';
import { PO_CHANGE_FORM_NUMBER } from 'src/queries';
import { IRootState } from 'src/redux/rootReducer';
import TableMiddle from '../Table/tableMiddle';
import TableTop from '../Table/tableTop';
import SpecialInstructions from '../specialInstructions';
import TableChangeOrderToReadLineItem from './Table/tableChangeOrderToReadLineItem';
import TableOriginalLineItem from './Table/tableOriginalLineItem';

const VendorPrintModePOChangeForm: React.FC<Props> = ({ formData }) => {
  const handleSwitchFormData = React.useMemo(() => {
    switch (formData?.formNumber) {
      case PO_CHANGE_FORM_NUMBER.TOTAL_CANCELLATION_NUMBER:
        return <TableOriginalLineItem />;
      case PO_CHANGE_FORM_NUMBER.CHANGE_DESCRIPTION_NUMBER:
      case PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_NUMBER:
        return (
          <>
            <TableOriginalLineItem />
            <TableChangeOrderToReadLineItem />
          </>
        );
      case PO_CHANGE_FORM_NUMBER.INCREASE_DECREASE_AMOUNT_TERMINATED_NUMBER:
        return (
          <>
            <TableOriginalLineItem />
            <Stack
              bgcolor={COLOR_CODE.WARNING}
              sx={{ p: 1, mt: 2, flexDirection: 'row', alignItems: 'center' }}
            >
              <AiFillWarning color={COLOR_CODE.WHITE} fontSize={24} />
              <Typography variant="body2" color={COLOR_CODE.WHITE} sx={{ ml: 1 }}>
                Internal Purposes Only - Do not send to vendor
              </Typography>
            </Stack>
            <TableChangeOrderToReadLineItem />
          </>
        );
      default:
        return null;
    }
  }, [formData?.formNumber]);

  return (
    <>
      <TableTop />
      <TableMiddle />
      {handleSwitchFormData}

      <SpecialInstructions />

      <Stack alignItems="center" lineHeight={2}>
        <Typography variant="body2" fontWeight="bold">
          ORIGINAL PURCHASE ORDER
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          RCUH COPY
        </Typography>
        {formData?.formNumber !== PO_CHANGE_FORM_NUMBER.TOTAL_CANCELLATION_NUMBER && (
          <Typography variant="body2" fontWeight="bold" style={{ display: 'contents' }}>
            AMOUNT CHANGE:{' '}
            <Typography variant="body2" style={{ display: 'contents' }}>
              ${formData?.amountChange}
            </Typography>
          </Typography>
        )}
        <Typography>{}</Typography>
        <Typography fontWeight="bold" variant="body2" style={{ display: 'contents' }}>
          TYPE OF CHANGE:
          <Typography variant="body2" style={{ display: 'contents' }}>
            {getTypeOfPOChange(formData?.formNumber)}
          </Typography>
        </Typography>
        <Typography>{}</Typography>
        <Typography variant="body2" fontWeight="bold" style={{ display: 'contents' }}>
          REMAINING BALANCE ON P.O.AFTER THIS CHANGE:{' '}
          <Typography variant="body2" style={{ display: 'contents' }}>
            ${formData?.balance}
          </Typography>
        </Typography>
        <Typography>{}</Typography>
        {formData?.uhSubawardNumber && (
          <Typography style={{ display: 'contents' }} variant="body2" fontWeight="bold">
            <Typography style={{ display: 'contents' }} variant="body2">
              {formData?.uhSubawardNumber}
            </Typography>
          </Typography>
        )}
        <Box width="100%">
          <Typography variant="body2" fontWeight="bold" textAlign="center">
            REASON FOR CHANGE
          </Typography>
          <TextareaAutosize
            style={{ padding: '14px', marginTop: '8px' }}
            value={formData?.reasonForChange}
            disabled
            resize="none"
          />
        </Box>
      </Stack>
      <Stack sx={{ mt: 12 }} justifyContent="flex-end" flexDirection="row">
        <Typography variant="body2" fontWeight="bold" borderTop={1} width="25%" marginRight={1}>
          FISCAL AUTHORIZED SIGNATURE
        </Typography>
        <Typography variant="body2" fontWeight="bold" borderTop={1} width="15%" textAlign="start">
          DATE
        </Typography>
      </Stack>
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VendorPrintModePOChangeForm);
