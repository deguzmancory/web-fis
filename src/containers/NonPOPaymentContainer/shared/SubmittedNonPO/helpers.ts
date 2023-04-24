import { PATHS } from 'src/appConfig/paths';
import { NON_PO_PAYMENT_DOCUMENT_TYPE } from 'src/queries';

export const getSubmittedNonPOContent = ({
  documentType,
  id,
}: {
  documentType: NON_PO_PAYMENT_DOCUMENT_TYPE;
  id: string;
}) => {
  switch (documentType) {
    case NON_PO_PAYMENT_DOCUMENT_TYPE.AUTHORIZATION_PAYMENT:
      return {
        name: 'Authorization for Payment Form',
        poNumberName: 'Payment Request Number',
        viewLink: {
          title: 'View the Authorization for Payment',
          href: `${PATHS.authorizationForPaymentDetail}/${id}`,
        },
        createLink: {
          title: 'Create another Authorization for Payment',
          href: `${PATHS.createAuthorizationForPayment}`,
        },
      };
    case NON_PO_PAYMENT_DOCUMENT_TYPE.NON_EMPLOYEE_TRAVEL_PAYMENT:
      return {
        name: 'Non-Employee Expense Payment Form',
        poNumberName: 'Payment Request Number',
        viewLink: {
          title: 'View the Non-Employee Expense Payment',
          href: `${PATHS.nonEmployeeTravelPaymentDetail}/${id}`,
        },
        createLink: {
          title: 'Create another Non-Employee Expense Payment',
          href: `${PATHS.createNonEmployeeTravelPayment}`,
        },
      };
    case NON_PO_PAYMENT_DOCUMENT_TYPE.PERSONAL_AUTO_PAYMENT:
      return {
        name: 'Personal Auto Payment',
        poNumberName: 'Payment Request Number',
        viewLink: {
          title: 'View the Personal Auto Payment',
          href: `${PATHS.personalAutoPaymentDetail}/${id}`,
        },
        createLink: {
          title: 'Create another Personal Auto Payment',
          href: `${PATHS.createPersonalAutoPayment}`,
        },
      };
    case NON_PO_PAYMENT_DOCUMENT_TYPE.PETTY_CASH_PAYMENT:
      return {
        name: 'Petty Cash Payment',
        poNumberName: 'Payment Request Number',
        viewLink: {
          title: 'View the Petty Cash Payment',
          href: `${PATHS.pettyCashPaymentDetail}/${id}`,
        },
        createLink: {
          title: 'Create another Petty Cash Payment',
          href: `${PATHS.createPettyCashPayment}`,
        },
      };

    default:
      return {
        name: '',
        poNumberName: '',
        viewLink: {
          title: '',
          href: ``,
        },
        createLink: {
          title: '',
          href: ``,
        },
      };
  }
};
