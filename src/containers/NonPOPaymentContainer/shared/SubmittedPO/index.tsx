import { Box, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { IconSuccess } from 'src/components/common';
import TypographyLink from 'src/components/TypographyLink';
import SectionLayout from 'src/containers/shared/SectionLayout';
import { PO_DOCUMENT_TYPE } from 'src/queries';
import { getSubmittedPOContent } from './helpers';
import BreadcrumbsNonPOForm from '../Breadcrumb';
import { SUBMITTED_NON_PO_PAYMENT_QUERY } from './enums';

export type SubmittedPOContent = ReturnType<typeof getSubmittedPOContent>;

const SubmittedPO: React.FC<Props> = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const poNumber = query.get(SUBMITTED_NON_PO_PAYMENT_QUERY.NUMBER) || null;
  const documentType = query.get(SUBMITTED_NON_PO_PAYMENT_QUERY.DOCUMENT_TYPE) || null;
  const content: SubmittedPOContent = getSubmittedPOContent({
    documentType: documentType as PO_DOCUMENT_TYPE,
    id,
  });

  return (
    <Box p={4}>
      <Container maxWidth={'lg'}>
        <BreadcrumbsNonPOForm />
        <SectionLayout sx={{ py: 5, px: 16, textAlign: 'center' }}>
          <Stack direction={'column'} alignItems="center">
            <IconSuccess size={48} />
            <Typography variant="h1" color={COLOR_CODE.SUCCESS} mt={2}>
              Congratulations!
            </Typography>
            <Typography variant="body1" mt={2}>
              Your {content.name} has been successfully submitted and transferred to your DUO-Fiscal
              Office. {content.poNumberName} <b>{poNumber}</b> has been assigned to your request.
            </Typography>
            <Typography variant="body1" mt={2}>
              Would you like to:
            </Typography>
            <Stack mt={2} direction="row" alignItems={'center'} justifyContent="center">
              <Link to={content.viewLink.href}>
                <TypographyLink fontWeight={'bold'}>{content.viewLink.title}</TypographyLink>
              </Link>
              <Typography variant="body1" mx={1} mb="3px">
                or
              </Typography>
              <Link to={content.createLink.href}>
                <TypographyLink fontWeight={'bold'}>{content.createLink.title}</TypographyLink>
              </Link>
              <Typography variant="body1" mx={1} mb="3px">
                or
              </Typography>
              <Link to={`${PATHS.dashboard}`}>
                <TypographyLink fontWeight={'bold'}>Return to RCUH Financial Home</TypographyLink>
              </Link>
            </Stack>
          </Stack>
        </SectionLayout>
      </Container>
    </Box>
  );
};

type Props = {};

export default React.memo(SubmittedPO);
