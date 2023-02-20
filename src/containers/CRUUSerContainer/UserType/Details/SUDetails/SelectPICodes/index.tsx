import { Grid, Stack } from '@mui/material';
import React from 'react';
import { Button, Select } from 'src/components/common';
import { CRUUSER_KEY, CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import {
  CRUUserFormikProps,
  getErrorMessage,
  getPICodeOptions,
} from 'src/containers/CRUUSerContainer/helper';
import { useGetPICode } from 'src/queries';
import { PICode } from 'src/queries/Contents/types';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { UserFisCode } from 'src/queries/Users/types';
import ManageCodesTable from '../../shared/ManageCodesTable';

const SelectPICodes: React.FC<Props> = ({ formikProps, isLoading }) => {
  const { piCodes } = useGetPICode();

  const piOptions = React.useMemo(
    () => getPICodeOptions({ piCodes, fullObjectValue: true }),
    [piCodes]
  );

  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;

  const piCodeRows: UserFisCode[] = React.useMemo(
    () => values.fisSuInfo.userFisCodes || [],
    [values.fisSuInfo.userFisCodes]
  );

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleAddCode = () => {
    const currentPICode: PICode = values.fisSuInfo.currentPICode;

    if (piCodeRows.every((row) => row.code !== currentPICode.code)) {
      const newRows = [
        ...piCodeRows,
        {
          code: currentPICode.code,
          piName: currentPICode.piName,
          codeType: ROLE_NAME.PI,
        },
      ];

      setFieldValue(`${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`, newRows);
    }

    setFieldValue(`${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_PI_CODE}`, null);
  };

  const handleDeleteCode = React.useCallback(
    (code) => {
      const updatedRow = piCodeRows.filter((row) => row.code !== code);

      setFieldValue(
        `${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`,
        updatedRow
      );
    },
    [piCodeRows, setFieldValue]
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <ManageCodesTable type={ROLE_NAME.PI} rows={piCodeRows} onDeleteCode={handleDeleteCode} />
      </Grid>
      <Grid item xs={12}>
        <Select
          label=""
          placeholder={'Search'}
          options={piOptions}
          hideSearchIcon
          isClearable={false}
          isDisabled={isLoading}
          {...getFieldProps(`${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_PI_CODE}`)}
          errorMessage={_getErrorMessage(
            `${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_PI_CODE}`
          )}
          onChange={setFieldValue}
        />
      </Grid>
      <Grid item xs={12}>
        <Stack alignItems={'flex-end'}>
          <Button onClick={handleAddCode}>Add</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

type Props = {
  prefix?: string;
  formikProps: CRUUserFormikProps;
  isLoading: boolean;
};

export default React.memo(SelectPICodes, (prevProps, nextProps) => {
  const prevNeededValues = prevProps.formikProps.values.fisSuInfo;
  const nextNeededValues = nextProps.formikProps.values.fisSuInfo;

  return (
    prevNeededValues.userFisCodes?.length === nextNeededValues.userFisCodes?.length &&
    prevNeededValues.currentPICode === nextNeededValues.currentPICode
  );
});
