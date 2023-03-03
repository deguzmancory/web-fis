import { Typography, TypographyProps } from '@mui/material';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';

const TypographyLink: React.FC<Props> = ({
  variant = 'body2',
  children,
  className,
  sx,
  ...props
}) => {
  return (
    <Typography
      variant={variant}
      color={COLOR_CODE.INFO}
      sx={{
        ...sx,
        '&:hover': {
          textDecoration: 'underline',
          cursor: 'pointer',
        },
      }}
      {...(className && {
        classes: {
          root: className,
        },
      })}
      {...props}
    >
      {children}
    </Typography>
  );
};

type Props = TypographyProps & {
  children: any;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit';
  className?: string;
};

export default TypographyLink;
