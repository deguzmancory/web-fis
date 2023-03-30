import { Box, Typography } from '@mui/material';
import React from 'react';
import { NO_OPENER } from 'src/appConfig/constants';
import { Link } from 'src/components/common';

const SoleSourceInfo: React.FC = () => {
  return (
    <Box>
      <Typography style={{ display: 'contents' }} variant="h5">
        PURPOSE:
      </Typography>{' '}
      <Typography style={{ display: 'contents' }} variant="body1">
        Public procurement law requires that price considerations be evaluated via competitive
        quotations. The purpose of the Sole Source Justification form is to show that competitive
        procurement cannot be accomplished, because only one good or service can meet a specific,
        essential need, and that one good or service is only available from a single source.
        Therefore, an equitable valuation of comparable goods or services must be made and
        documented by the requestor. The documentation shows that rejection of other goods or
        services is based solely on their failure to meet that specific, essential need. In cases
        where no other comparable source can be identified, a technical description of the good or
        service requested and a listing of those companies which were considered as alternate
        sources must be provided. Sole source justification cannot be based on quality or price.
      </Typography>
      <Typography mt={2} variant="h5">
        INSTRUCTIONS:
      </Typography>
      <Typography variant="body1">
        1. Complete all sections. See{' '}
        <Link
          target="_blank"
          rel={NO_OPENER}
          href="https://www.rcuh.com/document-library/2-000/procurement-contracts/attachment-58-sample-sole-source-justifications/"
        >
          Sample Sole Source Justifications.
        </Link>
      </Typography>
      <Typography variant="body1">
        2. Provide full explanations and complete descriptions. A Sole Source Justification form
        that lacks sufficient detail cannot be approved.
      </Typography>
      <Typography variant="body1"> 3. Sign and date the form.</Typography>
      <Typography variant="body1">
        An improperly completed and/or unsigned form may be returned to the sender.
      </Typography>
    </Box>
  );
};

export default React.memo(SoleSourceInfo);
