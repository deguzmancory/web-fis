import { Box } from '@mui/material';
import { isNil } from 'lodash';
import { COLOR_CODE, NO_OPENER } from 'src/appConfig/constants';
import { BodyRow } from 'src/components/CustomTable/types';
import { Link } from 'src/components/common';
import { NonEmployeeTravelItinerary } from 'src/queries/NonPOPayment/NonEmployeeTravel';
import { calculateTotals, getFullDayDifference } from 'src/utils';
import {
  getPartialDaysFromHours,
  getRateUsingCostAndMetric,
  getTotalNumberMinusNumber,
} from 'src/utils/rcuhUtils';
import { commonColumnStyles } from '../../shared/constants';
import { ITINERARY_ITEM_FORM_KEY } from '../enums';

export const headerRow: BodyRow = {
  isHeaderRow: true,
  style: {
    verticalAlign: 'top',
  },
  columns: [
    {
      content: 'Leg',
      style: {
        padding: '4px',
        width: 30,
      },
    },
    {
      content: 'Destination *',
      style: {
        ...commonColumnStyles,
        width: 125,
      },
    },
    {
      content: '',
      style: {
        ...commonColumnStyles,
        width: 20,
      },
    },
    {
      content: (
        <Box>
          <p>Arrival/Departure</p>
          <p>Date and Time *</p>
        </Box>
      ),
      style: {
        ...commonColumnStyles,
        width: 200,
      },
    },
    {
      content: 'Calc Days',
      style: {
        ...commonColumnStyles,
        width: 60,
      },
    },
    {
      content: 'Minus Days',
      style: {
        ...commonColumnStyles,
        width: 60,
      },
    },
    {
      content: 'Bus Days',
      style: {
        ...commonColumnStyles,
        width: 60,
      },
    },
    {
      content: '',
      style: {
        ...commonColumnStyles,
        width: 20,
      },
    },
    {
      content: (
        <Link
          textSx={{
            color: COLOR_CODE.WHITE,
            fontWeight: 'bold',
            textDecoration: 'underline',
            lineHeight: 1.8,
          }}
          href="https://www.gsa.gov/travel/plan-book/per-diem-rates?gsaredirect=perdiem"
          target="_blank"
          rel={NO_OPENER}
        >
          Fed. Allow Rate
        </Link>
      ),
      style: {
        ...commonColumnStyles,
        width: 110,
      },
    },
    {
      content: 'Actual Rate',
      style: {
        ...commonColumnStyles,
        width: 110,
      },
    },
    {
      content: 'Excess Amount',
      style: {
        ...commonColumnStyles,
        width: 110,
      },
    },
    {
      content: 'Days Claim',
      style: {
        ...commonColumnStyles,
        width: 60,
      },
    },
    {
      content: 'Cost',
      style: {
        ...commonColumnStyles,
        width: 110,
      },
    },
  ],
};

