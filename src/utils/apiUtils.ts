import { CancelToken } from 'apisauce';
import appConfig from 'src/appConfig';
import { isEmpty } from 'src/validations';

export function newCancelToken(timeout = appConfig.CONNECTION_TIMEOUT) {
  const source = CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, timeout);

  return { cancelToken: source.token };
}

export const stringify = (params: { [key: string]: number | string | string[] }) => {
  let result = '';

  if (!params) return '';

  Object.keys(params).forEach((key) => {
    if (!isEmpty(params[`${key}`])) {
      if (Array.isArray(params[`${key}`])) {
        let array = params[`${key}`] as string[];
        array.forEach((param: string) => {
          result += `&${key}=${encodeURIComponent(param)}`;
        });
      } else {
        result += `&${key}=${encodeURIComponent(params[`${key}`].toString())}`;
      }
    }
  });

  result = result.replace(/^&/, '');

  return result;
};
