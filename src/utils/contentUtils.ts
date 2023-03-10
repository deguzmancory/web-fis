/* eslint-disable security/detect-object-injection */
import { ContentStore } from 'src/redux/common/types';

export const getContentOptions = (content: ContentStore, field: keyof ContentStore) => {
  if (!content) return [];
  const rawObject = content?.[field];
  const result = Array.isArray(rawObject)
    ? rawObject.map((x) => ({ ...x, value: x.value, label: x.displayName }))
    : [];
  return result;
};

export const getContentLabelFormValue = <T = any>(
  content: ContentStore,
  field: keyof ContentStore,
  value: T
) => {
  const options = getContentOptions(content, field);
  const foundItem = options.find((x) => x.value === value);
  return foundItem?.label || '';
};
