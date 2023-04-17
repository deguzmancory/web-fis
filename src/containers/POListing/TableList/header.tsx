import { Box } from '@mui/material';
import { FC, memo, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import SearchChips, { ChipsData } from 'src/components/SearchChips';
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

const POHeaderTable: FC<Props> = ({ searchValues, currentRole, allowSelectWorkflow = true }) => {
  const history = useHistory();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location]);
  const searchStatusText = useMemo(
    () => query.get(PO_LIST_QUERY_KEY.WORKFLOW_STATUS) || '',
    [query]
  );

  const tableColumnsForChips = useMemo<ChipsData[]>(
    () => [
      {
        name: 'number',
        value: searchValues.number,
        type: 'input',
      },
      {
        name: 'projectNumber',
        label: 'Project #',
        value: searchValues.projectNumber,
        type: 'input',
      },
      {
        name: 'vendorName',
        value: searchValues.vendorName,
        type: 'input',
      },
      {
        name: 'faReviewer',
        label: 'FA Staff',
        value: searchValues.faReviewer,
        type: 'input',
      },
      {
        name: 'piName',
        label: 'PI Name',
        value: searchValues.piName,
        type: 'input',
      },
      {
        name: 'modifiedStartDate;modifiedEndDate',
        nameSplitter: ';',
        label: 'Modified Date',
        value: [searchValues.modifiedStartDate, searchValues.modifiedEndDate],
        type: 'dateRange',
      },
      {
        name: 'documentType',
        label: 'Document Type',
        value: searchValues.documentType || [],
        type: 'filter',
        customRenderFn: (value) => getOptionLabel(documentTypePendingApproveReviewOptions, value),
      },
      {
        name: 'status',
        label: 'Status',
        value: searchValues.status || [],
        type: 'filter',
        customRenderFn: (value) => getOptionLabel(poStatusOptions, value),
      },
    ],
    [searchValues]
  );

  const onSearch = (_, value) => {
    if (!value) return;
    query.set(PO_LIST_QUERY_KEY.WORKFLOW_STATUS, value);
    history.push({ search: query.toString() });
  };

  const filteredWorkFlowTypeOptions = useMemo(
    () => purchasingListType.filter((item) => item.roles.some((role) => role === currentRole)),
    [currentRole]
  );

  return (
    <Box sx={{ mb: 1 }}>
      {allowSelectWorkflow && (
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
      )}

      <Box mt={1}>
        <SearchPendingReviewApprove searchValues={searchValues} />
      </Box>

      <Box>
        <SearchChips data={tableColumnsForChips} />
      </Box>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    searchValues?: Partial<CustomFilterPOQueryValue>;
    allowSelectWorkflow?: boolean;
  };

const mapStateToProps = (state: IRootState) => ({
  currentRole: state.auth.currentRole,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(memo(POHeaderTable));
