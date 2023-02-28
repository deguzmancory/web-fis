import { Box, Stack } from '@mui/material';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { Button, Select } from 'src/components/common';
import { CRUUSER_KEY, CRUUSER_USER_TYPE_KEY } from 'src/containers/CRUUSerContainer/enums';
import {
  CRUUserFormikProps,
  getErrorMessage,
  getFisCodeOptions,
  isEditProfileMode,
} from 'src/containers/CRUUSerContainer/helper';
import { useGetPICode } from 'src/queries';
import { PICode } from 'src/queries/Contents/types';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { UserFisCode } from 'src/queries/Users/types';
import TableCodes from '../../shared/TableCodes';

const SelectPICodes: React.FC<Props> = ({ formikProps, isLoading }) => {
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);

  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;
  const { piCodes } = useGetPICode();
  const isInEditProfileMode = isEditProfileMode(values.mode);

  const piCodeRows: UserFisCode[] = React.useMemo(
    () => values.fisSuInfo.userFisCodes || [],
    [values.fisSuInfo.userFisCodes]
  );

  const piOptions = React.useMemo(
    () =>
      getFisCodeOptions<PICode>({
        code: piCodes,
        fullObjectValue: true,
        codeType: ROLE_NAME.PI,
        excludeCodes: piCodeRows.map((code) => code.code),
      }),
    [piCodes, piCodeRows]
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

      //reset data in <TableProjects />
      history.push({ search: query.toString() });
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

      //reset data in <TableProjects />
      history.push({ search: query.toString() });
    },
    [history, piCodeRows, setFieldValue, query]
  );

  return (
    <Box>
      <Box mb={1} mt={5}>
        <TableCodes
          type={ROLE_NAME.PI}
          rows={piCodeRows}
          onDeleteCode={handleDeleteCode}
          readonly={isInEditProfileMode}
        />
      </Box>

      {!isInEditProfileMode && (
        <>
          <Box mb={1}>
            <Select
              label=""
              placeholder={'Search'}
              options={piOptions}
              hideSearchIcon
              isClearable={false}
              isDisabled={isLoading}
              {...getFieldProps(
                `${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_PI_CODE}`
              )}
              errorMessage={_getErrorMessage(
                `${CRUUSER_KEY.FIS_SU_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_PI_CODE}`
              )}
              onChange={setFieldValue}
              menuStyle={{
                width: '320px',
              }}
            />
          </Box>
          <Box mb={1}>
            <Stack alignItems={'flex-end'}>
              <Button onClick={handleAddCode}>Add</Button>
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
};

type Props = {
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
