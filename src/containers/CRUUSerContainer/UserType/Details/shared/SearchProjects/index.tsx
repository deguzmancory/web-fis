import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import { debounce, get } from 'lodash';
import React from 'react';
import { Button, Select } from 'src/components/common';
import { CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import { CRUUserFormikProps } from 'src/containers/CRUUSerContainer/helper';
import { UserFICode } from 'src/queries/Contents/types';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { SearchFinancialProject } from 'src/queries/Users/types';
import { useSearchFinancialProjects } from 'src/queries/Users/useSearchFinancialProjects';
import { isEmpty } from 'src/validations';

const SearchProjects: React.FC<Props> = ({ formikProps, prefix = '', type, isLoading }) => {
  const { values, setFieldValue, getFieldProps } = formikProps;
  const [searchProjects, setSearchProjects] = React.useState('');

  const userFisCodes: UserFICode[] =
    get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`) || [];
  const userFisProjects = get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [];

  const { financialProjects, isLoading: isLoadingSearchProjects } = useSearchFinancialProjects({
    search: searchProjects,
    roleType: type,
    excludeCode: userFisCodes.map((code) => code.code).join(','),
    excludeProject: userFisProjects.map((project) => project.projectNumber).join(','),
  });

  const handleAddProject = () => {
    const currentSearchProject: SearchFinancialProject = get(
      values,
      `${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`
    );
    const currentProjects: SearchFinancialProject[] =
      get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`) || [];
    const newProjects = [...currentProjects, currentSearchProject];

    setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_PROJECTS}`, newProjects);
    setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.CURRENT_SEARCH_PROJECT}`, null);
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
          value={values.fisSuInfo.currentSearchProject}
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
            console.log('value: ', value);
            if (!isEmpty(value)) {
              debounceSearchProjectsValue(value);
            }
          }}
          required
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
