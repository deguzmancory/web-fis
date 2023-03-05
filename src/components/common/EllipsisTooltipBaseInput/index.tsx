import React from 'react';

import { Box, SxProps, Tooltip } from '@mui/material';
import { CommonPlacement } from 'src/utils/commonTypes';

const EllipsisTooltipBaseInput: React.FC<EllipsisTooltipBaseInputProps> = ({
  lengthShowTooltip = 15,
  hideEllipsisTooltip = false,
  ellipsisTooltipPlacement = 'bottom-start',
  ellipsisTooltipSx,
  arrow = false,
  enterDelay = 500,
  disableFocusListener = true,
  disableTouchListener = false,
  disableHoverListener = false,
  children,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const currentInputValue = inputRef.current?.value;

  const disabledTooltip = React.useMemo(() => {
    return (
      hideEllipsisTooltip ||
      !currentInputValue ||
      currentInputValue?.toString()?.length < lengthShowTooltip
    );
  }, [currentInputValue, hideEllipsisTooltip, lengthShowTooltip]);

  return (
    <Tooltip
      title={!disabledTooltip ? currentInputValue : ''}
      enterDelay={enterDelay}
      disableHoverListener={disableHoverListener || disabledTooltip}
      disableFocusListener={disableFocusListener || disabledTooltip}
      disableTouchListener={disableFocusListener || disabledTooltip}
      placement={ellipsisTooltipPlacement}
      arrow={arrow}
      sx={ellipsisTooltipSx}
    >
      <Box>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { ...props, inputRef: inputRef });
        })}
      </Box>
    </Tooltip>
  );
};
export type EllipsisTooltipBaseInputProps = {
  lengthShowTooltip?: number;
  ellipsisTooltipSx?: SxProps;
  hideEllipsisTooltip?: boolean;
  ellipsisTooltipPlacement?: CommonPlacement;
  controlledValue?: string;
  arrow?: boolean;
  children?: React.ReactElement;
  enterDelay?: number;
  disableFocusListener?: boolean;
  disableTouchListener?: boolean;
  disableHoverListener?: boolean;
};

export default EllipsisTooltipBaseInput;
