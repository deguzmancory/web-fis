import React from 'react';
import { Box, Stack } from '@mui/material';
import { Button, Input, LoadingCommon } from 'src/components/common';
import { UpsertPOFormikProps, UpsertPOFormValue } from '../types';
import { debounce } from 'lodash';
import { useSearchSuperQuotes } from 'src/queries';
import { isEmpty } from 'src/validations';
import { useDispatch } from 'react-redux';
import { hideDialog } from 'src/redux/dialog/dialogSlice';
import { PO_FORM_KEY } from '../enums';
import { isEqualPrevAndNextFormikValues } from 'src/utils';

const SuperQuote: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { values, setFieldValue } = formikProps;
  const [error, setError] = React.useState('');
  const [searchQuote, setSearchQuote] = React.useState('');
  const { superQuotes, isLoading, setSearchSuperQuoteParams } = useSearchSuperQuotes({
    onSuccess: (data) => {
      if (isEmpty(data)) {
        setError('No unusued SuperQUOTEs matched the text entered.');
      } else {
        setError('');
      }
    },
  });
  const dispatch = useDispatch();

  const debounceSearchSuperQuote = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuote(value);
    if (!value) {
      setError('');
    } else {
      setSearchSuperQuoteParams({ search: value });
    }
  }, 500);

  const handleCloseDialog = () => dispatch(hideDialog());

  const handleImport = () => {
    if (isEmpty(superQuotes) && (error || isLoading)) {
      return;
    }

    if (!searchQuote && !error) {
      setFieldValue(PO_FORM_KEY.SUPER_QUOTE_NUMBER, '');
      setFieldValue(PO_FORM_KEY.SUPER_QUOTE_BID_ID, '');
    } else if (!isEmpty(superQuotes)) {
      setFieldValue(PO_FORM_KEY.SUPER_QUOTE_NUMBER, superQuotes[0]?.quoteNumber);
      setFieldValue(PO_FORM_KEY.SUPER_QUOTE_BID_ID, superQuotes[0]?.bidId);
    }

    handleCloseDialog();
  };

  return (
    <Box>
      <Input
        label={'SuperQUOTE Number'}
        onChange={debounceSearchSuperQuote}
        disabled={disabled}
        placeholder="XXXXX"
        errorMessage={isLoading || !isEmpty(superQuotes) ? '' : error}
        defaultValue={values.superquoteNumber || ''}
        iconComponent={isLoading ? <LoadingCommon /> : null}
      />

      <Stack direction={'row'} justifyContent="flex-end" mt={3}>
        <Button variant="outline" className="mr-16" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={handleImport}>
          Import
        </Button>
      </Stack>
    </Box>
  );
};

interface Props {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
}

export default React.memo(SuperQuote, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [PO_FORM_KEY.SUPER_QUOTE_NUMBER, PO_FORM_KEY.SUPER_QUOTE_BID_ID]; // only re-render if keys using in this component change

  return isEqualPrevAndNextFormikValues<UpsertPOFormValue>({
    prevFormikProps,
    nextFormikProps,
    formKeysNeedRender,
  });
});
