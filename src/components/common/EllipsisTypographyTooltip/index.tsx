import { Typography, Tooltip, TypographyProps, SxProps } from '@mui/material';
import './styles.scss';
const EllipsisTypographyTooltip: React.FC<Props> = ({
  lengthShowTooltip = 10,
  hideTooltip,
  children,
  placement = 'bottom',
  tooltipSx,
  maxLine = 1,
  ...props
}) => {
  return (
    <Tooltip
      title={children}
      enterDelay={500}
      disableHoverListener={
        hideTooltip || !children || children.toString().length < lengthShowTooltip
      }
      placement={placement}
      sx={tooltipSx}
    >
      <Typography
        variant="body2"
        className="ellipsis-multiple-line"
        sx={{
          WebkitLineClamp: maxLine,
        }}
      >
        {children ?? '--'}
      </Typography>
    </Tooltip>
  );
};

type Props = TypographyProps & {
  lengthShowTooltip?: number;
  maxLine?: number;
  tooltipSx?: SxProps;
  hideTooltip?: boolean;
  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start';
};

export default EllipsisTypographyTooltip;
