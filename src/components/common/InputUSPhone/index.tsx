import { useRef } from 'react';
import { Callback } from 'src/redux/types';
import { getRandomId } from 'src/utils';
import { InputMask } from '..';
import Element from '../Element';
import EllipsisTooltipBaseInput, {
  EllipsisTooltipBaseInputProps,
} from '../EllipsisTooltipBaseInput';
import View from '../View';
import './styles.scss';

const InputUSPhone: React.FC<Props> = ({
  label = '',
  errorMessage,
  containerClassName = '',
  name,
  required = false,
  disabled,
  onChange,
  ...props
}) => {
  const id = useRef(`input-${getRandomId()}`);

  const handleChange = (e) => {
    const value = e.target.value;

    onChange(name, value ? value.replace(/\s/g, '') : '');
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
        <InputMask
          name={name}
          mask="999 999 9999"
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
      </View>
    </Element>
  );
};

const EllipsisTooltipInputPhone: React.FC<EllipsisTooltipInputProps> = ({ ...props }) => {
  return (
    <EllipsisTooltipBaseInput {...props}>
      <InputUSPhone name={props.name} onChange={props.onChange} />
    </EllipsisTooltipBaseInput>
  );
};

export type EllipsisTooltipInputProps = EllipsisTooltipBaseInputProps & Props;

type Props = {
  label?: React.ReactNode;
  errorMessage?: string;
  containerClassName?: string;
  name: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  onChange: Callback;
};

export default InputUSPhone;
export { EllipsisTooltipInputPhone };
