import { Box } from '@mui/material';
import { SelectOption } from 'src/components/common/Select';
import { FinancialProject } from 'src/queries/Projects/types';
import { Vendor } from 'src/queries/Vendors';
import { getDateDisplay } from 'src/utils';
import { isEmpty } from 'src/validations';

export const emptyVariousProject = {
  label: <Box>Various</Box>,
  value: {
    name: 'Various',
    number: 'Various',
    ac: null,
    campus: null,
    classification: null,
    endDate: null,
    faCode: null,
    id: null,
    inactive: false,
    piCode: null,
    startDate: null,
    type: null,
  },
  subLabel: null,
};

export const getFinancialProjectOptions = ({
  financialProjects,
}: {
  financialProjects: FinancialProject[];
}): SelectOption[] => {
  if (isEmpty(financialProjects)) return [emptyVariousProject];

  return financialProjects
    .map((project) => ({
      label: (
        <Box>
          <span className="mr-4">{project.number}</span>
          <span>{project.name}</span>
        </Box>
      ),
      value: project,
      subLabel: `(${getDateDisplay(project.startDate)} - ${getDateDisplay(project.endDate)})`,
    }))
    .concat([emptyVariousProject]);
};

export const getVendorOptions = ({ vendors }: { vendors: Vendor[] }): SelectOption[] => {
  if (isEmpty(vendors)) return [];

  return vendors.map((vendor) => ({
    label: (
      <Box>
        <span className="mr-4">{vendor.code}</span>
        <span>{vendor.name}</span>
      </Box>
    ),
    value: vendor,
  }));
};
