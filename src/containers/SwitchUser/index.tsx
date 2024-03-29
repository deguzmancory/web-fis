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
} from 'src/queries';
import { getRoleName, ROLE_NAME } from 'src/queries/Profile/helpers';
import { setCurrentRole, setIsUpdatedCurrentRole, setProfile } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/store';
import { DelegationKeyService, RoleService, Toastify } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import { isEmpty } from 'src/validations';

import './styles.scss';
import { useGetProfileProjects } from 'src/queries/Projects/useGetProfileProjects';

const SwitchUser: React.FC<Props> = ({
  currentRole,
  userProfile,
  onSetProfile,
  onSetCurrentRole,
}) => {
  const { mainProfile, handleInvalidateProfile, getMyProfile } = useProfile();
  const { handleInvalidateAllProfileProjects } = useGetProfileProjects();
  const [rowSelected, setRowSelected] = React.useState<{
    id: string;
    type: 'role' | 'delegate' | '';
  }>({
    id: '',
    type: '',
  });

  const handleSwitchUser = async () => {
    if (rowSelected.type === 'role') {
      DelegationKeyService.clearDelegationKey();

      await handleInvalidateProfile();
      const {
        data: { data: mainProfile },
      } = await getMyProfile();
      const role = mainProfile.roles.find((_role) => _role.roleId === rowSelected.id);
      const roleName = role.role.name;

      Toastify.info(`You are now logged in as: ${mainProfile.username} - ${getRoleName(roleName)}`);
      setRowSelected({
        id: '',
        type: '',
      });
      RoleService.setCurrentRole(roleName as ROLE_NAME);
      onSetCurrentRole(roleName as ROLE_NAME);
      onSetProfile(mainProfile);
    } else if (rowSelected.type === 'delegate') {
      const user = myAccessesRows.find((row) => row.id === rowSelected.id);
      getTokenDelegation(
        {
          accessId: rowSelected.id,
          fullName: user.user.fullName,
          username: user.user.username,
          roleName: user.userRole.role.name,
        },
        {
          onSuccess: async (data, variables, _context) => {
            const jwt = data?.data?.data?.jwt;
            if (jwt) {
              DelegationKeyService.setDelegationKey(jwt);
              Toastify.info(
                `You are now logged in as: ${variables.username} - ${getRoleName(
                  variables.roleName
                )}.`
              );

              await handleInvalidateProfile();
              const {
                data: { delegateUser: switchedProfile },
              } = await getMyProfile();
              const formatNewProfile: MyProfile = {
                ...switchedProfile,
                fullName: `${mainProfile.fullName.match(/\b(\w)/g)} as ${variables.fullName}`,
              };
              onSetProfile(formatNewProfile);
              onSetCurrentRole(variables.roleName as ROLE_NAME);
              RoleService.setCurrentRole(variables.roleName as ROLE_NAME);
            } else {
              Toastify.error('Fail to switch user, please try again');
            }
          },
        }
      );
    } else {
      Toastify.error('Error when switch user, Please refresh page and try again!');
    }

    handleInvalidateAllProfileProjects();
  };

  // Switch Role
  const roleRows = React.useMemo(() => {
    if (mainProfile) {
      return [...mainProfile.roles];
    } else {
      return [];
    }
  }, [mainProfile]);

  // End Switch Role

  // Switch Delegation Access
  const { getDelegationAccesses, receivedAccesses } = useGetDelegationAccesses();
  const { getTokenDelegation, isLoading: isLoadingGetTokenDelegation } = useGetTokenDelegation({
    onError(error, _variables, _context) {
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
            - {getRoleName(currentRole)} - Financial
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
                        <StyledTableCell>{mainProfile.fullName}</StyledTableCell>
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
              isLoading={isLoadingGetTokenDelegation}
              disabled={isEmpty(rowSelected.id) || isLoadingGetTokenDelegation}
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
  currentRole: state.auth.currentRole,
});

const mapDispatchToProps = {
  onSetUpdatedCurrentRoleStatus: setIsUpdatedCurrentRole,
  onSetProfile: setProfile,
  onSetCurrentRole: setCurrentRole,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchUser);
