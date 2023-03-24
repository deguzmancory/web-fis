import { Box } from '@mui/material';
import { SelectOption } from 'src/components/common/Select';
import { FinancialProject } from 'src/queries';
import { getDateDisplay } from 'src/utils';
import { isEmpty } from 'src/validations';

export const getFinancialProjectNumberOptions = ({
  financialProjects,
}: {
  financialProjects: FinancialProject[];
}): SelectOption[] => {
  if (isEmpty(financialProjects)) return [];

  return financialProjects.map((project) => ({
    label: (
      <Box>
        <span className="mr-4">{project.number}</span>
        <span>{project.name}</span>
      </Box>
    ),
    value: project,
    subLabel: `(${getDateDisplay(project.startDate)} - ${getDateDisplay(project.endDate)})`,
  }));
};
