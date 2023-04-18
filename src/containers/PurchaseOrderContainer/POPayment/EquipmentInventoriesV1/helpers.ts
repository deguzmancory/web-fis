import { PO_PAYMENT_EQUIPMENT_INVENTORY_OWNERSHIP } from 'src/queries';

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
