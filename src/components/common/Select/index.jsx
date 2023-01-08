import cn from 'classnames';
import { useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoCaretDownOutline } from 'react-icons/io5';
import Select, { components } from 'react-select';
import { COLOR_CODE } from 'src/appConfig/constants';
import { getRandomId } from 'src/utils';
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

const Control = ({ children, ...props }) => (
  <components.Control {...props}>
    <FiSearch className="ml-8" />
    {children}
  </components.Control>
);
const ControlNoSearchIcon = ({ children, ...props }) => (
  <components.Control {...props}>{children}</components.Control>
);

const SelectCmp = ({
  options,
  onChange,
  label,
  className = '',
  value,
  errorMessage = '',
  placeholder = 'Select',
  containerClassName = '',
  onBlur,
  name = '',
  isTranslatable = false,
  required = false,
  infoTooltipMessage = '',
  infoTooltipPlacement = 'right',
  infoToolTipWithArrow = true,
  hideSearchIcon = false,
  isClearable = true,
  isDisabled = false,
  isMulti = false,
  menuPosition = 'fixed',
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
    : options?.find((option) => option.value === value) || null;
  // For custom select, follow this link:
  // https://react-select.com/styles#using-classnames
  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
      isTranslatable={isTranslatable}
      required={required}
      infoTooltipMessage={infoTooltipMessage}
      infoTooltipPlacement={infoTooltipPlacement}
      infoToolTipWithArrow={infoToolTipWithArrow}
    >
      <View>
        <Select
          id={id.current}
          isClearable={isClearable}
          isDisabled={isDisabled}
          value={selectedOption}
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
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: COLOR_CODE.PRIMARY,
              neutral20: hasError ? COLOR_CODE.DANGER : COLOR_CODE.DISABLED,
            },
          })}
          {...props}
          components={{
            DropdownIndicator,
            Control: hideSearchIcon ? ControlNoSearchIcon : Control,
          }}
          menuPosition={menuPosition}
        />
      </View>
    </Element>
  );
};

export default SelectCmp;
