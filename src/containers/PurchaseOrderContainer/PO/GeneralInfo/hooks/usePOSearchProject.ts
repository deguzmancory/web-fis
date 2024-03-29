import React from 'react';
import { SelectOption } from 'src/components/common/Select';
import { useGetProfileProjects } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { RoleService } from 'src/services';
import { getFinancialProjectOptions } from '../helpers';

export type SearchProjectsType = {
  title: string;
  number: string;
};

const usePOSearchProject = ({ currentProjectTitle, currentProjectNumber }) => {
  const currentUserRole = RoleService.getCurrentRole() as ROLE_NAME;

  const [searchProjects, setSearchProjects] = React.useState<SearchProjectsType>({
    title: '',
    number: '',
  });

  const {
    profileProjects,
    setParams: setParamsSearchProject,
    isLoading: isLoadingSearchProjects,
  } = useGetProfileProjects();

  const searchedProjectTitleOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchProjects || (!searchProjects.title && !currentProjectTitle)) {
      return [];
    }

    return getFinancialProjectOptions({ projects: profileProjects });
  }, [profileProjects, searchProjects.title, currentProjectTitle, isLoadingSearchProjects]);

  const searchedProjectNumberOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchProjects || (!searchProjects.number && !currentProjectNumber)) {
      return [];
    }

    return getFinancialProjectOptions({
      projects: profileProjects,
    });
  }, [profileProjects, searchProjects.number, currentProjectNumber, isLoadingSearchProjects]);

  // fetch options on search title input change
  React.useEffect(() => {
    if (!searchProjects.title) return;

    setParamsSearchProject({
      searchName: searchProjects.title,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchProjects.title, currentUserRole, setParamsSearchProject]);

  // fetch options on search number input change
  React.useEffect(() => {
    if (!searchProjects.number) return;

    setParamsSearchProject({
      searchNumber: searchProjects.number,
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
    searchedProjectTitleOptions,
    searchedProjectNumberOptions,
    setSearchProjects,
  };
};

export default usePOSearchProject;
