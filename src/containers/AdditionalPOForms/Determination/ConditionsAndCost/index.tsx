import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  Checkbox,
  EllipsisTooltipInput,
  Input,
  Link,
  TextareaAutosize,
} from 'src/components/common';
import { PODeterminationPayload } from 'src/queries/PurchaseOrders';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_DETERMINATION_KEY } from '../enum';
import { PO_DETERMINATION_LABEL } from './enum';

const ConditionsAndCost: React.FC<Props> = ({ formikProps }) => {
  const { values, errors, touched, getUncontrolledFieldProps, getFieldProps, setFieldValue } =
    formikProps;

  const _getErrorMessage = (fieldName: PO_DETERMINATION_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target?.checked;
    const nameFieldValue = event.target.name;

    // eslint-disable-next-line security/detect-object-injection
    if (checked && !values[nameFieldValue]) {
      setFieldValue(
        nameFieldValue,
        // eslint-disable-next-line security/detect-object-injection
        PO_DETERMINATION_LABEL[nameFieldValue]
      );
    } else setFieldValue(nameFieldValue, '');
  };

  return (
    <>
      <Typography variant="h5" mb={2}>
        I. This expenditure is being made under the following condition(s):
      </Typography>
      <Box>
        <Checkbox.Item
          label={
            <>
              Sole source{' '}
              <Link target="_blank" href="https://www.rcuh.com/2-000/2-100/2-106/">
                (Policy 2.106)
              </Link>
            </>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.SOLE_SOURCE)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.SOLE_SOURCE)}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              Emergency procurement{' '}
              <Link target="_blank" href="https://www.rcuh.com/2-000/2-100/2-108/">
                (Policy 2.108)
              </Link>{' '}
              where only one quote is received
            </>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.EMERGENCY_PROCUREMENT)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.EMERGENCY_PROCUREMENT)}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              Request for Quotations or Invitations for Bid (where the solicitation is publicly
              posted) where only one (1) quote/bid is received{' '}
              <Link target="_blank" href="https://www.rcuh.com/2-000/2-100/2-103/">
                (Policy 2.103
              </Link>{' '}
              and{' '}
              <Link target="_blank" href="https://www.rcuh.com/2-000/2-100/2-105/">
                2.105)
              </Link>
            </>
          }
          {...getFieldProps(
            PO_DETERMINATION_KEY.REQUEST_FOR_QUOTATIONS_INVITATION_FOR_BID_ONLY_ONE
          )}
          errorMessage={_getErrorMessage(
            PO_DETERMINATION_KEY.REQUEST_FOR_QUOTATIONS_INVITATION_FOR_BID_ONLY_ONE
          )}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            'Request for Quotations or Invitations for Bid where the lowest quote is NOT selected'
          }
          {...getFieldProps(PO_DETERMINATION_KEY.REQUEST_FOR_QUOTATIONS_INVITATION_FOR_BID_LOWEST)}
          errorMessage={_getErrorMessage(
            PO_DETERMINATION_KEY.REQUEST_FOR_QUOTATIONS_INVITATION_FOR_BID_LOWEST
          )}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              Request for Proposals{' '}
              <Link target="_blank" href="https://www.rcuh.com/2-000/2-100/2-104/">
                (Policy 2.104)
              </Link>
            </>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.REQUEST_FOR_PROPOSALS)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REQUEST_FOR_PROPOSALS)}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <div style={{ display: 'contents' }}>
              <div style={{ display: 'contents' }}>Price adjustment to Purchase Order No. </div>
              <div style={{ display: 'inline-block' }}>
                <EllipsisTooltipInput
                  maxLength={25}
                  errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.PRICE_ADJ_PO_NUMBER)}
                  {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.PRICE_ADJ_PO_NUMBER)}
                />
              </div>
              <div style={{ display: 'contents' }}> or Contract No. </div>
              <div style={{ display: 'inline-block' }}>
                <EllipsisTooltipInput
                  maxLength={25}
                  errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.PRICE_ADJ_CONTRACT_NUMBER)}
                  {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.PRICE_ADJ_CONTRACT_NUMBER)}
                />
              </div>
            </div>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.PRICE_ADJUSTMENT)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.PRICE_ADJUSTMENT)}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              <div style={{ display: 'contents' }}>
                <div style={{ display: 'contents' }}>
                  Exempt procurement{' '}
                  <Link target="_blank" href="https://www.rcuh.com/2-000/2-100/2-107/">
                    (Policy 2.107)
                  </Link>
                  , UH Exemption No.
                </div>{' '}
                <div style={{ display: 'inline-block' }}>
                  <Input
                    maxLength={3}
                    style={{ maxWidth: '30%' }}
                    errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.EXEMPTION_NUMBER)}
                    {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.EXEMPTION_NUMBER)}
                  />
                </div>
              </div>
            </>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.EXEMPT_PROCUREMENT)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.EXEMPT_PROCUREMENT)}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              Professional services procurement{' '}
              <Link target="_blank" href="https://www.rcuh.com/2-000/2-200/2-210/">
                (Policy 2.210)
              </Link>
            </>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.PROFESSIONAL_SVC_PROCUREMENT)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.PROFESSIONAL_SVC_PROCUREMENT)}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              <div>
                Extension of an existing contract past its initial term{' '}
                <Link target="_blank" href="https://www.rcuh.com/2-000/2-200/2-205/">
                  (Policy 2.205)
                </Link>
              </div>
              <div style={{ display: 'contents' }}>
                <div style={{ display: 'contents' }}>
                  Reason that uninterrupted service is beneficial:
                </div>{' '}
                <div style={{ display: 'inline-block' }}>
                  <EllipsisTooltipInput
                    maxLength={1000}
                    errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.BENEFICIAL_REASON)}
                    {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.BENEFICIAL_REASON)}
                  />
                </div>
              </div>
            </>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.EXTENSION)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.EXTENSION)}
          onChange={handleChangeValue}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              <div style={{ display: 'contents' }}>
                <div style={{ display: 'contents' }}>Other condition (specify): </div>
                <div style={{ display: 'inline-block' }}>
                  <EllipsisTooltipInput
                    maxLength={1000}
                    errorMessage={_getErrorMessage(
                      PO_DETERMINATION_KEY.EXPENDITURE_CONDITION_OTHER
                    )}
                    {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.EXPENDITURE_CONDITION_OTHER)}
                  />
                </div>
              </div>
            </>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.OTHER)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.OTHER)}
          onChange={handleChangeValue}
        />
      </Box>

      <Typography variant="h5" mt={4} lineHeight={1.5}>
        II. Cost or price offered or fee negotiated is considered fair and reasonable for the
        following reason(s) and if applicable, is supported by attached documentation and/or a
        detailed discussion of the price or cost analysis:
      </Typography>

      <Box>
        <Checkbox.Item
          label={
            'Comparison of previous RCUH purchase order and contract prices with current proposed price for the same or similar goods or services. Both the validity of the comparison and the reasonableness of the previous price(s) have been established (include the referenced RCUH purchase orders/contracts, amounts, issuance dates, and how they are similar to the current purchase).'
          }
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_1)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_1)}
          onChange={handleChangeValue}
        />
      </Box>
      <Box px={3}>
        <TextareaAutosize
          maxLength={5000}
          resize="none"
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_1_REF)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_1_REF)}
        />
      </Box>

      <Box mt={2}>
        <Checkbox.Item
          label={
            'Comparison with Vendor’s published price lists, market prices, pricing indexes, and discount or rebate arrangements. Attach published price list or other published pricing information used. (A vendor’s quotation or correspondence does not qualify as a published price list.)'
          }
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_2)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_2)}
          onChange={handleChangeValue}
        />
      </Box>
      <Box px={3}>
        <TextareaAutosize
          maxLength={5000}
          resize="none"
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_2_REF)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_2_REF)}
        />
      </Box>

      <Box mt={2}>
        <Checkbox.Item
          label={
            'Comparison of proposed price to an independent (in-house) estimate that describes the cost of the components (e.g., labor, materials). Attach documentation of the data used to prepare the estimate.'
          }
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_3)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_3)}
          onChange={handleChangeValue}
        />
      </Box>
      <Box px={3}>
        <TextareaAutosize
          maxLength={5000}
          resize="none"
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_3_REF)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_3_REF)}
        />
      </Box>

      <Box mt={2}>
        <Checkbox.Item
          label={
            'Comparison of proposed price with prices obtained through market research for the same or similar goods or services. Attach documentation of research conducted.'
          }
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_4)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_4)}
          onChange={handleChangeValue}
        />
      </Box>
      <Box px={3}>
        <TextareaAutosize
          maxLength={5000}
          resize="none"
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_4_REF)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_4_REF)}
        />
      </Box>

      <Box mt={1}>
        <Checkbox.Item
          label={
            <>
              <div style={{ display: 'contents' }}>
                <div style={{ display: 'contents' }}>
                  The order is priced in accordance with existing RCUH Purchase Order No.
                </div>{' '}
                <div style={{ display: 'inline-block' }}>
                  <EllipsisTooltipInput
                    maxLength={25}
                    {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.REASON_6_PO_NUMBER)}
                    errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_6_PO_NUMBER)}
                  />
                </div>
                <div style={{ display: 'contents' }}> and/or RCUH Contract No. </div>
                <div style={{ display: 'inline-block' }}>
                  <EllipsisTooltipInput
                    maxLength={25}
                    {...getUncontrolledFieldProps(PO_DETERMINATION_KEY.REASON_6_CONTRACT_NUMBER)}
                    errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_6_CONTRACT_NUMBER)}
                  />
                </div>
                <div style={{ display: 'contents' }}> which was competitively established.</div>
              </div>
            </>
          }
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_6)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_6)}
          onChange={handleChangeValue}
        />
      </Box>
      <Box px={3}>
        <TextareaAutosize
          resize="none"
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_6_REF)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_6_REF)}
        />
      </Box>

      <Box mt={2}>
        <Checkbox.Item
          label={
            'Comparison of proposed price with prices obtained through market research for the same or similar goods or services. Attach documentation of research conducted.'
          }
          {...getFieldProps(PO_DETERMINATION_KEY.REASON_7)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.REASON_7)}
          onChange={handleChangeValue}
        />
      </Box>
      <Box px={3}>
        <TextareaAutosize
          maxLength={5000}
          resize="none"
          {...getFieldProps(PO_DETERMINATION_KEY.COST_JUSTIFICATION)}
          errorMessage={_getErrorMessage(PO_DETERMINATION_KEY.COST_JUSTIFICATION)}
        />
      </Box>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<PODeterminationPayload>;
};

