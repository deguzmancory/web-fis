import { Stack, Switch, Typography } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import React from 'react';
import { USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';

export const isUnlinkedProjectParam = (value: string) => {
  switch (value) {
    case '1':
      return true;
    case '0':
      return false;
    default:
      return false;
  }
};

const SwitchUnlinkedProject = () => {
  const history = useHistory();

  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);

  const unLinkedProject = React.useMemo(
    () => query.get(USER_TYPE_KEY.UNLINKED_PROJECT) || '0',
    [query]
  );

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked ? '1' : '0';
    query.set(USER_TYPE_KEY.UNLINKED_PROJECT, value);
    history.push({ search: query.toString() });
  };

  return (
    <Stack direction="row" alignItems={'center'}>
      <Typography variant="body2">Unlinked Project</Typography>
      <Switch
        color="info"
        onChange={handleSwitchChange}
        checked={isUnlinkedProjectParam(unLinkedProject)}
      />
    </Stack>
  );
};

export default React.memo(SwitchUnlinkedProject);
