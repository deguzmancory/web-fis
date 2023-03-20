import { Delete } from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  iconButtonClasses,
  Stack,
  Typography,
} from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import React from 'react';
import JsonView from 'react-json-view';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import {
  AnimatedTabPanel,
  Button,
  Checkbox,
  EllipsisTooltipInput,
  EllipsisTooltipInputCurrency,
  Input,
  RadioButton,
  Select,
  TextareaAutosize,
} from 'src/components/common';
import TabsBar from 'src/components/common/TabsBar';
import TypographyLink from 'src/components/TypographyLink';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/rootReducer';
import { getUncontrolledInputFieldProps } from 'src/utils';

type TabData = {
  controlledInput: string;
  uncontrolledInput: string;
  ellipsisTooltipInput: string;
  number: number;
  currencyUSD: string;
  textareaAutosizeVertical: string;
  textareaAutosizeNoneResize: string;
  select: string;
  checkbox: string[];
  radio: string;
  date: Date;
  dateRange: Date;
  phone: string;
  validatePassword: string;
  confirmationCode: string;
};

const VerticalTabs: React.FC<Props> = ({ onShowDialog, onHideDialog }) => {
  const verticalTabsRef = React.useRef<FormikProps<TabData[]>>(null);
  const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(0);
  const [hideArrowTypeNumber, setHideArrowTypeNumber] = React.useState<boolean>(false);

  const emptyTabData: TabData = {
    uncontrolledInput: '',
    controlledInput: '',
    ellipsisTooltipInput: '',
    number: null,
    currencyUSD: '',
    textareaAutosizeVertical: '',
    textareaAutosizeNoneResize: '',
    select: null,
    checkbox: [],
    radio: null,
    date: null,
    dateRange: null,
    phone: '',
    validatePassword: '',
    confirmationCode: '',
  };

  const handleFormTableInputSubmit = (value) => {
    onShowDialog({
      type: DIALOG_TYPES.OK_DIALOG,
      data: {
        title: 'Vertical Tabs Data',
        content: (
          <Box>
            <JsonView src={{ value: value }} />
          </Box>
        ),
        onOk: () => onHideDialog(),
      },
    });
  };

  const { values, getFieldProps, setFieldValue, setValues, setFieldTouched, handleSubmit } =
    useFormik<TabData[]>({
      initialValues: [emptyTabData, emptyTabData],
      validationSchema: null,
      innerRef: verticalTabsRef,
      enableReinitialize: true,
      onSubmit: handleFormTableInputSubmit,
    });

  const getUncontrolledFieldProps = getUncontrolledInputFieldProps({
    values,
    setFieldTouched,
    setFieldValue,
  });

  const handleAddTab = () => {
    const currentValuesLength = values.length || 1;
    setValues([...values, emptyTabData]);

    // auto jump to item just created
    setCurrentTabIndex(currentValuesLength);
  };

  const handleRemoveTab = React.useCallback(
    (index: number) => {
      setValues(values.filter((_item, idx) => idx !== index));

      // jump to first item when remove current item
      if (currentTabIndex === index) {
        setCurrentTabIndex(0);
      }

      // update index of current selected item if other item above has been removed
      if (currentTabIndex > index) {
        setCurrentTabIndex((prev) => prev - 1);
      }
    },
    [values, currentTabIndex, setValues]
  );

  const tabList = React.useMemo(
    () =>
      values
        .map((_item, index) => {
          const showRemoveButton = values.length > 1;

          return {
            label: (
              <Stack
                direction={'row'}
                justifyContent="space-between"
                width={'100%'}
                height={'100%'}
                sx={{
                  '&:hover': {
                    [`& .${iconButtonClasses.root}`]: {
                      display: 'inline-flex',
                    },
                  },
                }}
              >
                <span>Item #{index + 1} </span>
                {showRemoveButton && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      handleRemoveTab(index);
                    }}
                    sx={{
                      p: 0,
                      display: 'none',
                    }}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Stack>
            ),
            value: index.toString(),
            sx: {
              minWidth: 150,
              justifyContent: 'space-between',
              flexDirection: 'row',
            },
          };
        })
        .concat([
          {
            label: <TypographyLink fontWeight={'bold'}>Add Item</TypographyLink>,
            value: 'Add',
            sx: undefined,
          },
        ]),
    [values, handleRemoveTab]
  );

  const handleTabChange = (_e, value) => {
    if (value === 'Add') {
      handleAddTab();
      return;
    }

    setCurrentTabIndex(Number(value));
  };

  const handleJumpToNextItem = () => {
    setCurrentTabIndex((prev) => prev + 1);
  };

  const handleJumpToPrevItem = () => {
    setCurrentTabIndex((prev) => prev - 1);
  };

  return (
    <>
      <Box display={'flex'} flexGrow={1} border={COLOR_CODE.DEFAULT_BORDER}>
        <TabsBar
          tabsList={tabList}
          onChange={handleTabChange}
          value={currentTabIndex.toString()}
          orientation="vertical"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        />
        <AnimatedTabPanel
          uniqKey={`vertical-tab-${currentTabIndex}`}
          transitionTime={0.2}
          style={{ width: '100%', maxHeight: '70vh', overflow: 'auto' }}
        >
          <Stack
            direction="row"
            alignItems={'center'}
            justifyContent={'space-between'}
            borderBottom={COLOR_CODE.DEFAULT_BORDER}
            py={1}
            px={2}
            position="sticky"
            bgcolor={COLOR_CODE.WHITE}
            zIndex={99}
            top={0}
          >
            <Typography fontWeight={'bold'}>ITEM #{currentTabIndex + 1}</Typography>
            <Stack direction="row">
              <Button
                variant="link"
                disabled={currentTabIndex === values.length - 1}
                onClick={handleJumpToNextItem}
              >
                Next Item
              </Button>
              <Button
                variant="link"
                disabled={currentTabIndex === 0}
                onClick={handleJumpToPrevItem}
              >
                Previous Item
              </Button>
              <Button
                variant="link-danger"
                disabled={values.length === 1}
                onClick={() => handleRemoveTab(currentTabIndex)}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
          <Grid container spacing={1} py={1} px={2}>
            {/* uncontrolledInput */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <b>1. Input</b> - Uncontrolled
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Input {...getUncontrolledFieldProps(`${currentTabIndex}.uncontrolledInput`)} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* controlledInput */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <b>2. Input</b> - Controlled
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Input {...getFieldProps(`${currentTabIndex}.controlledInput`)} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* EllipsisTooltipInput */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <b>3. Input</b> - Ellipsis Tooltip (Type over 10 character)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <EllipsisTooltipInput
                {...getUncontrolledFieldProps(`${currentTabIndex}.ellipsisTooltipInput`)}
                lengthShowTooltip={10}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Number */}
            <Grid item xs={12} md={6}>
              <Stack direction={'row'} alignItems="center">
                <Typography variant="body1" mr={1}>
                  <b>4. Input Number</b>
                </Typography>
                <Button variant="link" onClick={() => setHideArrowTypeNumber((prev) => !prev)}>
                  Toggle arrow
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <EllipsisTooltipInput
                {...getUncontrolledFieldProps(`${currentTabIndex}.number`)}
                lengthShowTooltip={10}
                type={'number'}
                hideArrowTypeNumber={hideArrowTypeNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* currencyUSD */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" mr={1}>
                <b>5. USD</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <EllipsisTooltipInputCurrency
                {...getUncontrolledFieldProps(`${currentTabIndex}.currencyUSD`)}
                lengthShowTooltip={10}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* textareaAutosizeVertical */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" mr={1}>
                <b>6. Textarea Autosize Vertical</b> (default)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextareaAutosize
                {...getUncontrolledFieldProps(`${currentTabIndex}.textareaAutosizeVertical`)}
                minRows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* textareaAutosizeNoneResize */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" mr={1}>
                <b>7. Textarea Autosize None Resize</b> (Auto resize when new row appears)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextareaAutosize
                {...getUncontrolledFieldProps(`${currentTabIndex}.textareaAutosizeHorizontal`)}
                resize="none"
                minRows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Checkbox */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" mr={1}>
                <b>8. Checkbox</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Checkbox.Group
                label={''}
                {...getFieldProps(`${currentTabIndex}.checkbox`)}
                options={[
                  { label: 'Option 1', value: 'Option 1' },
                  { label: 'Option 2', value: 'Option 2' },
                  { label: 'Option 3', value: 'Option 3' },
                ]}
                onChange={setFieldValue}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* select */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" mr={1}>
                <b>9. Select</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
                label={''}
                {...getFieldProps(`${currentTabIndex}.select`)}
                placeholder={'Search'}
                onBlur={setFieldTouched}
                options={[
                  { label: 'Option 1', value: 1 },
                  { label: 'Option 2', value: 2 },
                  { label: 'Option 3', value: 3 },
                ]}
                onChange={setFieldValue}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* radio */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" mr={1}>
                <b>10. Radio</b>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioButton
                label={''}
                {...getFieldProps(`${currentTabIndex}.radio`)}
                options={[
                  { label: 'Option 1', value: 'Option 1' },
                  { label: 'Option 2', value: 'Option 2' },
                  { label: 'Option 3', value: 'Option 3' },
                ]}
                onChange={setFieldValue}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </AnimatedTabPanel>
      </Box>
      <Box mt={2}>
        <Button onClick={() => handleSubmit()}>Submit Tabs</Button>
      </Box>
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(VerticalTabs));

// function TabPanel({ children, value, index }) {
//   return (
//     <div role="tabpanel" hidden={value !== index}>
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }
