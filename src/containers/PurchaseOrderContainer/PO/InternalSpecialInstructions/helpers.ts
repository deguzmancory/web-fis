import { getOptionsByEnum } from 'src/utils';

export enum RECORD_OF_COMPETITION_VALUE {
  VERBAL_QUOTATIONS = 'Verbal Quotations',
  WRITTEN_QUOTATIONS = 'Written Quotations (Forward to FA Office)',
  NOT_APPLICABLE = 'Not Applicable',
}

export const recordOfCompetitionOptions = getOptionsByEnum(RECORD_OF_COMPETITION_VALUE);
