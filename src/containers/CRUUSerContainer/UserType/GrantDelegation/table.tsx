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
            {[
              { title: 'Username', width: '15%' },
              { title: 'Full Name', width: '15%' },
              { title: 'User Type', width: '20%' },
              { title: 'Project #', width: '10%' },
              { title: 'Start Date', width: '15%' },
              { title: 'End Date', width: '15%' },
              { title: ' ', width: '5%' },
            ].map((item) => (
              <StyledTableCell key={item.title} width={item.width}>
                {item.title}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(rows) ? (
            <EmptyTableDelegation />
          ) : (
            rows.map((row, index) => (
              <StyledTableRow key={`${row.delegatedUserId}-${row.username}-${index}`}>
                <StyledTableCell width={'15%'}>{row.username}</StyledTableCell>
                <StyledTableCell width={'15%'}>{row.fullName}</StyledTableCell>
                <StyledTableCell width={'20%'}>{displayRoleName(row.roleName)}</StyledTableCell>
                <StyledTableCell width={'10%'}>{row.projectNumber}</StyledTableCell>
                <StyledTableCell width={'15%'}>
                  <DatePickerEdit
                    data={row}
                    rowIndex={index}
                    tempValue={USER_KEY.START_DATE_TEMP}
                    value={USER_KEY.START_DATE}
                    maxDate={dayjs(row.endDateTemp).toDate()}
                    formikProps={formikProps}
                  />
                </StyledTableCell>
                <StyledTableCell width={'15%'}>
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
