import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import { debounce, get } from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { Button, Select } from 'src/components/common';
import { CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import { UserFICode } from 'src/queries/Contents/types';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { FinancialProject } from 'src/queries/Users/types';
import { useGetFinancialProjects } from 'src/queries/Users/useGetFinancialProjects';
import { isEmpty } from 'src/validations';

const SearchProjects: React.FC<Props> = ({ formikProps, prefix = '', type, isLoading }) => {
  const { values, setFieldValue, getFieldProps } = formikProps;
  const [searchProjects, setSearchProjects] = React.useState('');
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const userFisCodes: UserFICode[] = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`)]
  );
  const userFisProjects = React.useMemo(
    () => get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`)]
  );

  const {
    financialProjects,
    isLoading: isLoadingSearchProjects,
    setParams,
  } = useGetFinancialProjects();

  React.useEffect(() => {
    if (!searchProjects) return;

    setParams({
      search: searchProjects,
      userType: type,
      excludeCodes: userFisCodes.map((code) => code.code).join(','),
      excludeProjects: userFisProjects.map((project) => project.projectNumber).join(','),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchProjects]);

  const handleAddProject = () => {
    if (!searchProjects) return;

    const currentSearchProject: FinancialProject = get(
      values,
      `${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`
    );
    const currentProjects: FinancialProject[] =
      get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [];
    const newProjects = [...currentProjects, currentSearchProject];

    setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`, newProjects);
    setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`, null);
    setSearchProjects('');

    history.push({ search: query.toString() });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchProjectsValue = React.useCallback(debounce(setSearchProjects, 200), []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={10}>
        <Select
          {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`)}
          label="Comprehensive Project Search"
          placeholder={'Search'}
          options={
            financialProjects
              ? financialProjects.map((project) => ({
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
            if (!isEmpty(value)) {
              debounceSearchProjectsValue(value);
            }
          }}
          hideSearchIcon
          isClearable={true}
          onChange={setFieldValue}
          optionWithSubLabel
          isDisabled={isLoading}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={2}
        sx={{
          alignSelf: 'end',
        }}
      >
        <Button onClick={handleAddProject}>Add</Button>
      </Grid>
    </Grid>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
  prefix: string;
  type: ROLE_NAME;
};

export default SearchProjects;
