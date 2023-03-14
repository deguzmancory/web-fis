import { Box } from '@mui/material';
import { SelectOption } from 'src/components/common/Select';
import { FinancialProject } from 'src/queries/Projects/types';
import { Vendor } from 'src/queries/Vendors';
import { getDateDisplay } from 'src/utils';
import { isEmpty } from 'src/validations';

export const VARIOUS_PROJECT_VALUE = 'Various';
export const VARIOUS_PROJECT_NAME = 'PO WILL USE MORE THAN 1 PROJECT NUMBER';

export const emptyVariousProject = {
  label: (
    <Box>
      <span className="mr-4">{VARIOUS_PROJECT_VALUE}</span>
      <span>{VARIOUS_PROJECT_NAME}</span>
    </Box>
  ),
  value: {
    name: VARIOUS_PROJECT_VALUE,
    number: VARIOUS_PROJECT_VALUE,
    ac: null,
    campus: null,
    classification: null,
    endDate: null,
    faCode: null,
    piName: VARIOUS_PROJECT_VALUE,
    id: null,
    inactive: false,
    piCode: null,
    startDate: null,
    type: null,
  },
  subLabel: null,
};

export const isVariousProject = (projectNumber: string) => {
  return projectNumber === VARIOUS_PROJECT_VALUE;
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
      <div
        style={{
          display: 'flex',
        }}
      >
        <p style={{ width: '12%' }}>{vendor.code}</p>
        <p style={{ width: '8%' }}>{vendor.w9}</p>
        <p style={{ width: '84%' }}>{vendor.name}</p>
      </div>
    ),
    value: vendor,
    subLabel: `${vendor.address1}, ${vendor.address2}${vendor.address3 && `, ${vendor.address3}`}`,
  }));
};
