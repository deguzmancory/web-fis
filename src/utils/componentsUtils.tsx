import cn from 'classnames';
import { isEmpty } from 'src/validations';

export const getYesNo = (value: boolean, highLightValue = 'YES') => {
  if (isEmpty(value)) return '';
  const result = value ? 'YES' : 'NO';
  const isHighLight = highLightValue === result;
  return <span className={cn({ 'has-text-danger': isHighLight })}>{result}</span>;
};
