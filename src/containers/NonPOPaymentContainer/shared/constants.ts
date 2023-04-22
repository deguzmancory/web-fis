import { PMT_PROJECT_LINE_ITEM_KEY } from './enums';

export const commonColumnStyles = {
  padding: '4px',
  paddingRight: 0,
};

export const commonInputColumnStyles = {
  padding: '4px',
};

export const authorizationProjectLineItemsColumnsName = [
  PMT_PROJECT_LINE_ITEM_KEY.PROJECT_NUMBER,
  PMT_PROJECT_LINE_ITEM_KEY.SUB_PROJECT,
  PMT_PROJECT_LINE_ITEM_KEY.BUDGET_CATEGORY,
  PMT_PROJECT_LINE_ITEM_KEY.SUB_BUDGET_CATEGORY,
  PMT_PROJECT_LINE_ITEM_KEY.SERVICE_DATE,
  PMT_PROJECT_LINE_ITEM_KEY.DESCRIPTION,
  PMT_PROJECT_LINE_ITEM_KEY.AMOUNT,
];
