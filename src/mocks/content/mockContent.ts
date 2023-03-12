import { SHIP_VIA } from 'src/queries/Contents/enums';
import { Content } from 'src/redux/common/types';

export const ShipViaContent: Content[] = [
  {
    id: 1,
    createdAt: '2023-02-24T04:38:48.000Z',
    updatedAt: '2023-02-24T04:38:48.000Z',
    displayName: SHIP_VIA.LOCAL_DELIVERY,
    value: SHIP_VIA.LOCAL_DELIVERY,
  },
  {
    id: 2,
    createdAt: '2023-02-24T04:38:48.000Z',
    updatedAt: '2023-02-24T04:38:48.000Z',
    displayName: SHIP_VIA.WILL_CALL,
    value: SHIP_VIA.WILL_CALL,
  },
  {
    id: 3,
    createdAt: '2023-02-24T04:38:48.000Z',
    updatedAt: '2023-02-24T04:38:48.000Z',
    displayName: SHIP_VIA.BEST_WAY,
    value: SHIP_VIA.BEST_WAY,
  },
  {
    id: 4,
    createdAt: '2023-02-24T04:38:48.000Z',
    updatedAt: '2023-02-24T04:38:48.000Z',
    displayName: SHIP_VIA.OTHER,
    value: SHIP_VIA.OTHER,
  },
];
