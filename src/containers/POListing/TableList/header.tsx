import { Box } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import SearchChips, { ChipsTableColumn } from 'src/components/SearchChips';
import { Select } from 'src/components/common';
import { IRootState } from 'src/redux/store';
import { PO_LIST_QUERY_KEY } from '../enum';
import SearchPendingReviewApprove from './CustomSearch/SearchPendingReviewApprove';
import {
  CustomFilterPOQueryValue,
  documentTypePendingApproveReviewOptions,
  poStatusOptions,
} from './CustomSearch/SearchPendingReviewApprove/helpers';
import { purchasingListType } from './helpers';
import { getOptionLabel } from 'src/utils';

export interface SearchChip {
  id: string;
  key: string;
  value: string;
  label: string;
}

const tableColumnsForChips: ChipsTableColumn[] = [
  {
    name: 'status',
    label: 'Status',
    formatValueFn: (value) => getOptionLabel(poStatusOptions, value),
  },
  {
    name: 'documentType',
    label: 'Document Type',
    formatValueFn: (value) => getOptionLabel(documentTypePendingApproveReviewOptions, value),
  },
  {
    name: 'faReviewer',
    label: 'FA Staff',
  },
  {
    name: 'projectNumber',
    label: 'Project #',
  },
  {
    name: 'piName',
    label: 'PI Name',
  },
];

const HeaderTable: React.FC<Props> = ({ searchValues, currentRole }) => {
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);
  const searchStatusText = React.useMemo(
    () => query.get(PO_LIST_QUERY_KEY.WORKFLOW_STATUS) || '',
    [query]
  );

  const onSearch = (_, value) => {
    if (!value) return;
    query.set(PO_LIST_QUERY_KEY.WORKFLOW_STATUS, value);
    history.push({ search: query.toString() });
  };

  const filteredWorkFlowTypeOptions = React.useMemo(
    () => purchasingListType.filter((item) => item.roles.some((role) => role === currentRole)),
    [currentRole]
  );

  const { status, documentType, ...searchValue } = searchValues;
  const filterValue = { status, documentType };

  return (
    <Box sx={{ mb: 1 }}>
      <Box width={'40%'}>
        <Select
          isClearable={false}
          label="Workflow View"
          hideSearchIcon
          options={filteredWorkFlowTypeOptions}
          value={searchStatusText}
          onChange={onSearch}
        />
      </Box>

      <Box mt={1}>
        <SearchPendingReviewApprove searchValues={searchValues} />
      </Box>

      <Box>
        <SearchChips
          searchValue={searchValue}
          filterValue={filterValue}
          tableColumns={tableColumnsForChips}
        />
      </Box>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    searchValues?: Partial<CustomFilterPOQueryValue>;
  };

const mapStateToProps = (state: IRootState) => ({
  currentRole: state.auth.currentRole,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(HeaderTable));