export const calculateDataOfItineraries = ({
  startDepartureDate,
  endArrivalDate,
  itineraries,
  estimatedFlag = false,
}: {
  startDepartureDate: Date;
  endArrivalDate: Date;
  itineraries: NonEmployeeTravelItinerary[];
  estimatedFlag?: boolean;
}): NonEmployeeTravelItinerary[] => {
  const itinerariesLength = itineraries.length;
  let updatedItineraries = structuredClone([...itineraries]);
  let calcDays;

  // if there are no items, then just exit
  if (itinerariesLength < 1) return;

  // if theres only one item,
  // then use the main dep and arrival dates
  if (itinerariesLength === 1) {
    if (!!startDepartureDate && !!endArrivalDate) {
      // this is the logic to calculate the days
      // 1. grab the actual full day difference
      // 2. minus a day for the ends (which we will put back after we decided how much to put back)
      // 3. calculate how much to add using the table provided to travel
      // 4. add back the number of partial days back to the total
      calcDays =
        getFullDayDifference({
          startDate: startDepartureDate,
          endDate: endArrivalDate,
        }) - 1;
      calcDays += getPartialDaysFromHours('home-dept', startDepartureDate);
      calcDays += getPartialDaysFromHours('home-return', endArrivalDate);

      updatedItineraries[0].calcDays = calcDays;
    } else {
      updatedItineraries[0].calcDays = null;
    }

    updateBusDaysOfItinerary(updatedItineraries[0]);

    return updatedItineraries;
  }

  // the first one is special and uses the main dep date, everything else uses the line dept date
  if (startDepartureDate && updatedItineraries[0].departureDate) {
    if (startDepartureDate && updatedItineraries[0].departureDate) {
      calcDays =
        getFullDayDifference({
          startDate: startDepartureDate,
          endDate: updatedItineraries[0].departureDate,
        }) - 1;
      calcDays += getPartialDaysFromHours('home-dept', startDepartureDate);
      calcDays += getPartialDaysFromHours('dest-dept', updatedItineraries[0].departureDate);
      updatedItineraries[0].calcDays = calcDays;
    } else {
      updatedItineraries[0].calcDays = null;
    }
    updateBusDaysOfItinerary(updatedItineraries[0], estimatedFlag);
  }

  // go thru all the other lines and figure out the calc days
  updatedItineraries.forEach((itinerary, index) => {
    //ignore first item
    if (index === 0) return;

    // special case for the very last leg (we calculate using the home arrival vs the current legs departure date)
    if (index === itinerariesLength - 1) {
      if (updatedItineraries[index - 1].departureDate && endArrivalDate) {
        calcDays =
          getFullDayDifference({
            startDate: updatedItineraries[index - 1].departureDate,
            endDate: endArrivalDate,
          }) - 1;
        calcDays += getPartialDaysFromHours(
          'dest-next',
          updatedItineraries[index - 1].departureDate
        );
        calcDays += getPartialDaysFromHours('home-return', endArrivalDate);
        itinerary.calcDays = calcDays;
      } else {
        itinerary.calcDays = null;
      }
    }
    // otherwise use the prev departure date, and this current legs departure date
    else {
      if (updatedItineraries[index - 1].departureDate && itinerary.departureDate) {
        calcDays =
          getFullDayDifference({
            startDate: updatedItineraries[index - 1].departureDate,
            endDate: itinerary.departureDate,
          }) - 1;
        calcDays += getPartialDaysFromHours(
          'dest-next',
          updatedItineraries[index - 1].departureDate
        );
        calcDays += getPartialDaysFromHours('dest-dept', itinerary.departureDate);
        itinerary.calcDays = calcDays;
      } else {
        itinerary.calcDays = null;
      }
    }

    updateBusDaysOfItinerary(itinerary, estimatedFlag);
  });

  return updatedItineraries;
};

/**
 * Add the minus days and set in the correct fields that should be populated
 * @param itineraryRow
 */
export const updateBusDaysOfItinerary = (
  itineraryRow: NonEmployeeTravelItinerary,
  estimatedFlag = false
) => {
  const minusDays = itineraryRow.minusDays;
  const originalBusDays = itineraryRow.businessDays;

  // need to use the utility otherwise 3.5-2.2 = 1.29999999
  itineraryRow.businessDays = getTotalNumberMinusNumber(itineraryRow.calcDays, minusDays);

  // check if the bus days haven't changed - if they haven't then don't update the days claim
  if (originalBusDays !== itineraryRow.businessDays) {
    itineraryRow.miscDaysClaim = itineraryRow.businessDays;
  }

  // run all the other calculations here as well -
  // decided to put it all together vs splitting it up to try make it as fast as possible?????
  // also to run in the correct order...
  updateCostOfItinerary('trip-misc-cost', itineraryRow);
  updateCostOfItinerary('trip-misc-excess', itineraryRow);

  if (estimatedFlag) {
    updateCostOfItinerary('trip-lodging-cost', itineraryRow);
    updateCostOfItinerary('trip-lodging-excess', itineraryRow);
  } else {
    updateCostOfItinerary('trip-lodging-rate-excess', itineraryRow);
  }
};

export type calculationCostOfItineraryId =
  | 'trip-lodging-rate-excess'
  | 'trip-misc-rate-excess'
  | 'trip-lodging-cost'
  | 'trip-misc-cost'
  | 'trip-lodging-excess'
  | 'trip-misc-excess';

/**
 * Match a calculation id to a specific calculation for an item in an item list
 *
 * @param calculationId
 * @param itineraryRow
 * @returns {*}
 */
