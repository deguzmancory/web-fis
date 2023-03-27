import { REGEX } from 'src/appConfig/constants';
import { ErrorService, Yup } from 'src/services';
import { CustomShape } from 'src/services/yup';
import { getOptionsByEnum } from 'src/utils';
import { VENDOR_OPTION_VALUE } from './enums';
import {
  isVendorRequiredEinNumber,
  isVendorRequiredRcuhNumber,
  isVendorRequiredTIN,
  isVendorRequiredUhNumber,
} from './helpers';
import { VendorRegistrationFormValue, VendorRegistrationValidationSchema } from './types';

export const initialVendorRegistrationFromData: VendorRegistrationFormValue = {
  //vendor info
  taxPayerName: '',
  firstName: '',
  lastName: '',
  middleName: '',
  suffix: '',
  company: '',
  departmentOrOffice: '',
  addressStreet: '',
  addressCity: '',
  addressState: '',
  addressZip: '',
  addressZip4: '',
  vendorAddressPhoneNumber: '',
  vendorAddressEmail: '',
  //additional for vendor info
  hasIndividualOrBusinessName: false,

  //select vendor
  fedTaxClass: null,
  fedTaxClassOtherDescription: '',

  //assignee info
  // ssn1: '',
  // ssn2: '',
  // ssn3: '',
  // ein1: '',
  // ein2: '',
  uhEmpNumber: '',
  rcuhEmpNumber: '',
  employedByRcuh: '', //TODO: huy_dang emp number or employed?
  employedByUh: '',
  rcuhId: '',
  uhId: '',
  preparedBy: '',
  phoneNumber: '',
  email: '',
  faName: '',
  faEmail: '',
  //additional for assignee info
  ssn: '',
  ein: '',
  hasSsnOrEin: false,

  //file attachments
  fileAttachments: [],

  // TODO: check usage
  formName: '',
  shortFormName: '',
  vendorCode: '',
  fedTaxClassOther: '',
  exemptPayee: '',
  w9FormCompleted: '',
  partOfUsGovernment: '',
  possessionsOfUs: '',
  certification: '',
  travelFlag: null,
  paymentsFlag: null,

  submitted: null,
  oldForm: null,
  vendorBuNumber: '',
  vendorPrNumber: '',
};

export const vendorRegistrationValidationSchema = Yup.object().shape<
  CustomShape<VendorRegistrationValidationSchema>
>(
  {
    //vendor info
    firstName: Yup.string()
      .letterOnly()
      .max(100)
      .notTrimmable()
      .when(['lastName', 'middleName', 'suffix'], {
        is: (lastName, middleName, suffix) => !!lastName || !!middleName || !!suffix,
        then: (schema) => schema.required().typeError(ErrorService.MESSAGES.required),
        otherwise: (schema) => schema.nullable(),
      }),
    lastName: Yup.string()
      .letterOnly()
      .max(100)
      .notTrimmable()
      .when(['firstName', 'middleName', 'suffix'], {
        is: (firstName, middleName, suffix) => !!firstName || !!middleName || !!suffix,
        then: (schema) => schema.required().typeError(ErrorService.MESSAGES.required),
        otherwise: (schema) => schema.nullable(),
      }),
    middleName: Yup.string().letterOnly().notTrimmable().max(5).nullable(),
    addressStreet: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    addressCity: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    addressState: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    addressZip: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    vendorAddressEmail: Yup.string().notTrimmable().email().nullable().optional(),
    vendorAddressPhoneNumber: Yup.string().phone().nullable().optional(),
    //additional for vendor info
    hasIndividualOrBusinessName: Yup.boolean().when(
      ['firstName', 'lastName', 'middleName', 'suffix', 'company'],
      ([firstName, lastName, middleName, suffix, company], schema) => {
        return schema.test(
          'has-individual-or-business-name',
          'Individual or Business/Trade Name is required',
          () => {
            return !!firstName || !!lastName || !!middleName || !!suffix || !!company;
          }
        );
      }
    ),

    //select vendor
    fedTaxClass: Yup.string()
      .required(ErrorService.MESSAGES.selectRequired)
      .typeError(ErrorService.MESSAGES.selectRequired),
    fedTaxClassOtherDescription: Yup.string().when('fedTaxClass', {
      is: (fedTaxClass) => fedTaxClass === VENDOR_OPTION_VALUE.OTHER,
      then: (schema) => schema.required().typeError(ErrorService.MESSAGES.required),
      otherwise: (schema) => schema.nullable(),
    }),

    //assignee info
    ssn: Yup.string().matches(REGEX.SSN, 'SSN must be in the format XXX-XX-XXXX.').nullable(),
    ein: Yup.string()
      .matches(REGEX.EIN, 'EIN must be in the format XX-XXXXXXX.')
      .when(['fedTaxClass'], ([fedTaxClass], schema) => {
        if (isVendorRequiredEinNumber(fedTaxClass)) {
          return schema.required().typeError(ErrorService.MESSAGES.required);
        }
        return schema.nullable();
      }),
    uhId: Yup.string().when(['fedTaxClass'], ([fedTaxClass], schema) => {
      if (isVendorRequiredUhNumber(fedTaxClass)) {
        return schema.required().typeError(ErrorService.MESSAGES.required);
      }
      return schema.nullable();
    }),
    rcuhId: Yup.string().when(['fedTaxClass'], ([fedTaxClass], schema) => {
      if (isVendorRequiredRcuhNumber(fedTaxClass)) {
        return schema.required().typeError(ErrorService.MESSAGES.required);
      }
      return schema.nullable();
    }),
    hasSsnOrEin: Yup.boolean().when(
      ['fedTaxClass', 'ssn', 'ein'],
      ([fedTaxClass, ssn, ein], schema) => {
        if (isVendorRequiredTIN(fedTaxClass)) {
          return schema.test(
            'require-tin',
            'Taxpayer Identification Number (TIN) is required.',
            () => {
              return !!ssn || !!ein;
            }
          );
        }
        return schema.nullable().optional();
      }
    ),
    preparedBy: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    email: Yup.string().notTrimmable().email().required(),
    phoneNumber: Yup.string().phone().required(),
    faName: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    faEmail: Yup.string().notTrimmable().email().required(),
  },
  [['firstName', 'lastName']]
);

export const vendorOptions = getOptionsByEnum(VENDOR_OPTION_VALUE).slice(0, -1); //remove last item (OTHER) for custom input field inline purpose
