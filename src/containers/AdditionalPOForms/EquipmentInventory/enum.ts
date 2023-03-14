export enum PO_EQUIPMENT_INVENTORY_FORM_KEY {
  EQUIPMENT_DESCRIPTION = 'equipmentDescription',
  EQUIPMENT_LOCATION = 'equipmentLocation',
  BUILDING_CODE = 'buildingCode',
  DECAL = 'decal',
  DECAL2 = 'decal2',
  PART_OF_FABRICATION = 'Component is part of a Fabrication - an item that is to become part of something being built.',
  FINISHED_PRODUCT_NAME = 'finishedProductName',
  COMPLETED_BY = 'completedBy',
  EQUIPMENT_TYPE = 'equipmentType',
}

export enum EQUIPMENT_TYPE {
  STAND_ALONE = 'standAlone',
  INTERCHANGEABLE = 'interchangeable',
  COMPONENT = 'component',
}

export const optionCheckboxValue = [
  {
    label:
      'Stand-alone - defined as equipment which is $5000 and above and has a life expectancy of at least 1 year.',
    value: EQUIPMENT_TYPE.STAND_ALONE,
  },
  {
    label:
      'Interchangeable Equipment - defined as equipment which is $5000 and above and has a life expectancy of at least 1 year but can be used interchangeably with other equipment and cannot function by itself.',
    value: EQUIPMENT_TYPE.INTERCHANGEABLE,
  },
  {
    label: 'Component - an item that becomes a part of the existing equipment.',
    value: EQUIPMENT_TYPE.COMPONENT,
  },
];

export enum EQUIPMENT_INVENTORY_LABEL {
  PART_OF_FABRICATION = 'Component is part of a Fabrication - an item that is to become part of something being built.',
}
