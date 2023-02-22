import cn from 'classnames';
import { isEqual } from 'lodash';
import { useCallback, useRef } from 'react';
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
  label,
  className = '',
  value,
  errorMessage = '',
  placeholder = 'Select',
  containerClassName = '',
  name = '',
  required = false,
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
  onChange = (name, value) => {},
  onBlur = (e) => {},
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

  const Option = useCallback((props) => {
    const { data } = props;
    const children = (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
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
        <div style={{ textAlign: 'right' }}>{data?.subLabel}</div>
      </div>
    );
    return <components.Option {...props} children={children} />;
  }, []);

  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
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
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? COLOR_CODE.PRIMARY_100
                : state.isSelected
                ? COLOR_CODE.PRIMARY_100
                : 'white',
            }),
            menuPortal: (base, props) => ({
              ...base,
              zIndex: 999,
            }),
          }}
          {...props}
          components={{
            DropdownIndicator,
            Control: hideSearchIcon ? ControlNoSearchIcon : Control,
            ...(optionWithSubLabel && {
              Option: Option,
            }),
          }}
          menuPosition={menuPosition}
          onInputChange={onInputChange}
        />
      </View>
    </Element>
  );
};

export default SelectCmp;
