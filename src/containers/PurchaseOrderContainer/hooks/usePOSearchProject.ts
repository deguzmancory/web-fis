import React from 'react';
import { SelectOption } from 'src/components/common/Select';
import { useProfile } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { useGetFinancialProjects } from 'src/queries/Projects';
import { RoleService } from 'src/services';
import { getFinancialProjectOptions } from '../GeneralInfo/helpers';
import { getSearchProjectsParamsByRole } from '../helpers';

export type SearchProjectsType = {
  title: string;
  number: string;
};

const usePOSearchProject = ({ currentProjectTitle, currentProjectNumber }) => {
  const currentUserRole = RoleService.getCurrentRole() as ROLE_NAME;

  const { profile } = useProfile();

  const [searchProjects, setSearchProjects] = React.useState<SearchProjectsType>({
    title: '',
    number: '',
  });

  const {
    financialProjects,
    setParams: setParamsSearchProject,
    isLoading: isLoadingSearchProjects,
  } = useGetFinancialProjects();

  const projectTitleOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchProjects || (!searchProjects.title && !currentProjectTitle)) {
      return [];
    }

    return getFinancialProjectOptions({ financialProjects });
  }, [financialProjects, searchProjects.title, currentProjectTitle, isLoadingSearchProjects]);

  const projectNumberOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchProjects || (!searchProjects.number && !currentProjectNumber)) {
      return [];
    }

    return getFinancialProjectOptions({
      financialProjects,
    });
  }, [financialProjects, searchProjects.number, currentProjectNumber, isLoadingSearchProjects]);

  const searchProjectsParams = React.useMemo(
    () => getSearchProjectsParamsByRole({ profile, role: currentUserRole }),
    [currentUserRole, profile]
  );

  // fetch options on search title input change
  React.useEffect(() => {
    if (!searchProjects.title) return;

    setParamsSearchProject({
      searchName: searchProjects.title,
      userType: currentUserRole,
      codes: searchProjectsParams?.codes || '',
      projectNumbers: searchProjectsParams?.projectNumbers || '',
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchProjects.title, currentUserRole, setParamsSearchProject]);

  // fetch options on search number input change
  React.useEffect(() => {
    if (!searchProjects.number) return;

    setParamsSearchProject({
      searchNumber: searchProjects.number,
      userType: currentUserRole,
      codes: searchProjectsParams?.codes,
      projectNumbers: searchProjectsParams?.projectNumbers,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchProjects.number, currentUserRole, setParamsSearchProject]);

  // fetch project first mounted with data from get PO response
  React.useEffect(() => {
    if (!!currentProjectNumber && typeof currentProjectNumber === 'string') {
      setParamsSearchProject({
        searchNumber: currentProjectNumber,
      });

      return;
    }

    if (!!currentProjectTitle && typeof currentProjectTitle === 'string') {
      setParamsSearchProject({
        searchName: currentProjectTitle,
      });
    }
  }, [currentProjectNumber, currentProjectTitle, setParamsSearchProject]);

  // fetch project first mounted when just back from additional forms
  React.useLayoutEffect(() => {
    if (!!currentProjectNumber && typeof currentProjectNumber !== 'string') {
      setParamsSearchProject({
        searchNumber: currentProjectNumber.number,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoadingSearchProjects,
    projectTitleOptions,
    projectNumberOptions,
    setSearchProjects,
  };
};

export default usePOSearchProject;
