import React, { useState } from 'react';
import { FaElementor, FaUsersCog, FaUserShield } from 'react-icons/fa';
import {
  AnimatedTabPanel,
  Button,
  Checkbox,
  ConfirmationCodeField,
  DatePicker,
  DateRangePicker,
  EllipsisTypographyTooltip,
  Input,
  InputCurrency,
  InputPassword,
  Loading,
  Tag,
  Text,
  TimePicker,
  View,
  WeekPicker,
} from 'src/components/common';
import AccountBadge from 'src/components/common/Badge';
import Banner from 'src/components/common/Banner';
import FileUpload from 'src/components/common/FileUpload';
import RadioButton from 'src/components/common/RadioButton';
import Signature from 'src/components/common/Signature';
import './styles.scss';

import { Box, Container, Divider, Tooltip, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { Location } from 'history';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { DateRange } from 'src/components/common/DateRangePicker';
import TabsBar from 'src/components/common/TabsBar';
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
import { Toastify } from 'src/services';
import { emptyFunction, formatMoney, getUncontrolledCurrencyInputFieldProps } from 'src/utils';
import JsonView from 'react-json-view';

const Dev: React.FC<Props> = ({ location, onShowDialog, onHideDialog, onHideAllDialog }) => {
  const currentLocation = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(currentLocation.search);

  const [files, setFiles] = useState<File[]>();
  const [count, setCount] = useState(0);
  const [datePicked, setDatePicked] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);
  const [newTime, setNewTime] = useState<Date>(new Date());
  const [week, setWeek] = useState<[Date, Date]>([new Date(), new Date()]);
  const [radio, setRadio] = useState<string>('');
  const [select, setSelect] = useState<string[]>([]);
  const [source, setSource] = useState<string>(null);
  const [currencyInput, setCurrencyInput] = useState<number>(0);
  const [tab, setTab] = useState(null);
  const formTableInputRef = React.useRef<FormikProps<ReportData[]>>(null);
  const [disableInputTable, setDisabledInputTable] = useState<boolean>(true);
  const reportTableData = ReportTableData.document;

  const handleCodeFieldChange = (value: string) => {
    console.log('value', value);
  };

  const handleCheckboxChange = (name, value: any[]) => {
    console.log('handleCheckboxChange', value);
    setSelect(value);
  };

  const handleDatePickerChage = (value: Date) => {
    setDatePicked(value);
  };

  const handleDateRangePickerChage = (value: DateRange) => {
    console.log(`handleDateRangePickerChage`, value);
    setDateRange(value);
  };

  const handleTimePickerChage = (value: Date) => {
    console.log('handleTimePickerChage', value);
    setNewTime(value);
  };

  const handleWeekPickerChage = (value: any) => {
    console.log(value);
    setWeek(value);
  };

  const showContentDialog = () => {
    onShowDialog({
      type: DIALOG_TYPES.CONTENT_DIALOG,
      data: {
        content: (
          <View>
            <Input label="aaaaaaaaaa" placeholder="asdasd" />
            <Input label="bbbbbbb" placeholder="cvbcvb" />

            <View justify="flex-end" isRow className="mt-16">
              <Button
                variant="secondary-outline"
                className="mr-16"
                onClick={() => {
                  Toastify.success('Cancel Click');
                  onHideDialog();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  Toastify.info('Ok Click');
                  onHideDialog();
                }}
              >
                Ok
              </Button>
            </View>
          </View>
        ),
        cancelText: 'Cancel',
        okText: 'Ok',
        onCancel: () => onHideDialog(),
      },
    });
  };

  const showYesNoDialog = () => {
    onShowDialog({
      type: DIALOG_TYPES.YESNO_DIALOG,
      data: {
        title: 'Yes No Dialog',
        content: (
          <View>
            <Input label="aaaaaaaaaa" placeholder="asdasd" />
            <Input label="bbbbbbb" placeholder="cvbcvb" />
          </View>
        ),
        cancelText: 'Cancel',
        okText: 'Ok',
        onOk: () => {
          Toastify.info('Ok Click');
          onHideDialog();
        },
        onCancel: () => {
          Toastify.info('Cancel Click');
          onHideDialog();
        },
      },
    });
  };

  const showYesNoReconfirmDialog = () => {
    onShowDialog({
      type: DIALOG_TYPES.YESNO_DIALOG,
      data: {
        title: 'Yes No Dialog',
        content: (
          <View>
            <Input label="aaaaaaaaaa" placeholder="asdasd" />
            <Input label="bbbbbbb" placeholder="cvbcvb" />
          </View>
        ),
        cancelText: 'Cancel',
        okText: 'Ok',
        onOk: () => {
          Toastify.info('Ok Click');
          onHideAllDialog();
        },
        onCancel: () => {
          Toastify.info('Cancel Click');
          onHideAllDialog();
        },
        reconfirm: {
          ok: {
            show: true,
            title: 'Ok Confirmation Title',
            content: 'Ok Content',
          },
          cancel: {
            show: true,
            title: 'Cancel Confirmation Title',
            content: 'Cancel Content',
          },
        },
      },
    });
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
    <Container maxWidth="lg">
      <View className="mt-32">
        <h2>Report table</h2>
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
      </View>

      <View className="mt-32">
        <h2>Input Currency</h2>
        <InputCurrency
          onChange={(name: string, value: number) => {
            setCurrencyInput(value);
          }}
          label="Currency"
          value={currencyInput}
          name=""
        />
      </View>

      <View className="mb-32 mt-32">
        <h2>Tab bars</h2>
        <TabsBar
          tabsList={[
            {
              label: 'Tab 1',
              value: 'tab1',
            },
            {
              label: 'Tab 2',
              value: 'tab2',
            },
            {
              label: 'Tab 3',
              value: 'tab3',
            },
            {
              label: 'Tab 4',
              value: 'tab4',
            },
          ]}
          value={tab}
          onChange={(e, value) => {
            setTab(value);
            query.set('tab', value);
            history.push({ search: query.toString() });
          }}
        />
        <Divider />
        <AnimatedTabPanel uniqKey={`userType-${tab}`} transitionTime={0.2}>
          {tab === 'tab1' && <Box p={2}>Content 1</Box>}
          {tab === 'tab2' && <Box p={2}>Content 2</Box>}
          {tab === 'tab3' && <Box p={2}>Content 3</Box>}
          {tab === 'tab4' && <Box p={2}>Content 4</Box>}
        </AnimatedTabPanel>
      </View>

      <View className="mb-32">
        <h2>Banner</h2>
        <Banner
          title="Tips"
          status="warning"
          className="mb-8"
          message="Et eu nostrud deserunt id anim mollit. Sint deserunt adipisicing aliqua ut tempor qui consectetur duis reprehenderit consectetur. Voluptate consectetur enim ut veniam enim dolor commodo ea ad ad aliqua nulla officia."
        />
        <Banner
          title="Tips"
          status="rejected"
          className="mb-8"
          message="Et eu nostrud deserunt id anim mollit. Sint deserunt adipisicing aliqua ut tempor qui consectetur duis reprehenderit consectetur. Voluptate consectetur enim ut veniam enim dolor commodo ea ad ad aliqua nulla officia."
        />
        <Banner
          title="Tips"
          status="completed"
          className="mb-8"
          message="Et eu nostrud deserunt id anim mollit. Sint deserunt adipisicing aliqua ut tempor qui consectetur duis reprehenderit consectetur. Voluptate consectetur enim ut veniam enim dolor commodo ea ad ad aliqua nulla officia."
        />
      </View>

      <View className="mb-32">
        <h2 className="">Deposition Badge</h2>
        <AccountBadge variant="Active" className="mb-8" />
        <AccountBadge variant="Completed" className="mb-8" />
        <AccountBadge variant="Pending" className="mb-8" />
        <AccountBadge variant="Rejected" className="mb-8" />
      </View>
      <View className="mb-32">
        <h2>Signature</h2>
        <Signature onChange={(name: string, value: any) => setSource(value)} />
        {source && <img src={source} alt="asdasd" />}
      </View>

      <View className="mb-32">
        <h2>Image</h2>
        <img src="https://picsum.photos/200" alt="picsum" width={200} />
      </View>

      <View className="mb-32">
        <h2>Tag</h2>
        <View isRow justify="space-around">
          <Tag>Primary</Tag>
          <Tag variant="is-success">Success</Tag>
          <Tag variant="is-danger">Danger</Tag>
          <Tag variant="is-dark">Dark</Tag>
          <Tag variant="is-info">Info</Tag>
          <Tag variant="is-light">Light</Tag>
          <Tag variant="is-black">Black</Tag>
          <Tag variant="is-warning">Warning</Tag>
        </View>
      </View>

      <View className="mb-32">
        <h2>Tag isLight</h2>
        <View isRow justify="space-around">
          <Tag isLight>Primary</Tag>
          <Tag isLight variant="is-success">
            Success
          </Tag>
          <Tag isLight variant="is-danger">
            Danger
          </Tag>
          <Tag isLight variant="is-dark">
            Dark
          </Tag>
          <Tag isLight variant="is-info">
            Info
          </Tag>
          <Tag isLight variant="is-light">
            Light
          </Tag>
          <Tag isLight variant="is-black">
            Black
          </Tag>
          <Tag isLight variant="is-warning">
            Warning
          </Tag>
        </View>
      </View>

      <View className="mb-32">
        <h2>File Upload</h2>
        {files?.map((file) => (
          <View>
            <Text>Name: {file.name}</Text>
            <Text>Size: {file.size} bytes</Text>
            <Text>Type: {file.type}</Text>
          </View>
        ))}

        <FileUpload onChange={(value: any) => setFiles(value)} />
      </View>

      <View className="mb-32">
        <h2>Date Range Picker</h2>
        <div className="columns">
          <div className="column">
            <DateRangePicker
              selecteds={dateRange}
              label="date range 1"
              onChange={handleDateRangePickerChage}
            />
          </div>
          <div className="column">
            <DateRangePicker
              label="date range 1"
              onChange={handleDateRangePickerChage}
              errorMessage="error go here"
            />
          </div>
          <div className="column">
            <DateRangePicker
              selecteds={dateRange}
              label="date range 1"
              onChange={handleDateRangePickerChage}
              disabled
            />
          </div>
        </div>
      </View>

      <View className="mt-40">
        <div className="columns">
          <div className="column">
            <WeekPicker
              weekSelected={week}
              label="week picker 1"
              onChange={handleWeekPickerChage}
            />
          </div>
          <div className="column">
            <WeekPicker
              weekSelected={week}
              label="week picker 1"
              onChange={handleWeekPickerChage}
              errorMessage="error go here"
            />
          </div>
          <div className="column">
            <WeekPicker
              weekSelected={week}
              label="week picker 1"
              onChange={handleWeekPickerChage}
              disabled
            />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <DatePicker selected={datePicked} label="date 1" onChange={handleDatePickerChage} />
          </div>
          <div className="column">
            <DatePicker
              label="date 2"
              onChange={handleDatePickerChage}
              errorMessage="error go here"
            />
          </div>
          <div className="column">
            <DatePicker
              selected={datePicked}
              label="date 3"
              onChange={handleDatePickerChage}
              disabled
            />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <TimePicker selected={newTime} label="time 1" onChange={handleTimePickerChage} />
          </div>
          <div className="column">
            <DatePicker
              label="date 2"
              onChange={handleDatePickerChage}
              errorMessage="error go here"
            />
          </div>
          <div className="column">
            <DatePicker
              selected={datePicked}
              label="date 3"
              onChange={handleDatePickerChage}
              disabled
            />
          </div>
        </div>
      </View>

      <View className="mb-32">
        <h2>Count</h2>
        <h1>{count}</h1>
        <Button onClick={() => setCount(count + 1)}>Count</Button>
      </View>

      <View>
        <h2>Button</h2>
        <View
          className="mb-32"
          isRow
          justify="space-around"
          style={{ backgroundColor: 'white', padding: 20 }}
        >
          <Button isOutline onClick={() => {}}>
            Modal
          </Button>

          <Button isOutline disabled>
            Disabled
          </Button>
          <Button disabled>Pri Disabled</Button>
        </View>

        <View className="mt-40" isRow justify="space-around">
          <Button icon={<FaElementor />}>To Interview</Button>
          <Button icon={<FaUserShield />} iconPosition="right">
            Icon Right
          </Button>
          <Button icon={<FaUsersCog />} variant="outline">
            Icon Left
          </Button>
          <Button icon={<FaUsersCog />} iconPosition="right" variant="outline">
            Icon Right
          </Button>
          <Tooltip arrow title={'Test Tool Tip top'}>
            <Button>Tooltip</Button>
          </Tooltip>
        </View>

        <View className="mt-40" isRow justify="space-around">
          <Button variant="text">Text Button</Button>
          <Button variant="link">Link Button</Button>
          <Button variant="outline">Outline Button</Button>
        </View>
      </View>

      <View className="mb-32">
        <h2>Toast</h2>
        <View isRow justify="space-around">
          <Button onClick={() => Toastify.success('Test Toast Success')}>Toast Success</Button>
          <Button onClick={() => Toastify.error('Test Toast Error')}>Toast Error</Button>
          <Button onClick={() => Toastify.info('Test Toast Info')}>Toast Info</Button>
          <Button onClick={() => Toastify.info('Test Toast Warning')}>Toast Warning</Button>
        </View>
      </View>

      <View className="mb-32">
        <h2>Loading</h2>
        <View isRow justify="space-around" style={{ backgroundColor: 'black', padding: 20 }}>
          <Loading loadingStyle={1} />
          <Loading loadingStyle={2} />
          <Loading loadingStyle={3} />
          <Loading loadingStyle={4} />
          <Loading loadingStyle={5} />
        </View>
      </View>
      <View className="mb-32">
        <h2>Confirmation Code Field</h2>
        <ConfirmationCodeField onChange={handleCodeFieldChange} />
      </View>

      <View className="mb-32">
        <h2>Checkbox</h2>
        <Checkbox.Group
          label="Hello World Checkbox"
          options={[
            { label: 'Hello', value: 'Hello' },
            { label: 'World', value: 'World' },
            { label: 'Loc', value: 'World' },
            { label: 'Tran', value: 'World' },
          ]}
          onChange={handleCheckboxChange}
          value={select}
          columns={3}
        />
        <Checkbox.Group
          label="Hello World Checkbox"
          options={[
            { label: 'Hello', value: 'Hello' },
            { label: 'World', value: 'World' },
            { label: 'Loc', value: 'World' },
            { label: 'Tran', value: 'World' },
          ]}
          onChange={handleCheckboxChange}
          value={select}
          columns={3}
          disabled
        />
      </View>
      <View className="mb-32">
        <RadioButton
          label="Radio button"
          options={[
            { label: 'Hello', value: 'Hello' },
            { label: 'World', value: 'World' },
            { label: 'Loc', value: 'World' },
            { label: 'Tran', value: 'World' },
          ]}
          onChange={(name, value: string) => setRadio(value)}
        />
        <p>Radio value: {radio}</p>
      </View>
      <View className="mb-32">
        <h2>Input</h2>
        <Input label="Text" defaultValue="1" />
        <Input label="Text Error" defaultValue="2" errorMessage="aaaaa" />
        <Input label="Text Disabled" defaultValue="3" disabled />
        <Input label="Password" type="password" />
        <InputPassword label="Password with eye" />
      </View>
      <View className="mb-32">
        <h2>Dialog</h2>
        <View isRow>
          <Button onClick={showContentDialog} className="mb-32 mr-16">
            Content Dialog
          </Button>
          <Button onClick={showYesNoDialog} className="mb-32 mr-16">
            YES NO Dialog
          </Button>
          <Button onClick={showYesNoReconfirmDialog} className="mb-32 mr-16">
            YES NO + Reconfirm Answer Dialog
          </Button>
        </View>
      </View>
      <View className="mb-32">
        <h2>Accordion</h2>
      </View>
      <View className="mb-32">
        <h2>Date Picker</h2>
        <DatePicker value={new Date().toISOString()} onChange={emptyFunction} />
        <hr />
      </View>
    </Container>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    location: Location<string>;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
  onHideAllDialog: hideAllDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dev);
