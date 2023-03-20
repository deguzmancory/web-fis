import React from 'react';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { VendorList } from 'src/queries';
import { Navigator, PermissionsService } from 'src/services';

const ActionsButton: React.FC<Props> = ({ vendor }) => {
  const havePermission = PermissionsService.vendorMaster().canUpdate;
  if (!havePermission) return null;
  return (
    <>
      <Button
        variant="link"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          Navigator.navigate(`${PATHS.editVendorMaster}/${vendor.code}`);
        }}
      >
        Edit
      </Button>
    </>
  );
};

type Props = {
  vendor: VendorList;
};

export default ActionsButton;
