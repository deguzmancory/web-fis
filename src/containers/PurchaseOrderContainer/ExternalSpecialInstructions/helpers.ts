import { getOptionsByEnum } from 'src/utils';

export enum PRESET_INSTRUCTIONS {
  TRAVEL_AGENCY_REFUND_NOTICE = 'Travel Agency Refund Notice',
  OTHER = 'Other (Specify)',
}

export const presetInstructionOptions = getOptionsByEnum(PRESET_INSTRUCTIONS);
