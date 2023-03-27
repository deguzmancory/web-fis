import React from 'react';
import { SelectOption } from 'src/components/common/Select';
import { useSearchVendors } from 'src/queries/Vendors/useSearchVendors';
import { getVendorOptions } from '../helpers';

export type SearchVendorsType = {
  name: string;
  code: string;
};

const usePOSearchVender = ({ currentVendorName, currentVendorCode }) => {
  const [searchVendors, setSearchVendors] = React.useState<SearchVendorsType>({
    name: '',
    code: '',
  });

  const { vendors, isLoading: isLoadingSearchVendors, setSearchVendorParams } = useSearchVendors();

  const searchedVendorNameOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchVendors || (!searchVendors.name && !currentVendorName)) {
      return [];
    }

    return getVendorOptions({ vendors });
  }, [vendors, searchVendors.name, currentVendorName, isLoadingSearchVendors]);

  const searchedVendorCodeOptions: SelectOption[] = React.useMemo(() => {
    if (isLoadingSearchVendors || (!searchVendors.code && !currentVendorCode)) {
      return [];
    }

    return getVendorOptions({
      vendors,
    });
  }, [vendors, searchVendors.code, currentVendorCode, isLoadingSearchVendors]);

  // fetch options on search name input change
  React.useEffect(() => {
    if (!searchVendors.name) return;

    setSearchVendorParams({
      search: searchVendors.name,
    });
  }, [searchVendors.name, setSearchVendorParams]);

  // fetch options on search code input change
  React.useEffect(() => {
    if (!searchVendors.code) return;

    setSearchVendorParams({
      search: searchVendors.code,
    });
  }, [searchVendors.code, setSearchVendorParams]);

  // // fetch vendor first mounted with data from get PO response
  // React.useEffect(() => {
  //   if (!!currentVendorCode && typeof currentVendorCode === 'string') {
  //     setSearchVendorParams({
  //       search: currentVendorCode,
  //     });

  //     return;
  //   }

  //   if (!!currentVendorName && typeof currentVendorName === 'string') {
  //     setSearchVendorParams({
  //       search: currentVendorName,
  //     });

  //     return;
  //   }
  // }, [currentVendorCode, currentVendorName, setSearchVendorParams]);

  // // fetch project first mounted when just back from additional forms
  // React.useLayoutEffect(() => {
  //   if (!!currentVendorCode && typeof currentVendorCode !== 'string') {
  //     setSearchVendorParams({
  //       search: currentVendorCode.code,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return {
    isLoadingSearchVendors,
    searchedVendorNameOptions,
    searchedVendorCodeOptions,
    setSearchVendors,
  };
};

export default usePOSearchVender;
