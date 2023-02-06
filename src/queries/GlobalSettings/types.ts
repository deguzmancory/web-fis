export enum GLOBAL_SETTING_TYPE {
  BOOLEAN = 'boolean',
  INT = 'int',
  STRING = 'string',
  DATE_TIME = 'datetime',
}

export type GlobalSetting = {
  settingId: number | string;
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
};

export type GlobalSettings = GlobalSetting[];

export enum GLOBAL_SETTING_KEY {
  PASSWORD_RESET_MONTHS = 'PasswordResetMonths', //pragma: allowlist secret
  TEMP_PASSWORD_VALID_HOURS = 'TempPasswordValidHours', //pragma: allowlist secret
}
