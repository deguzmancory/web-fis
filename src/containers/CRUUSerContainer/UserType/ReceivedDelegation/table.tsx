import { Check } from '@mui/icons-material';
import {
  Box,
  IconButton,
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
import { getRoleName } from 'src/queries/Profile/helpers';
import { DateFormat } from 'src/utils/momentUtils';
import { isEmpty } from 'src/validations';
import { CRUUserFormikProps } from '../../helper';

const TableGrantDelegation: React.FC<Props> = ({ formikProps }) => {
  // const { values } = formikProps;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rows, setRows] = React.useState([]);

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
                <StyledTableCell>{getRoleName(row.roleName)}</StyledTableCell>
                <StyledTableCell>{row.projectNumber}</StyledTableCell>
                <StyledTableCell>{dayjs(row.startDate).format(DateFormat)}</StyledTableCell>
                <StyledTableCell>{dayjs(row.endDate).format(DateFormat)}</StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    size="small"
                    sx={{
                      p: 0,
                      mr: 1,
                      opacity: 0,
                    }}
                    disabled
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      p: 0,
                      opacity: 0,
                    }}
                    disabled
                  >
                    <Check />
                  </IconButton>
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderBottom: COLOR_CODE.DEFAULT_BORDER,
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));
