import React from 'react';
import { TenantService } from 'src/services';
import AdminWelcome from '../admin/Welcome';

const Welcome: React.FC<Props> = (props) => {
  if (TenantService.isAdmin()) return <AdminWelcome {...props} />;
  return null;
};

type Props = {};

export default Welcome;
