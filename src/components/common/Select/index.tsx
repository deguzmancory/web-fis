import { Box } from '@mui/material';
import cn from 'classnames';
import { isEqual } from 'lodash';
import { useCallback, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoCaretDownOutline } from 'react-icons/io5';
import Select, {
  components,
  MenuPosition,
  ControlProps,
  CSSObjectWithLabel,
  StylesConfig,
  Props as SelectProps,
} from 'react-select';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Callback } from 'src/redux/types';
import { getRandomId } from 'src/utils';
import { CommonPlacement } from 'src/utils/commonTypes';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import View from '../View';
import './styles.scss';

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <IoCaretDownOutline size={12} />
    </components.DropdownIndicator>
  );
};

const Control: React.FC<ControlProps> = ({ children, ...props }) => (
  <components.Control {...props}>
    <FiSearch className="ml-8" />
    {children}
  </components.Control>
);

const ControlNoSearchIcon: React.FC<ControlProps> = ({ children, ...props }) => (
  <components.Control {...props}>{children}</components.Control>
);

const menuRightPositionStyle = {
  position: 'absolute' as const,
  right: 0,
};

const SelectCmp: React.FC<Props> = ({
  options,
  label,
  className = '',
  value,
  errorMessage = '',
  placeholder = 'Select',
  containerClassName = '',
  name = '',
  required = false,
  extraRequired = false,
  infoTooltipMessage = '',
  infoTooltipPlacement = 'right',
  infoToolTipWithArrow = true,
  hideSearchIcon = false,
  isClearable = true,
  isDisabled = false,
  isMulti = false,
  menuPosition = 'fixed',
  optionWithSubLabel = false,
  isLoading = false,
  menuStyle,
  optionStyle,
  styles,
  footer,
  customSelectedOptionValue,
  subLabelStyle,
  labelStyle,
  menuOptionPosition = 'left',
  onChange = (name, value) => {},
  onBlur = (name, value) => {},
  onInputChange = (value) => {},
  ...props
}) => {
  const id = useRef(`select-${getRandomId()}`);
  const handleChange = (selectedOption) => {
    if (isMulti) {
      onChange(name, selectedOption ? selectedOption.map((item) => item?.value) : null);
    } else onChange(name, selectedOption?.value || null);
  };

  const handleSelectBlur = (event) => {
    onBlur && onBlur(name, true);
  };
  const hasError = !isEmpty(errorMessage);

  const selectedOption = isMulti
    ? options?.filter((option) => value.includes(option.value)) || null
    : options?.find((option) => isEqual(option.value, value)) || null;
  // For custom select, follow this link:
  // https://react-select.com/styles#using-classnames

  const Option = useCallback(
    (props) => {
      const { data } = props;
      const children = (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={labelStyle}>
            {data.prefix && (
              <span
                style={{
                  marginRight: '12px',
                }}
              >
                {data?.prefix}
              </span>
            )}
            {data.label}
          </div>
          <div style={{ textAlign: 'right', ...subLabelStyle }}>{data?.subLabel}</div>
        </div>
      );
      return <components.Option {...props} children={children} />;
    },
    [labelStyle, subLabelStyle]
  );

  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
      required={required}
      extraRequired={extraRequired}
      infoTooltipMessage={infoTooltipMessage}
      infoTooltipPlacement={infoTooltipPlacement}
      infoToolTipWithArrow={infoToolTipWithArrow}
    >
      <View>
        <Select
          id={id.current}
          isClearable={isClearable}
          isDisabled={isDisabled}
          value={customSelectedOptionValue ?? selectedOption}
          placeholder={placeholder}
          onChange={handleChange}
          options={options}
          className={cn('cmp-select', className, {
            'cmp-select--error': hasError,
            'cmp-select--is-disabled': isDisabled,
          })}
          isMulti={isMulti}
          classNamePrefix="cmp-select"
          menuPlacement="auto"
          onBlur={handleSelectBlur}
          name={name}
          isLoading={isLoading}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: COLOR_CODE.PRIMARY,
              neutral20: hasError ? COLOR_CODE.DANGER : COLOR_CODE.DISABLED,
              primary50: COLOR_CODE.PRIMARY_100,
            },
          })}
          styles={{
            ...styles,
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? COLOR_CODE.PRIMARY_100
                : state.isSelected
                ? COLOR_CODE.PRIMARY_100
                : 'white',
              ...optionStyle,
            }),
            menuPortal: (base, props) => ({
              ...base,
              zIndex: 999,
            }),
            menu: (base, props) => ({
              ...base,
              ...menuStyle,
              ...(menuOptionPosition === 'right' && menuRightPositionStyle),
            }),
          }}
          components={{
            DropdownIndicator,
            Control: hideSearchIcon ? ControlNoSearchIcon : Control,
            ...(optionWithSubLabel && {
              Option: Option,
            }),
          }}
          menuPosition={menuPosition}
          onInputChange={onInputChange}
          {...props}
        />
      </View>
      {footer && <Box mt={1}>{footer}</Box>}
    </Element>
  );
};

export interface SelectOption<T = any> {
  label: string | React.ReactNode;
  value: T;
  prefix?: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
  isDisabled?: boolean;
}

type Props = Omit<SelectProps, 'onBlur' | 'onChange'> & {
  options: SelectOption[] & any;
  label: string;
  className?: string;
  value: any;
  errorMessage?: string;
  placeholder?: string;
  containerClassName?: string;
  name?: string;
  required?: boolean;
  extraRequired?: boolean;
  infoTooltipMessage?: string;
  infoTooltipPlacement?: CommonPlacement;
  infoToolTipWithArrow?: boolean;
  hideSearchIcon?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  menuPosition?: MenuPosition;
  optionWithSubLabel?: boolean;
  menuStyle?: CSSObjectWithLabel;
  optionStyle?: CSSObjectWithLabel;
  styles?: StylesConfig;
  isLoading?: boolean;
  footer?: React.ReactNode;
  subLabelStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties; //work only when optionWithSubLabel = true
  customSelectedOptionValue?: any;
  menuOptionPosition?: 'left' | 'right';
  onChange?: (name, value) => void;
  onBlur?: Callback;
  onInputChange?: Callback;
};

export default SelectCmp;
