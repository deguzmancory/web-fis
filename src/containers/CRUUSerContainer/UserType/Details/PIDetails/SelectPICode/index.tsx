import { Grid } from '@mui/material';
import { get } from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { Checkbox, Select } from 'src/components/common';
import { CRUUSER_KEY, CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import {
  CRUUserFormikProps,
  getErrorMessage,
  getPICodeOptions,
} from 'src/containers/CRUUSerContainer/helper';
import { useGetPICode } from 'src/queries/Contents/useGetPICode';
import { PIDetail } from 'src/queries/Users/types';

const SelectPICode: React.FC<Props> = ({
  prefix = CRUUSER_KEY.FIS_PI_INFO,
  initialPIInfo,
  formikProps,
  isLoading,
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const { piCodes } = useGetPICode();

  const piOptions = React.useMemo(
    () => getPICodeOptions({ piCodes, fullObjectValue: false }),
    [piCodes]
  );

  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleUseExistingPICodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const existingPICode = initialPIInfo?.piCode || null;

    //TODO: confirm the logic
    if (value === true) {
      setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`, existingPICode);
      setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`, [value]);
    }

    setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.USE_EXISTING_PI_CODE}`, value);
    history.push({ search: query.toString() });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Select
          label="PI Code"
          placeholder={'Search'}
          options={piOptions}
          hideSearchIcon
          isClearable={false}
          isDisabled={
            isLoading ||
            get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USE_EXISTING_PI_CODE}`) === true
          }
          {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`)}
          errorMessage={_getErrorMessage(`${prefix}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`)}
          onChange={(name, value) => {
            setFieldValue(name, value);
            setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`, [value]);
            history.push({ search: query.toString() });
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Checkbox.Item
          label="Use Existing PI Code"
          {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.USE_EXISTING_PI_CODE}`)}
          errorMessage={_getErrorMessage(`${prefix}.${CRUUSER_USER_TYPE_KEY.USE_EXISTING_PI_CODE}`)}
          onChange={handleUseExistingPICodeChange}
          disabled={isLoading}
        />
      </Grid>
    </Grid>
  );
};

type Props = {
  prefix?: string;
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
  initialPIInfo?: PIDetail;
};

export default React.memo(SelectPICode, (prevProps, nextProps) => {
  const prevNeededValues = prevProps.formikProps.values.fisPiInfo;
  const nextNeededValues = nextProps.formikProps.values.fisPiInfo;

  return (
    prevNeededValues.piCode === nextNeededValues.piCode &&
    prevNeededValues.useExistingPICode === nextNeededValues.useExistingPICode
  );
});
