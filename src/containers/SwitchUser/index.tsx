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
import { useProfile, useUpdateCurrentRoleProfile } from 'src/queries';
import { getRoleName } from 'src/queries/Profile/helpers';
import { setIsUpdatedCurrentRole } from 'src/redux/auth/authSlice';
import { Toastify } from 'src/services';
import { isEmpty } from 'src/validations';

import './styles.scss';

const SwitchUser: React.FC<Props> = ({ onSetUpdatedCurrentRoleStatus }) => {
  const { profile } = useProfile();
  const [rowSelected, setRowSelected] = React.useState(null);

  const roleRows = React.useMemo(() => {
    return [...profile.roles];
  }, [profile]);

  const handleSwitchUser = (type: 'role' | 'delegate') => {
    if (type === 'role') {
      const role = profile.roles.find((_role) => _role.roleId === rowSelected);
      updateCurrentRoleMyProfile({
        roleName: role.role.name,
      });
    } else if (type === 'delegate') {
      Toastify.info('Delegate clicked');
    } else {
    }
  };

  const { getMyProfile, handleInvalidateProfile } = useProfile();
  const { updateCurrentRoleMyProfile, isLoading } = useUpdateCurrentRoleProfile({
    onSuccess(data, variables, context) {
      handleInvalidateProfile();
      getMyProfile();
      Toastify.info(
        `You are now logged in as: ${profile.fullName} - ${getRoleName(variables.roleName)}`
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
                          setRowSelected(row.roleId);
                        }}
                        className="cursor-pointer"
                        {...(rowSelected === row.roleId && {
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
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Stack flexDirection={'row'} justifyContent="flex-end">
            <Button
              isLoading={loading}
              disabled={isEmpty(rowSelected) || loading}
              onClick={() => handleSwitchUser('role')}
            >
              Switch to Selected User Account
            </Button>
          </Stack>
        </Box>

        <Accordion title={`Raw data (${profile.username} - ${profile.id})`}>
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
      </Container>
    </Box>
  );
};

type Props = typeof mapDispatchToProps;

const mapDispatchToProps = {
  onSetUpdatedCurrentRoleStatus: setIsUpdatedCurrentRole,
};

export default connect(undefined, mapDispatchToProps)(SwitchUser);
