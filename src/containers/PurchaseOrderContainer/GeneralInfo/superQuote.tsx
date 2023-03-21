import React from 'react';
import { Box, Stack } from '@mui/material';
import { Button, Input } from 'src/components/common';
import { UpsertPOFormikProps } from '../types';
import { debounce } from 'lodash';
import { useSearchSuperQuotes } from 'src/queries';

const SuperQuote: React.FC<Props> = ({ formikProps, disabled = false }) => {
  const { superQuotes, isSuccess, setSearchSuperQuoteParams } = useSearchSuperQuotes();

  const debounceSearchSuperQuote = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSuperQuoteParams({ search: event.target.value });
  }, 500);

  return (
    <Box>
      <Input
        label={'SuperQUOTE Number'}
        onChange={debounceSearchSuperQuote}
        disabled={disabled}
        placeholder="XXXXX"
      />

      <Stack direction={'row'} justifyContent="flex-end" mt={3}>
        <Button variant="outline" className="mr-16">
          Cancel
        </Button>
        <Button>Import</Button>
      </Stack>
    </Box>
  );
};

interface Props {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
}

export default React.memo(SuperQuote);
