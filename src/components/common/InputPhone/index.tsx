import cn from 'classnames';
import { useRef } from 'react';
import PhoneInput, { Country } from 'react-phone-number-input';
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
          international={onlyUS ? false : international}
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
          {...props}
        />

        <span className="cmp-phoneinput__icon">{icon}</span>
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
};

export default InputPhone;
export { EllipsisTooltipInputPhone };
