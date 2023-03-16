import { Grid, Stack, Typography } from '@mui/material';
import React, { Fragment } from 'react';
import { IoDocument } from 'react-icons/io5';
import { COLOR_CODE } from 'src/appConfig/constants';
import TypographyLink from 'src/components/TypographyLink';
import { AdditionalPOFormValue } from '../types';

const FormAttachmentItem: React.FC<Props> = ({ formAttachments, onEditClick, onRemoveClick }) => {
  return (
    <>
      {formAttachments.map((formAttachment) => {
        return (
          <Fragment key={formAttachment.code}>
            <Grid item xs={10}>
              <Stack direction="row" alignItems="center">
                <IoDocument size={22} color={COLOR_CODE.GRAY} />
                <Typography ml={1}>{formAttachment.name}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <TypographyLink onClick={() => onEditClick(formAttachment)}>
                {formAttachment.isExternalLink ? 'View' : 'Edit'}
              </TypographyLink>
            </Grid>
            {!formAttachment.isExternalLink && (
              <Grid item xs={1}>
                <TypographyLink onClick={() => onRemoveClick(formAttachment)}>
                  Remove
                </TypographyLink>
              </Grid>
            )}
          </Fragment>
        );
      })}
    </>
  );
};

type Props = {
  formAttachments: AdditionalPOFormValue[];
  onEditClick: (value: AdditionalPOFormValue) => void;
  onRemoveClick?: (value: AdditionalPOFormValue) => void;
};

export default React.memo(FormAttachmentItem);
