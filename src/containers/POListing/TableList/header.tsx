import { Box, Stack } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Select } from 'src/components/common';
import { IRootState } from 'src/redux/store';
import { QUERY_KEY } from '../enum';
import { purchasingListType } from './helpers';

const HeaderTable: React.FC<Props> = ({ searchKey = QUERY_KEY.WORKFLOW_STATUS, currentRole }) => {
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
      <Stack>
        <Box width={'40%'}>
          <Box>
            <Select
              isClearable={false}
              label="Workflow View"
              hideSearchIcon
              options={filteredWorkFlowTypeOptions}
              value={searchStatusText}
              onChange={onSearch}
            />
          </Box>
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
