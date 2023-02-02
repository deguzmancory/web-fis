import {
  Box,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Button } from 'src/components/common';
import { useProfile, useUpdateCurrentRoleProfile } from 'src/queries';
import { getRoleName } from 'src/queries/Profile/helpers';
import { setIsUpdatedCurrentRole } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Toastify } from 'src/services';
import { isEmpty } from 'src/validations';
import {
  StyledTableCell,
  StyledTableRow,
} from '../CRUUSerContainer/UserType/GrantDelegation/table';
import './styles.scss';

const SwitchUser: React.FC<Props> = ({ onSetUpdatedCurrentRoleStatus }) => {
  const { profile } = useProfile();
  const [rowSelected, setRowSelected] = React.useState(null);

  const currentProfile = React.useMemo(() => {
    return {
      fullName: profile.fullName || 'Anonymous',
      username: profile.username || 'Anonymous',
      roleName: getRoleName(profile.currentRole),
    };
  }, [profile]);

  const rows = React.useMemo(() => {
    return [
      ...profile.roles.map((role) => ({
        name: role.role.name,
        id: role.roleId,
        delegatedAccount: false,
      })),
    ];
  }, [profile]);

  const handleSwitchUser = () => {
    const role = profile.roles.find((_role) => _role.roleId === rowSelected);
    updateCurrentRoleMyProfile({
      roleName: role.role.name,
    });
  };

  const { getMyProfile, handleInvalidateProfile } = useProfile();
  const { updateCurrentRoleMyProfile, isLoading } = useUpdateCurrentRoleProfile({
    onSuccess(data, variables, context) {
      handleInvalidateProfile();
      getMyProfile();
      Toastify.info(
        `You are now logged in as: ${currentProfile.fullName} - ${getRoleName(variables.roleName)}`
      );
      onSetUpdatedCurrentRoleStatus(true);
      setRowSelected(true);
    },
  });

  const loading = React.useMemo(() => {
    return isLoading;
  }, [isLoading]);

  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="lg">
        <Typography variant="h2">Switch User Account</Typography>

        <Box my={2} p={4} bgcolor={COLOR_CODE.WHITE} border={COLOR_CODE.DEFAULT_BORDER}>
          <Typography variant="body1">
            Currently signed in as:{' '}
            <b>
              {currentProfile.fullName} ({currentProfile.username})
            </b>{' '}
            - {currentProfile.roleName} - Financial
          </Typography>

          <Box my={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Full Name', 'User Type', 'System', 'Delegated Account'].map((item) => (
                      <StyledTableCell key={item}>{item}</StyledTableCell>
                    ))}
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
                    rows.map((row) => (
                      <StyledTableRow
                        key={row.id}
                        onClick={() => {
                          setRowSelected(row.id);
                        }}
                        className="cursor-pointer"
                        {...(rowSelected === row.id && {
                          sx: {
                            bgcolor: `#DFEDF7 !important`,
                          },
                        })}
                      >
                        <StyledTableCell>{currentProfile.fullName}</StyledTableCell>
                        <StyledTableCell>{getRoleName(row.name)}</StyledTableCell>
                        <StyledTableCell>Financial</StyledTableCell>
                        <StyledTableCell>{row.delegatedAccount ? 'Y' : ''}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Stack flexDirection={'row'} justifyContent="flex-end">
            <Button
              isLoading={loading}
              disabled={isEmpty(rowSelected) || loading}
              onClick={handleSwitchUser}
            >
              Switch to Selected User Account
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onSetUpdatedCurrentRoleStatus: setIsUpdatedCurrentRole,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchUser);
