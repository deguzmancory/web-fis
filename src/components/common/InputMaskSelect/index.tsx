import cn from 'classnames';
import { useRef } from 'react';
import Select from 'react-select';
import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import InputMask from '../InputMask';
import View from '../View';
import './styles.scss';

const InputMaskSelect = ({
  options,
  onChangeSelect,
  // onChange,
  label = '',
  className = '',
  selectValue = null,
  mask = '***',
  maskChar = null,
  errorMessage = '',
  selectPlaceholder = '',
  inputPlaceholder = '',
  containerClassName = '',
  onSelectBlur,
  selectName = '',
  inputName = '',
  required = false,
  infoTooltipMessage = '',
  inputRef = null,
  infoToolTipWithArrow = true,
  isClearable = false,

  ...props
}) => {
  const id = useRef(`input-select-${getRandomId()}`);

  const handleChangeSelect = (selectedOption) => {
    onChangeSelect(selectName, selectedOption?.value || null);
  };

  const handleSelectBlur = (event) => {
    onSelectBlur && onSelectBlur(selectName, true);
  };
  const hasError = !isEmpty(errorMessage);

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      border: 'none',
    }),
    control: (provided, _state) => ({
      ...provided,
      border: 'none',
      borderRadius: '8px 0 0 8px',
      borderRight: '1px solid #e5e4e4',
      width: 80,
      // flexDirection: 'row-reverse',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      '& svg': {
        width: '14px',
        height: '14px',
        color: '#6D7176',
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
  };

  const selectedOption = options?.find((option) => option.value === selectValue) || null;

  // For custom select, follow this link:
  // https://react-select.com/styles#using-classnames
  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={cn(containerClassName)}
      required={required}
      infoTooltipMessage={infoTooltipMessage}
      infoToolTipWithArrow={infoToolTipWithArrow}
    >
      <View className={cn('cmp-input-mask-select', { 'cmp-input-select--error': hasError })}>
        <Select
          id={id.current}
          isClearable={isClearable}
          value={selectedOption}
          placeholder={selectPlaceholder}
          onChange={handleChangeSelect}
          options={options}
          className={cn('cmp-input-mask-select__select', className)}
          classNamePrefix="input-mask-select"
          menuPlacement="auto"
          onBlur={handleSelectBlur}
          name={selectName}
          styles={customStyles}
          // {...props}
        />
        <InputMask
          id={id.current}
          className={cn(className, 'cmp-input-mask-select__input')}
          mask={mask}
          maskChar={maskChar}
          ref={inputRef}
          placeholder={inputPlaceholder}
          name={inputName}
          {...props}
        />
      </View>
    </Element>
  );
};

export default InputMaskSelect;
