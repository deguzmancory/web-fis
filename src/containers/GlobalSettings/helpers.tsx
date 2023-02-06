/* eslint-disable security/detect-object-injection */
import { GlobalSettings } from 'src/queries';
import { isEmpty } from 'src/validations';

export type GlobalSettingFormatted = {
  title: string;
  order: number;
  items: GlobalSettings;
};

export const getFormatGlobalSettingsResponse = (globalSettings: GlobalSettings) => {
  if (isEmpty(globalSettings)) return [];

  let result: {} = {};

  for (const item of globalSettings) {
    const groupDisplayName = item.settingGroup.settingGroupDisplayName;

    if (!result[groupDisplayName]) {
      result[groupDisplayName] = {
        order: item.settingGroup.settingGroupSortOrder,
        title: item.settingGroup.settingGroupDisplayName,
        items: [],
      };
    }

    result[groupDisplayName].items.push(item);
  }

  return Object.values(result)
    .sort((a: GlobalSettingFormatted, b: GlobalSettingFormatted) => a.order - b.order)
    .map((group: GlobalSettingFormatted) => {
      group.items.sort((a, b) => a.settingSortOrder - b.settingSortOrder);
      return group;
    });
};

export const updateSettingValue = ({ currentSetting, groupIndex, itemIndex, properties }) => {
  return currentSetting.map((group, i) => {
    if (i === groupIndex) {
      return {
        ...group,
        items: group.items.map((item, j) => {
          if (j === itemIndex) {
            return {
              ...item,
              ...properties,
            };
          }
          return item;
        }),
      };
    }
    return group;
  });
};
