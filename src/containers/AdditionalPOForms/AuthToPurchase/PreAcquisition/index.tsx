import { Box, Typography } from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { DatePicker, EllipsisTooltipInput, Input, TextareaAutosize } from 'src/components/common';
import CustomTable from 'src/components/CustomTable';
import { BodyBasicRows, CellType } from 'src/components/CustomTable/types';
import { initialAuthToPurchaseLineItemsValue } from 'src/containers/PurchaseOrderContainer/constants';
import { AuthToPurchaseResponse, POAuthToPurchasePayload } from 'src/queries/PurchaseOrders';
import {
  checkRowStateAndSetValue,
  getErrorMessage,
  isEqualPrevAndNextFormikValues,
} from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_AUTH_TO_PURCHASE_KEY, PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY } from '../enum';

const PreAcquisition: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;
  const lineItemsValue = React.useMemo(() => values.responses, [values.responses]);

  const _getErrorMessage = (fieldName: PO_AUTH_TO_PURCHASE_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const addNewRow = React.useCallback(() => {
    setFieldValue(`${PO_AUTH_TO_PURCHASE_KEY.RESPONSES}`, [
      ...lineItemsValue,
      initialAuthToPurchaseLineItemsValue,
    ]);
  }, [lineItemsValue, setFieldValue]);

  const removeRow = React.useCallback(
    (index: number) => {
      setFieldValue(
        `${PO_AUTH_TO_PURCHASE_KEY.RESPONSES}`,
        lineItemsValue.filter((_row, idx) => idx !== index)
      );
    },
    [lineItemsValue, setFieldValue]
  );

  const handleInputChange = ({ name, value, index }) => {
    checkRowStateAndSetValue<AuthToPurchaseResponse>({
      name,
      value,
      index,
      records: lineItemsValue,
      setFieldValue,
      onAddRow: addNewRow,
      onRemoveRow: removeRow,
    });
  };

  const lineItemRows: BodyBasicRows = lineItemsValue.map((lineItemRow, index) => {
    const prefixLineItem = `${PO_AUTH_TO_PURCHASE_KEY.RESPONSES}.${index}`;

    return {
      style: {
        verticalAlign: 'top',
      },
      columns: [
        {
          type: CellType.INPUT,
          label: 'Name',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY.ATTACHMENT_NAME}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY.ATTACHMENT_NAME}`,
                  value: event.target.value,
                })
              }
              style={{ width: 370 }}
              lengthShowTooltip={8}
              disabled={disabled}
            />
          ),
          width: 90,
        },
        {
          type: CellType.INPUT,
          label: 'Response',
          content: (
            <EllipsisTooltipInput
              {...getFieldProps(
                `${prefixLineItem}.${PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY.ATTACHMENT_RESPONSE}`
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY.ATTACHMENT_RESPONSE}`,
                  value: event.target.value,
                });
              }}
              style={{ width: 480 }}
              lengthShowTooltip={8}
              disabled={disabled}
            />
          ),
          width: 90,
        },
        {
          type: CellType.INPUT,
          label: 'Date',
          content: (
            <DatePicker
              placeholder=""
              dateFormat="MM/dd/yyyy"
              {...getFieldProps(
                `${prefixLineItem}.${PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY.ATTACHMENT_DATE}`
              )}
              selected={lineItemRow.attachmentDate as Date}
              name={`${prefixLineItem}.${PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY.ATTACHMENT_DATE}`}
              onBlur={setFieldTouched}
              onChange={(name, value) => {
                handleInputChange({
                  index,
                  name: `${prefixLineItem}.${PO_AUTH_TO_PURCHASE_LINE_ITEM_KEY.ATTACHMENT_DATE}`,
                  value: value,
                });
              }}
              disabled={disabled}
            />
          ),
          width: 150,
        },
      ],
    };
  });

  return (
    <>
      <Typography fontWeight="bold" borderBottom={COLOR_CODE.DEFAULT_BORDER} variant="h5" mb={1}>
        Pre acquisition Equipment Screening Certification
      </Typography>
      <div style={{ display: 'contents', lineHeight: '2.5' }}>
        <div style={{ display: 'contents' }}>
          In accordance with Federal Government regulations and University of Hawaii Administrative
          Procedure A8.290, the following screening action was accomplished to ascertain the
          availability of a
        </div>
        <span> </span>
        <div style={{ display: 'inline-block', width: '600px' }}>
          <TextareaAutosize
            maxLength={250}
            resize="none"
            style={{ padding: '0 2px', marginTop: '2px' }}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.EQUIPMENT_DESCRIPTION)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.EQUIPMENT_DESCRIPTION)}
            disabled={disabled}
          />
        </div>
        <div style={{ display: 'contents' }}> for </div>
        <div style={{ display: 'inline-block', width: '60%' }}>
          <TextareaAutosize
            maxLength={250}
            resize="none"
            style={{ padding: '0 2px', marginTop: '2px' }}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.PROJECT)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.PROJECT)}
            disabled={disabled}
          />
        </div>
        <div style={{ display: 'contents' }}> , at an estimated cost of $ </div>
        <div style={{ display: 'inline-block', marginTop: '2px' }}>
          <Input
            type="number"
            maxLength={20}
            errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.ESTIMATED_COST)}
            {...getUncontrolledFieldProps(PO_AUTH_TO_PURCHASE_KEY.ESTIMATED_COST)}
            disabled={disabled}
          />
        </div>
      </div>

      <>
        <Typography variant="body1" mt={2}>
          NOTE: For equipment with an estimated cost of $5,000 and less than $25,000, the inventory
          of the department shall be screened for available usage. For equipment with an estimated
          cost of $25,000 or more, University-wide screening is required for available usage.
        </Typography>
        <Typography variant="body2" mt={2}>
          A. Individuals and departments contacted were:
        </Typography>
        <Typography variant="body2">
          (Note: Applies to equipment with estimated value of $5,000 or more only.)
        </Typography>
        <Box mt={1}>
          <CustomTable.Basic bodyList={lineItemRows} />
        </Box>
      </>
      <>
        <Typography variant="body1" mt={2}>
          B. Sufficient availability does not exist because:
        </Typography>
        <TextareaAutosize
          maxLength={5000}
          errorMessage={_getErrorMessage(PO_AUTH_TO_PURCHASE_KEY.AVAILABILITY_NOT_EXISTS_REASON)}
          {...getFieldProps(PO_AUTH_TO_PURCHASE_KEY.AVAILABILITY_NOT_EXISTS_REASON)}
          disabled={disabled}
        />
      </>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<POAuthToPurchasePayload>;
  disabled: boolean;
};

export default React.memo(PreAcquisition, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_AUTH_TO_PURCHASE_KEY.RESPONSES,
    PO_AUTH_TO_PURCHASE_KEY.EQUIPMENT_DESCRIPTION,
    PO_AUTH_TO_PURCHASE_KEY.PROJECT,
    PO_AUTH_TO_PURCHASE_KEY.ESTIMATED_COST,
    PO_AUTH_TO_PURCHASE_KEY.AVAILABILITY_NOT_EXISTS_REASON,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<POAuthToPurchasePayload>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
