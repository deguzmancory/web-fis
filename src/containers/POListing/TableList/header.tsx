import { Box } from '@mui/material';
import { FC, memo, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import SearchChips, { ChipsData } from 'src/components/SearchChips';
import { Select } from 'src/components/common';
import { IRootState } from 'src/redux/store';
import { getOptionLabel } from 'src/utils';
import { PO_LIST_QUERY_KEY, PURCHASING_LIST_WORK_FLOW_STATUS_KEY } from '../enum';
import SearchApproved from './CustomSearch/SearchApproved';
import {
  documentTypeApprovedOptions,
  paymentTypeOptions,
} from './CustomSearch/SearchApproved/helpers';
import SearchPendingReviewApprove from './CustomSearch/SearchPendingReviewApprove';
import {
  CustomFilterPOQueryValue,
  poStatusOptions,
} from './CustomSearch/SearchPendingReviewApprove/helpers';
import { purchasingListType } from './helpers';
import SearchPOChangePayment from './CustomSearch/SearchPOChangePayment';

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
        name: 'checkStartDate;checkEndDate',
        nameSplitter: ';',
        label: 'Check Date',
        value: [searchValues.checkStartDate, searchValues.checkEndDate],
        type: 'dateRange',
      },
      {
        name: 'finalApprovedStartDate;finalApprovedEndDate',
        nameSplitter: ';',
        label: 'Approved Date',
        value: [searchValues.finalApprovedStartDate, searchValues.finalApprovedEndDate],
        type: 'dateRange',
      },
      {
        name: 'printedStartDate;printedEndDate',
        nameSplitter: ';',
        label: 'Printed Date',
        value: [searchValues.printedStartDate, searchValues.printedEndDate],
        type: 'dateRange',
      },
      {
        name: 'documentType',
        label: 'Document Type',
        value: searchValues.documentType || [],
        type: 'filter',
        customRenderFn: (value) => getOptionLabel(documentTypeApprovedOptions, value),
      },
      {
        name: 'status',
        label: 'Status',
        value: searchValues.status || [],
        type: 'filter',
        customRenderFn: (value) => getOptionLabel(poStatusOptions, value),
      },
      {
        name: 'paymentType',
        label: 'Payment Type',
        value: searchValues.paymentType || [],
        type: 'filter',
        customRenderFn: (value) => getOptionLabel(paymentTypeOptions, value),
      },
    ],
    [searchValues]
  );

  const onSearch = (_, value) => {
    if (!value) return;
    for (const searchValue in searchValues) {
      // eslint-disable-next-line security/detect-object-injection
      if (searchValues[searchValue] !== undefined) {
        query.delete(searchValue);
      }
    }

    query.set(PO_LIST_QUERY_KEY.WORKFLOW_STATUS, value);
    history.push({ search: query.toString() });
  };

  const filteredWorkFlowTypeOptions = useMemo(
    () => purchasingListType.filter((item) => item.roles.some((role) => role === currentRole)),
    [currentRole]
  );

  const changeFormFilterValue = useMemo(() => {
    switch (searchStatusText) {
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PENDING_PO_DOCUMENTS:
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_PO_DOCUMENTS:
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.ALL_PO_DOCUMENTS:
        return <SearchPendingReviewApprove searchValues={searchValues} />;
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.APPROVED_PO_DOCUMENTS:
        return <SearchApproved searchValues={searchValues} />;
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_CHANGE:
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.PO_PAYMENT:
      case PURCHASING_LIST_WORK_FLOW_STATUS_KEY.OUTSTANDING_PO_DOCUMENTS:
        return (
          <SearchPOChangePayment searchValues={searchValues} searchStatusText={searchStatusText} />
        );
      default:
        return null;
    }
  }, [searchStatusText, searchValues]);

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

      <Box mt={1}>{changeFormFilterValue}</Box>

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
