import { BodyRow } from 'src/components/CustomTable/types';
import { TRAVEL_EXPENSES_VALUE } from 'src/queries';
import { commonColumnStyles } from '../../shared/constants';

export const travelExpendituresHeaderRow: BodyRow = {
  isHeaderRow: true,
  style: {
    verticalAlign: 'top',
  },
  columns: [
    {
      content: 'All Travel Expenses',
      style: {
        padding: '4px 4px 4px 16px',
        width: 250,
      },
    },
    {
      content: 'Leg',
      style: {
        ...commonColumnStyles,
        width: 70,
      },
    },
    {
      content: 'Days',
      style: {
        ...commonColumnStyles,
        width: 100,
      },
    },
    {
      content: 'Description/Document Number',
      style: {
        ...commonColumnStyles,
      },
    },
    {
      content: 'Amount',
      style: {
        ...commonColumnStyles,
        width: 120,
      },
    },
  ],
};

export const travelExpensesOptions = [
  { label: 'Airfare', value: TRAVEL_EXPENSES_VALUE.AIRFARE },
  { label: 'Automobile Rental', value: TRAVEL_EXPENSES_VALUE.AUTOMOBILE },
  { label: 'Baggage', value: TRAVEL_EXPENSES_VALUE.BAGGAGE },
  { label: 'Bus Fares', value: TRAVEL_EXPENSES_VALUE.BUS },
  { label: 'Conference Fees', value: TRAVEL_EXPENSES_VALUE.CONFERENCE },
  { label: 'Gas', value: TRAVEL_EXPENSES_VALUE.GAS },
  { label: 'Hotel Taxes', value: TRAVEL_EXPENSES_VALUE.HOTEL_TAXES },
  { label: 'Internet', value: TRAVEL_EXPENSES_VALUE.INTERNET },
  { label: 'Parking', value: TRAVEL_EXPENSES_VALUE.PARKING },
  { label: 'Taxi', value: TRAVEL_EXPENSES_VALUE.TAXI },
  { label: 'Telephone Fees', value: TRAVEL_EXPENSES_VALUE.TELEPHONE },
  { label: 'Other', value: TRAVEL_EXPENSES_VALUE.OTHER },
];
