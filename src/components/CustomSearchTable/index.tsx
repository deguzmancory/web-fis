import { Clear } from '@mui/icons-material';
import { Box } from '@mui/material';
import { debounce } from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { isEmpty } from 'src/validations';
import { Input } from '../common';

type Props = {
  label?: string;
  placeholder?: string;
  searchKey?: string;
  enableAutoFocus?: boolean;
};

enum QUERY_KEY {
  SEARCH = 'search',
}

const CustomSearchTable: React.FC<Props> = ({
  label = 'Search User Documents',
  placeholder = 'Search',
  searchKey = QUERY_KEY.SEARCH,
  enableAutoFocus = false,
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchText = query.get(searchKey) || '';
  const [searchValue, setSearchValue] = React.useState(searchText || '');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (enableAutoFocus) {
      inputRef.current?.focus();
    }
  }, [enableAutoFocus]);

  const hasValue = !isEmpty(searchText);

  const handleTextChange = (event) => {
    const { value } = event.target;

    setSearchValue(value);
    debounceValue(value);
  };

  const handleClearSearchValue = () => {
    setSearchValue('');
    onSearch('');
  };

  const onSearch = (value: string) => {
    query.set(searchKey, value);
    history.push({ search: query.toString() });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceValue = React.useCallback(debounce(onSearch, 300), []);

  return (
    <Box>
      <Input
        label={label}
        placeholder={placeholder}
        value={searchValue}
        onChange={handleTextChange}
        {...(hasValue && {
          iconComponent: <Clear />,
          onIconClick: handleClearSearchValue,
        })}
        iconPosition="right"
        inputRef={inputRef}
      />
    </Box>
  );
};

export default CustomSearchTable;
