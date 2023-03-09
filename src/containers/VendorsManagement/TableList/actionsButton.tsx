import React from 'react';
import { Button } from 'src/components/common';
import { PermissionsService } from 'src/services';

const ActionsButton: React.FC<Props> = () => {
  const havePermission = PermissionsService.vendorMaster().canUpdate;
  if (!havePermission) return null;
  return (
    <>
      <Button variant="link">Edit</Button>
    </>
  );
};

type Props = {
  data: any;
};

export default ActionsButton;
