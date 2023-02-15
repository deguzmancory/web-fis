import { Box, Divider } from '@mui/material';
import React, { useMemo, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AnimatedTabPanel } from 'src/components/common';
import TabsBar, { TabList } from 'src/components/common/TabsBar';
import { getRoleName, ROLE_NAME } from 'src/queries/Profile/helpers';
import { isEmpty } from 'src/validations';
import { USER_TYPE_KEY } from '../../enums';
import { CRUUserFormikProps } from '../../helper';
import Layout from '../../layout';
import CUDetails from './CUDetails';
import FADetails from './FADetails';
import PIDetails from './PIDetails';
import SUDetails from './SUDetails';

const UserTypeDetails: React.FC<Props> = ({ formikProps, isLoading }) => {
  const location = useLocation();
  const history = useHistory();

  const query = new URLSearchParams(location.search);
  const tab = (query.get(USER_TYPE_KEY.TAB) as ROLE_NAME) || '';
  const userRoles = formikProps.values.roles;

  const onChangeTab = (_e, value) => {
    query.set(USER_TYPE_KEY.TAB, value);
    history.push({ search: query.toString() });
  };

  const hasPermission = useCallback(
    (role: ROLE_NAME | '') => userRoles.includes(role),
    [userRoles]
  );

  const getTabListOption = useCallback(
    (role: ROLE_NAME | '') => {
      return {
        label: getRoleName(role),
        value: role,
        hidden: !hasPermission(role),
      };
    },
    [hasPermission]
  );

  const tabListOptions: TabList[] = useMemo(
    () => [
      getTabListOption(ROLE_NAME.SU),
      getTabListOption(ROLE_NAME.PI),
      getTabListOption(ROLE_NAME.FA),
      getTabListOption(ROLE_NAME.CU),
    ],
    [getTabListOption]
  );

  const tabComponent = useMemo(() => {
    if (hasPermission(tab)) {
      switch (tab) {
        case ROLE_NAME.SU:
          return <SUDetails formikProps={formikProps} isLoading={isLoading} />;
        case ROLE_NAME.PI:
          return <PIDetails formikProps={formikProps} isLoading={isLoading} />;
        case ROLE_NAME.FA:
          return <FADetails formikProps={formikProps} isLoading={isLoading} />;
        case ROLE_NAME.CU:
          return <CUDetails formikProps={formikProps} />;
        default:
          return null;
      }
    }
    return null;
  }, [hasPermission, tab, formikProps, isLoading]);

  if (isEmpty(userRoles)) return null;

  return (
    <Layout
      sx={{
        padding: '0 0 16px 0',
      }}
    >
      <TabsBar tabsList={tabListOptions} value={tab} onChange={onChangeTab} />
      <Divider />
      {tabComponent && (
        <Box>
          <AnimatedTabPanel uniqKey={`userType-${tab}`} transitionTime={0.2}>
            {tabComponent}
          </AnimatedTabPanel>
        </Box>
      )}
    </Layout>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};
export default UserTypeDetails;
