import dayjs, { Dayjs, UnitType } from 'dayjs';
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
export const isoFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export const DatePickerDateTimeFormat = 'MM/dd/yyyy hh:mm aa';

export type DateType = string | Date | Dayjs;

/**
 * Get date display
 * @param {string|date|Dayjs} value
 * @param {string} languageCode
 */
export const getDateDisplay = (value: DateType, format = DateFormat) => {
  if (!value) return '';

  return dayjs(value).format(format);
};

/**
 * Get date display
 * @param {string|date|Dayjs} value
 * @param {string} languageCode
 */
export const getEndOfDayDisplay = (value: DateType, format = DateFormat) => {
  if (!value) return '';

  return dayjs(value).endOf('day').format(format);
};

/**
 * Get date display
 * @param {string|date|Dayjs} value
 * @param {string} languageCode
 */
export const getTimeDisplay = (value: DateType) => {
  return dayjs(value).format(TimeFormat);
};

/// dayjs has many cases incorrect format with timezone so using moment-timezone for this case
/// Reference issues : https://github.com/iamkun/dayjs/issues/1827
export const localTimeToHawaii = (dateTime, format = DateFormatDisplayMinute) => {
  if (!dateTime) return null;

  const date = momentTz(dateTime).format(DateFormatWithHour);
  return momentTz(date, DateFormatWithHour).utcOffset('-1000').format(format);
};

export const formatDateUtc = (value: DateType) => {
  if (!value || (typeof value === 'string' && isEmpty(value))) {
    return '';
  } else {
    return dayjs(value).utc().format();
  }
};

export const getDate = (date: DateType) => {
  if (!date) return null;
  return dayjs(date).toDate();
};

export const getFullDayDifference = ({
  startDate,
  endDate,
  unit = 'days',
  float = false,
  fractionDigits = 2,
}: {
  startDate: DateType;
  endDate: DateType;
  float?: boolean;
  unit?: UnitType;
  fractionDigits?: number;
}) => {
  if (!startDate || !endDate) return null;

  const diff = dayjs(endDate).diff(startDate, unit, float);

  if (float) {
    return Number(diff.toFixed(fractionDigits));
  }

  return diff;
};
