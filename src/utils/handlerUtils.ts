import dayjs from 'dayjs';
import { Location } from 'history';
import _ from 'lodash';
import { parse } from 'qs';
import shortid from 'shortid';
import { ErrorService, Toastify } from 'src/services';
import { isEmpty } from 'src/validations';

export const emptyFunction = () => {};

export const getRandomId = (): string => shortid.generate();

export const generateArray = (length: number, initial = '') => Array(length).fill(initial);

export const getLocationState = (location: Location<string>) => {
  const locationState = location.state;
  const state = parse(locationState, { ignoreQueryPrefix: true });

  return state;
};

export const getWeekDay = (value: string) => {
  if (!value) return '';
  return dayjs(value).format('dddd');
};

export const getClassNameByStatus = (status) => {
  switch (status) {
    case 'Pending':
      return 'is-status-pending ';
    case 'Completed':
    case 'Approved':
    case 'Active':
      return 'is-status-active';
    case 'Rejected':
      return 'is-status-rejected';
    default:
      return '';
  }
};

export const getYesNoText = (value: boolean) => (value ? 'Yes' : 'No');

export const getNavigateUrl = (url: string) => (url.includes('http') ? url : `https://${url}`);

export const isURLImage = (url: string) => {
  if (isEmpty(url)) return false;

  const hasExtensionImage = [
    '.png',
    '.jpeg',
    '.jpg',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg',
  ].some((ext) => url?.includes(ext));

  if (hasExtensionImage) {
    return true;
  }

  const state = parse(url?.split('?')[1], { ignoreQueryPrefix: false });
  const contentType = state?.['Content-Type'];
  const isImage = ['image/jpg', 'image/jpeg', 'image/png'].includes(contentType as string);

  return isImage;
};

export const handleGetError = (touched, errors, prefix) =>
  _.get(touched, prefix) ? _.get(errors, prefix) : '';

export const waiter = (time: number = 100) =>
  new Promise<Array<any>>((res) => setTimeout(() => res([]), time));

export const trimUrlHasEndDate = (url: string) => {
  const trimUrl = url.split('?')[0];
  const items = trimUrl.split('_');
  return items.slice(0, items.length - 1).join('');
};

export const trimUrl = (url: string) => {
  if (!url) return null;
  return url.split('?')[0];
};

export const handleClick = (callback) => (event: React.MouseEvent<any>) => {
  event.stopPropagation();
  event.preventDefault();
  if (callback) callback(event);
};

//link https://stackoverflow.com/questions/42674473/get-all-keys-of-a-deep-object-in-javascript
export const deepKeys = (t, path = []) => {
  const res =
    Object(t) === t
      ? Object.entries(t) // 1
          .flatMap(([k, v]) => deepKeys(v, [...path, k]))
      : [path.join('.')]; // 2
  return res?.filter((x) => !/\d$/.test(x));
};

export const scrollToTopError = (error: string[]) => {
  if (!isEmpty(error)) {
    const input = document?.querySelector(`[name='${error[0]}']`);
    input?.parentElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'start',
    });
  }
};

export const handleShowErrorMsg = (error: Error, prefix: string = '') => {
  let errorMessage = ErrorService.MESSAGES.unknown;
  if (!isEmpty(error)) {
    if (typeof error?.message === 'string') {
      errorMessage = error?.message;
    } else {
      errorMessage = error?.message[0];
    }
    Toastify.error(`${!isEmpty(prefix) ? `${prefix}: ` : ''}${errorMessage}`);
  }
};
