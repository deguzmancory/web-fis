import { Box, Stack } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Select } from 'src/components/common';
import { IRootState } from 'src/redux/store';
import { PO_LIST_QUERY_KEY } from '../enum';
import { purchasingListType } from './helpers';
import CustomSearchTable from 'src/components/CustomSearchTable';

const HeaderTable: React.FC<Props> = ({
  searchKey = PO_LIST_QUERY_KEY.WORKFLOW_STATUS,
  currentRole,
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location]);

  const searchStatusText = React.useMemo(() => query.get(searchKey) || '', [query, searchKey]);

  const onSearch = (_, value) => {
    if (!value) return;
    query.set(searchKey, value);
    history.push({ search: query.toString() });
  };

  const filteredWorkFlowTypeOptions = React.useMemo(
    () => purchasingListType.filter((item) => item.roles.some((role) => role === currentRole)),
    [currentRole]
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={'row'} justifyContent={'space-between'}>
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
        <Box width={'40%'}>
          <CustomSearchTable label=" " placeholder="Search by PO Number" searchKey="number" />
        </Box>
      </Stack>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    searchKey?: string;
  };

const mapStateToProps = (state: IRootState) => ({
  currentRole: state.auth.currentRole,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderTable);
