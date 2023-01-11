import { ErrorService, Toastify } from 'src/services';
import { isEmpty } from 'src/validations';

export const QUERY_KEY = {
  filter: 'filter',
};

export const handleShowErrorMsg = (error: Error) => {
  let errorMessage = ErrorService.MESSAGES.unknown;
  if (!isEmpty(error)) {
    if (typeof error?.message === 'string') {
      errorMessage = error?.message;
    } else {
      errorMessage = error?.message[0];
    }
    Toastify.error(errorMessage);
  }
};
