import { ROLE_NAME } from 'src/queries/Profile/helpers';

const LOCAL_STORAGE_ROLE = 'current-role';

const getCurrentRole = () => {
  return localStorage.getItem(LOCAL_STORAGE_ROLE);
};

const setCurrentRole = (value: ROLE_NAME) => {
  localStorage.setItem(LOCAL_STORAGE_ROLE, value);
};

const clearCurrentRole = () => {
  localStorage.removeItem(LOCAL_STORAGE_ROLE);
};

export default { LOCAL_STORAGE_ROLE, getCurrentRole, setCurrentRole, clearCurrentRole };
