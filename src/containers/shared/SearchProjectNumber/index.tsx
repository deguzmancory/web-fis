import { Box } from '@mui/material';
import { FieldInputProps } from 'formik';
import { debounce } from 'lodash';
import React from 'react';
import { EllipsisTooltipInput, Select } from 'src/components/common';
import { SelectOption } from 'src/components/common/Select';
import { getFinancialProjectOptions } from 'src/containers/PurchaseOrderContainer/GeneralInfo/helpers';
import { getSearchProjectsParamsByRole } from 'src/containers/PurchaseOrderContainer/helpers';
import { FinancialProject, useGetFinancialProjects, useProfile } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { RoleService } from 'src/services';

const SearchProjectNumber: React.FC<Props> = ({
  errorMessage,
  disabled = false,
  fieldProps,
  setFieldTouched,
}) => {
  const [searchProjects, setSearchProjects] = React.useState<string>('');
  const [options, setOptions] = React.useState<FinancialProject[]>([]);
  const currentUserRole = RoleService.getCurrentRole() as ROLE_NAME;
  const { profile } = useProfile();

  const {
    financialProjects,
    setParams: setParamsSearchProject,
    isLoading: isLoadingSearchProjects,
  } = useGetFinancialProjects();

  const projectNumberOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchProjects || !searchProjects) {
      return [];
    }

    return getFinancialProjectOptions({
      financialProjects,
    });
  }, [financialProjects, searchProjects, isLoadingSearchProjects]);

  const searchProjectsParams = React.useMemo(
    () => getSearchProjectsParamsByRole({ profile, role: currentUserRole }),
    [currentUserRole, profile]
  );

  // Debouncing search projects inputs
  const debounceSearchProjectsInput = debounce((name, value: string) => {
    if (!value) return;

    setParamsSearchProject({
      search: searchProjects,
      userType: currentUserRole,
      codes: searchProjectsParams?.codes,
      projectNumbers: searchProjectsParams?.projectNumbers,
    });
  }, 300);

  return (
    <Box>
      <EllipsisTooltipInput
        {...fieldProps}
        errorMessage={errorMessage}
        // onChange={debounceSearchProjectsInput}
        hideEllipsisTooltip
        maxLength={4}
        // disabled={disabled || isCUReviewMode}
        required
      />
    </Box>
  );
};

type Props = {
  errorMessage: string;
  disabled?: boolean;
  fieldProps: FieldInputProps<any>;
  setFieldTouched?: any;
};

export default SearchProjectNumber;
