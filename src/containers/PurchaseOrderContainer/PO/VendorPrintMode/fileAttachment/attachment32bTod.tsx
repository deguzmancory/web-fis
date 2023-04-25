import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import { IRootState } from 'src/redux/rootReducer';
import { FED_ATTACHMENT_VALUE } from '../../PurchaseInfo/helpers';
import React from 'react';
import { Image } from 'src/components/common';
import { IMAGES } from 'src/appConfig/images';

const clsPrefix = 'ctn-navbar-desktop';

const Attachment32bTod: React.FC<Props> = ({ formData }) => {
  const renderAttachmentFil32 = React.useMemo(() => {
    switch (formData?.fedAttachment) {
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32B:
        return {
          name: '32b',
          title: 'FEDERAL PROVISIONS',
          label:
            'GOVERNMENT SUBCONTRACT PROVISIONS INCORPORATED IN ALL SUBCONTRACTS/PURCHASE ORDERS (UNDER FEDERAL PRIME CONTRACTS)',
        };
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32C:
        return {
          name: '32c',
          title: 'Federal Provisions Applicable When Subcontractor',
          label:
            '(Commercial Entity) is in Possession of Government Property Government Subcontract Provisions Incorporated in All Subcontracts/Purchase Orders (Under Cost-Type Prime Cost Reimbursable Contracts)',
        };
      case FED_ATTACHMENT_VALUE.ATTACHMENT_32D:
        return {
          name: '32d',
          title: 'FEDERAL PROVISIONS APPLICABLE WHEN SUBCONTRACTOR',
          label:
            '(EDUCATIONAL OR NONPROFIT ORGANIZATION) IS IN POSSESSION OF GOVERNMENT PROPERTY GOVERNMENT SUBCONTRACT PROVISIONS INCORPORATED IN ALL SUBCONTRACTS/PURCHASE ORDERS (UNDER COST-TYPE PRIME COST REIMBURSABLE CONTRACTS)',
        };
      default:
        return null;
    }
  }, [formData?.fedAttachment]);

  const isAttachment32b = React.useMemo(() => {
    return formData?.fedAttachment === FED_ATTACHMENT_VALUE.ATTACHMENT_32B;
  }, [formData?.fedAttachment]);

  const isAttachment32d = React.useMemo(() => {
    return formData?.fedAttachment === FED_ATTACHMENT_VALUE.ATTACHMENT_32D;
  }, [formData?.fedAttachment]);

  const contentAttachmentFAR32b = [
    {
      leftContent: '52.202-1',
      rightContent: 'Definitions',
    },
    {
      leftContent: '52.204-2',
      rightContent: 'Security Requirements (applies if there is access to classified information)',
    },
    {
      leftContent: '52.204-8',
      rightContent: 'Required Sources for Helium and Helium Usage Data',
    },
    {
      leftContent: '52.211-15',
      rightContent:
        'Defense Priority and Allocation Requirements (Applies to rated orders certified for national defense, emergency preparedness, and energy program use. In such event, Seller is required to follow all the provisions of the Defense Priorities and Allocations System regulation (15 CFR 700))',
    },
    {
      leftContent: '52.215-15',
      rightContent: 'Pension Adjustments and Asset Reversions',
    },
    {
      leftContent: '52.215-18',
      rightContent:
        'Reversion or Adjustment of Plans for Postretirement Benefits (PRB) Other Than Pensions',
    },
    {
      leftContent: '52.215-19',
      rightContent: 'Notification of Ownership Changes',
    },
    {
      leftContent: '52.215-20',

      rightContent:
        'Requirements for Certified Cost or Pricing Data and Data Other Than Certified Cost or Pricing Data',
    },
    {
      leftContent: '52.215-21',
      rightContent:
        'Requirements for Certified Cost or Pricing Data and Data Other Than Certified Cost or Pricing Data - Modifications',
    },
    {
      leftContent: '52.216-7',
      rightContent: 'Allowable Cost and Payment',
    },
    {
      leftContent: '52.216-8',
      rightContent: 'Fixed Fee',
    },
    {
      leftContent: '52.216-11',
      rightContent: 'Cost Contract--No Fee',
    },
    {
      leftContent: '52.222-6',
      rightContent: 'Construction Wage Rate Requirements',
    },
    {
      leftContent: '52.222-7',
      rightContent: 'Withholding of Funds',
    },
    {
      leftContent: '52.222-8',
      rightContent: 'Payrolls and Basic Records',
    },
    {
      leftContent: '52.222-9',
      rightContent: 'Apprentices and Trainees',
    },
    {
      leftContent: '52.222-10',
      rightContent: 'Compliance with Copeland Act Requirements',
    },
    {
      leftContent: '52.222-11',
      rightContent: 'Subcontracts (Labor Standards)',
    },
    {
      leftContent: '52.222-12',
      rightContent: 'Contract Termination--Debarment',
    },
    {
      leftContent: '52.222-13',
      rightContent: 'Compliance with Construction Wage Rate Requirements and Related Regulations',
    },
    {
      leftContent: '52.222-14',
      rightContent: 'Disputes Concerning Labor Standards',
    },
    {
      leftContent: '52.222-15',
      rightContent: 'Certification of Eligibility',
    },
    {
      leftContent: '52.222-22',
      rightContent: 'Previous Contracts and Compliance Reports',
    },
    {
      leftContent: '52.222-25',
      rightContent: 'Affirmative Action Compliance',
    },
    {
      leftContent: '52.222-41',
      rightContent: 'Service Contract Labor Standards',
    },
    {
      leftContent: '52.222-50',
      rightContent: 'Combating Trafficking in Persons',
    },
    {
      leftContent: '52.222-51',
      rightContent:
        'Exemption from Application of the Service Contract Labor Standards to Contracts for Maintenance, Calibration, or Repair of Certain Equipment',
    },
    {
      leftContent: '52.223-7',
      rightContent: 'Notice of Radioactive Materials',
    },
    {
      leftContent: '52.223-11',
      rightContent:
        'Ozone-Depleting Substances (applies if the work was manufactured with or contains ozone-depleting substances)',
    },
    {
      leftContent: '52.223-99',
      rightContent:
        'Ensuring Adequate COVID-19 Safety Protocols for Federal Contractors (Oct 2021) (Deviation)',
    },
    {
      leftContent: '52.224-2',
      rightContent: 'Privacy Act',
    },
    {
      leftContent: '52.225-1',
      rightContent: 'Buy American—Supplies',
    },
    {
      leftContent: '52.225-2',
      rightContent: 'Buy American Certificate',
    },
    {
      leftContent: '52.225-5',
      rightContent: 'Trade Agreements',
    },
    {
      leftContent: '52.225-6',
      rightContent: 'Trade Agreements Certificate',
    },
    {
      leftContent: '52.225-13',
      rightContent: 'Restrictions on Certain Foreign Purchases',
    },
    {
      leftContent: '52.227-9',
      rightContent: 'Refund of Royalties',
    },
    {
      leftContent: '52.227-10',
      rightContent: 'Filing of Patent Applications--Classified Subject Matter',
    },
    {
      leftContent: '52.227-11',
      rightContent: 'Patent Rights--Ownership by the Contractor',
    },
    {
      leftContent: '52.227-13',
      rightContent:
        isAttachment32b || isAttachment32d
          ? 'Patent Rights--Ownership by the Government'
          : 'Patent Rights--Ownership by the Government52.227-14 Rights in Data—General',
    },
    (isAttachment32b || isAttachment32d) && {
      leftContent: '52.227-14',
      rightContent: 'Rights in Data—General',
    },
    {
      leftContent: '52.227-16',
      rightContent: 'Additional Data Requirements',
    },
    {
      leftContent: '52.227-17',
      rightContent: 'Rights in Data—Special Works',
    },
    {
      leftContent: '52.227-18',
      rightContent: 'Rights in Data—Existing Works',
    },
    {
      leftContent: '52.227-19',
      rightContent:
        'Commercial Computer Software License (applies if existing computer software is to be delivered under the subcontract)',
    },
    {
      leftContent: '52.228-3',
      rightContent: `Workers' Compensation Insurance (Defense Base Act) (if Defense Base Act applies)`,
    },
    {
      leftContent: '52.228-4',
      rightContent: `Workers' Compensation and War-Hazard Insurance Overseas (applies to public-work contracts performed outside the U.S., when the Secretary of Labor waives the applicability of the Defense Base Act)`,
    },
    {
      leftContent: '52.228-5',
      rightContent: 'Insurance--Work on a Government Installation',
    },
    {
      leftContent: '52.229-10',
      rightContent: 'State of New Mexico Gross Receipts and Compensating Tax',
    },
    {
      leftContent: '52.232-7',
      rightContent: 'Payments Under Time and Materials and Labor-Hour Contracts',
    },
    {
      leftContent: '52.232-16',
      rightContent: 'Progress Payments',
    },
    {
      leftContent: '52.232-20',
      rightContent: 'Limitation of Cost',
    },
    {
      leftContent: '52.232-27',
      rightContent: 'Prompt Payment for Construction Contracts',
    },
    {
      leftContent: '52.232-40',
      rightContent: 'Providing Accelerated Payment to Small Business Subcontractors',
    },
    {
      leftContent: '52.234-1',
      rightContent: 'Industrial Resources Developed Under Defense Production Act Title III',
    },
    {
      leftContent: '52.236-13',
      rightContent: 'Accident Prevention',
    },
    {
      leftContent: '52.237-7',
      rightContent: 'Indemnification and Medical Liability Insurance',
    },
    {
      leftContent: '52.243-1',
      rightContent: 'Changes—Fixed-Price',
    },
    {
      leftContent: '52.243-2',
      rightContent: 'Changes—Cost-Reimbursement',
    },
    {
      leftContent: '52.243-3',
      rightContent: 'Changes—Time-and-Materials or Labor-Hours',
    },
    {
      leftContent: '52.243-4',
      rightContent: 'Changes',
    },
    {
      leftContent: '52.243-5',
      rightContent: 'Changes and Changed Conditions',
    },
    {
      leftContent: '52.243-6',
      rightContent: 'Change Order Accounting',
    },
    {
      leftContent: '52.243-7',
      rightContent: 'Notification of Changes',
    },
    {
      leftContent: '52.244-6',
      rightContent: 'Subcontracts for Commercial Items',
    },
    {
      leftContent: '52.245-1',
      rightContent: 'Government Property',
    },
    {
      leftContent: '52.245-2',
      rightContent: 'Government Property Installation Operation Services',
    },
    {
      leftContent: '52.246-1',
      rightContent: 'Contractor Inspection Requirements',
    },
    {
      leftContent: '52.246-3',
      rightContent: 'Inspection of Supplies - Cost-Reimbursement',
    },
    {
      leftContent: '52.246-5',
      rightContent: 'Inspection of Services - Cost-Reimbursement',
    },
    {
      leftContent: '52.246-6',
      rightContent: 'Inspection - Time-and-Material and Labor-Hour',
    },
    {
      leftContent: '52.246-7',
      rightContent: 'Inspection of Research and Development - Fixed-Price',
    },
    {
      leftContent: '52.246-8',
      rightContent: 'Inspection of Research and Development - Cost-Reimbursement',
    },
    {
      leftContent: '52.246-9',
      rightContent: 'Inspection of Research and Development (Short Form)',
    },
    {
      leftContent: '52.246-13',
      rightContent: 'Inspection - Dismantling, Demolition, or Removal of Improvement',
    },
    {
      leftContent: '52.246-16',
      rightContent: 'Responsibility for Supplies',
    },
    {
      leftContent: '52.247-63',
      rightContent: 'Preference for U.S.-Flag Air Carriers',
    },
    {
      leftContent: '52.247-64',
      rightContent: 'Preference for Privately Owned U.S.-Flag Commercial Vessels',
    },
    isAttachment32b && {
      leftContent: '52.249-1',
      rightContent: 'Termination for Convenience of the Government (Fixed-Price) (Short Form)',
    },
    !isAttachment32d && {
      leftContent: '52.249-4',
      rightContent:
        'Termination for Convenience of the Government (Services) (Short Form) (NOT applicable to suppliers)',
    },
    (isAttachment32b || isAttachment32d) && {
      leftContent: '52.249-5',
      rightContent:
        'Termination for Convenience of the Government (Educational and other Nonprofit Institutions)',
    },
    !isAttachment32d && {
      leftContent: '52.249-6',
      rightContent: 'Termination (Cost-Reimbursement)',
    },
    !isAttachment32d && {
      leftContent: '52.249-8',
      rightContent: 'Default (Fixed-Price Supply and Service) (NOT applicable to suppliers)',
    },
    {
      leftContent: '52.249-12',
      rightContent: 'Termination (Personal Services)',
    },
    {
      leftContent: '52.249-14',
      rightContent: 'Excusable Delays',
    },
  ];

  const contentAttachmentDFARS32b = [
    { leftContent: '252.204-7000', rightContent: 'Disclosure of Information' },
    {
      leftContent: '252.204-7012',
      rightContent: 'Safeguarding Covered Defense Information and Cyber Incident Reporting',
    },
    {
      leftContent: '252.208-7000',
      rightContent: 'Intent to Furnish Precious Metals as Government-Furnished Material',
    },
    { leftContent: '252.217-7012', rightContent: 'Liability and Insurance' },
    { leftContent: '252.222-7000', rightContent: 'Restrictions on Employment of Personnel' },
    {
      leftContent: '252.223-7006',
      rightContent:
        'Prohibition on Storage, Treatment, and Disposal of Toxic and Hazardous Materials',
    },
    {
      leftContent: '252.223-7999',
      rightContent:
        'Ensuring Adequate COVID-19 Safety Protocols for Federal Contractors (Deviation 2021-O0009) (Oct 2021)',
    },

    { leftContent: '252.225-7012', rightContent: 'Preference for Certain Domestic Commodities' },
    { leftContent: '252.225-7013', rightContent: 'Duty-Free Entry' },
    {
      leftContent: '252.225-7016',
      rightContent: 'Restriction on Acquisition of Ball and Roller Bearings',
    },
    {
      leftContent: '252.225-7019',
      rightContent: 'Restriction on Acquisition of Anchor and Mooring Chain',
    },
    { leftContent: '252.225-7025', rightContent: 'Restriction on Acquisition of Forgings' },
    { leftContent: '252.227-7013', rightContent: 'Rights in Technical Data-Noncommercial Items' },
    {
      leftContent: '252.227-7014',
      rightContent:
        'Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation',
    },

    { leftContent: '252.227-7016', rightContent: 'Rights in Bid or Proposal Information' },
    {
      leftContent: '252.227-7018',
      rightContent:
        'Rights in Noncommercial Technical Data and Computer Software--Small Business Innovation Research (SBIR) Program',
    },

    {
      leftContent: '252.227-7019',
      rightContent: 'Validation of Asserted Restrictions--Computer Software',
    },
    { leftContent: '252.227-7033', rightContent: 'Rights in Shop Drawings' },
    {
      leftContent: '252.227-7037',
      rightContent: 'Validation of Restrictive Markings on Technical Data',
    },
    { leftContent: '252.227.7039', rightContent: 'Patents-Reporting of Subject Inventions' },
    {
      leftContent: '252.235-7000',
      rightContent: 'Indemnification under 10 U.S.C. 2354--Fixed Price',
    },
    {
      leftContent: '252.235-7001',
      rightContent: 'Indemnification under 10 U.S.C. 2354--Cost Reimbursement',
    },
    { leftContent: '252.235-7002', rightContent: 'Animal Welfare' },
    { leftContent: '252.235-7003', rightContent: 'Frequency Authorization' },
    {
      leftContent: '252.239-7016',
      rightContent: 'Telecommunications Security Equipment, Devices, Techniques and Services',
    },
    { leftContent: '252.244-7000', rightContent: 'Subcontracts for Commercial Items' },
    { leftContent: '252.247-7023', rightContent: 'Transportation of Supplies by Sea' },
    {
      leftContent: '252.247-7024',
      rightContent: 'Notification of Transportation of Supplies by Sea',
    },
  ];

  const textContentOver10_000 = [
    {
      leftContent: '52.222-21',
      rightContent: 'Prohibition of Segregated Facilities',
    },
    {
      leftContent: '52.222-26',
      rightContent: 'Equal Opportunity',
    },
    {
      leftContent: '52.222-27',
      rightContent: 'Affirmative Action Compliance Requirements for Construction',
    },
    {
      leftContent: '52.222-40',
      rightContent: 'Notification of Employee Rights Under the National Labor Relations Act',
    },
  ];

  const textContentOver150_000 = [
    { leftContent: '52.203-3', rightContent: 'Gratuities' },
    {
      leftContent: '52.203-6',
      rightContent: 'Restrictions on Subcontractor Sales to the Government',
    },
    { leftContent: '52.203-7', rightContent: 'Anti-Kickback Procedures' },
    {
      leftContent: '52.203-11',
      rightContent:
        'Certification and Disclosure Regarding Payments to Influence Certain Federal Transactions',
    },
    {
      leftContent: '52.203-12',
      rightContent: 'Limitation on Payments to Influence Certain Federal Transactions',
    },
    isAttachment32b && {
      leftContent: '52.203-17',
      rightContent:
        'Contractor Employee Whistleblower Rights and Requirement to Inform Employees of Whistleblower Rights',
    },
    { leftContent: '52.215-2', rightContent: 'Audit and Records—Negotiation' },
    { leftContent: '52.215-14', rightContent: 'Integrity of Unit Prices' },
    { leftContent: '52.219-8', rightContent: 'Utilization of Small Business Concerns' },
    {
      leftContent: '52.222-4',
      rightContent: 'Contract Work Hours and Safety Standards Act—Overtime Compensation',
    },
    {
      leftContent: '52.222-35',
      rightContent: 'Employment Reports on VeteransEqual Opportunity for Veterans',
    },
    { leftContent: '52.222-37', rightContent: 'Employment Reports on Veterans' },
    { leftContent: '52.227-1', rightContent: 'Authorization and Consent' },
    {
      leftContent: '52.227-2',
      rightContent: 'Notice and Assistance Regarding Patent and Copyright Infringement',
    },
    { leftContent: '52.246-2', rightContent: 'Inspection of Supplies - Fixed-Price' },
    { leftContent: '52.246-4', rightContent: 'Inspection of Services - Fixed-Price' },
    { leftContent: '52.246-12', rightContent: 'Inspection of Construction' },
    { leftContent: '52.248-1', rightContent: 'Value Engineering' },
    isAttachment32b && {
      leftContent: '52.249-2',
      rightContent: 'Termination for Convenience of the Government (Fixed-Price)',
    },
    {
      leftContent: '52.249-3',
      rightContent:
        'Termination for Convenience of the Government (Dismantling, Demolition, or Removal of Improvements)',
    },
    isAttachment32b && {
      leftContent: '52.249-9',
      rightContent: 'Default (Fixed-Price Research and Development) (NOT applicable to suppliers)',
    },
    {
      leftContent: '52.249-10',
      rightContent: 'Default (Fixed-Price Construction)',
    },
  ];

  const textContentOver750_000 = [
    { leftContent: '15.403-4', rightContent: 'Requiring Certified Cost or Pricing Data' },
    { leftContent: '52.214-26', rightContent: 'Audit and Records—Sealed Bidding' },
    {
      leftContent: '52.214-28',
      rightContent: 'Subcontractor Certified Cost or Pricing Data—Modifications—Sealed Bidding',
    },
    {
      leftContent: '52.215-10',
      rightContent: 'Price Reduction for Defective Certified Cost or Pricing Data',
    },
    {
      leftContent: '52.215-11',
      rightContent: 'Price Reduction for Defective Certified Cost or Pricing Data—Modifications',
    },
    { leftContent: '52.215-12', rightContent: 'Subcontractor Certified Cost or Pricing Data' },
    {
      leftContent: '52.215-13',
      rightContent: 'Subcontractor Certified Cost or Pricing Data—Modifications',
    },
    !isAttachment32d && { leftContent: '52.230-2', rightContent: 'Cost Accounting Standards' },
    !isAttachment32d && {
      leftContent: '52.230-3',
      rightContent: 'Disclosure and Consistency of Cost Accounting Practices',
    },
    { leftContent: '52.230-5', rightContent: 'Cost Accounting Standards--Educational Institution' },
    !isAttachment32d && {
      leftContent: '52.230-6',
      rightContent: 'Administration of Cost Accounting Standards',
    },
  ];

  return (
    <>
      <Box>
        <Box m={3}>
          <Divider />
        </Box>

        <Stack alignItems="flex-end">
          <Typography variant="body2" fontWeight="bold">
            ATTACHMENT {renderAttachmentFil32.name}
          </Typography>
        </Stack>
        <Stack alignItems="center" mb={2}>
          <Stack flexDirection="row" alignItems="center">
            <Box sx={{ mr: 1 }}>
              <Image src={IMAGES.logoGrey} className={`${clsPrefix}-logo`} />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {renderAttachmentFil32.title}
            </Typography>
          </Stack>

          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {renderAttachmentFil32.label}
          </Typography>
        </Stack>

        <Box>
          <Typography variant="body2">
            Since this is a subcontract under a U.S. Government Prime Contract awarded to the
            Research Corporation of the University of Hawaii (RCUH), the Federal Acquisition
            Regulation (FAR), the Defense Federal Acquisition Regulations Supplement (DFARS), and
            other clauses and provisions listed below, if applicable, are hereby incorporated in
            this subcontract by reference with the same force and effect as if set forth in full
            text. The complete text for all clauses and provisions is available online at
            https://www.acquisition.gov/browse/index/far and https://www.acquisition.gov/dfars or
            from the RCUH. The Contractor hereby acknowledges possession of the FAR or is otherwise
            familiar with all of the clauses and provisions incorporated herein by reference, and
            agrees to perform the applicable requirements under this subcontract. In the event of a
            conflict between the terms and conditions of this section and any other provisions of
            this subcontract, the terms and conditions of this section shall prevail. The terms
            “contractor/subcontractor,” “Government,” and “Contracting Officer,” as used in the
            clauses incorporated by this reference, shall be deemed to refer to the “Seller,”
            “Buyer,” and the “Research Corporation of the University of Hawaii”, respectively.
          </Typography>

          <Typography variant="body2" mt={3} mb={3}>
            THE FOLLOWING PROVISIONS APPLY:{' '}
          </Typography>
          <Typography variant="body2" flexWrap="wrap" sx={{ borderBottom: 1, width: 205 }}>
            Applies to orders of any amount
          </Typography>

          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>
            <Grid container>
              {contentAttachmentFAR32b.map((item, _) => {
                return (
                  <>
                    <Grid item xs={2}>
                      <Typography variant="body2">{item.leftContent}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="body2">{item.rightContent}</Typography>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Stack>

          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              DFARS:
            </Typography>
            <Grid container>
              {contentAttachmentDFARS32b.map((item, _) => {
                return (
                  <>
                    <Grid item xs={2}>
                      <Typography variant="body2">{item.leftContent}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="body2">
                        <Typography variant="body2">{item.rightContent}</Typography>
                      </Typography>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Stack>

          {(formData?.fedAttachment === FED_ATTACHMENT_VALUE.ATTACHMENT_32C || isAttachment32d) && (
            <Stack>
              <Typography variant="body2" mt={2} mb={2}>
                NFS:
              </Typography>

              <Grid container>
                <Grid item xs={2}>
                  <Typography variant="body2">1852.245-73</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">
                    Financial Reporting of NASA Property in the Custody of Contractors
                  </Typography>
                  <Typography variant="body2">
                    (Subcontractor reports due to the prime contractor no later than one week prior
                    to the due date indicated in the above provision.)
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          )}

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 190 }}>
            Applies if order is over $3,500
          </Typography>
          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>

            <Grid container>
              <Grid item container>
                <Grid item xs={2}>
                  <Typography variant="body2">52.222-54</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">
                    Employment Eligibility Verification (applicable to contract containing the FAR
                    E-Verify clause)
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item xs={2}>
                  <Typography variant="body2">52.223-18</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">
                    Encouraging Contractor Policies to Ban Text Messaging While Driving
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Stack>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 340 }}>
            Applies if order is over Applies if order is over $10,000
          </Typography>
          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>

            <Grid container>
              {textContentOver10_000.map((item, _) => {
                return (
                  <>
                    <Grid item xs={2}>
                      <Typography variant="body2">{item.leftContent}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="body2">{item.rightContent}</Typography>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Stack>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 205 }}>
            Applies if order is over $15,000
          </Typography>
          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>

            <Grid container>
              <Grid item container>
                <Grid item xs={2}>
                  <Typography variant="body2">52.222-36</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">
                    Equal Opportunity for Workers with Disabilities
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item xs={2}>
                  <Typography variant="body2">52.225-8</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">Duty-Free Entry</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Stack>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 205 }}>
            Applies if order is over $30,000
          </Typography>
          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>

            <Grid container>
              <Grid item xs={2}>
                <Typography variant="body2">52.204-10</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">
                  Reporting Executive Compensation and First-Tier Subcontract Awards
                </Typography>
              </Grid>
            </Grid>
          </Stack>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 205 }}>
            Applies if order is over $35,000
          </Typography>
          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>

            <Grid container>
              <Grid item container>
                <Grid item xs={2}>
                  <Typography variant="body2">52.209-5</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">
                    Certification Regarding Responsibility Matters
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item xs={2}>
                  <Typography variant="body2">52.209-6</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2">
                    Protecting the Government's Interest When Subcontracting with Contractors
                    Debarred, Suspended, or Proposed for Debarment
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Stack>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 205 }}>
            Applies if order is over $70,000
          </Typography>
          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>

            <Grid container>
              <Grid item xs={2}>
                <Typography variant="body2">52.248-3</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">Value Engineering—Construction</Typography>
              </Grid>
            </Grid>
          </Stack>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 205 }}>
            Applies if order is over $150,000
          </Typography>

          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>

            <Grid container>
              {textContentOver150_000.map((item, _) => {
                return (
                  <>
                    <Grid item xs={2}>
                      <Typography variant="body2">{item.leftContent}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="body2">{item.rightContent}</Typography>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Stack>

          <Typography variant="body2" mt={2} mb={2}>
            DFARS:
          </Typography>

          <Grid container>
            <Grid item container>
              <Grid item xs={2}>
                <Typography variant="body2">252.203-7001</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">
                  Prohibition on Persons Convicted of Fraud or Other Defense-Contract-Related
                  Felonies
                </Typography>
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item xs={2}>
                <Typography variant="body2">252.249-7002</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">
                  Notification of Anticipated Contract Termination or Reduction
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 205 }}>
            Applies if order is over $700,000
          </Typography>

          <Typography variant="body2" mt={2} mb={2}>
            FAR:
          </Typography>

          <Grid container>
            <Grid item container>
              <Grid item xs={2}>
                <Typography variant="body2">52.219-9</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">Small Business Subcontracting Plan</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Typography variant="body2" mt={2} mb={2}>
            DFARS:
          </Typography>
          <Grid container>
            <Grid item container>
              <Grid item xs={2}>
                <Typography variant="body2">252.225-7003</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">
                  Report of Intended Performance Outside the United States and Canada—Submission
                  with Offer
                </Typography>
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item xs={2}>
                <Typography variant="body2">252.22-7004</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">
                  Report of Intended Performance Outside the United States and Canada—Submission
                  after Award
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 202 }}>
            Applies if order is over $750,000
          </Typography>

          <Stack>
            <Typography variant="body2" mt={2} mb={2}>
              FAR:
            </Typography>

            <Grid container>
              {textContentOver750_000.map((item, _) => {
                return (
                  <>
                    <Grid item xs={2}>
                      <Typography variant="body2">{item.leftContent}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="body2">{item.rightContent}</Typography>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Stack>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 205 }}>
            Applies if order is over $1,000,000
          </Typography>

          <Typography variant="body2" mt={2} mb={2}>
            DFARS:
          </Typography>

          <Grid container>
            <Grid item container>
              <Grid item xs={2}>
                <Typography variant="body2">
                  {isAttachment32d ? '252.211-7000' : '252.225-7033'}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">Waiver of United Kingdom Levies</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 215 }}>
            Applies if order is over $1,500,000
          </Typography>

          <Typography variant="body2" mt={2} mb={2}>
            DFARS:
          </Typography>

          <Grid container>
            <Grid item container>
              <Grid item xs={2}>
                <Typography variant="body2">
                  {' '}
                  {isAttachment32d ? '252.225.7033' : '252.211-7000'}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">Acquisition Streamlining</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Typography variant="body2" mt={2} sx={{ borderBottom: 1, width: 215 }}>
            Applies if order is over $5,500,000
          </Typography>

          <Typography variant="body2" mt={2} mb={2}>
            FAR:
          </Typography>

          <Grid container>
            <Grid item container>
              <Grid item xs={2}>
                <Typography variant="body2">52.203-13</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2">
                  Contractor Code of Business Ethics and Conduct
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box>
        <Typography variant="body2">
          COST PRINCIPLES AND ADMINISTRATIVE REQUIREMENTS APPLICABLE TO SUBCONTRACTOR AGREEMENTS NOT
          COVERED BY THE FAR:
        </Typography>
        <Typography variant="body2">
          Subcontractor shall comply with the cost principles of the OMB, in 2 CFR Part 200, Subpart
          E.
        </Typography>
        <Typography variant="body2">
          AUDIT REPORT AND OTHER CLAUSES FOR SUBCONTRACTOR AGREEMENTS:
        </Typography>
        <Typography variant="body2">AUDIT REPORTS</Typography>

        <Typography variant="body2" mt={2} mb={2}>
          Subcontractor shall comply with the requirements of 2 CFR Part 200, Compliance Supplement
          Appendix XI. Subcontractor further agrees to provide the awarding institution with copies
          of any of the independent auditors' reports which present instances of non-compliance with
          federal laws and regulations which bear directly on the performance or administration of
          this Agreement. In cases of such non-compliance, Subcontractor will provide copies of
          responses to auditors' reports and a plan for corrective action. All records and reports
          prepared in accord with the requirements of 2 CFR Part 200, Compliance Supplement Appendix
          XI, shall be available for inspection by representatives of the awarding institutions or
          the government during normal business hours.
        </Typography>

        <Typography variant="body2" mt={2} mb={2}>
          AUDIT COSTS
        </Typography>
        <Typography variant="body2">
          Subcontractor agrees that it shall be solely responsible for all costs to conduct any
          independent audit as required by 2 CFR Part 200, Compliance Supplement Appendix XI, for
          assuring compliance under this subaward.
        </Typography>
        <Typography variant="body2" mt={2} mb={2}>
          DISALLOWANCES
        </Typography>
        <Typography variant="body2">
          Subcontractor agrees that it shall be solely responsible for reimbursing the RCUH for all
          costs which may be disallowed as a result of non-compliance with any applicable laws,
          rules, or regulations.
        </Typography>
        <Typography variant="body2" textAlign="end">
          Revised 12/2/2021
        </Typography>
      </Box>
    </>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const mapStateToProps = (state: IRootState) => ({
  formData: state.form.formData,
});

const mapDispatchToProps = {};

export default Attachment32bTod;
