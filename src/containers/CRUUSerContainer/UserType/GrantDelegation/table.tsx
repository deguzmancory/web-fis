import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';

import dayjs from 'dayjs';
import React from 'react';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';

import { getRoleName, ROLE_NAME } from 'src/queries/Profile/helpers';
import { USER_KEY } from 'src/queries/Users/types';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps } from '../../helper';
import { EmptyTableDelegation } from '../helpers';
import ActionsButton from './actionsButton';
import DatePickerEdit from './datePickerEdit';
import { getAfterDate } from './helpers';

const TableGrantDelegation: React.FC<Props> = ({ formikProps }) => {
  const { values } = formikProps;

  const rows = values.delegateAccess;

  const displayRoleName = (value: string) => {
    if (
      value === ROLE_NAME.CU ||
      value === ROLE_NAME.PI ||
      value === ROLE_NAME.SU ||
      value === ROLE_NAME.FA
    ) {
      return getRoleName(value);
    } else {
      return value;
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {['Username', 'Full Name', 'User Type', 'Project #', 'Start Date', 'End Date', ' '].map(
              (item) => (
                <StyledTableCell key={item}>{item}</StyledTableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(rows) ? (
            <EmptyTableDelegation />
          ) : (
            rows.map((row, index) => (
              <StyledTableRow key={`${row.delegatedUserId}-${row.username}-${index}`}>
                <StyledTableCell>{row.username}</StyledTableCell>
                <StyledTableCell>{row.fullName}</StyledTableCell>
                <StyledTableCell>{displayRoleName(row.roleName)}</StyledTableCell>
                <StyledTableCell>{row.projectNumber}</StyledTableCell>
                <StyledTableCell>
                  <DatePickerEdit
                    data={row}
                    rowIndex={index}
                    tempValue={USER_KEY.START_DATE_TEMP}
                    value={USER_KEY.START_DATE}
                    maxDate={dayjs(row.endDateTemp).toDate()}
                    formikProps={formikProps}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <DatePickerEdit
                    data={row}
                    rowIndex={index}
                    tempValue={USER_KEY.END_DATE_TEMP}
                    value={USER_KEY.END_DATE}
                    minDate={getAfterDate(row.startDateTemp, new Date())}
                    formikProps={formikProps}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <ActionsButton data={row} rowIndex={index} formikProps={formikProps} />
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type Props = {
  formikProps: CRUUserFormikProps;
};

export default TableGrantDelegation;
