import { Grid, Stack } from '@mui/material';
import React from 'react';
import { Button, Select } from 'src/components/common';
import { CRUUSER_KEY, CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import {
  CRUUserFormikProps,
  getErrorMessage,
  getFACodeOptions,
} from 'src/containers/CRUUSerContainer/helper';
import { useGetFACode } from 'src/queries';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { UserFisCode } from 'src/queries/Users/types';
import ManageCodesTable from '../../shared/ManageCodesTable';

const SelectFACodes: React.FC<Props> = ({ formikProps, isLoading }) => {
  const { faCodes } = useGetFACode();

  const piOptions = React.useMemo(() => getFACodeOptions(faCodes), [faCodes]);

  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;

  const faCodeRows: UserFisCode[] = React.useMemo(
    () => values.fisFaInfo.userFisCodes || [],
    [values.fisFaInfo.userFisCodes]
  );

  const _getErrorMessage = (fieldName) => {
    return getErrorMessage(fieldName, { touched, errors });
  };

  const handleAddCode = () => {
    const currentFACode = values.fisFaInfo.currentFACode;

    if (faCodeRows.every((row) => row.code !== currentFACode)) {
      const newRows = [
        ...faCodeRows,
        {
          code: currentFACode,
          codeType: ROLE_NAME.FA,
        },
      ];

      setFieldValue(`${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`, newRows);
    }

    setFieldValue(`${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_FA_CODE}`, null);
  };

  const handleDeleteCode = React.useCallback(
    (code) => {
      const updatedRow = faCodeRows.filter((row) => row.code !== code);

      setFieldValue(
        `${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.USER_FIS_CODES}`,
        updatedRow
      );
    },
    [faCodeRows, setFieldValue]
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <ManageCodesTable type={ROLE_NAME.FA} rows={faCodeRows} onDeleteCode={handleDeleteCode} />
      </Grid>
      <Grid item xs={12}>
        <Select
          label=""
          placeholder={'Search'}
          options={piOptions}
          hideSearchIcon
          isClearable={false}
          isDisabled={isLoading}
          {...getFieldProps(`${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_FA_CODE}`)}
          errorMessage={_getErrorMessage(
            `${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_FA_CODE}`
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

export default React.memo(SelectFACodes, (prevProps, nextProps) => {
  const prevNeededValues = prevProps.formikProps.values.fisFaInfo;
  const nextNeededValues = nextProps.formikProps.values.fisFaInfo;

  return (
    prevNeededValues.userFisCodes?.length === nextNeededValues.userFisCodes?.length &&
    prevNeededValues.currentFACode === nextNeededValues.currentFACode
  );
});
