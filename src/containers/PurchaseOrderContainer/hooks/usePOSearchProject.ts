import React from 'react';
import { PARAMS_SPLITTER } from 'src/appConfig/constants';
import { SelectOption } from 'src/components/common/Select';
import { useProfile } from 'src/queries';
import { isPI, ROLE_NAME } from 'src/queries/Profile/helpers';
import { useGetFinancialProjects } from 'src/queries/Projects';
import { RoleService } from 'src/services';
import { getFinancialProjectOptions } from '../GeneralInfo/helpers';

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
  } = useGetFinancialProjects({
    enabled:
      !!searchProjects.title ||
      !!searchProjects.number ||
      !!currentProjectTitle ||
      !!currentProjectNumber,
  });

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

  const getSearchProjectsParamsByRole = React.useCallback(
    (role: ROLE_NAME): { codes: string; projectNumbers: string } | null => {
      let roleInfo;

      switch (role) {
        case ROLE_NAME.PI:
          roleInfo = profile.fisPiInfo;
          break;
        case ROLE_NAME.SU:
          roleInfo = profile.fisSuInfo;
          break;

        default:
          break;
      }

      if (!roleInfo) return null;

      const codes = isPI(role)
        ? profile.fisPiInfo.piCode
        : roleInfo.userFisCodes?.map((code) => code.code).join(PARAMS_SPLITTER) ?? '';
      const projectNumbers =
        roleInfo.userFisProjects?.map((project) => project.projectNumber).join(PARAMS_SPLITTER) ??
        '';

      return { codes, projectNumbers };
    },
    [profile]
  );

  const searchProjectsParams = React.useMemo(
    () => getSearchProjectsParamsByRole(currentUserRole),
    [getSearchProjectsParamsByRole, currentUserRole]
  );

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

  return {
    setSearchProjects,
    isLoadingSearchProjects,
    projectTitleOptions,
    projectNumberOptions,
  };
};

export default usePOSearchProject;
