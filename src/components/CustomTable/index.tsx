import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { COLOR_CODE } from 'src/appConfig/constants';

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
