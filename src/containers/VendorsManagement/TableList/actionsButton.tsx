import React from 'react';
import { PATHS } from 'src/appConfig/paths';
import { Button } from 'src/components/common';
import { VenderItem } from 'src/queries';
import { Navigator, PermissionsService } from 'src/services';

const ActionsButton: React.FC<Props> = ({ VenderItem }) => {
  const havePermission = PermissionsService.vendorMaster().canUpdate;
  if (!havePermission) return null;
  return (
    <>
      <Button
        variant="link"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          Navigator.navigate(`${PATHS.editVendorMaster}/${VenderItem.code}`);
        }}
      >
        Edit
      </Button>
    </>
  );
};

type Props = {
  VenderItem: VenderItem;
};

export default ActionsButton;
