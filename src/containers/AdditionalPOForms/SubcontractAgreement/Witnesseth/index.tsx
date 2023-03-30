import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { DatePicker, Input, TextareaAutosize } from 'src/components/common';
import { getAfterDate } from 'src/containers/CRUUSerContainer/UserType/GrantDelegation/helpers';
import { SubcontractorPayload } from 'src/queries';
import { getErrorMessage, isEqualPrevAndNextFormikValues } from 'src/utils';
import { CommonFormikProps } from 'src/utils/commonTypes';
import { PO_SUBCONTRACT_AGREEMENT_KEY } from '../enum';
import './styles.scss';

const WitnessethFormLayout: React.FC<Props> = ({ formikProps, disabled }) => {
  const {
    values,
    errors,
    touched,
    getUncontrolledFieldProps,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const _getErrorMessage = (fieldName: PO_SUBCONTRACT_AGREEMENT_KEY) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  return (
    <>
      <Box>
        <div style={{ display: 'contents' }}>
          <div style={{ display: 'contents' }}>THIS AGREEMENT, entered into this day, </div>
          <div style={{ display: 'inline-block', width: '15%' }}>
            <DatePicker
              {...getFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.DATE)}
              name={PO_SUBCONTRACT_AGREEMENT_KEY.DATE}
              placeholder={'MM/DD/YYYY'}
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              selected={values.date as Date}
              errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.DATE)}
              disabled={disabled}
            />
          </div>
          <div style={{ display: 'contents' }}>
            , by and between The Research Corporation of the University of Hawaii, hereinafter
            called "RCUH", a governmental agency of the State of Hawaii, whose post office address
            is 2800 Woodlawn Drive, Suite 200, Honolulu, Hawaii 96822, for the benefit of
          </div>{' '}
          <div style={{ display: 'inline-block', width: '70%' }}>
            <TextareaAutosize
              maxLength={250}
              resize="none"
              style={{ padding: '0 2px', marginTop: '2px' }}
              errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.PROJECT)}
              {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.PROJECT)}
              disabled={disabled}
            />
          </div>
          <div style={{ display: 'contents' }}> , hereinafter called the "Project", and </div>
          <div style={{ display: 'inline-block', width: '50%', marginTop: '2px' }}>
            <TextareaAutosize
              maxLength={250}
              resize="none"
              style={{ padding: '0 2px', marginTop: '2px' }}
              errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR_NAME)}
              {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR_NAME)}
              disabled={disabled}
            />
          </div>
          {' , '}
          <div style={{ display: 'contents' }}>
            hereinafter called "Subcontractor", whose business address and tax identification number
            are as follows:
          </div>
        </div>
        <TextareaAutosize
          resize="none"
          style={{ marginTop: '4px' }}
          errorMessage={_getErrorMessage(
            PO_SUBCONTRACT_AGREEMENT_KEY.BUSINESS_ADDRESS_AND_TAX_ID_NUMBER
          )}
          {...getFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.BUSINESS_ADDRESS_AND_TAX_ID_NUMBER)}
          disabled={disabled}
        />
      </Box>

      <Box>
        <Typography variant="h5" textAlign={'center'} my={4}>
          WITNESSETH THAT:
        </Typography>

        <div style={{ display: 'contents', lineHeight: '4' }}>
          <div className="witness_desc" style={{ display: 'contents' }}>
            WHEREAS, the Project and the Funding Agency are parties to a Grant/Contract Number and
            the CFDA number, if applicable,
          </div>
          <div style={{ display: 'inline-block', width: '44%' }}>
            <TextareaAutosize
              maxLength={250}
              resize="none"
              style={{ padding: '0 2px', marginTop: '2px' }}
              errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.CONTRACT_NUMBER)}
              {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.CONTRACT_NUMBER)}
              disabled={disabled}
            />
          </div>
          <div style={{ display: 'contents' }}> , entitled " </div>
          <div style={{ display: 'inline-block', width: '44%' }}>
            <TextareaAutosize
              maxLength={250}
              resize="none"
              style={{ padding: '0 2px', marginTop: '2px' }}
              errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.GRANT_NUMBER)}
              {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.GRANT_NUMBER)}
              disabled={disabled}
            />
          </div>{' '}
          {'",'}
          <div>
            a copy of which is attached hereto as Attachment 1 and by reference made a part hereof;
            and
          </div>
          <div className="witness_desc">
            WHEREAS, the Project has requested RCUH to provide administrative services for their
            benefit in support of the Grant/Contract referenced above, in accordance with the
            Internal Agreement between UH and RCUH, and
          </div>
          <div className="witness_desc">
            WHEREAS, RCUH for the benefit of the Project and the Principal Investigator of said
            grant/contract will provide financial support to the Subcontractor to provide the
            Services detailed in the Statement of Work attached hereto as Attachment 2; and
          </div>
          <div className="witness_desc">
            WHEREAS, RCUH desires to compensate the Subcontractor for their Subcontract work in
            accordance with the applicable budget attached hereto as Attachment 3 and by reference
            made a part hereof; NOW, THEREFORE, in consideration of the mutual covenants and
            agreements hereinafter contained, the parties hereto agree:
          </div>
          <div style={{ padding: '0 16px' }}>
            <ol>
              <li>
                The Subcontractor agrees to perform the necessary services for the implementation
                and completion of that portion of the contract above referred to as relates to the
                Project.
              </li>

              <li>
                The Subcontractor agrees to conform to all federal rules and regulations that may
                apply to the conduct and performance of this Agreement.
              </li>

              <li>
                <div style={{ display: 'contents' }}>
                  <div style={{ display: 'contents' }}>
                    Period of Agreement and Amount: The period of performance of this Agreement
                    shall be
                  </div>{' '}
                  <div style={{ display: 'inline-block', width: '18%' }}>
                    <DatePicker
                      {...getFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.START_DATE)}
                      name={PO_SUBCONTRACT_AGREEMENT_KEY.START_DATE}
                      selected={values.startDate as Date}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      maxDate={values.endDate as Date}
                      errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.START_DATE)}
                      disabled={disabled}
                    />
                  </div>
                  <div style={{ display: 'contents' }}> through </div>
                  <div style={{ display: 'inline-block', width: '18%' }}>
                    <DatePicker
                      {...getFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.END_DATE)}
                      name={PO_SUBCONTRACT_AGREEMENT_KEY.END_DATE}
                      selected={values.endDate as Date}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      minDate={getAfterDate(values.startDate, new Date())}
                      errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.END_DATE)}
                      disabled={disabled}
                    />
                  </div>
                  <div style={{ display: 'contents' }}>
                    , as listed in the Project Budget which is attached hereto as Attachment 3 and
                    made a part hereof by reference, and provided, further, that expenditures from
                    monies to be provided by RCUH pursuant to this Agreement shall not exceed the
                    total amount of $
                  </div>
                  <div style={{ display: 'inline-block', width: '15%' }}>
                    <Input
                      type="number"
                      errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.CONTRACT_NUMBER)}
                      {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.CONTRACT_NUMBER)}
                      disabled={disabled}
                    />
                  </div>
                </div>
              </li>

              <li>
                Method of Payment: RCUH shall reimburse the Subcontractor for expenses incurred by
                the project on a monthly basis. Such reimbursement will be made in accordance with
                the submission or completion of required deliverables, monthly billings prepared and
                submitted by the Subcontractor, broken down by expense categories reflected in the
                budget, and must be consistent with the rules and regulations contained in
                Attachment 1 of this subcontract. Failure to submit invoices on a timely basis may
                result in delayed reimbursement. RCUH may withhold reimbursement payments if
                quarterly financial reports are not submitted on a timely basis or if reported cost
                sharing data is not current or proportional to the annual estimated obligation.
              </li>

              <li>
                Audit Requirements: The provisions of Office of Management and Budget (OMB) Circular
                A-133, “Audits of States, Local Governments, and Non-Profit Organizations,” apply to
                this contract. Subcontractor agrees to comply with the requirements of OMB Circular
                A-133. Subcontractor further agrees to provide the University of Hawaii (UH) with
                timely access to any independent auditors’ reports that describe instances of
                noncompliance with federal laws and regulations that bear directly on the
                performance or administration of this Sub-award. In cases of such noncompliance,
                Subcontractor will provide copies of responses to auditors’ reports and associated
                corrective action plans. The Subcontractor shall cooperate with UH in resolving
                questions that UH may have concerning any audit reports and plans for corrective
                action(s). All reports prepared in accordance with the requirements of OMB Circular
                A-133 shall be available for inspection by representatives of UH or the government
                during normal business hours. Failure to submit the audit report and corrective
                actions may result in delayed reimbursement to Subcontractor for costs incurred
                under the contract.
              </li>

              <li>
                Examination of Records: The Subcontractor agrees that the U.S. Comptroller General,
                University of Hawaii, RCUH, or any of their duly authorized representatives shall
                have access to, and the right to inspect or audit any directly pertinent books,
                documents, papers and records of the Subcontractor involving transactions related to
                this Agreement. The Subcontractor agrees that it shall keep for a period of three
                (3) years following completion of the project, or until all litigation, claims or
                audit findings have been resolved and final action is taken, such records as may be
                reasonably necessary to facilitate an effective audit.
              </li>

              <li>
                Termination: The RCUH shall have the privilege, with or without cause, to cancel or
                annul this Agreement at any time upon written notice given thirty (30) days in
                advance of such termination.
              </li>

              <li>
                Disallowed Costs: The Subcontractor shall be responsible for reimbursement to the
                prime contractor, UH, a sum of money equivalent to the amount of any expenditures
                disallowed should the funding agency or an authorized agency rule through audit
                exception or some other appropriate means that expenditures from funds allocated to
                the Subcontractor for direct and/or indirect costs were not made in compliance with
                the applicable cost principles, regulation of the funding agency, or the provisions
                of this Subcontract.
              </li>

              <li>
                Disputes: Any disputes concerning a matter of fact arising under this Agreement,
                which is not disposed of by mutual agreement within thirty (30) calendar days, shall
                be determined by the Executive Director of RCUH, or said Executive Director’s
                designated representative who shall reduce the decision to writing and mail or
                otherwise furnish a copy of the decision to the Subcontractor. Pending final
                decision of such a dispute, the Subcontractor shall proceed diligently with the
                performance of services under this Agreement in accordance with RCUH’s request.
              </li>

              <li>
                Federal Funds: If this Agreement is payable in whole or in part from federal funds,
                the Subcontractor agrees that, as to the portion of the compensation under this
                Agreement to be payable from federal funds, the Subcontractor shall be paid only
                from such federal funds received from the federal government, and shall not be paid
                from any other funds.
              </li>

              <li>
                Ownership Rights and Copyright. RCUH shall have complete ownership of all material,
                both finished and unfinished, which is developed, prepared, assembled, or conceived
                by the Subcontractor pursuant to this Agreement, and all such material shall be
                considered “works made for hire”. All such material shall be delivered to the RCUH
                upon expiration or termination of this Agreement. RCUH, at its discretion, shall
                have the exclusive right to copyright any product, concept, or material developed,
                prepared, assembled, or conceived by the Subcontractor pursuant to this Agreement.
                The Subcontractor, however, reserves the right to use thereafter any ideas and
                techniques that may be developed during the performance of this Agreement.
              </li>

              <li>
                Governing Law: The validity of the Agreement and any of its terms or provisions, as
                well as the rights and duties of the parties to this Agreement, shall be governed by
                the laws of the State of Hawaii. Any action at law or in equity to enforce or
                interpret the provisions of this Agreement shall be brought in a state court of
                competent jurisdiction in Honolulu, Hawaii.
              </li>

              <li>
                Indemnification and Defense: Subcontractor shall defend, indemnify, and hold
                harmless RCUH, the University of Hawaii, the State of Hawaii, the contracting
                agency, and their officers, employees, and agents from and against all liability,
                loss, damage, cost, and expense, including all attorneys’ fees, and all claims,
                suits, and demands thereof, arising out of or resulting from the acts or omissions
                of the Subcontractor or its employees, officers, agents, or subcontractors under
                this Agreement. The provisions of this paragraph shall remain in full force and
                effect notwithstanding the expiration or early termination of this Agreement.
              </li>

              <li>
                Modifications of Agreement: Any modification, alteration, amendment, change, or
                extension of any term, provision, or condition of this Agreement shall be made only
                by written amendments to this Agreement, signed by both the Subcontractor and RCUH.
              </li>

              <li>Relationship of Parties; Independent Contractor Status and Responsibilities:</li>

              <ol start={1} style={{ listStyle: 'lower-alpha', padding: '0 20px' }}>
                <li>
                  In the performance of services, or delivery of goods, or both, required under this
                  Agreement, the Subcontractor is an “independent contractor,” with the authority
                  and responsibility to control and direct the performance and details of the work
                  and services required under this Agreement; however, RCUH shall have a general
                  right to inspect work in progress to determine whether, in RCUH’s opinion, the
                  services are being performed or the goods are being provided, or both, by
                  Subcontractor.
                </li>
                <li>
                  The Subcontractor and the Subcontractor’s employees and agents are not by reason
                  of this Agreement, agents or employees of RCUH for any purpose, and the
                  Subcontractor and the Subcontractor’s employees and agents shall not be entitled
                  to claim or receive from RCUH any vacation, sick leave, retirement, workers’
                  compensation, unemployment insurance, or other benefits provided to RCUH
                  employees.
                </li>
                <li>
                  The Subcontractor shall be responsible for the accuracy, completeness, and
                  adequacy of its performance under this Agreement. Furthermore, the Subcontractor
                  intentionally, voluntarily, and knowingly assumes the sole and entire liability to
                  the Subcontractor’s employees and agents, and to any individual not a party to
                  this Agreement, for all loss, damage, or injury caused by the Subcontractor, or
                  the Subcontractor’s employees or agents in the course of their employment.
                </li>
                <li>
                  The Subcontractor is responsible for securing all employee-related insurance
                  coverage for the Subcontractor and the Subcontractor’s employees and agents that
                  is or may be required by law, and for payment of all premiums, costs, and other
                  liabilities associated with securing the insurance coverage.
                </li>
                <li>
                  The Subcontractor is responsible for securing all employee-related insurance
                  coverage for the Subcontractor and the Subcontractor’s employees and agents that
                  is or may be required by law, and for payment of all premiums, costs, and other
                  liabilities associated with securing the insurance coverage.
                </li>
              </ol>

              <li>
                Tax Clearances: In accordance with Section 103-53, Hawaii Revised Statutes, if the
                amount of this Agreement is $25,000 or more, a tax clearance from the Director of
                Taxation, State of Hawaii and the Internal Revenue Service is required before this
                subcontract can become effective. Tax clearances are also required prior to the
                release of final payment.
              </li>

              <li>
                General Conditions: The terms, conditions, provisions, and special requirements of
                the Prime Grant/Contract will apply to this Agreement and are attached hereto as
                Attachment 1 and made a part hereof by reference.
              </li>

              <li>
                Federal Provisions. If federal grant funds are expended under this contract, the
                Subcontractor shall comply with the applicable provisions of Attachment 32a. If
                federal contract funds are expended under this contract, the Subcontractor shall
                comply with the applicable provisions of Attachments 32b, 32c or 32d.
              </li>

              <li>
                Standards of Conduct Declaration. The Standards of Conduct Declaration by
                Subcontractor, set forth in Attachment 4, is hereby made a part of this Agreement.
              </li>

              <li>
                It is understood that this Agreement represents the sole and entire Agreement
                between the parties.
              </li>
            </ol>
          </div>
        </div>
      </Box>

      <Box pt={2}>
        <div style={{ display: 'contents' }}>
          <div style={{ display: 'contents' }}>
            IN WITNESSETH WHEREOF, The Subcontractor and The Research Corporation of the University
            of Hawaii have executed this Agreement at Honolulu, Hawaii on
          </div>{' '}
          <div style={{ display: 'inline-block', width: '18%' }}>
            <DatePicker
              {...getFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.EXECUTED_DATE)}
              name={PO_SUBCONTRACT_AGREEMENT_KEY.EXECUTED_DATE}
              selected={values.executedDate as Date}
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.EXECUTED_DATE)}
              disabled={disabled}
            />
          </div>{' '}
          <div style={{ display: 'contents' }}>
            with retroactive effect as of and from the date first above written.
          </div>
        </div>
      </Box>

      <Box>
        <Typography variant="h5" mt={4}>
          RECOMMENDED BY:
        </Typography>
        <Typography variant="body1" mt={2}>
          PRINCIPAL INVESTIGATOR OR PROJECT AUTHORITY
        </Typography>

        <Grid container spacing={2} pt={12} flexDirection="column">
          <Grid item xs={5}>
            <Divider />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body2">Signature</Typography>
          </Grid>

          <Grid item xs={5}>
            <Input
              label={'Full Name of Principal Investigator or Project Authority'}
              errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.PRINCIPAL_INVESTIGATOR)}
              {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.PRINCIPAL_INVESTIGATOR)}
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Typography variant="h5" mt={4}>
          EXECUTED BY:
        </Typography>

        <Grid container>
          <Grid container item xs={6} flexDirection={'column'} paddingRight={2}>
            <Typography variant="body1" mt={4}>
              SUBCONTRACTOR
            </Typography>

            <Box pt={12}>
              <Grid item xs={7}>
                <Divider />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body2">Signature</Typography>
              </Grid>
              <Grid item mt={2}>
                <Input
                  label={'Full Name of Principal Investigator or Project Authority'}
                  errorMessage={_getErrorMessage(
                    PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR_SIGNATURE
                  )}
                  {...getUncontrolledFieldProps(
                    PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR_SIGNATURE
                  )}
                  disabled={disabled}
                />
              </Grid>
            </Box>
          </Grid>

          <Grid container item xs={6} flexDirection={'column'} paddingLeft={2}>
            <Typography variant="body1" mt={4}>
              THE RESEARCH CORPORATION OF THE UNIVERSITY OF HAWAII
            </Typography>

            <Box pt={12}>
              <Grid item xs={7}>
                <Divider />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body2">Signature</Typography>
              </Grid>
              <Grid item mt={2}>
                <Input
                  label={'Full Name of The Research Corporation of the University of Hawaii'}
                  errorMessage={_getErrorMessage(PO_SUBCONTRACT_AGREEMENT_KEY.RCUH_SIGNATURE)}
                  {...getUncontrolledFieldProps(PO_SUBCONTRACT_AGREEMENT_KEY.RCUH_SIGNATURE)}
                  disabled={disabled}
                />
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

