import React from 'react';
import { UpdatePOPaymentFormikProps } from '../types';
import { PO_MODE, useGetPOPmtRemainingBalance } from 'src/queries';
import { Box, Grid, Typography } from '@mui/material';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import { DateFormatDisplayMinute, getDateDisplay, localTimeToHawaii } from 'src/utils';
import { EllipsisTooltipInputCurrency, Input } from 'src/components/common';
import { mockupDataRes } from './mokupDataRes';
import TypographyLink from 'src/components/TypographyLink';
import { useParams } from 'react-router-dom';
import { PO_FORM_KEY } from 'src/containers/PurchaseOrderContainer/PO/enums';

const TablePaymentRemainingBalanceLineItems: React.FC<Props> = ({
  formikProps,
  disabled = false,
}) => {
  const { id } = useParams<{ id: string }>();

  const { values, setFieldValue } = formikProps;

  const remainingBalanceLineItems = React.useMemo(
    () => values.remainingBalanceLineItems || [],
    [values.remainingBalanceLineItems]
  );

  const { handleInvalidateRemainingBalance, onGetRemainingBalance } = useGetPOPmtRemainingBalance({
    id: id,
  });

  const handleRefreshRemainingBalance = async () => {
    handleInvalidateRemainingBalance();
    try {
      const { data: remainingBalanceData } = await onGetRemainingBalance();
      setFieldValue(
        PO_FORM_KEY.REMAINING_BALANCE,
        remainingBalanceData?.remainingBalance?.total || mockupDataRes.remainingBalance.total //TODO: Tuyen Tran: remove mock data after BE integrate
      );
      setFieldValue(
        PO_FORM_KEY.REMAINING_BALANCE_LINE_ITEMS,
        remainingBalanceData?.remainingBalance?.itemList || mockupDataRes.remainingBalance.itemList //TODO: Tuyen Tran: remove mock data after BE integrate
      );
      setFieldValue(
        PO_FORM_KEY.REMAINING_BALANCE_AS_OF_DATE,
        remainingBalanceData?.asOfDate || getDateDisplay(new Date(), DateFormatDisplayMinute) //TODO: Tuyen Tran: remove mock data after BE integrate
      );
    } catch (error) {
      // handleShowErrorMsg(error);  //TODO: Tuyen Tran: uncomment after BE integrate
    }
  };

  // TODO: Tuyen Tran replace mockup data
  const lineItemRows: BodyBasicRows = remainingBalanceLineItems.map((lineItem, _) => {
    return {
      style: {
        verticalAlign: 'top',
      },
      columns: [
        {
          type: CellType.INPUT,
          label: 'Project #',
          content: (
            <Input
              value={lineItem.projectNumber}
              name=""
              disabled
              style={{ width: 100, padding: '6px' }}
            />
          ),
          width: 90,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },

        {
          type: CellType.INPUT,
          label: 'Sub Project',
          content: (
            <Input value={lineItem.subProject} disabled style={{ width: 100, padding: '6px' }} />
          ),
          width: 90,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },

        {
          type: CellType.INPUT,
          label: 'Budget Category',
          content: (
            <Input
              value={lineItem.budgetCategory}
              disabled
              style={{ width: 110, padding: '6px' }}
            />
          ),
          width: 90,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },

        {
          type: CellType.INPUT,
          label: 'Sub Budget Category',
          content: (
            <Input
              value={lineItem.subBudgetCategory}
              disabled
              style={{ width: 110, padding: '6px' }}
            />
          ),
          width: 90,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },

        {
          type: CellType.INPUT,
          label: 'Amount',
          content: (
            <EllipsisTooltipInputCurrency
              name=""
              value={lineItem.amount}
              disabled
              style={{ width: 110, padding: '6px' }}
            />
          ),
          width: 90,
          headerStyle: {
            paddingRight: 0,
            paddingLeft: '6px',
          },
          style: {
            paddingRight: 0,
          },
        },
      ],
    };
  });

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="bold" style={{ display: 'contents' }}>
          PO Remaining Balance As of:{' '}
          <Typography style={{ display: 'contents' }}>
            {localTimeToHawaii(values.remainingBalanceAsOfDate)}
          </Typography>
        </Typography>
      </Box>

      <CustomTable.Basic bodyList={lineItemRows} />

      <Grid container mt={2}>
        <Grid item xs={8} className="justify-flex-start">
          <TypographyLink variant="body2" fontWeight="bold" onClick={handleRefreshRemainingBalance}>
            Refresh Remaining Balance
          </TypographyLink>
        </Grid>
        <Grid item xs={1.5} className="justify-flex-start">
          <Typography variant="h6" fontWeight={'bold'}>
            TOTAL
          </Typography>
        </Grid>
        <Grid item xs={2.5}>
          <EllipsisTooltipInputCurrency
            name=""
            value={values.remainingBalance}
            textAlign="right"
            disabled
            lengthShowTooltip={8}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type Props = {
  formikProps: UpdatePOPaymentFormikProps;
  disabled?: boolean;
  currentPOMode: PO_MODE;
};

export default TablePaymentRemainingBalanceLineItems;
