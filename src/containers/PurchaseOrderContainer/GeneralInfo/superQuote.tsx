import React from 'react';
import { Box } from '@mui/material';
import { Input } from 'src/components/common';
import { UpsertPOFormikProps } from '../types';
import { debounce } from 'lodash';

const SuperQuote: React.FC<Props> = ({ formikProps, disabled = false }) => {
  // const { setFieldValue} = formikProps;

  const handleSearchSuperQuote = (searchString: string) => {
    console.log('searchString: ', searchString); //TODO: huy_dang handle search super quote
  };

  const debounceSearchSuperQuote = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchSuperQuote(event.target.value);
  }, 500);

  return (
    <Box>
      <Input
        label={'SuperQUOTE Number'}
        onChange={debounceSearchSuperQuote}
        disabled={disabled}
        placeholder="XXXXX"
      />
    </Box>
  );
};

interface Props {
  formikProps: UpsertPOFormikProps;
  disabled?: boolean;
}

export default React.memo(SuperQuote);
