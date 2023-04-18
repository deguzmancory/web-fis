import { connect } from 'react-redux';
import { IRootState } from 'src/redux/rootReducer';
import TableTop from '../Table/tableTop';
import TableMiddle from '../Table/tableMiddle';
import TableLineItem from '../Table/tableLineItem';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { FED_ATTACHMENT_VALUE } from '../../PurchaseInfo/helpers';
import Attachment32a from '../fileAttachment/attachment32a';
import Attachment32bTod from '../fileAttachment/attachment32bTod';
import Attachment31 from '../fileAttachment/attachment31';
import SpecialInstructions from '../specialInstructions';

const VendorPrintModePO: React.FC<Props> = ({ formData }) => {
  const haveAttachmentFile32 = React.useMemo(() => {
    switch (formData?.fedAttachment) {
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32A:
        return <Attachment32a />;
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32B:
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32C:
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32D:
        return <Attachment32bTod formData={formData} />;
      case FED_ATTACHMENT_VALUE.NON_FEDERAL:
      case FED_ATTACHMENT_VALUE.UH_SUBAWARD:
        return null;
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.fedAttachment]);

  return (
    <>
      <TableTop />
      <TableMiddle />
      <TableLineItem />

      <SpecialInstructions />

      <Box sx={{ mt: 2 }}>
        <Stack sx={{ textAlign: 'center' }} mb={2}>
          <Typography variant="body2" fontWeight="bold">
            PURCHASE ORDER
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            DUPLICATE COPY
          </Typography>
        </Stack>

        {formData?.attachment31 && <Attachment31 />}
        {haveAttachmentFile32}
      </Box>
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VendorPrintModePO);
