import { ReactElement, ReactNode, FC, CSSProperties } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Callback } from 'src/redux/types';
import { emptyFunction, isString, MoneyInputDetect } from 'src/utils';
import { Input } from '..';
import EllipsisTooltipBaseInput, {
  EllipsisTooltipBaseInputProps,
} from '../EllipsisTooltipBaseInput';
import { InputIcon, InputProps } from '../Input';
import { Box } from '@mui/material';

const baseStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  borderStyle: 'border-box',
  fontSize: 14,
};

const DollarInputIcon = (
  <InputIcon
    iconName={'ic_dollar'}
    isIconPositionLeft={true}
    iconComponent={null}
    onIconClick={emptyFunction}
  />
);

const CustomInput: FC<Props> = ({
  showCustomIcon,
  customIcon = DollarInputIcon,
  customIconPosition = 'left',
  ...props
}) => (
  <Input
    iconPosition={customIconPosition}
    {...(showCustomIcon && { customIcon: customIcon })}
    {...props}
  />
);

const InputCurrency: FC<Props> = ({
  unFixedDecimalScale = false,
  name,
  value,
  className,
  style,
  customIcon,
  showCustomIcon,
  customIconPosition,
  prefix = '$',
  decimalScale = 2,
  thousandSeparator = true,
  disabled,
  defaultValue,
  textAlign = 'right',
  footer,
  onChange,
  ...props
}) => {
  const handleChange = (values) => {
    const { floatValue } = values;
    const returnValue = floatValue ? floatValue : floatValue === 0 ? 0 : null;
    onChange && onChange(name, returnValue);
  };
  return (
    <>
      <CurrencyFormat
        className={className}
        style={{ ...baseStyles, textAlign: textAlign, ...style }}
        thousandSeparator={thousandSeparator}
        fixedDecimalScale={!unFixedDecimalScale}
        decimalScale={decimalScale}
        displayType="input"
        prefix={prefix}
        name={name}
        customInput={CustomInput}
        disabled={disabled}
        onValueChange={handleChange}
        {...(value !== undefined && {
          value: isString(value) ? value : MoneyInputDetect(value),
        })}
        {...(defaultValue !== undefined && {
          value: isString(defaultValue) ? defaultValue : MoneyInputDetect(defaultValue),
        })}
        {...props}
      />
      {footer && <Box mt={1}>{footer}</Box>}
    </>
  );
};

const EllipsisTooltipInputCurrency: FC<EllipsisTooltipInputProps> = ({ ...props }) => {
  return (
    <EllipsisTooltipBaseInput {...props}>
      <InputCurrency name={props.name} />
    </EllipsisTooltipBaseInput>
  );
};

export type EllipsisTooltipInputProps = EllipsisTooltipBaseInputProps & Props;

type Props = Omit<CurrencyFormat.Props, 'InputProps'> & { InputProps?: InputProps } & {
  unFixedDecimalScale?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  name: string;
  className?: string;
  style?: CSSProperties;
  customIcon?: ReactElement;
  showCustomIcon?: boolean;
  customIconPosition?: 'left' | 'right';
  prefix?: string;
  decimalScale?: number;
  thousandSeparator?: string | boolean;
  disabled?: boolean;
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
  footer?: ReactNode;
  onChange?: Callback;
};

export default InputCurrency;
export { EllipsisTooltipInputCurrency };
