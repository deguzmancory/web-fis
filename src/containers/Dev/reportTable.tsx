import React, { useState } from 'react';
import { Button, EllipsisTypographyTooltip, Input, InputCurrency } from 'src/components/common';
import './styles.scss';

import { Box, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { get } from 'lodash';
import JsonView from 'react-json-view';
import ReportTable from 'src/components/ReportTable';
import { BodyRow, BodyRows } from 'src/components/ReportTable/types';
import {
  getRecordTableHeader,
  INDIRECT_COSTS,
  REPORT_TABLE_HEADER_ROW_IN_FOOTER,
} from 'src/mocks/table/reportTableConfig';
import { ReportData, ReportTableData } from 'src/mocks/table/reportTableData';
import { hideAllDialog, hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/store';
import { formatMoney, getUncontrolledCurrencyInputFieldProps } from 'src/utils';
import { connect } from 'react-redux';

const ReportTableContainer: React.FC<Props> = ({ onHideAllDialog, onHideDialog, onShowDialog }) => {
  const formTableInputRef = React.useRef<FormikProps<ReportData[]>>(null);
  const [disableInputTable, setDisabledInputTable] = useState<boolean>(true);
  const reportTableData = ReportTableData.document;

  const initialRow = {
    projectNumber: '',
    activityCode: '',
    amountAwarded: '',
    totalExpended: '',
    outstandingPO: '',
    totalCost: '',
    suspense: '',
    availableBalance: '',
    currentExpended: '',
    description: '',
    category: '',
  };

  const handleFormTableInputSubmit = (value) => {
    onShowDialog({
      type: DIALOG_TYPES.OK_DIALOG,
      data: {
        title: 'Data Editable Table',
        content: (
          <Box>
            <JsonView src={{ value: value }} />
          </Box>
        ),
        onOk: () => onHideDialog(),
      },
    });
  };

  const { values, setValues, getFieldProps, setFieldValue, setFieldTouched, handleSubmit } =
    useFormik<ReportData[]>({
      initialValues: [...reportTableData.reportDataList, initialRow],
      validationSchema: null,
      innerRef: formTableInputRef,
      enableReinitialize: true,
      onSubmit: handleFormTableInputSubmit,
    });

  const getUncontrolledFieldProps = getUncontrolledCurrencyInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

  const getAutoGenerateUncontrolledFieldProps = getUncontrolledCurrencyInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

  const removeRow = (index: number) => {
    setValues(values.filter((_row, idx) => idx !== index));
  };

  const addNewRow = () => {
    setValues([...values, initialRow]);
  };

  const handleAutoGenerateOnBlur = ({ name, value, index }) => {
    setFieldValue(name, value);
    setFieldTouched(name, value);

    const currentRow = get(values, index);
    if (!value && !Object.values(currentRow).some((value) => value && value !== '0')) {
      if (index === values.length - 1) return;

      removeRow(index);
      return;
    }

    const rowAbove = get(values, `${index + 1}`);
    if (!rowAbove) {
      addNewRow();
      return;
    }
  };

  const cellBaseStyles = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderStyle: 'border-box',
    fontSize: 14,
  };

  const cellCurrencyInputBaseStyles = {
    ...cellBaseStyles,
    width: 140,
    maxWidth: 140,
    textAlign: 'right' as const,
  };

  const cellContainCurrencyInputStyles = {
    ...cellCurrencyInputBaseStyles,

    padding: '8px',
  };

  const cellContainInputStyles = {
    ...cellBaseStyles,

    padding: '8px',
  };

  const currencyInputInlineTableStyles = {
    ...cellBaseStyles,
    // border: 'none',
    // backgroundColor: 'transparent',
    textAlign: 'right' as const,
  };

  const reportList: BodyRows = values.map((reportRow, index) => {
    const reportRowFormValues: ReportData = get(values, index);
    return {
      columns: [
        {
          content: reportRow.category,
        },
        {
          content: (
            <Input {...getUncontrolledFieldProps(`${index}.description`)} style={cellBaseStyles} />
          ),
          style: cellContainInputStyles,
        },
        {
          content: (
            <InputCurrency
              {...getUncontrolledFieldProps(`${index}.amountAwarded`)}
              style={currencyInputInlineTableStyles}
            />
          ),
          style: cellContainCurrencyInputStyles,
        },
        {
          content: formatMoney(Number(get(values, `${index}.currentExpended`))), //formatMoney(Number(reportRow.currentExpended)),
          style: cellCurrencyInputBaseStyles,
        },
        {
          content: (
            <InputCurrency
              {...getFieldProps(`${index}.totalExpended`)}
              onChange={setFieldValue}
              style={currencyInputInlineTableStyles}
            />
          ),
          style: cellContainCurrencyInputStyles,
        },
        {
          content: (
            <InputCurrency
              {...getUncontrolledFieldProps(`${index}.outstandingPO`)}
              style={currencyInputInlineTableStyles}
              disabled={disableInputTable}
            />
          ),
          style: cellContainCurrencyInputStyles,
        },
        {
          content: formatMoney(
            Number(reportRowFormValues?.amountAwarded) +
              Number(reportRowFormValues?.currentExpended) +
              Number(reportRowFormValues?.totalExpended) +
              Number(reportRowFormValues?.suspense) +
              Number(reportRowFormValues?.outstandingPO)
          ),
          style: cellCurrencyInputBaseStyles,
        },
        {
          content: (
            <InputCurrency
              {...getAutoGenerateUncontrolledFieldProps(`${index}.suspense`, {
                onBlur: (name, value) => handleAutoGenerateOnBlur({ name, value, index }),
              })}
              style={currencyInputInlineTableStyles}
            />
          ),
          style: cellContainCurrencyInputStyles,
        },
        {
          content: (
            <Typography
              variant="body2"
              className={Number(reportRow.availableBalance) < 0 ? 'has-text-danger' : ''}
              sx={currencyInputInlineTableStyles}
            >
              {formatMoney(Number(reportRow.availableBalance))}
            </Typography>
          ),
          style: cellCurrencyInputBaseStyles,
        },
        {
          content: <Button onClick={() => alert(JSON.stringify(get(values, index)))}>View</Button>,
        },
      ],
    };
  });
  const directCostsTotalRow: BodyRow = {
    columns: [
      {
        content: 'Direct Costs Total',
        colSpan: 2,
        isHeaderColumn: true,
        style: {
          textAlign: 'right',
        },
      },
      {
        content: (
          <EllipsisTypographyTooltip variant="body2" lengthShowTooltip={15}>
            {formatMoney(values.reduce((output, report) => output + +report.amountAwarded, 0))}
          </EllipsisTypographyTooltip>
        ),
        style: cellCurrencyInputBaseStyles,
      },
      {
        content: (
          <EllipsisTypographyTooltip variant="body2" lengthShowTooltip={15}>
            {formatMoney(values.reduce((output, report) => output + +report.currentExpended, 0))}
          </EllipsisTypographyTooltip>
        ),
        style: cellCurrencyInputBaseStyles,
      },
      {
        content: (
          <EllipsisTypographyTooltip variant="body2" lengthShowTooltip={15}>
            {formatMoney(values.reduce((output, report) => output + +report.totalExpended, 0))}
          </EllipsisTypographyTooltip>
        ),
        style: cellCurrencyInputBaseStyles,
      },
      {
        content: (
          <EllipsisTypographyTooltip variant="body2" lengthShowTooltip={15}>
            {formatMoney(values.reduce((output, report) => output + +report.outstandingPO, 0))}
          </EllipsisTypographyTooltip>
        ),
        style: cellCurrencyInputBaseStyles,
      },
      {
        content: (
          <EllipsisTypographyTooltip variant="body2" lengthShowTooltip={15}>
            {formatMoney(values.reduce((output, report) => output + +report.totalCost, 0))}
          </EllipsisTypographyTooltip>
        ),
        style: cellCurrencyInputBaseStyles,
      },
      {
        content: (
          <EllipsisTypographyTooltip variant="body2" lengthShowTooltip={15}>
            {formatMoney(values.reduce((output, report) => output + +report.suspense, 0))}
          </EllipsisTypographyTooltip>
        ),
        style: cellCurrencyInputBaseStyles,
      },
      {
        content: (
          <EllipsisTypographyTooltip variant="body2" lengthShowTooltip={15}>
            {formatMoney(values.reduce((output, report) => output + +report.availableBalance, 0))}
          </EllipsisTypographyTooltip>
        ),
        style: cellCurrencyInputBaseStyles,
      },
      {
        content: '',
      },
    ],
  };

  const grandTotalRow: BodyRow = {
    columns: [
      {
        content: 'Grand Total',
        colSpan: 2,
        isHeaderColumn: true,
        style: {
          textAlign: 'right',
        },
      },
      {
        content: formatMoney(Number(reportTableData.grandTotal.amountAwarded)),
        style: {
          textAlign: 'right',
        },
      },
      {
        content: formatMoney(Number(reportTableData.grandTotal.currentExpended)),
        style: {
          textAlign: 'right',
        },
      },
      {
        content: formatMoney(Number(reportTableData.grandTotal.totalExpended)),
        style: {
          textAlign: 'right',
        },
      },
      {
        content: formatMoney(Number(reportTableData.grandTotal.outstandingPO)),
        style: {
          textAlign: 'right',
        },
      },
      {
        content: formatMoney(Number(reportTableData.grandTotal.totalCost)),
        style: {
          textAlign: 'right',
        },
      },
      {
        content: formatMoney(Number(reportTableData.grandTotal.suspense)),
        style: {
          textAlign: 'right',
        },
      },
      {
        content: formatMoney(Number(reportTableData.grandTotal.availableBalance)),
        style: {
          textAlign: 'right',
        },
      },
      {
        content: '',
      },
    ],
  };

  const handleToggleDisabled = () => {
    setDisabledInputTable((prev) => !prev);
  };

  const bodyList: BodyRows = [
    ...getRecordTableHeader({
      onToggleDisabled: handleToggleDisabled,
      disabled: disableInputTable,
    }),
    ...reportList,
    directCostsTotalRow,
    INDIRECT_COSTS,
    grandTotalRow,
    ...REPORT_TABLE_HEADER_ROW_IN_FOOTER,
  ];

  return (
    <>
      <ReportTable
        showBorder
        // headerList={REPORT_TABLE_HEADER}
        // headerSx={{
        //   textAlign: 'center',
        // }}
        bodyList={bodyList}
      />

      <Box mt={2}>
        <Button onClick={() => handleSubmit()}>Submit Table</Button>
      </Box>
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
  onHideAllDialog: hideAllDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportTableContainer);
