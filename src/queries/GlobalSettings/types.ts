export enum GLOBAL_SETTING_TYPE {
  BOOLEAN = 'boolean',
  INT = 'int',
  STRING = 'string',
  DATE_TIME = 'datetime',
}

export type GlobalSetting = {
  settingId: number;
  settingName: string;
  settingValue: string;
  settingType: GLOBAL_SETTING_TYPE;
  settingSortOrder: number;
  settingGroup: {
    settingGroupDisplayName: string;
    settingGroupSortOrder: number;
  };
  settingSubGroup: any;
  isEdit?: boolean;
  tempSettingValue?: string;
};

export type GlobalSettings = GlobalSetting[];

export enum GLOBAL_SETTING_KEY {
  PASSWORD_RESET_MONTHS = 'PasswordResetMonths', //pragma: allowlist secret
  FIRST_TIME_LOGIN_VALID_HOURS = 'FirstTimeLoginValidHours', //pragma: allowlist secret
}

export type UpdateGlobalSettingPayload = {
  settingId: number;
  settingName?: string;
  value: string;
  groupIndex?: number;
  itemIndex?: number;
};
