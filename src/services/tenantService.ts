import _ from 'lodash';
import { getStartCase } from 'src/utils';
import navigator from './navigator';

export enum Tenants {
  ADMIN = 'admin',
  FIS = 'fis',
}

const TenantOptions = Object.values(Tenants).map((value) => ({
  label: value === Tenants.FIS ? _.upperCase(value) : getStartCase(value),
  isHideOnProduction: false,
  value,
}));

const DefaultTenant = Tenants.FIS;

type Tenant = {
  name: string;
};

let _tenant: Tenant = {
  name: '',
};

const setTenant = (tenant?: Tenant) => {
  if (tenant) return (_tenant = tenant);
};

const getTenant = () => _tenant;

const getWebTenant = () => {
  const subDomain = navigator.getSubdomain();
  const isHasSubdomain = Object.values(Tenants).some((item) => item === subDomain);
  const validSubdomain = isHasSubdomain ? subDomain : DefaultTenant;
  return validSubdomain;
};

const changeWebTenant = (tenant: string) => {
  const validSubdomain = getWebTenant();
  if (tenant !== validSubdomain) {
    const nextDomain = tenant === DefaultTenant ? '' : tenant;
    return navigator.jumpToCrossDomain(nextDomain);
  }
};

// ================== Check tenant ==================
const isAdmin = () => _tenant?.name === Tenants.ADMIN;
const isFIS = () => _tenant?.name === Tenants.FIS;

export {
  setTenant,
  getTenant,
  isAdmin,
  isFIS,
  DefaultTenant,
  changeWebTenant,
  getWebTenant,
  TenantOptions,
};