export default React.memo(ConditionsAndCost, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_DETERMINATION_KEY.SOLE_SOURCE,
    PO_DETERMINATION_KEY.EMERGENCY_PROCUREMENT,
    PO_DETERMINATION_KEY.REQUEST_FOR_QUOTATIONS_INVITATION_FOR_BID_ONLY_ONE,
    PO_DETERMINATION_KEY.REQUEST_FOR_QUOTATIONS_INVITATION_FOR_BID_LOWEST,
    PO_DETERMINATION_KEY.REQUEST_FOR_PROPOSALS,
    PO_DETERMINATION_KEY.PRICE_ADJ_PO_NUMBER,
    PO_DETERMINATION_KEY.PRICE_ADJ_CONTRACT_NUMBER,
    PO_DETERMINATION_KEY.PRICE_ADJUSTMENT,
    PO_DETERMINATION_KEY.EXEMPTION_NUMBER,
    PO_DETERMINATION_KEY.EXEMPT_PROCUREMENT,
    PO_DETERMINATION_KEY.PROFESSIONAL_SVC_PROCUREMENT,
    PO_DETERMINATION_KEY.BENEFICIAL_REASON,
    PO_DETERMINATION_KEY.EXTENSION,
    PO_DETERMINATION_KEY.EXPENDITURE_CONDITION_OTHER,
    PO_DETERMINATION_KEY.REASON_1,
    PO_DETERMINATION_KEY.REASON_1_REF,
    PO_DETERMINATION_KEY.REASON_2,
    PO_DETERMINATION_KEY.REASON_2_REF,
    PO_DETERMINATION_KEY.REASON_3,
    PO_DETERMINATION_KEY.REASON_3_REF,
    PO_DETERMINATION_KEY.REASON_4,
    PO_DETERMINATION_KEY.REASON_4_REF,
    PO_DETERMINATION_KEY.REASON_6_PO_NUMBER,
    PO_DETERMINATION_KEY.REASON_6_CONTRACT_NUMBER,
    PO_DETERMINATION_KEY.REASON_6,
    PO_DETERMINATION_KEY.REASON_6_REF,
    PO_DETERMINATION_KEY.REASON_7,
    PO_DETERMINATION_KEY.COST_JUSTIFICATION,
  ];

  return isEqualPrevAndNextFormikValues<PODeterminationPayload>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
