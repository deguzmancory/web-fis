import { Box } from '@mui/material';
import { SelectOption } from 'src/components/common/Select';
import { FinancialProject } from 'src/queries/Projects/types';
import { Vendor } from 'src/queries/Vendors';
import { getDateDisplay, getOptionsByEnum, isString } from 'src/utils';
import { isEmpty } from 'src/validations';

export const VARIOUS_PROJECT_LABEL = 'Various';
export const VARIOUS_PROJECT_VALUE = 'various';
export const VARIOUS_PROJECT_NAME = 'PO WILL USE MORE THAN 1 PROJECT NUMBER';
export enum SHIP_VIA_VALUE {
  LOCAL_DELIVERY = 'Local Delivery',
  WILL_CALL = 'Will-Call',
  BEST_WAY = 'Best Way',
  OTHER = 'Other (Specify)',
}

export const shipViaOptions = getOptionsByEnum(SHIP_VIA_VALUE);

export const emptyVariousProject = {
  label: (
    <Box>
      <span className="mr-4">{VARIOUS_PROJECT_LABEL}</span>
      <span>{VARIOUS_PROJECT_NAME}</span>
    </Box>
  ),
  value: {
    name: VARIOUS_PROJECT_LABEL,
    number: VARIOUS_PROJECT_VALUE,
    ac: null,
    campus: null,
    classification: null,
    endDate: null,
    faCode: null,
    piName: VARIOUS_PROJECT_LABEL,
    id: null,
    inactive: false,
    piCode: null,
    startDate: null,
    type: null,
  },
  subLabel: null,
};

export const isVariousProject = (projectNumber: string | FinancialProject) => {
  if (!projectNumber) return false;

  return typeof projectNumber === 'string'
    ? projectNumber.toLowerCase() === VARIOUS_PROJECT_VALUE
    : projectNumber.number?.toString()?.toLocaleLowerCase() === VARIOUS_PROJECT_VALUE;
};

export const getFinancialProjectOptions = ({
  projects,
}: {
  projects: FinancialProject[];
}): SelectOption[] => {
  if (isEmpty(projects)) return [emptyVariousProject];

  return projects
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
        <div style={{ width: '84%' }}>
          <p>{vendor.name}</p>
          <p className="mt-2">{vendor.name2}</p>
        </div>
      </div>
    ),
    value: vendor,
    subLabel: `${vendor.address1}, ${vendor.address2}${vendor.address3 && `, ${vendor.address3}`}`,
  }));
};

export const getVendorAddress = (vendor: Partial<Vendor>) => {
  if (!vendor) return '';

  const { name2, address1, address2, address3 } = vendor || {};
  const formattedAddress = `${name2 && `${name2}\n`}${address1 && `${address1}\n`}${
    address2 && `${address2}\n`
  }${address3}`;

  return formattedAddress;
};

export const getVendorNameOrVendorCodeOptions = ({
  currentVendorNameOrCode,
  searchedVendorNameOrCodeOptions,
  isLoadingSearchVendors,
}: {
  currentVendorNameOrCode: string | Vendor;
  searchedVendorNameOrCodeOptions: SelectOption[];
  isLoadingSearchVendors: boolean;
}) => {
  const hasVendorNameValueButOptions =
    !!currentVendorNameOrCode &&
    isEmpty(searchedVendorNameOrCodeOptions) &&
    !isLoadingSearchVendors;

  if (hasVendorNameValueButOptions) {
    return isString(currentVendorNameOrCode)
      ? [{ label: currentVendorNameOrCode, value: currentVendorNameOrCode, isDisabled: true }]
      : getVendorOptions({ vendors: [currentVendorNameOrCode] });
  }

  return searchedVendorNameOrCodeOptions;
};
