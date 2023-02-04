const LOCAL_STORAGE_DELEGATION_KEY = 'x_delegation_key';

const clearDelegationKey = () => {
  sessionStorage.removeItem(LOCAL_STORAGE_DELEGATION_KEY);
};

const setDelegationKey = (key: string) => {
  sessionStorage.setItem(LOCAL_STORAGE_DELEGATION_KEY, key);
};

const getDelegationKey = () => {
  return sessionStorage.getItem(LOCAL_STORAGE_DELEGATION_KEY);
};

export default {
  clearDelegationKey,
  setDelegationKey,
  getDelegationKey,
};
