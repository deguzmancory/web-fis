import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'src/components/common';

const PurposeAndInstruction: React.FC = () => {
  return (
    <>
      <Typography style={{ display: 'contents' }} variant="h5">
        PURPOSE:
      </Typography>{' '}
      <Typography style={{ display: 'contents' }} variant="body1">
        Federal regulations require documentation of cost analysis or price analysis for procurement
        actions. The Determination of Cost or Price Reasonableness form is used to document the
        analysis showing that the offered price is fair and reasonable. The form is kept as part of
        the procurement file to demonstrate that the procurement process was conducted in an open
        and fair manner, and that RCUH received the most advantageous price.
      </Typography>
      <Typography mt={2} variant="h5">
        INSTRUCTIONS:
      </Typography>
      <Typography variant="body1">
        1. Complete all sections. See{' '}
        <Link
          target="_blank"
          href="https://www.rcuh.com/document-library/2-000/procurement-contracts/attachment-58-sample-sole-source-justifications/"
        >
          Sample Price and Cost Analyses.
        </Link>
      </Typography>
      <Typography variant="body1">
        2. Provide a detailed discussion of your price analysis or cost analysis. A Determination of
        Cost or Price Reasonableness form that lacks sufficient detail cannot be approved.
      </Typography>
      <Typography variant="body1">3. Sign and date the form.</Typography>
      <Typography variant="body1">
        An improperly completed and/or unsigned form may be returned to the sender.
      </Typography>
    </>
  );
};

export default PurposeAndInstruction;
