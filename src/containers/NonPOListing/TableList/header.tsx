import { Box } from '@mui/material';
import { FC, memo, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import SearchChips, { ChipsData } from 'src/components/SearchChips';
import { Select } from 'src/components/common';
import { IRootState } from 'src/redux/store';
import { getOptionLabel } from 'src/utils';
import { NON_PO_LISTING_QUERY_KEY, NON_PO_LISTING_WORK_FLOW_STATUS_KEY } from '../enum';
import SearchApproved from './CustomSearch/SearchApproved';
import SearchPendingReviewApprove from './CustomSearch/SearchPendingReviewApprove';
import {
  CustomFilterPOQueryValue,
  nonPODocumentTypePendingApproveReviewOptions,
  nonPoStatusOptions,
} from './CustomSearch/SearchPendingReviewApprove/helpers';
import { purchasingListType } from './helpers';
import { paymentMethodOptions } from 'src/containers/POListing/TableList/CustomSearch/SearchApproved/helpers';

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
    () => query.get(NON_PO_LISTING_QUERY_KEY.WORKFLOW_STATUS) || '',
    [query]
  );

  const tableColumnsForChips = useMemo<ChipsData[]>(
    () => [
      {
        name: 'requestNumber',
        label: 'Request Number',
        value: searchValues.requestNumber,
        type: 'input',
      },
      {
        name: 'documentNumber',
        label: 'Document Number',
        value: searchValues.documentNumber,
        type: 'input',
      },
      {
        name: 'vendorName',
        value: searchValues.vendorName,
        type: 'input',
      },
      {
        name: 'listedProjectNumber',
        label: 'Project Number',
        value: searchValues.listedProjectNumber,
        type: 'input',
      },
      {
        name: 'faStaffReviewer',
        label: 'FA Staff',
        value: searchValues.faStaffReviewer,
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
        name: 'documentType',
        label: 'Document Type',
        value: searchValues.documentType || [],
        type: 'filter',
        customRenderFn: (value) =>
          getOptionLabel(nonPODocumentTypePendingApproveReviewOptions, value),
      },
      {
        name: 'status',
        label: 'Status',
        value: searchValues.status || [],
        type: 'filter',
        customRenderFn: (value) => getOptionLabel(nonPoStatusOptions, value),
      },
      {
        name: 'paymentMethod',
        label: 'Payment Type',
        value: searchValues.paymentMethod || [],
        type: 'filter',
        customRenderFn: (value) => getOptionLabel(paymentMethodOptions, value),
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

    query.set(NON_PO_LISTING_QUERY_KEY.WORKFLOW_STATUS, value);

    history.push({ search: query.toString() });
  };

  const filteredWorkFlowTypeOptions = useMemo(
    () => purchasingListType.filter((item) => item.roles.some((role) => role === currentRole)),
    [currentRole]
  );

  const changeFormFilterValue = useMemo(() => {
    switch (searchStatusText) {
      case NON_PO_LISTING_WORK_FLOW_STATUS_KEY.PENDING_DOCUMENTS:
      case NON_PO_LISTING_WORK_FLOW_STATUS_KEY.REVIEW_APPROVE_DOCUMENTS:
      case NON_PO_LISTING_WORK_FLOW_STATUS_KEY.ALL_DOCUMENT:
        return <SearchPendingReviewApprove searchValues={searchValues} />;
      case NON_PO_LISTING_WORK_FLOW_STATUS_KEY.APPROVED_DOCUMENTS:
        return <SearchApproved searchValues={searchValues} />;

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
