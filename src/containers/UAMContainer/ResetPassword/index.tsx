import React from 'react';
import { TenantService } from 'src/services';
import AdminResetPassword from '../admin/ResetPassword';
import { History, Location } from 'history';

const ResetPassword: React.FC<Props> = (props) => {
  if (TenantService.isAdmin()) return <AdminResetPassword {...props} />;
  return null;
};

type Props = { history: History; location: Location<string> };

export default ResetPassword;
