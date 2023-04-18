import { PO_PAYMENT_EQUIPMENT_INVENTORY_OWNERSHIP } from 'src/queries';

export const DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS = 5;
export const NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS_VALUES = [5, 10, 15, 20];

export const ownershipOptions = [
  {
    label: 'University of Hawaii',
    value: PO_PAYMENT_EQUIPMENT_INVENTORY_OWNERSHIP.UNIVERSITY_OF_HAWAII,
  },
  {
    label: 'Fed. Government',
    value: PO_PAYMENT_EQUIPMENT_INVENTORY_OWNERSHIP.FED_GOVERNMENT,
  },
  {
    label: 'Other Agency',
    value: PO_PAYMENT_EQUIPMENT_INVENTORY_OWNERSHIP.OTHER_AGENCY,
  },
];

export const numberOfItemsOptions = [
  {
    label: '5',
    value: DEFAULT_NUMBER_OF_PAYMENT_EQUIPMENT_ITEMS,
  },
  {
    label: '10',
    value: 10,
  },
  {
    label: '15',
    value: 15,
  },
  {
    label: '20',
    value: 20,
  },
];