export const updateCostOfItinerary = (
  calculationId: calculationCostOfItineraryId,
  itineraryRow: NonEmployeeTravelItinerary
) => {
  switch (calculationId) {
    // calculating the excess amount between the FAR and actual rate in the Travel Screens
    case 'trip-lodging-rate-excess':
      itineraryRow.lodgingRate = getRateUsingCostAndMetric(
        itineraryRow.lodgingCost,
        itineraryRow.lodgingDaysClaim
      );
      itineraryRow.lodgingExcess = getTotalNumberMinusNumber(
        itineraryRow.lodgingRate,
        itineraryRow.lodgingFar,
        {
          noNegativesFlag: true,
        }
      );
      // don't allow negative excess
      if (itineraryRow.lodgingExcess < 0) {
        itineraryRow.lodgingExcess = null;
      }
      break;

    // calculating the excess amount between the FAR and actual rate in the Travel Screens
    case 'trip-misc-rate-excess':
      itineraryRow.miscRate = getRateUsingCostAndMetric(
        itineraryRow.miscCost,
        itineraryRow.miscDaysClaim
      );
      itineraryRow.miscExcess = getTotalNumberMinusNumber(
        itineraryRow.miscRate,
        itineraryRow.miscFar,
        {
          noNegativesFlag: true,
        }
      );
      // don't allow negative excess
      if (itineraryRow.miscExcess < 0) {
        itineraryRow.miscExcess = null;
      }
      break;

    // calculating the cost of a trip line in the Travel Screens
    case 'trip-lodging-cost':
      if (!isNil(itineraryRow.lodgingEstimated) && !isNil(itineraryRow.lodgingDaysClaim)) {
        itineraryRow.lodgingCost = Number(
          (
            Number(itineraryRow.lodgingEstimated || 0) * Number(itineraryRow.lodgingDaysClaim || 0)
          ).toFixed(2)
        );
      } else {
        itineraryRow.lodgingCost = null;
      }
      break;

    // calculating the cost of a trip line in the Travel Screens
    case 'trip-misc-cost':
      if (!isNil(itineraryRow.miscEstimated) && !isNil(itineraryRow.miscDaysClaim)) {
        itineraryRow.miscCost = Number(
          (
            Number(itineraryRow.miscEstimated || 0) * Number(itineraryRow.miscDaysClaim || 0)
          ).toFixed(2)
        );
      } else {
        itineraryRow.miscCost = null;
      }
      break;

    // calculating the excess amount between the FAR and estimated rate in the Travel Screens
    case 'trip-lodging-excess':
      itineraryRow.lodgingExcess = getTotalNumberMinusNumber(
        itineraryRow.lodgingEstimated,
        itineraryRow.lodgingFar,
        {
          noNegativesFlag: true,
        }
      );
      break;

    // calculating the excess amount between the FAR and estimated rate in the Travel Screens
    case 'trip-misc-excess':
      itineraryRow.miscExcess = getTotalNumberMinusNumber(
        itineraryRow.miscEstimated,
        itineraryRow.miscFar,
        {
          noNegativesFlag: true,
        }
      );
      break;
  }
  return itineraryRow;
};

export const calculateItinerariesTotal = (itineraries: NonEmployeeTravelItinerary[]) => {
  const miscDaysClaimTotal = calculateTotals(itineraries, [
    ITINERARY_ITEM_FORM_KEY.MISC_DAYS_CLAIM,
  ]);
  const lodgingDaysClaimTotal = calculateTotals(itineraries, [
    ITINERARY_ITEM_FORM_KEY.LODGING_DAYS_CLAIM,
  ]);
  const miscCostTotal = calculateTotals(itineraries, [ITINERARY_ITEM_FORM_KEY.MISC_COST]);
  const lodgingCostTotal = calculateTotals(itineraries, [ITINERARY_ITEM_FORM_KEY.LODGING_COST]);
  const itinerariesTotal = calculateTotals(itineraries, [
    ITINERARY_ITEM_FORM_KEY.LODGING_COST,
    ITINERARY_ITEM_FORM_KEY.MISC_COST,
  ]);

  return {
    miscDaysClaimTotal,
    lodgingDaysClaimTotal,
    miscCostTotal,
    lodgingCostTotal,
    itinerariesTotal,
  };
};
