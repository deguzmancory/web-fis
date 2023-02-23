import { Box, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { debounce, get } from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { PARAMS_SPLITTER } from 'src/appConfig/constants';
import { Button, Select } from 'src/components/common';
import { CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import { UserFiCode } from 'src/queries/Contents/types';
import { isPI, ROLE_NAME } from 'src/queries/Profile/helpers';
import { FinancialProject } from 'src/queries/Users/types';
import { useGetFinancialProjects } from 'src/queries/Users/useGetFinancialProjects';

const SearchProjects: React.FC<Props> = ({ formikProps, prefix = '', type, isLoading }) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const { values, setFieldValue, getFieldProps } = formikProps;
  const [searchProjects, setSearchProjects] = React.useState('');

  const userFisCodes: UserFiCode[] = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`)]
  );
  const userFisProjects = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`)]
  );
  const currentSearchProject: FinancialProject = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`)]
  );

  const {
    financialProjects,
    isLoading: isLoadingSearchProjects,
    setParams,
  } = useGetFinancialProjects({
    enabled: !!searchProjects,
  });

  const filteredFinancialProjects = React.useMemo(() => {
    if (!searchProjects && !currentSearchProject) {
      return [];
    }

    return financialProjects;
  }, [financialProjects, searchProjects, currentSearchProject]);

  const handleAddProject = () => {
    if (!searchProjects && !currentSearchProject) return;

    const currentProjects: FinancialProject[] =
      get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [];
    const newProjects = [...currentProjects, currentSearchProject];

    setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`, newProjects);
    setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`, null);
    setSearchProjects('');

    //reset data in <TableProjects />
    history.push({ search: query.toString() });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchProjectsValue = React.useCallback(debounce(setSearchProjects, 300), []);

  //search project after debouncing input
  React.useEffect(() => {
    if (!searchProjects) return;

    setParams({
      search: searchProjects,
      userType: type,
      excludeCodes: userFisCodes.map((code) => code.code).join(PARAMS_SPLITTER),
      excludeProjects: userFisProjects
        .map((project) => project.projectNumber)
        .join(PARAMS_SPLITTER),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchProjects]);

  return (
    <Stack direction={'row'}>
      <Select
        {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`)}
        label={
          isPI(type)
            ? 'New Unassigned Project Search (Project not linked to PI Code)'
            : 'Comprehensive Project Search'
        }
        placeholder={'Search'}
        options={
          filteredFinancialProjects
            ? filteredFinancialProjects.map((project) => ({
                label: `${project.number} ${project.name}`,
                value: { projectNumber: project.number },
                subLabel: `(${dayjs(project.startDate).format('MM/DD')} - ${dayjs(
                  project.endDate
                ).format('MM/DD')})`,
              }))
            : []
        }
        isLoading={isLoadingSearchProjects}
        onInputChange={(value: string) => {
          debounceSearchProjectsValue(value);
        }}
        hideSearchIcon
        isClearable={true}
        onChange={setFieldValue}
        optionWithSubLabel
        isDisabled={isLoading}
      />

      <Box alignSelf={'end'} ml={2}>
        <Button onClick={handleAddProject}>Add</Button>
      </Box>
    </Stack>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
  prefix: string;
  type: ROLE_NAME;
};

export default SearchProjects;
