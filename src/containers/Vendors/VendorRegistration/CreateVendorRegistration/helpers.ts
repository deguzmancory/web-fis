import { getOptionsByEnum } from 'src/utils';
import { VENDOR_OPTION_VALUE } from './enums';

export const vendorOptions = getOptionsByEnum(VENDOR_OPTION_VALUE).slice(0, -1); //remove last item (OTHER) for custom input field inline purpose
