import { Autocomplete, CircularProgress, SxProps, TextField } from '@mui/material';
import debounce from 'lodash/debounce';
import React from 'react';
import { isEmpty as isEmptyValue } from 'src/validations';

export interface AutocompleteOption {
  label: string;
  value: string | number;
}

const InputAutocomplete = <TData extends unknown, TValue = TData>({
  value,
  loading,
  options,
  placeholder,
  debounceDelay = 300,
  noOptionsText = 'No Results',
  inputValue,
  size = 'medium',
  disabled = false,
  multiple = false,
  emptyText,
  errorMessage,
  hideDropdownIcon,
  sx,
  onBlur,
  onChange,
  onInputChange,
  onDropdownClose = noop,
  getOptionLabel,
  getOptionValue = (o) => o as unknown as TValue,
  onClear = noop,
  onSearch = noop,
  renderOptionCustom,
}: SearchDropdownBoxProps<TData, TValue>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(debounce(onSearch, debounceDelay), [
    debounceDelay,
    onSearch,
  ]);

  const isEmpty = () => (Array.isArray(value) && !value?.length) || !value;

  const [showEmptyText, setShowEmptyText] = React.useState<boolean>(emptyText && isEmpty());

  const handleInputChange = (_event, text: string) => {
    if (!text || !inputValue) {
      onClear();
      debouncedSearch.cancel();
    }
    onInputChange?.(text);

    if (text && text.length > 1 && !options.some((o) => getOptionLabel(o) === text)) {
      // require min of 2 characters for search
      // select an option triggers text change
      // this check to make sure onSearch is not called after selecting an option
      debouncedSearch(text);
    }
  };

  const handleOnChange = (_event, value: NonNullable<TData>) => {
    onChange(getOptionValue(value));
  };

  const renderOption = (option: TData, _state) => getOptionLabel(option);
  return (
    <Autocomplete<TData, boolean>
      multiple={multiple}
      disableCloseOnSelect={multiple}
      value={value as NonNullable<TData>}
      onChange={handleOnChange}
      // conditional uncontrolled input
      {...(inputValue ? { inputValue } : undefined)}
      // conditional uncontrolled input
      {...(handleInputChange ? { onInputChange: handleInputChange } : undefined)}
      options={options || []}
      renderOption={renderOptionCustom ? renderOptionCustom : renderOption}
      // filterOptions={option => option}
      // filterSelectedOptions
      getOptionLabel={getOptionLabel}
      // PopperComponent={CustomPopperAutocomplete}
      sx={sx}
      renderInput={(params) => (
        <div className="search-dropdown-box-input-container">
          <TextField
            {...params}
            label={placeholder}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            size={size}
            {...(emptyText && showEmptyText
              ? {
                  InputLabelProps: {
                    shrink: true,
                  },
                }
              : undefined)}
            onFocus={() => {
              setShowEmptyText(false);
            }}
            onBlur={(e) => {
              setShowEmptyText(true);
              onBlur?.(e);
            }}
            error={errorMessage === ' ' || isEmptyValue(errorMessage) ? false : true}
            helperText={errorMessage}
          />
          {isEmpty() && emptyText && (
            <span
              className={['search-dropdown-box-empty-text', (showEmptyText && 'show') || ''].join(
                ' '
              )}
            >
              {emptyText}
            </span>
          )}
        </div>
      )}
      noOptionsText={noOptionsText}
      loading={loading}
      onClose={onDropdownClose}
      disabled={disabled}
      {...(hideDropdownIcon ? { popupIcon: null } : undefined)}
    />
  );
};

type SearchDropdownBoxProps<TData extends unknown, TValue extends unknown> = {
  value: TValue;
  loading?: boolean;
  options: TData[];
  placeholder?: string;
  debounceDelay?: number;
  noOptionsText?: string;
  inputValue?: string;
  size?: 'small' | 'medium';
  disabled?: true | false;
  multiple?: boolean;
  emptyText?: string;
  errorMessage?: string;
  hideDropdownIcon?: boolean;
  sx?: SxProps;
  getOptionLabel: (o: TData) => string;
  getOptionValue?: (o: TData) => TValue;
  onSearch?: (search: string) => void;
  onDropdownClose?: () => void;
  onClear?: () => void;
  onInputChange?: (text: string) => void;
  onBlur?: (e) => void;
  onChange: (v: TValue) => void;
  renderOptionCustom?: (option: TData, _state) => React.ReactNode;
};

const noop = () => {};

export default InputAutocomplete;
