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
import { useGetFACode } from 'src/queries';
import { FACode } from 'src/queries/Contents/types';
import { ROLE_NAME } from 'src/queries/Profile/helpers';
import { UserFisCode } from 'src/queries/Users/types';
import TableCodes from '../../shared/TableCodes';

const SelectFACodes: React.FC<Props> = ({ formikProps, isLoading }) => {
  const history = useHistory();
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);

  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;
  const { faCodes } = useGetFACode();
  const isInEditProfileMode = isEditProfileMode(values.mode);

  const faCodeRows: UserFisCode[] = React.useMemo(
    () => values.fisFaInfo.userFisCodes || [],
    [values.fisFaInfo.userFisCodes]
  );

  const piOptions = React.useMemo(
    () =>
      getFisCodeOptions<FACode>({
        code: faCodes,
        codeType: ROLE_NAME.FA,
        excludeCodes: faCodeRows.map((code) => code.code),
      }),
    [faCodes, faCodeRows]
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

      //reset data in <TableProjects />
      history.push({ search: query.toString() });
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

      //reset data in <TableProjects />
      history.push({ search: query.toString() });
    },
    [history, faCodeRows, setFieldValue, query]
  );

  return (
    <Box>
      <Box mb={1} mt={5}>
        <TableCodes
          type={ROLE_NAME.FA}
          rows={faCodeRows}
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
                `${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_FA_CODE}`
              )}
              errorMessage={_getErrorMessage(
                `${CRUUSER_KEY.FIS_FA_INFO}.${CRUUSER_USER_TYPE_KEY.CURRENT_FA_CODE}`
              )}
              onChange={setFieldValue}
              menuStyle={{
                width: '200px',
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
