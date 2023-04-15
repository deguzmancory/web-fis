import cn from 'classnames';
import { useRef } from 'react';
import PhoneInput, { Country } from 'react-phone-number-input';
import PhoneInputWithoutFlags from 'react-phone-number-input/input';
import { Callback } from 'src/redux/types';
import { getRandomId } from 'src/utils';
import { isEmpty } from 'src/validations';
import Element from '../Element';
import EllipsisTooltipBaseInput, {
  EllipsisTooltipBaseInputProps,
} from '../EllipsisTooltipBaseInput';
import View from '../View';
import './styles.scss';

const InputPhone: React.FC<Props> = ({
  label = '',
  defaultCountryCode = 'US',
  errorMessage,
  containerClassName = '',
  name,
  icon = null,
  required = false,
  disabled,
  international = true,
  countries,
  onlyUS,
  onChange,
  ...props
}) => {
  const id = useRef(`input-${getRandomId()}`);

  const handleChange = (value) => {
    onChange(name, value ? value : '');
  };

  // For change style of phone input, follow:
  // https://catamphetamine.gitlab.io/react-phone-number-input/
  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
      required={required}
    >
      <View className="cmp-phoneinput">
        <PhoneInput
          international={international}
          defaultCountry={defaultCountryCode}
          className={cn('cmp-phoneinput__input', {
            'cmp-phoneinput__input--error': !isEmpty(errorMessage),
            'cmp-phoneinput__input--disabled': disabled,
          })}
          onChange={handleChange}
          name={name}
          countryOptionsOrder={['US']}
          countries={onlyUS ? ['US'] : countries}
          disabled={disabled}
          c
          {...props}
        />

        <span className="cmp-phoneinput__icon">{icon}</span>
      </View>
    </Element>
  );
};

const InputPhoneWithoutFlags: React.FC<Props> = ({
  label = '',
  errorMessage,
  containerClassName = '',
  name,
  icon = null,
  required = false,
  disabled,
  international = true,
  country = 'US',
  onlyUS,
  onChange,
  ...props
}) => {
  const id = useRef(`input-${getRandomId()}`);

  const handleChange = (value) => {
    onChange(name, value ? value : '');
  };

  // For change style of phone input, follow:
  // https://catamphetamine.gitlab.io/react-phone-number-input/
  return (
    <Element
      id={id.current}
      errorMessage={errorMessage}
      label={label}
      className={containerClassName}
      required={required}
    >
      <View className="cmp-phone-input-without-flags" isRow align="center">
        <PhoneInputWithoutFlags
          international={international}
          className={cn('cmp-phone-input-without-flags__input', {
            'cmp-phone-input-without-flags__input--error': !isEmpty(errorMessage),
            'cmp-phone-input-without-flags__input--disabled': disabled,
          })}
          onChange={handleChange}
          name={name}
          country={country}
          disabled={disabled}
          {...props}
        />

        <span className="cmp-phone-input-without-flags__icon">{icon}</span>
      </View>
    </Element>
  );
};

const EllipsisTooltipInputPhone: React.FC<EllipsisTooltipInputProps> = ({ ...props }) => {
  return (
    <EllipsisTooltipBaseInput {...props}>
      <InputPhone name={props.name} />
    </EllipsisTooltipBaseInput>
  );
};

export type EllipsisTooltipInputProps = EllipsisTooltipBaseInputProps & Props;

type Props = {
  label?: React.ReactNode;
  defaultCountryCode?: Country;
  errorMessage?: string;
  containerClassName?: string;
  name: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  international?: boolean;
  countries?: Country[];
  onlyUS?: boolean;
  onChange?: Callback;

  //InputPhoneWithoutFlags
  country?: Country;
};

export default InputPhone;
export { EllipsisTooltipInputPhone, InputPhoneWithoutFlags };
