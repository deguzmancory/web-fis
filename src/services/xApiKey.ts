import appConfig from 'src/appConfig';

const LOCAL_STORAGE_API_KEY = 'x_api_key'; //pragma: allowlist secret

const clearApiKey = () => {
  localStorage.removeItem(LOCAL_STORAGE_API_KEY);
};

const setApiKey = () => {
  localStorage.setItem(LOCAL_STORAGE_API_KEY, appConfig.API_KEY);
};

const getApiKey = () => {
  return localStorage.getItem(LOCAL_STORAGE_API_KEY);
};

export default {
  clearApiKey,
  setApiKey,
  getApiKey,
};
