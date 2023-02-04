import { isValidPhoneNumber } from 'react-phone-number-input';
import * as yup from 'yup';
import { ErrorService } from '.';
import { isEmpty } from '../validations';

yup.setLocale({
  mixed: {
    required: ErrorService.MESSAGES.required,
  },
  string: {
    email: ErrorService.MESSAGES.invalidEmail,
    // eslint-disable-next-line
    min: 'This field must be at least ${min} characters',
    // eslint-disable-next-line
    max: 'You have reached the maximum length of ${max} characters',
  },
});

declare module 'yup' {
  interface StringSchema {
    phone(message?: string): StringSchema;
    password(message?: string): StringSchema;
    letterOnly(message?: string): StringSchema;
    numberOnly(message?: string): StringSchema;
    notTrimmable(message?: string): StringSchema;
    username(message?: string): StringSchema;
  }
}

yup.addMethod<yup.StringSchema>(yup.string, 'phone', function (message) {
  return this.test('isValidPhone', message, function (value) {
    const { path, createError } = this;

    if (!value) return true;

    if (!isValidPhoneNumber(value)) {
      return createError({
        path,
        message: message ?? ErrorService.MESSAGES.invalidPhone,
      });
    }

    return true;
  });
});

yup.addMethod<yup.StringSchema>(yup.string, 'password', function (message) {
  return this.test('isValidName', message, function (value) {
    const { path, createError } = this;

    if (!value) return true;

    if (!/.{8,}/.test(value))
      return createError({
        path,
        message: message ?? 'Your password must be at least 8 characters.',
      });
    if (!/[a-z]/.test(value) || !/[A-Z]/.test(value))
      return createError({
        path,
        message: message ?? 'Your password must have at least one upper and lower case letter',
      });
    if (!/[0-9]/.test(value))
      return createError({
        path,
        message: message ?? 'Your password must have at one number',
      });
    if (!/.*[!@#$%?=*&.]/.test(value))
      return createError({
        path,
        message: message ?? 'Your password must have at one special character',
      });

    return true;
  });
});

yup.addMethod<yup.StringSchema>(yup.string, 'username', function (message) {
  return this.test('isValidUsername', message, function (value) {
    const { path, createError } = this;

    if (!value) return true;

    //     allow
    //      characters
    //      number
    //      underscore _
    //      dot .
    //      hyphen -
    //      length: 3-100
    //    not allow
    //      space
    if (value.includes(' ')) {
      return createError({
        path,
        message: message ?? 'Space character is not allowed. Please remove it',
      });
    }
    if (value.length < 3) {
      return createError({
        path,
        message: message ?? 'This field must be at least 3 characters',
      });
    }
    if (value.length > 100) {
      return createError({
        path,
        message: message ?? 'You have reached the maximum length of 100 characters',
      });
    }
    const re = /^([a-zA-Z0-9_.-]){3,100}$/;

    if (!re.test(value)) {
      return createError({
        path,
        message: message ?? ErrorService.MESSAGES.inValidUsername,
      });
    }

    return true;
  });
});

yup.addMethod<yup.StringSchema>(yup.string, 'letterOnly', function (message) {
  return this.test('isValidName', message, function (value) {
    const { path, createError } = this;

    if (!value) return true;

    const re = /^[aA-zZ\s]+$/;

    if (!re.test(value)) {
      return createError({
        path,
        message: message ?? ErrorService.MESSAGES.onlyLetter,
      });
    }

    return true;
  });
});

yup.addMethod(yup.string, 'numberOnly', function () {
  return this.matches(/^\d+$/, 'The field should have digits only');
});

yup.addMethod<yup.StringSchema>(yup.string, 'notTrimmable', function (message) {
  return this.test('isValidString', message, function (value) {
    const { path, createError } = this;

    if (!value) return true;

    if (/(^\s+|\s+$)/.test(value)) {
      return createError({
        path,
        message: message ?? ErrorService.MESSAGES.notTrimmable,
      });
    }

    return true;
  });
});
yup.addMethod<yup.ArraySchema<any>>(
  yup.array,
  'uniqueOfficerIdentificationNumber',
  function (message, path) {
    return this.test('uniqueOfficerIdentificationNumber', message, function (lists) {
      if (lists.length <= 1) return true;
      for (let i = 0; i < lists.length - 1; i++) {
        for (let j = i + 1; j < lists.length; j++) {
          if (!isEmpty(lists[`${i}`]) && !isEmpty(lists[`${j}`])) {
            if (
              lists[`${i}`].identificationNumberType === lists[`${j}`].identificationNumberType &&
              lists[`${i}`].identificationNumber === lists[`${j}`].identificationNumber
            ) {
              return this.createError({ path: `officers[${j}].${path}`, message });
            }
          }
        }
      }
      return true;
    });
  }
);
yup.addMethod<yup.StringSchema>(yup.string, 'letterAndNumber', function (message) {
  return this.test('isValidName', message, function (value) {
    const { path, createError } = this;

    if (!value) return true;

    if (/.*[!@#$%?=*&.]/.test(value))
      return createError({
        path,
        message: message ?? ErrorService.MESSAGES.onlyLetterAndNumber,
      });
    return true;
  });
});
yup.addMethod<yup.ArraySchema<any>>(
  yup.array,
  'uniqueOfficerIdentificationNumber',
  function (message, path) {
    return this.test('uniqueOfficerIdentificationNumber', message, function (lists) {
      if (lists.length <= 1) return true;
      for (let i = 0; i < lists.length - 1; i++) {
        for (let j = i + 1; j < lists.length; j++) {
          if (!isEmpty(lists[`${i}`]) && !isEmpty(lists[`${j}`])) {
            if (
              lists[`${i}`].identificationNumberType === lists[`${j}`].identificationNumberType &&
              lists[`${i}`].identificationNumber === lists[`${j}`].identificationNumber
            ) {
              return this.createError({ path: `officers[${j}].${path}`, message });
            }
          }
        }
      }
      return true;
    });
  }
);

export default yup;
