import { Accept } from 'react-dropzone';

export const ONE_HOUR = 60 * 60 * 1000;

export const COMMON_TYPE: Accept = {
  'image/png': ['.png'],
  'image/jpg': ['.jpg'],
  'image/jpeg': ['.jpeg'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

export const muiResponsive = {
  MOBILE: '(max-width:600px)',
  TABLET: '(max-width:960px)',
  LARGE_SCREEN: '(max-width:1200px)',
  EXTRA_LARGE_SCREEN: '(max-width:1440px)',
};

export const COLOR_CODE = {
  PRIMARY: '#333333',
  PRIMARY_DARK: '#1f1f1f', // primary 900
  PRIMARY_LIGHT: '#B9B9B9', // primary 300
  SECONDARY: '#0088CC',
  SUCCESS: '#2D934E',
  WARNING: '#E87839',
  DANGER: '#DB0012',
  WHITE: '#fff',
  BACKGROUND: '#f7f8fa',
  INFO: '#0088CC',
  LINK: '#0088CC',
  DISABLED: '#91979E',
  PRIMARY_900: '#1f1f1f',
  PRIMARY_800: '#1f1f1f',
  PRIMARY_700: '#333333',
  PRIMARY_600: '#525252',
  PRIMARY_500: '#787878',
  PRIMARY_400: '#999999',
  PRIMARY_300: '#b9b9b9',
  PRIMARY_200: '#d9d9d9',
  PRIMARY_100: '#ececec',
  PRIMARY_50: '#f8f8f8',
  GRAY: '#686868',
  GRAY_LIGHT: '#cccccc',
  DEFAULT_BORDER: '1px solid #ccc',
  DEFAULT_TABLE_ERROR_BORDER: '3px solid #DB0012',
  DEFAULT_ROW_ERROR_BORDER: '2px solid #DB0012',
};

export const COMMON_STYLE = {
  SMALL_INPUT_HEIGHT: '40px',
};

export enum BOOLEAN {
  true = 'true',
  false = 'false',
}

export const NO_OPENER = 'noopener noreferrer';
export const PARAMS_SPLITTER = ';';
export const US_ZIP_CODE_LENGTH = 5;

export const REGEX = {
  SSN: /^\d{3}-?\d{2}-?\d{4}$/,
  EIN: /^\d{2}-?\d{7}$/,
};

export const ACCEPT_FILE_TYPE: Accept = {
  'image/png': ['.png'],
  'image/jpg': ['.jpg'],
  'image/jpeg': ['.jpeg'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};
