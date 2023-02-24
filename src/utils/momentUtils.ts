import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import momentTz from 'moment-timezone';
import { isEmpty } from 'src/validations';

dayjs.extend(weekday);

export const DateFormat = 'MM/DD/YYYY';
export const DateFormatWithHour = 'DD/MM/YYYY HH:mm';
export const DateFormatDisplay = 'MMMM DD, YYYY';
export const DateFormatWithYear = 'YYYY-MM-DD';
export const DateFormatDisplayShort = 'MMM DD, YYYY';
export const DateFormatDisplayMinute = 'MM/DD/YYYY hh:mm A';

export const TimeFormat = 'HH:mm';

export const hourDateFormat = 'h:mm:ss a, MMMM DD, YYYY';
export const dateTimeFormat = 'MM/DD/YYYY HH:MM:ss A';
export const monthFormat = 'MMMM DD, YYYY';

/**
 * Get date display
 * @param {string|date|Dayjs} value
 * @param {string} languageCode
 */
export const getDateDisplay = (value: string) => {
  return dayjs(value).format(DateFormat);
};

/**
 * Get date display
 * @param {string|date|Dayjs} value
 * @param {string} languageCode
 */
export const getTimeDisplay = (value: string) => {
  return dayjs(value).format(TimeFormat);
};

/// dayjs has many cases incorrect format with timezone so using moment-timezone for this case
/// Reference issues : https://github.com/iamkun/dayjs/issues/1827
export const localTimeToHawaii = (dateTime, format = DateFormatDisplayMinute) => {
  if (!dateTime) return null;

  const date = momentTz(dateTime).format(DateFormatWithHour);
  return momentTz(date, DateFormatWithHour).utcOffset('-1000').format(format);
};

export const formatDateUtc = (value: Date | string) => {
  if (!value || (typeof value === 'string' && isEmpty(value))) {
    return '';
  } else {
    return dayjs(value).utc().format();
  }
};
