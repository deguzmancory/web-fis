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
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { COLOR_CODE } from 'src/appConfig/constants';
import { Accordion, Button } from 'src/components/common';
import { StyledTableCell, StyledTableRow } from 'src/components/CustomTable';
import { useGetDelegationAccesses, useProfile, useUpdateCurrentRoleProfile } from 'src/queries';
import { getRoleName } from 'src/queries/Profile/helpers';
import { setIsUpdatedCurrentRole } from 'src/redux/auth/authSlice';
import { Toastify } from 'src/services';
import { isEmpty } from 'src/validations';

import './styles.scss';

const SwitchUser: React.FC<Props> = ({ onSetUpdatedCurrentRoleStatus }) => {
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
      Toastify.info(`Delegate to ${rowSelected.id} clicked`);
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
        `You are now logged in as: ${profile.fullName} - ${getRoleName(variables.roleName)}`
      );
      onSetUpdatedCurrentRoleStatus(true);
      setRowSelected({
        id: '',
        type: '',
      });
    },
  });

  // End Switch Role

  // Switch Delegation Access
  const { getDelegationAccesses, receivedAccesses } = useGetDelegationAccesses();

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
              {profile.fullName} ({profile.username})
            </b>{' '}
            - {getRoleName(profile.currentRole)} - Financial
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

        <Accordion
          title={`Raw data profile (${profile.username} - ${profile.id})`}
          className="mb-16"
        >
          {profile && (
            <ReactJson
              src={{
                username: profile.username,
                fullName: profile.fullName,
                defaultUserType: profile.defaultUserType,
                currentRole: profile.currentRole,
                roles: profile.roles.map((role) => ({
                  userId: role.userId,
                  roleId: role.roleId,
                  role: {
                    id: role.role.id,
                    name: role.role.name,
                    displayName: role.role.displayName,
                  },
                })),
              }}
            />
          )}
        </Accordion>

        <Accordion title={`Raw data delegation accesses`}>
          {receivedAccesses && <ReactJson src={receivedAccesses} />}
        </Accordion>
      </Container>
    </Box>
  );
};

type Props = typeof mapDispatchToProps;

const mapDispatchToProps = {
  onSetUpdatedCurrentRoleStatus: setIsUpdatedCurrentRole,
};

export default connect(undefined, mapDispatchToProps)(SwitchUser);
