import { COLOR_CODE } from 'src/appConfig/constants';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';

export const EmptyTableDelegation = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <StyledTableRow
          key={index}
          sx={{
            backgroundColor: `${COLOR_CODE.WHITE} !important`,
            '&:not(:last-child)': {
              borderBottomWidth: `0px !important`,
            },
          }}
        >
          <StyledTableCell
            colSpan={7}
            sx={{
              borderLeft: COLOR_CODE.DEFAULT_BORDER,
              borderRight: COLOR_CODE.DEFAULT_BORDER,
              borderBottomWidth: `0px !important`,
            }}
          >
            &nbsp;
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </>
  );
};
