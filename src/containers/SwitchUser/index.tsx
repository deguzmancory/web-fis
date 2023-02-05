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
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import {
  MyProfile,
  useGetDelegationAccesses,
  useGetTokenDelegation,
  useProfile,
  useUpdateCurrentRoleProfile,
} from 'src/queries';
import { getRoleName } from 'src/queries/Profile/helpers';
import { setIsUpdatedCurrentRole, setProfile } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/store';
import { DelegationKeyService, Toastify } from 'src/services';
import { isEmpty } from 'src/validations';
import { handleShowErrorMsg } from '../UsersManagement/helpers';

import './styles.scss';

const SwitchUser: React.FC<Props> = ({
  onSetUpdatedCurrentRoleStatus,
  userProfile,
  onSetProfile,
}) => {
  const { profile } = useProfile();
  const [rowSelected, setRowSelected] = React.useState<{
    id: string;
    type: 'role' | 'delegate' | '';
  }>({
    id: '',
    type: '',
  });
  // console.log('rowSelected: ', rowSelected);

  const { getMyProfile, handleInvalidateProfile } = useProfile();

  const handleSwitchUser = () => {
    if (rowSelected.type === 'role') {
      const role = profile.roles.find((_role) => _role.roleId === rowSelected.id);
      updateCurrentRoleMyProfile({
        roleName: role.role.name,
      });
    } else if (rowSelected.type === 'delegate') {
      const user = myAccessesRows.find((row) => row.id === rowSelected.id);
      getTokenDelegation({
        accessId: rowSelected.id,
        fullName: user.user.fullName,
        username: user.user.username,
        roleName: user.userRole.role.name,
      });
    } else {
      Toastify.error('Error when switch user, Please refresh page and try again!');
    }
  };

  // Switch Role
  const roleRows = React.useMemo(() => {
    if (profile) {
      return [...profile.roles];
    } else {
      return [];
    }
  }, [profile]);

  const { updateCurrentRoleMyProfile, isLoading } = useUpdateCurrentRoleProfile({
    onSuccess(data, variables, context) {
      handleInvalidateProfile();
      getMyProfile();
      Toastify.info(
        `You are now logged in as: ${profile.username} - ${getRoleName(variables.roleName)}`
      );
      onSetUpdatedCurrentRoleStatus(true);
      setRowSelected({
        id: '',
        type: '',
      });

      DelegationKeyService.clearDelegationKey();
    },
  });

  // End Switch Role

  // Switch Delegation Access
  const { getDelegationAccesses, receivedAccesses } = useGetDelegationAccesses();
  const { getTokenDelegation, isLoading: isLoadingGetTokenDelegation } = useGetTokenDelegation({
    onSuccess(data, variables, context) {
      const jwt = data?.data.data?.jwt;
      if (jwt) {
        DelegationKeyService.setDelegationKey(jwt);
        Toastify.info(
          `You are now logged in as: ${variables.username} - ${getRoleName(variables.roleName)}.`
        );

        const formatNewProfile: MyProfile = {
          ...userProfile,
          fullName: `${profile.fullName.match(/\b(\w)/g)} as ${variables.fullName}`,
          username: variables.username,
          currentRole: variables.roleName,
        };
        onSetProfile(formatNewProfile);
      } else {
        Toastify.error('Fail to switch user, please try again');
      }
    },
    onError(error, variables, context) {
      handleShowErrorMsg(error);
    },
  });

  const myAccessesRows = React.useMemo(() => {
    if (receivedAccesses) {
      return [...receivedAccesses.myAccesses];
    } else {
      return [];
    }
  }, [receivedAccesses]);

  React.useEffect(() => {
    if (isEmpty(receivedAccesses)) {
      getDelegationAccesses();
    }
  }, [getDelegationAccesses, receivedAccesses]);

  // End Switch Delegation Access

  const loading = React.useMemo(() => {
    return isLoading || isLoadingGetTokenDelegation;
  }, [isLoading, isLoadingGetTokenDelegation]);

  return (
    <Box py={4} minHeight={'60vh'}>
      <Container maxWidth="lg">
        <Typography variant="h2">Switch User Account</Typography>

        <Box my={2} p={4} bgcolor={COLOR_CODE.WHITE} border={COLOR_CODE.DEFAULT_BORDER}>
          <Typography variant="body1">
            Currently signed in as:{' '}
            <b>
              {userProfile?.fullName} ({userProfile?.username})
            </b>{' '}
            - {getRoleName(userProfile?.currentRole)} - Financial
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
                  {isEmpty(roleRows) ? (
                    <StyledTableRow>
                      <StyledTableCell>
                        <Box minHeight={'150px'}>&nbsp;</Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    roleRows.map((row, index) => (
                      <StyledTableRow
                        key={`${row.roleId}-${row.createdAt}-${index}`}
                        onClick={() => {
                          setRowSelected({
                            id: row.roleId,
                            type: 'role',
                          });
                        }}
                        className="cursor-pointer"
                        {...(rowSelected.id === row.roleId && {
                          sx: {
                            bgcolor: `#DFEDF7 !important`,
                          },
                        })}
                      >
                        <StyledTableCell>{profile.fullName}</StyledTableCell>
                        <StyledTableCell>{row.role.displayName}</StyledTableCell>
                        <StyledTableCell>Financial</StyledTableCell>
                        <StyledTableCell>&nbsp;</StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                  {isEmpty(myAccessesRows) ? (
                    <></>
                  ) : (
                    myAccessesRows.map((row, index) => (
                      <StyledTableRow
                        key={`${row.userId}-${row.id}-${index}`}
                        onClick={() => {
                          setRowSelected({
                            id: row.id,
                            type: 'delegate',
                          });
                        }}
                        className="cursor-pointer"
                        {...(rowSelected.id === row.id && {
                          sx: {
                            bgcolor: `#DFEDF7 !important`,
                          },
                        })}
                      >
                        <StyledTableCell>{row.user.fullName}</StyledTableCell>
                        <StyledTableCell>{getRoleName(row.userRole.role.name)}</StyledTableCell>
                        <StyledTableCell>Financial</StyledTableCell>
                        <StyledTableCell>Y</StyledTableCell>
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
              disabled={isEmpty(rowSelected.id) || loading}
              onClick={() => handleSwitchUser()}
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

const mapStateToProps = (state: IRootState) => ({
  userProfile: state.auth.user,
});

const mapDispatchToProps = {
  onSetUpdatedCurrentRoleStatus: setIsUpdatedCurrentRole,
  onSetProfile: setProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchUser);
