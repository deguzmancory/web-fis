import { Box, SxProps } from '@mui/material';
import { FieldInputProps } from 'formik';
import { debounce, isString } from 'lodash';
import React from 'react';
import { Input, Select } from 'src/components/common';
import { SelectOption } from 'src/components/common/Select';
import { FinancialProject, useGetProfileProjects } from 'src/queries';
import { isEmpty } from 'src/validations';
import { getFinancialProjectNumberOptions } from './helpers';

const SearchProjectNumber: React.FC<Props> = ({
  errorMessage,
  fieldProps,
  disabled = false,
  isClearable = true,
  sx,
  setFieldTouched,
  onChange,
}) => {
  const [searchProjects, setSearchProjects] = React.useState<string>('');
  const [isClearedDefaultValue, setIsClearedDefaultValue] = React.useState<boolean>(false);

  const { value, name } = fieldProps;
  const selectedProjectNumber = typeof value === 'string' ? value : value?.number;

  const {
    profileProjects,
    setParams: setParamsSearchProject,
    isLoading: isLoadingSearchProjects,
  } = useGetProfileProjects();

  const filteredProjectNumberOptions = React.useMemo(() => {
    if (isLoadingSearchProjects || !searchProjects) {
      return [];
    }

    return getFinancialProjectNumberOptions({
      projects: profileProjects,
    });
  }, [profileProjects, searchProjects, isLoadingSearchProjects]);

  const hasValueButOptions =
    !!value && isEmpty(filteredProjectNumberOptions) && !isLoadingSearchProjects;

  // Debouncing search projects inputs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchProjectsInput = React.useCallback(
    debounce((value: string) => {
      setParamsSearchProject({
        search: value,
      });
    }, 300),
    []
  );

  const handleInputChange = (value: string) => {
    //handle case try to clear default value
    if (!value) {
      if (hasValueButOptions) {
        setIsClearedDefaultValue(true);
        onChange(name, null);
      }

      return;
    }

    setSearchProjects(value);
  };

  React.useEffect(() => {
    debounceSearchProjectsInput(searchProjects);
  }, [searchProjects, debounceSearchProjectsInput]);

  return (
    <Box sx={sx}>
      {disabled ? (
        <Input value={isString(value) ? value : value?.number || ''} disabled />
      ) : (
        <Select
          {...fieldProps}
          errorMessage={errorMessage}
          onBlur={setFieldTouched}
          label={''}
          placeholder={'Search'}
          options={filteredProjectNumberOptions}
          isLoading={isLoadingSearchProjects}
          onInputChange={handleInputChange}
          defaultInputValue={selectedProjectNumber} //first mounted with data get from PO response
          {...(!isClearedDefaultValue && {
            inputValue: hasValueButOptions ? selectedProjectNumber : undefined,
          })} //available in case have value but lack of options
          getOptionLabel={(option: SelectOption<FinancialProject>) => {
            return option.value?.number;
          }}
          customSelectedOptionValue={
            filteredProjectNumberOptions.find(
              (option: SelectOption<FinancialProject>) => option.value?.number === value
            ) || null
          }
          filterOption={(_option, _inputValue) => {
            return true; //ignore default filter option by label
          }}
          menuStyle={{
            width: '760px',
          }}
          hideSearchIcon
          isClearable={isClearable}
          onChange={onChange}
          optionWithSubLabel
          // isDisabled={disabled}
          hideDropdownIndicator
        />
      )}
    </Box>
  );
};

type Props = {
  errorMessage: string;
  fieldProps: FieldInputProps<FinancialProject | string>;
  disabled?: boolean;
  sx?: SxProps;
  isClearable?: boolean;
  setFieldTouched?: (field: string, touched?: boolean, shouldValidate?: boolean) => void;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  onChange: (name, value) => void;
};

export default SearchProjectNumber;
