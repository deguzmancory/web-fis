import { Chip, Stack, Typography } from '@mui/material';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { isEmpty } from 'src/validations';
import { PO_LIST_QUERY_KEY } from '../../containers/POListing/enum';
import { startCase } from 'lodash';
import { isString } from 'src/utils';

const SearchChips: React.FC<Props> = ({ searchValue, filterValue, tableColumns = [] }) => {
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);

  const searchKeys = React.useMemo(() => Object.keys(searchValue) || [], [searchValue]);
  const filterKeys = React.useMemo(() => Object.keys(filterValue) || [], [filterValue]);

  const searchChips: SearchChip[] = React.useMemo(() => {
    const searchInputChips: SearchChip[] = Object.entries(searchValue).reduce(
      (prevValue, [key, value], index) => {
        if (!value) return prevValue;

        const columnData = tableColumns.find((column) => column.name === key);
        const formattedValue = columnData?.formatValueFn ? columnData?.formatValueFn(value) : value;

        const label = (
          <Stack direction={'row'} alignItems={'center'}>
            <Typography variant="body2" mr={'4px'}>
              {columnData?.label || startCase(key)}:
            </Typography>

            {isString(formattedValue) ? (
              <Typography variant="body2">{formattedValue}</Typography>
            ) : (
              formattedValue
            )}
          </Stack>
        );

        return [
          ...prevValue,
          {
            id: `${key}-${index}`,
            key,
            value,
            label,
          },
        ];
      },
      []
    );

    const filterChips: SearchChip[] = Object.entries(filterValue).reduce(
      (prevValue, [key, value], index) => {
        if (isEmpty(value)) return prevValue;

        const columnData = tableColumns.find((column) => column.name === key);

        const splitFilterChips =
          value.split(',').map((filterItemValue) => {
            const formattedValue = columnData?.formatValueFn
              ? columnData?.formatValueFn(filterItemValue)
              : filterItemValue;

            const label = (
              <Stack direction={'row'} alignItems={'center'}>
                <Typography variant="body2" mr={'4px'}>
                  {columnData?.label || startCase(key)}:
                </Typography>
                {isString(formattedValue) ? (
                  <Typography variant="body2">{formattedValue}</Typography>
                ) : (
                  formattedValue
                )}
              </Stack>
            );

            return {
              key,
              id: `${key}-${filterItemValue}-${index}`,
              value: filterItemValue,
              label: label,
            };
          }) || [];

        return [...prevValue, ...splitFilterChips];
      },
      []
    );

    return [...searchInputChips, ...filterChips];
  }, [searchValue, filterValue, tableColumns]);

  const handleRemoveSearchFilter = React.useCallback(
    (searchChip: SearchChip) => {
      const removeKey = searchChip.key as PO_LIST_QUERY_KEY;

      if (searchKeys.includes(removeKey)) {
        query.delete(removeKey);
        history.push({ search: query.toString() });
        return;
      }

      if (filterKeys.includes(removeKey)) {
        // eslint-disable-next-line security/detect-object-injection
        const filterItems = filterValue?.[removeKey]?.split(',') || [];
        const updatedFilterValue = filterItems
          .filter((item) => item !== searchChip.value)
          .join(',');

        if (!updatedFilterValue) {
          query.delete(removeKey);
        } else {
          query.set(removeKey, updatedFilterValue);
        }

        history.push({ search: query.toString() });
      }
    },
    [searchKeys, filterKeys, query, history, filterValue]
  );

  return (
    <Stack direction={'row'} flexWrap={'wrap'}>
      {searchChips.map((searchChip) => (
        <Chip
          key={searchChip.id}
          sx={{ m: '4px' }}
          label={searchChip.label}
          onDelete={() => handleRemoveSearchFilter(searchChip)}
        />
      ))}
    </Stack>
  );
};

export interface SearchChip {
  id: string;
  key: string;
  value: string;
  label: React.ReactNode;
}

export interface ChipsTableColumn {
  name: string;
  label: string;
  formatValueFn?: (value: any) => React.ReactNode;
}

type Props = {
  searchValue: Object; //object should have keys match with name of TableColumns
  filterValue: Object; //object should have keys match with name of TableColumns
  tableColumns?: ChipsTableColumn[]; //TableColumns includes names, labels and formatFn of searchValue and filterValues
};

export default React.memo(SearchChips);
