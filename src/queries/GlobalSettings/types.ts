export enum GLOBAL_SETTING_TYPE {
  BOOLEAN = 'boolean',
  INT = 'int',
  STRING = 'string',
  DATE_TIME = 'datetime',
}

export type GlobalSetting = {
  settingId: number | string;
  settingName: string;
  settingValue: string | boolean;
  settingType: GLOBAL_SETTING_TYPE;
  settingSortOrder: number;
  settingGroup: {
    settingGroupDisplayName: string;
    settingGroupSortOrder: number;
  };
  settingSubGroup: any;
};

export type GlobalSettings = GlobalSetting[];
