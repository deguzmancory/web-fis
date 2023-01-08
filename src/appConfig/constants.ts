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
};

export enum BOOLEAN {
  true = 'true',
  false = 'false',
}

export const NO_OPENER = 'noopener noreferrer';
