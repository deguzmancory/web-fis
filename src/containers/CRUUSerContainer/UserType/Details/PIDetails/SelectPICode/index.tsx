import { Box } from '@mui/material';
import { get } from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { Checkbox, Select } from 'src/components/common';
import { CRUUSER_KEY, CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import {
  CRUUserFormikProps,
  getErrorMessage,
  getFisCodeOptions,
  isEditProfileMode,
} from 'src/containers/CRUUSerContainer/helper';
import { PICode } from 'src/queries/Contents/types';
import { useGetPICode } from 'src/queries/Contents/useGetPICode';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
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
    () =>
      getFisCodeOptions<PICode>({ code: piCodes, fullObjectValue: false, codeType: ROLE_NAME.PI }),
    [piCodes]
  );

  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;
  const isInEditProfileMode = isEditProfileMode(values.mode);

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleSelectPICode = (name, value) => {
    setFieldValue(name, value);

    //set "userFisCodes" field to able to reuse this field in shared components <TableProjects /> and <SearchProjects />
    setFieldValue(
      `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`,
      value ? [{ code: value }] : []
    );

    //reset data in <TableProjects />
    history.push({ search: query.toString() });
  };

  const handleUseExistingPICodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const existingPICode = initialPIInfo?.piCode || null;

    if (!value) {
      setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`, existingPICode);
      setFieldValue(
        `${prefix}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`,
        existingPICode ? [{ code: existingPICode }] : []
      );

      //reset data in <TableProjects />
      history.push({ search: query.toString() });
    }

    setFieldValue(`${prefix}.${CRUUSER_USER_TYPE_KEY.USE_EXISTING_PI_CODE}`, value);
  };

  return (
    <Box>
      <Box
        sx={{
          marginTop: `13px`,
        }}
      >
        <Select
          label="PI Code"
          placeholder={'Search'}
          options={piOptions}
          hideSearchIcon
          isClearable={false}
          isDisabled={
            isLoading ||
            !get(values, `${prefix}.${CRUUSER_USER_TYPE_KEY.USE_EXISTING_PI_CODE}`) ||
            isInEditProfileMode
          }
          {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`)}
          errorMessage={_getErrorMessage(`${prefix}.${CRUUSER_USER_TYPE_KEY.PI_CODE}`)}
          onChange={handleSelectPICode}
        />
      </Box>
      {!isInEditProfileMode && (
        <Box mt={2}>
          <Checkbox.Item
            label="Use Existing PI Code"
            {...getFieldProps(`${prefix}.${CRUUSER_USER_TYPE_KEY.USE_EXISTING_PI_CODE}`)}
            errorMessage={_getErrorMessage(
              `${prefix}.${CRUUSER_USER_TYPE_KEY.USE_EXISTING_PI_CODE}`
            )}
            onChange={handleUseExistingPICodeChange}
            disabled={isLoading}
          />
        </Box>
      )}
    </Box>
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
