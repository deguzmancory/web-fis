import { Box, Divider } from '@mui/material';
import React, { Suspense, useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AnimatedTabPanel, LoadingCommon } from 'src/components/common';
import TabsBar, { TabList } from 'src/components/common/TabsBar';
import { getRoleName, ROLE_NAME } from 'src/queries/Profile/helpers';
import { PIDetail } from 'src/queries/Users/types';
import { isEmpty } from 'src/validations';
import { USER_TYPE_KEY } from '../../enums';
import { CRUUserFormikProps } from '../../helper';
import SectionLayout from '../../../shared/SectionLayout';

import { SEARCH_PROJECT_KEY } from './shared/TableProjects/header';

const CUDetails = React.lazy(() => import('./CUDetails'));
const FADetails = React.lazy(() => import('./FADetails'));
const PIDetails = React.lazy(() => import('./PIDetails'));
const SUDetails = React.lazy(() => import('./SUDetails'));

const UserTypeDetails: React.FC<Props> = ({ initialPIInfo, formikProps, isLoading }) => {
  const location = useLocation();
  const history = useHistory();
  const query = useMemo(() => new URLSearchParams(location.search), [location]);

  const userRoles = useMemo(() => formikProps.values.roles, [formikProps.values.roles]);

  const findPriorityRole = useCallback((userRoles: string[]) => {
    const priorityRoles = [ROLE_NAME.SU, ROLE_NAME.PI, ROLE_NAME.FA, ROLE_NAME.CU];

    return (
      priorityRoles.find((role) => {
        return userRoles.includes(role);
      }) || ''
    );
  }, []);

  const tab = useMemo(
    () =>
      (query.get(USER_TYPE_KEY.TAB) as ROLE_NAME) ||
      (findPriorityRole(userRoles) as ROLE_NAME) ||
      '',
    [query, userRoles, findPriorityRole]
  );

  const onChangeTab = (_e, value) => {
    query.set(USER_TYPE_KEY.TAB, value);
    query.delete(SEARCH_PROJECT_KEY.SEARCH_NAME);
    query.delete(USER_TYPE_KEY.UNLINKED_PROJECT);
    query.delete('sort');
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

  const tabListOptions: TabList[] = useMemo(() => {
    const filterTabList = [
      getTabListOption(ROLE_NAME.SU),
      getTabListOption(ROLE_NAME.PI),
      getTabListOption(ROLE_NAME.FA),
      getTabListOption(ROLE_NAME.CU),
    ];

    return filterTabList;
  }, [getTabListOption]);

  const tabComponent = useMemo(() => {
    if (hasPermission(tab)) {
      switch (tab) {
        case ROLE_NAME.SU:
          return (
            <SUDetails
              initialPIInfo={initialPIInfo}
              formikProps={formikProps}
              isLoading={isLoading}
            />
          );
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
  }, [hasPermission, tab, initialPIInfo, formikProps, isLoading]);

  if (isEmpty(userRoles)) return null;

  return (
    <SectionLayout
      sx={{
        padding: '0 0 16px 0',
      }}
    >
      <TabsBar tabsList={tabListOptions} value={tab} onChange={onChangeTab} />
      <Divider />
      {tabComponent && (
        <Box>
          <AnimatedTabPanel uniqKey={`userType-${tab}`} transitionTime={0.2}>
            <Suspense
              fallback={
                <Box p={3}>
                  <LoadingCommon />
                </Box>
              }
            >
              {tabComponent}
            </Suspense>
          </AnimatedTabPanel>
        </Box>
      )}
    </SectionLayout>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
  initialPIInfo: PIDetail;
};
export default UserTypeDetails;
