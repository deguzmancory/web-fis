import dayjs from 'dayjs';
import { isNumber } from 'lodash';
import { DateType } from './dayjsUtils';

export type PartialDateFromHourType = 'home-dept' | 'home-return' | 'dest-dept' | 'dest-next';

/**
 * Get the number of days this day is worth depending how many hours have passed -
 * use the table supplied to the travel form.
 *
 * HAWAII DEPARTURE/ RETURN PARTIAL DAY PER DIEM SCHEDULE
 *  Time of                     Allowed on day of:
 *  Departure/ Return           Departure            Return
 *  12:01 a.m. - 6:00 a.m.      1 day                1/4 day
 *  6:01 a.m. - Noon            3/4 day              1/2 day
 *  12:01 p.m. - 6:00 p.m.      1/2 day              3/4 day
 *  6:01 p.m. - Midnight        1/4 day              1 day
 *
 *
 * BUSINESS DESTINATION PARTIAL DAY PER DIEM SCHEDULE
 * Time of                  Partial Day Assigned to:
 * Departure/ Return        Destination                  Next Destination
 * 12:01 a.m. - 6:00 a.m.   1/4 day                      3/4 day
 * 6:01 a.m. - Noon         1/2 day                      1/2 day
 * 12:01 p.m. - 6:00 p.m.   3/4 day                      1/4 day
 * 6:01 p.m. - Midnight     1 day                        0 day
 *
 * @param type
 * @param date
 * @returns {number}
 */
export const getPartialDaysFromHours = (type: PartialDateFromHourType, date: DateType) => {
  let dt = dayjs(date);
  let hours = dt.hour();
  let minutes = dt.minute();

  switch (type) {
    case 'home-dept':
      // special case for 12:00 it actually counts this as midnight of the same day vs, the start of the next day
      if (hours === 0 && minutes === 0) {
        return 0.25;
      }
      // 12:01 - 6:00am
      else if (hours < 6 || (hours === 6 && minutes === 0)) {
        return 1;
      }
      // 6:01 am to 12:00pm
      else if (hours < 12 || (hours === 12 && minutes === 0)) {
        return 0.75;
      }
      // 12:01 to 6:00pm
      else if (hours < 18 || (hours === 18 && minutes === 0)) {
        return 0.5;
      } else {
        return 0.25;
      }

    // the order you choose here matters greatly, less than vs greater than
    // because hours are floored. so 6:40 am turns into just 6, etc...
    case 'home-return':
      // special case for 12:00 it actually counts this as midnight of the same day vs, the start of the next day
      if (hours === 0 && minutes === 0) {
        return 1;
      }
      // 12:01 - 6:00am
      else if (hours < 6 || (hours === 6 && minutes === 0)) {
        return 0.25;
      }
      // 6:01 am to 12:00pm
      else if (hours < 12 || (hours === 12 && minutes === 0)) {
        return 0.5;
      }
      // 12:01 to 6:00pm
      else if (hours < 18 || (hours === 18 && minutes === 0)) {
        return 0.75;
      } else {
        return 1;
      }

    case 'dest-dept':
      // special case for 12:00 it actually counts this as midnight of the same day vs, the start of the next day
      if (hours === 0 && minutes === 0) {
        return 1;
      }
      // 12:01 - 6:00am
      else if (hours < 6 || (hours === 6 && minutes === 0)) {
        return 0.25;
      }
      // 6:01 am to 12:00pm
      else if (hours < 12 || (hours === 12 && minutes === 0)) {
        return 0.5;
      }
      // 12:01 to 6:00pm
      else if (hours < 18 || (hours === 18 && minutes === 0)) {
        return 0.75;
      } else {
        return 1;
      }

    case 'dest-next':
      // special case for 12:00 it actually counts this as midnight of the same day vs, the start of the next day
      if (hours === 0 && minutes === 0) {
        return 0;
      }
      // 12:01 - 6:00am
      else if (hours < 6 || (hours === 6 && minutes === 0)) {
        return 0.75;
      }
      // 6:01 am to 12:00pm
      else if (hours < 12 || (hours === 12 && minutes === 0)) {
        return 0.5;
      }
      // 12:01 to 6:00pm
      else if (hours < 18 || (hours === 18 && minutes === 0)) {
        return 0.25;
      } else {
        return 0;
      }

    default:
      return 0;
  }
};

/**
 * Subtract a number from another number if the second number exists
 * if noNegativesFlag is set, then pass back empty if the number is negative
 *
 *
 * This function has to take possibly any kind of garbage input
 *
 */
export const getTotalNumberMinusNumber = (
  firstNumber: number,
  secondNumber: number,
  options = { noNegativesFlag: false }
): number => {
  // if there is no total, then just display nothing
  if (!isNumber(firstNumber)) {
    return null;
  }

  // if there is no minus , but theres total, display the total
  if (!isNumber(secondNumber)) {
    return Number(firstNumber);
  }

  // if there is minus and total, then compute the difference
  const total = Number((firstNumber - secondNumber).toFixed(2));
  // don't allow negatives if this flag has been set
  if (options.noNegativesFlag && total < 0) {
    return null;
  }

  return total;
};

export const getRateUsingCostAndMetric = (cost, metric) => {
  if (cost !== undefined && metric !== undefined) {
    // if the values don't parse to numbers return empty
    if (!isNumber(cost) || !isNumber(metric)) {
      return null;
    }
    // special case for dividing by zero
    else if (metric === 0) {
      return null;
    } else {
      return Number((cost / metric).toFixed(2));
    }
  }
  // if either is null/undefined, then return empty
  else {
    return null;
  }
};
