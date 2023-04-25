import { Chip, Stack, Typography } from '@mui/material';
import { FC, useMemo, useCallback, ReactNode, memo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { isEmpty } from 'src/validations';
import { startCase } from 'lodash';
import { getDateDisplay, isString } from 'src/utils';

const ChipLabel = ({ label, value }) => (
  <Stack direction={'row'} alignItems={'center'}>
    <Typography variant="body2" mr={'4px'}>
      {label}:
    </Typography>

    {isString(value) ? <Typography variant="body2">{value}</Typography> : value}
  </Stack>
);

const SearchChips: FC<Props> = ({ data = [] }) => {
  const history = useHistory();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location]);

  const inputItems = useMemo(() => data.filter((item) => item.type === 'input'), [data]);
  const filterItems = useMemo(() => data.filter((item) => item.type === 'filter'), [data]);
  const dateRangeItems = useMemo(() => data.filter((item) => item.type === 'dateRange'), [data]);

  const searchChips: SearchChip[] = useMemo(() => {
    const searchInputChips: SearchChip[] = inputItems.reduce(
      (prevValue, currentInputItems, index) => {
        const { value, name, label, type, nameSplitter, customRenderFn } = currentInputItems;

        if (isEmpty(value)) return prevValue;

        const formattedValue = !!customRenderFn ? customRenderFn(value) : value;

        const chipLabel = <ChipLabel label={label || startCase(name)} value={formattedValue} />;

        return [
          ...prevValue,
          {
            id: `${name}-${index}`,
            name: name,
            value,
            label: chipLabel,
            type: type,
            nameSplitter,
          },
        ];
      },
      []
    );

    const filterChips: SearchChip[] = filterItems.reduce((prevValue, currentFilterItems, index) => {
      const { value, name, label, type, nameSplitter, customRenderFn } = currentFilterItems;

      if (isEmpty(value) || !Array.isArray(value)) return prevValue;

      const splitFilterChips =
        value.map((filterItemValue) => {
          const formattedValue = !!customRenderFn
            ? customRenderFn(filterItemValue)
            : filterItemValue;

          const chipLabel = <ChipLabel label={label || startCase(name)} value={formattedValue} />;

          return {
            name: name,
            id: `${name}-${filterItemValue}-${index}`,
            value: filterItemValue,
            label: chipLabel,
            type: type,
            nameSplitter,
          };
        }) || [];

      return [...prevValue, ...splitFilterChips];
    }, []);

    const dateRangeChips: SearchChip[] = dateRangeItems.reduce(
      (prevValue, currentDateRangeItems, index) => {
        const { value, name, label, type, nameSplitter, customRenderFn } = currentDateRangeItems;

        if (isEmpty(value) || (Array.isArray(value) && value.some((item) => !item)))
          return prevValue;

        const formattedValue = !!customRenderFn
          ? customRenderFn(value)
          : `${
              Array.isArray(value) ? value.map((item) => getDateDisplay(item)).join(' - ') : value
            }`;

        const chipLabel = <ChipLabel label={label || startCase(name)} value={formattedValue} />;

        return [
          ...prevValue,
          {
            id: `${name}-${index}`,
            name: name,
            value,
            label: chipLabel,
            type: type,
            nameSplitter,
          },
        ];
      },
      []
    );

    return [...searchInputChips, ...filterChips, ...dateRangeChips];
  }, [dateRangeItems, filterItems, inputItems]);

  const handleRemoveSearchFilter = useCallback(
    (searchChip: SearchChip) => {
      const { name, value, type, nameSplitter } = searchChip;

      if (type === 'input') {
        if (nameSplitter) {
          name.split(nameSplitter).forEach((nameItem) => {
            query.delete(nameItem);
          });
        } else {
          query.delete(name);
        }

        history.push({ search: query.toString() });
        return;
      }

      if (type === 'filter') {
        const currentFilterItemValues: any[] =
          filterItems?.find((item) => item.name === name)?.value || [];
        const updatedFilterValue = currentFilterItemValues.filter((item) => item !== value);

        if (!updatedFilterValue) {
          if (!!nameSplitter) {
            name.split(nameSplitter).forEach((nameItem) => {
              query.delete(nameItem);
            });
          } else {
            query.delete(name);
          }
        } else {
          if (!!nameSplitter) {
            name.split(nameSplitter).forEach((nameItem) => {
              query.delete(nameItem);
              updatedFilterValue.forEach((item) => {
                query.append(nameItem, item);
              });
            });
          } else {
            query.delete(name);
            updatedFilterValue.forEach((item) => {
              query.append(name, item);
            });
          }
        }

        history.push({ search: query.toString() });
        return;
      }

      if (type === 'dateRange') {
        if (!!nameSplitter) {
          name.split(nameSplitter).forEach((nameItem) => {
            query.delete(nameItem);
          });
        } else {
          query.delete(name);
        }

        history.push({ search: query.toString() });
        return;
      }
    },
    [query, history, filterItems]
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
  name: string;
  value: string;
  label: ReactNode;
  type: ChipValueType;
  nameSplitter?: string;
}

export type ChipValueType = 'filter' | 'input' | 'dateRange';

export interface ChipsData {
  /** Name of param of query.
   *
   * Ex: projectNumber
   *
   * Can using splitter to pass multiple name in case need to delete more than 1 param
   *
   * Ex: name1;name2 (Must define nameSplitter prop to make it works)
   *
   */
  name: string;

  value: any;

  /**
   * input: should be primitive values
   *
   * filter: should be array value
   *
   * dateRange: should have value [string | Date, string | Date], string
   */
  type: ChipValueType;

  /**
   * Define label of chip, or chip will auto get title case of name
   */
  label?: string;

  /**
   * using splitter to pass multiple name in case need to delete more than 1 param
   */
  nameSplitter?: string;

  /**
   * Format the value render inside chip
   * @param value
   * @returns
   */
  customRenderFn?: (value: any) => ReactNode;
}

type Props = {
  data?: ChipsData[];
};

export default memo(SearchChips);
