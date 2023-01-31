import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import dayjs from 'dayjs';
import React from 'react';
import { COLOR_CODE } from 'src/appConfig/constants';
import { USER_KEY } from 'src/queries/Users/types';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps } from '../../helper';
import ActionsButton from './actionsButton';
import DatePickerEdit from './datePickerEdit';

const TableGrantDelegation: React.FC<Props> = ({ formikProps }) => {
  const { values } = formikProps;

  const rows = values.tempDelegateAccess;

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
            <StyledTableRow>
              <StyledTableCell>
                <Box minHeight={'150px'}>&nbsp;</Box>
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            rows.map((row, index) => (
              <StyledTableRow key={row.username}>
                <StyledTableCell>{row.username}</StyledTableCell>
                <StyledTableCell>{row.fullName}</StyledTableCell>
                <StyledTableCell>{row.roleName}</StyledTableCell>
                <StyledTableCell>{row.projectNumber}</StyledTableCell>
                <StyledTableCell>
                  <DatePickerEdit
                    data={row}
                    rowIndex={index}
                    keyValue={USER_KEY.START_DATE}
                    maxDate={dayjs(row.endDateTemp).toDate()}
                    formikProps={formikProps}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <DatePickerEdit
                    data={row}
                    rowIndex={index}
                    keyValue={USER_KEY.END_DATE}
                    minDate={dayjs(row.startDateTemp).toDate()}
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

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: COLOR_CODE.PRIMARY_900,
    color: theme.palette.common.white,
    padding: '4px 16px',
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '4px 16px',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderBottom: COLOR_CODE.DEFAULT_BORDER,
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));
