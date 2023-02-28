import dayjs from 'dayjs';
import _ from 'lodash';
import {
  formatPhoneNumber as formatLocalPhoneNumber,
  formatPhoneNumberIntl,
} from 'react-phone-number-input';
import { isEmpty } from 'src/validations';

export const moneyReg = /[\d,]+\.{0,1}\d{0,}/;

export const MoneyInputDetect = (value) => `${value}`.match(moneyReg)?.[0] || '';

export const convertCurrencyInputToString = (value) => {
  return value.replace(/[^0-9.-]+/g, '');
};

export const formatPhoneNumber = (mobile: string) => {
  if (!mobile) return '';
  try {
    if (mobile.startsWith('+1')) return `+1 ${formatLocalPhoneNumber(mobile)}`;
    return formatPhoneNumberIntl(mobile);
  } catch (error) {
    return '';
  }
};

export const formatDate = (value: string, format: string = 'MM/DD/YYYY') => {
  if (!value) return '';

  return dayjs(value).format(format);
};

export const formatDateWithTimeZone = (value: string, format: string = 'MM/DD/YYYY') => {
  var customDayjs = require('dayjs');
  var timezone = require('dayjs/plugin/timezone');
  customDayjs.extend(timezone);
  return customDayjs().tz('US/Hawaii').format(format);
};

export const formatShowSSN = (value: string, from: number = 6) => {
  return `*******${value.slice(from)}`;
};

export const formatMoney = (value: number, defaultValue = '') => {
  if (isNaN(value)) return defaultValue;

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
};

export const formatMoneyInput = (value: number) => {
  if (!value) return '';
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });
};

export const formatStringToNumber = (value: string) => {
  if (isEmpty(value)) return null;
  return Number(value);
};

export const capitalizeWords = (string: string) => {
  return string.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

export const getStartCase = (value: string) => (value ? _.startCase(value.toLowerCase()) : '');

export const getTitleCase = (str: string): string => {
  if (!str) return '';
  return _.startCase(_.toLower(str));
};

export const removeSpecialCharacterFromString = (value: string) => {
  return value.replace(/[^a-zA-Z0-9 ]/g, '');
};