type Props = {
  formikProps: CommonFormikProps<SubcontractorPayload>;
  disabled: boolean;
};

export default React.memo(WitnessethFormLayout, (prevProps, nextProps) => {
  const prevFormikProps = prevProps.formikProps;
  const nextFormikProps = nextProps.formikProps;

  const formKeysNeedRender = [
    PO_SUBCONTRACT_AGREEMENT_KEY.DATE,
    PO_SUBCONTRACT_AGREEMENT_KEY.PROJECT,
    PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR_NAME,
    PO_SUBCONTRACT_AGREEMENT_KEY.BUSINESS_ADDRESS_AND_TAX_ID_NUMBER,
    PO_SUBCONTRACT_AGREEMENT_KEY.CONTRACT_NUMBER,
    PO_SUBCONTRACT_AGREEMENT_KEY.GRANT_NUMBER,
    PO_SUBCONTRACT_AGREEMENT_KEY.START_DATE,
    PO_SUBCONTRACT_AGREEMENT_KEY.END_DATE,
    PO_SUBCONTRACT_AGREEMENT_KEY.CONTRACT_NUMBER,
    PO_SUBCONTRACT_AGREEMENT_KEY.EXECUTED_DATE,
    PO_SUBCONTRACT_AGREEMENT_KEY.PRINCIPAL_INVESTIGATOR,
    PO_SUBCONTRACT_AGREEMENT_KEY.SUBCONTRACTOR_SIGNATURE,
    PO_SUBCONTRACT_AGREEMENT_KEY.RCUH_SIGNATURE,
  ];

  return (
    prevProps.disabled === nextProps.disabled &&
    isEqualPrevAndNextFormikValues<SubcontractorPayload>({
      prevFormikProps,
      nextFormikProps,
      formKeysNeedRender,
    })
  );
});
