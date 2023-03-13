import React from 'react';
import { SelectOption } from 'src/components/common/Select';
import { useSearchVendors } from 'src/queries/Vendors/useSearchVendors';
import { getVendorOptions } from '../GeneralInfo/helpers';

export type SearchVendorsType = {
  name: string;
  code: string;
};

const usePOSearchVender = ({ currentVendorName, currentVendorCode }) => {
  const [searchVendors, setSearchVendors] = React.useState<SearchVendorsType>({
    name: '',
    code: '',
  });

  const {
    vendors,
    isLoading: isLoadingSearchVendors,
    setSearchVendorParams,
  } = useSearchVendors({
    enabled:
      !!searchVendors.name || !!searchVendors.code || !!currentVendorName || !!currentVendorCode,
  });

  const vendorNameOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchVendors || (!searchVendors.name && !currentVendorName)) {
      return [];
    }

    return getVendorOptions({ vendors });
  }, [vendors, searchVendors.name, currentVendorName, isLoadingSearchVendors]);

  const vendorCodeOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchVendors || (!searchVendors.code && !currentVendorCode)) {
      return [];
    }

    return getVendorOptions({
      vendors,
    });
  }, [vendors, searchVendors.code, currentVendorCode, isLoadingSearchVendors]);

  React.useEffect(() => {
    if (!searchVendors.name) return;

    setSearchVendorParams({
      search: searchVendors.name,
    });
  }, [searchVendors.name, setSearchVendorParams]);

  React.useEffect(() => {
    if (!searchVendors.code) return;

    setSearchVendorParams({
      search: searchVendors.code,
    });
  }, [searchVendors.code, setSearchVendorParams]);

  return {
    setSearchVendors,
    isLoadingSearchVendors,
    vendorNameOptions,
    vendorCodeOptions,
  };
};

export default usePOSearchVender;
