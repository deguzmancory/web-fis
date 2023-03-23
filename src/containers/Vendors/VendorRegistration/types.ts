import { VENDOR_REGISTRATION_NAVIGATE_FROM } from './enums';

export interface VendorRegistrationRouteState {
  isFromForm?: VENDOR_REGISTRATION_NAVIGATE_FROM;
  isViewOnly?: boolean;
}
