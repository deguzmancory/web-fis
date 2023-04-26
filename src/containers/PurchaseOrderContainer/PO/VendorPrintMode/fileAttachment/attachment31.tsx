import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { IMAGES } from 'src/appConfig/images';
import { Image } from 'src/components/common';

const clsPrefix = 'ctn-navbar-desktop';

const Attachment31: React.FC = () => {
  return (
    <Box>
      <Box m={3}>
        <Divider />
      </Box>
      <Stack alignItems="flex-end">
        <Typography variant="body2" fontWeight="bold">
          ATTACHMENT 31
        </Typography>
      </Stack>
      <Stack alignItems="center" mb={2}>
        <Stack flexDirection="row" alignItems="center">
          <Box sx={{ mr: 1 }}>
            <Image src={IMAGES.logoGrey} className={`${clsPrefix}-logo`} />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            General Terms and Conditions Applicable to All Purchase Orders
          </Typography>
        </Stack>
      </Stack>

      <Stack flexDirection="row">
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body2">
              1. INVOICES must be rendered in duplicate not later than the day following shipment.
              In accordance with Sections 1.6047-1.6050 of the IRS Code, Vendor shall provide the
              Research Corporation of the University of Hawaii (RCUH) with its Federal Taxpayer
              Identification Number and its (a) Hawaii General Excise/Use Identification Number, or
              (b) its Social Security Number on the invoice.
            </Typography>
            <Typography variant="body2">
              2. EXTRA CHARGES. No additional charges of any kind, including charges for boxing,
              packing, cartage, or other extras will be allowed unless specifically agreed to in
              writing, in advance by RCUH.
            </Typography>

            <Typography variant="body2">
              3. PAYMENT. C.O.D. shipments will not be accepted. Drafts will not be honored. In
              accordance with Section 103-10, Hawaii Revised Statues, payment to vendors shall be
              made no later than thirty (30) calendar days following receipt of invoice or
              satisfactory receipt of goods and services, whichever is later.
            </Typography>

            <Typography variant="body2">
              4. PRICE. If price is not stated in this order, it is agreed that goods shall be
              billed at the price last quoted, or billed at the prevailing market price, whichever
              is lower. This order must not be filled at a higher price than last quoted or charged
              without RCUH’s specific authorization.
            </Typography>

            <Typography variant="body2">
              5. APPLICABLE LAWS. Vendor represents that the merchandise covered by this order was
              not manufactured, and is not being sold or priced, in violation of any federal, state,
              or local law.
            </Typography>

            <Typography variant="body2">
              6. FAIR LABOR STANDARDS ACT. Vendor agrees that goods shipped to RCUH under this order
              will be produced in compliance with the Fair Labor Standards Act.
            </Typography>

            <Typography variant="body2">
              7. WARRANTY SPECIFICATIONS. Vendor expressly warrants that all materials and articles
              covered by this order or other description or specification furnished by RCUH will be
              in exact accordance with such order, description, or specification, free from defects
              in material and/or workmanship, and merchantable.
            </Typography>

            <Typography variant="body2">
              8. CANCELLATION. RCUH reserves the right to cancel all or any part of the undelivered
              portion of this order if Vendor does not make deliveries as specified, time being of
              the essence for this order, or if Vendor breaches any of the terms hereof including,
              without limitation, the warranties of Vendor.
            </Typography>

            <Typography variant="body2">
              9. ACCEPTANCE. The items or services covered by this order shall be furnished by
              Vendor subject to all the terms and conditions set forth in this order. Vendor, in
              accepting this order, agrees to be bound by and to comply with all particulars and no
              other terms or conditions shall be binding upon the parties unless hereafter accepted
              by them in writing. Written acceptance or shipment of all or any portion of the items
              or services covered by this order shall constitute unqualified acceptance of all its
              terms and conditions. The terms of any proposal referred to in this order are included
              and made part of the order only to the extent of specifying items, the nature of the
              items, the services ordered, the price thereof and delivery date, and then only to the
              extent that such terms are consistent with the terms and conditions of this order.
            </Typography>

            <Typography variant="body2">
              10. WAIVER. The failure of the RCUH to enforce at any time the provisions of the
              order, or to exercise any option herein provided, or to require at any time
              performance by Vendor of provisions hereof, shall in no way be construed to be a
              waiver of such provisions, nor in any way to affect the validity of this order or any
              part thereof, or the right of the RCUH thereafter to enforce each and every such
              provision.
            </Typography>

            <Typography variant="body2">
              11. WARRANTIES. Vendor warrants the articles delivered hereunder to be free from
              defects in labor, material, and manufacture, and to be in compliance with any drawings
              or specifications incorporated or referenced herein and with any samples furnished by
              Vendor. All warranties shall run to the RCUH, its successors and assigns.
            </Typography>

            <Typography variant="body2">
              12. DISCOUNT DATE. The date for calculation of any cash discount offered by Vendor and
              provided for on the face of this order is (a) the date material is received, or (b)
              the date an acceptable invoice is received, whichever is later.
            </Typography>

            <Typography variant="body2">
              13. INSPECTION. All works performed and all deliverable items are subject to
              inspection and acceptance at destination, notwithstanding any payments or inspection
              at source. Final inspection and acceptance shall be conclusive except as to latent
              defects, fraud, gross mistakes that amount to fraud, and Vendor’s warranty
              obligations. Supplies to be furnished hereunder shall be subject to inspection by the
              RCUH and/or government inspectors upon the premises of Vendor. Vendor, without
              additional cost, shall provide all reasonable facilities and assistance for the safety
              and convenience of such inspectors. At the time of inspection, Vendor shall make
              available to the inspectors copies of all drawings, specifications and process,
              preservation and packaging data applicable to the articles ordered herein.
            </Typography>

            <Typography variant="body2">
              14. ASSIGNMENT. This order is assignable by the RCUH. Except as to any payment due
              hereunder, this order is not assignable by Vendor without prior written approval of
              the RCUH. In case such consent is given, it shall not relieve Vendor from any of the
              obligations of this order and any transferee or subcontractor shall be considered the
              agent of Vendor and, as between the parties hereto, Vendor shall be and remain liable
              as if no such transfer or subletting has been made.
            </Typography>

            <Typography variant="body2">
              15. CHANGES. The RCUH may make changes within the general scope of this order by
              giving notice to Vendor and subsequently confirming such changes in writing. If such
              changes affect the cost of, or the time required for performance of this order,
              equitable adjustment in the price or delivery or both shall be made. No change by
              Vendor shall be recognized without written approval of the RCUH. Any claim of Vendor
              for an adjustment under this article must be made in writing within thirty (30) days
              from the date of receipt by Vendor of notification of such change unless the RCUH
              waives this condition. Nothing in this article shall excuse Vendor from proceeding
              with performance of the order as changed hereunder.
            </Typography>

            <Typography variant="body2">
              16. SHIPPING INSTRUCTION. Vendor shall bear the risk of loss during shipment, unless
              otherwise agreed to in writing by the RCUH. All shipments shall also be made as
              specified on the face of the order.
            </Typography>

            <Typography variant="body2">
              17. LABOR DISPUTES. Vendor shall give prompt notice to the RCUH of any actual or
              potential labor dispute which delays or may delay timely performance of this order.
            </Typography>

            <Typography variant="body2">
              18. TERMINATION AND DELAYS. The RCUH may provide written notice stating the extent and
              effective date of termination of this order for the RCUH’s convenience in whole or in
              part, at any time. The RCUH shall pay Vendor as full compensation for performance
              under such termination: (a) the unit or pro rata order price for the delivered and
              accepted portion, and (b) a reasonable amount, not otherwise recoverable from other
              sources by Vendor as approved by the RCUH with respect to the undelivered or
              unaccepted portion of the order; provided compensation hereunder shall in no event
              exceed the total order price. The RCUH may, by written notice, terminate this order
              for Vendor’s default, in whole or in part, at any time, if Vendor refuses or fails to
              make progress, as to
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2">
              endanger performance, and does not cure such failure within a reasonable period of
              time, or fails to make deliveries of the items or services or perform the services
              within the time specified or any written extension thereof. In such event, the RCUH
              may purchase or otherwise secure items or services and, except as otherwise provided
              herein, Vendor shall be liable to the RCUH for any excess cost incurred by the RCUH.
              If, after notice of termination for default, the RCUH determines that Vendor was not
              in default or that the failure to perform this order is due to causes beyond the
              control and without the fault or negligence of Vendor (including, but not restricted
              to, acts of God or the public enemy, acts of the RCUH, acts of Government, fires,
              floods, epidemics, quarantine restrictions, strikes, freight embargoes, unusually
              severe weather, and delays of subcontractor or supplier due to such causes and without
              the fault or negligence of the subcontractor or supplier), termination shall be deemed
              for the convenience of the RCUH, unless the RCUH shall determine that the items or
              services covered by this order were obtainable from other sources in sufficient time
              to meet the required delivery schedule. If the RCUH determines that Vendor has been
              delayed in the work due to causes beyond the control, and without the fault or
              negligence, of Vendor, the RCUH may extend the time for completion of the work called
              for by this order, when promptly applied for in writing by Vendor; and if such delay
              is due to failure of the RCUH, not caused or contributed to by Vendor, to perform
              services or deliver property in accordance with the terms of the order, the time and
              price of the order shall be subject to change under the Changes article. Sole remedy
              of Vendor in event of delay by failure of the RCUH to perform shall, however, be
              limited to any money actually and necessarily expended in the work during the period
              of delay, solely by reason of delay. No allowance will be made for anticipated
              profits. The rights and remedies of the RCUH provided in this article shall not be
              exclusive and are in addition to any other rights and/or remedies provided by law or
              under this order. As used in this article, the word “Vendor” includes Vendor and
              Vendor’s subsuppliers at any tier.{' '}
            </Typography>
            <Typography variant="body2">
              19. LIABILITY FOR RCUH FURNISHED PROPERTY. Vendor assumes complete liability for any
              tools, articles or material furnished by the RCUH to Vendor in connection with this
              order, and Vendor agrees to pay for all such tools, articles, or materials spoiled by
              Vendor, or not otherwise accounted for to the RCUH’s satisfaction. The furnishing to
              Vendor of any tools, articles, or materials in connection with this order shall not,
              unless otherwise expressly provided, be construed to vest title with Vendor.
            </Typography>
            <Typography variant="body2">
              20. EQUAL OPPORTUNITY AND AFFIRMATIVE ACTION CERTIFICATION. Vendor agrees that the
              equal opportunity clause, which prohibits discrimination on the basis of race, color,
              religion, sex, or national origin, and the affirmative action requirements of
              Executive Order 11246, as amended, and implementing regulations at 41 CFR 60, are
              incorporated by reference in each non-exempt contract, subcontract, or purchase order
              which is presently existing or which may be entered into hereafter, between Vendor and
              the RCUH. Vendor agrees to perform the applicable obligations of the equal employment
              opportunity and affirmative action clauses, as amended, covering non-segregated
              facilities (41 CFR 60-1.8), minorities and women (41 CFR 60-1.4), workers with
              disabilities (41 CFR 60-741.5), disabled veterans, recently separated veterans, other
              protected veterans, and armed forces service medal veterans (41 CFR 60-300.5, as
              amended), and special disabled veterans, veterans of the Vietnam era, recently
              separated veterans, and other protected veterans (41 CFR 60-250.5), for employee
              rights (29 CFR, part 471). Contractors and construction contractors with 50 or more
              employees, and contracts of $50,000 or more, agree to comply with requirements for
              EEO-1 reports (41 CFR 60- 1.7(a)), affirmative action programs (41 CFR 60-1.40(a)),
              affirmative action programs for certain veterans and disabled veterans (41 CFR
              60-250.5; 41 CFR 60- 300.5), and affirmative action programs for disabled workers (41
              CFR 60-741.5). Vendor agrees to indemnify, defend, and hold harmless the RCUH from any
              claims or demands with regard to Vendor’s compliance with these provisions.
            </Typography>
            <Typography variant="body2">
              21. INDEMNIFICATION. Vendor shall indemnify, defend, and hold harmless the RCUH, the
              State of Hawaii, and the Federal government if applicable, and their officers,
              employees, agents, or any person acting on their behalf from and against: (a) any
              claim or demand for loss, liability or damage, including, but not limited to, claims
              for property damage, personal injury or death, by whomsoever brought, arising from any
              act or omission of Vendor, its officers, employees, or agents connected with the
              performance of this order, except liability arising out of the negligence of the RCUH
              or its employees; and (b) all claims, suits and damages by whomsoever brought or made
              by reason of the nonobservance or nonperformance of any of the terms, covenants, and
              conditions herein, or the rules, regulations, ordinances, and laws of the federal,
              state, municipal, or county governments. Furthermore, Vendor shall reimburse the RCUH
              and the State of Hawaii, and their officers, employees, agents or any person acting on
              their behalf for all attorneys’ fees, costs, and expenses incurred in connection with
              the defense of any such claims.
            </Typography>
            <Typography variant="body2">
              22. PATENT INDEMNITY. Vendor shall pay all royalty and license fees relating to the
              items covered hereby; in the event any third-party shall claim that the manufacture
              use and sale of the goods covered hereby, infringe on any copyright, trademark, or
              patent, Vendor shall indemnify the RCUH and hold the RCUH harmless from any cost,
              expenses, damage, or loss incurred in any manner by the RCUH on account of any such
              alleged infringement.
            </Typography>
            <Typography variant="body2">
              23. DISPUTES. All disputes arising under or related to this order shall be resolved in
              accordance with this clause.
            </Typography>
            <Typography variant="body2">
              a. A claim by Vendor shall be made in writing and submitted to the RCUH Procurement &
              Disbursing Manager for a written decision.
            </Typography>
            <Typography variant="body2">
              b. The RCUH Procurement & Disbursing Manager shall make a finding of fact and render a
              decision within 90 days of the request, provided all the necessary investigation can
              be made. The finding and decision shall be written and shall be mailed or otherwise
              furnished to Vendor.
            </Typography>
            <Typography variant="body2">
              c. If the RCUH Procurement & Disbursing Manager cannot decide the claim within 90
              days, Vendor will be notified of the date when the decision will be made. The decision
              of the RCUH Procurement & Disbursing Manager shall be final.
            </Typography>
            <Typography variant="body2">
              24. GOVERNING LAW. This order shall be construed according to the laws of the State of
              Hawaii. Any action at law or in equity to enforce or interpret the provisions of this
              order shall be brought in a state court of competent jurisdiction in Honolulu,
              Hawai‘i.
            </Typography>
            <Typography variant="body2">
              25. TAX CLEARANCE. Vendor is required to obtain a tax clearance from the Hawaii
              Department of Taxation and the U.S. Internal Revenue Service prior to the execution of
              this order if $25,000 or more, and upon final payment. The tax clearance is required
              pursuant to Section 103-53 of the Hawaii Revised Statutes. Revised 05/31/2017
            </Typography>
          </Grid>
        </Grid>
      </Stack>
      <Box m={3}>
        <Divider />
      </Box>
    </Box>
  );
};

export default Attachment31;
