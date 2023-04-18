import { REGEX } from 'src/appConfig/constants';
import { ErrorService, Yup } from 'src/services';
import { CustomShape } from 'src/services/yup';
import { isEmpty } from 'src/validations';
import { VENDOR_OPTION_LABEL, VENDOR_OPTION_VALUE } from './enums';
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
  placeholderFileAttachment: null,

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
    vendorAddressPhoneNumber: Yup.string().usPhone().nullable().optional(),
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
      .required(ErrorService.MESSAGES.required)
      .typeError(ErrorService.MESSAGES.required)
      .test(
        'required-attachment',
        'A W-9 must be attached for all ** categories (UH WH-1 is also acceptable for individuals).',
        (value: VENDOR_OPTION_VALUE, context) => {
          const { fileAttachments } = context.parent;
          if (isVendorRequiredTIN(value) && isEmpty(fileAttachments)) {
            return false;
          }
          return true;
        }
      )
      .test(
        'required-business-or-trade-name',
        'Federal Tax Classification can only be Federal/State Entity for non-individuals.',
        (value: VENDOR_OPTION_VALUE, context) => {
          const { company } = context.parent;
          if (isVendorRequiredEinNumber(value) && !company) {
            return false;
          }
          return true;
        }
      ),

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
    phoneNumber: Yup.string().usPhone().required(),
    faName: Yup.string().required().typeError(ErrorService.MESSAGES.required),
    faEmail: Yup.string().notTrimmable().email().required(),
  },
  [['firstName', 'lastName']]
);

export const vendorOptions = [
  {
    label: VENDOR_OPTION_LABEL.INDIVIDUAL_SOLE_PROPRIETOR_OR_SINGLE_MEMBER_LLC,
    value: VENDOR_OPTION_VALUE.INDIVIDUAL_SOLE_PROPRIETOR_OR_SINGLE_MEMBER_LLC,
  },
  {
    label: VENDOR_OPTION_LABEL.C_CORPORATION,
    value: VENDOR_OPTION_VALUE.C_CORPORATION,
  },
  {
    label: VENDOR_OPTION_LABEL.S_CORPORATION,
    value: VENDOR_OPTION_VALUE.S_CORPORATION,
  },
  {
    label: VENDOR_OPTION_LABEL.LLC_C_CORPORATION,
    value: VENDOR_OPTION_VALUE.LLC_C_CORPORATION,
  },
  {
    label: VENDOR_OPTION_LABEL.LLC_S_CORPORATION,
    value: VENDOR_OPTION_VALUE.LLC_S_CORPORATION,
  },
  {
    label: VENDOR_OPTION_LABEL.LLC_PARTNERSHIP,
    value: VENDOR_OPTION_VALUE.LLC_PARTNERSHIP,
  },
  {
    label: VENDOR_OPTION_LABEL.PARTNERSHIP,
    value: VENDOR_OPTION_VALUE.PARTNERSHIP,
  },
  {
    label: VENDOR_OPTION_LABEL.TRUST_OR_ESTATE,
    value: VENDOR_OPTION_VALUE.TRUST_OR_ESTATE,
  },
  {
    label: VENDOR_OPTION_LABEL.RCUH_STUDENT_EMPLOYEE,
    value: VENDOR_OPTION_VALUE.RCUH_STUDENT_EMPLOYEE,
  },
  {
    label: VENDOR_OPTION_LABEL.RCUH_EMPLOYEE,
    value: VENDOR_OPTION_VALUE.RCUH_EMPLOYEE,
  },
  {
    label: VENDOR_OPTION_LABEL.UH_GRADUATE_ASSISTANT_EMPLOYEE,
    value: VENDOR_OPTION_VALUE.UH_GRADUATE_ASSISTANT_EMPLOYEE,
  },
  {
    label: VENDOR_OPTION_LABEL.UH_STUDENT_EMPLOYEE,
    value: VENDOR_OPTION_VALUE.UH_STUDENT_EMPLOYEE,
  },
  {
    label: VENDOR_OPTION_LABEL.UH_EMERITUS_FACULTY,
    value: VENDOR_OPTION_VALUE.UH_EMERITUS_FACULTY,
  },
  {
    label: VENDOR_OPTION_LABEL.UH_NON_COMPENSATED_APPOINTEE,
    value: VENDOR_OPTION_VALUE.UH_NON_COMPENSATED_APPOINTEE,
  },
  {
    label: VENDOR_OPTION_LABEL.UH_EMPLOYEE,
    value: VENDOR_OPTION_VALUE.UH_EMPLOYEE,
  },
  {
    label: VENDOR_OPTION_LABEL.US_GOVERNMENT_ENTITY,
    value: VENDOR_OPTION_VALUE.US_GOVERNMENT_ENTITY,
  },
];
