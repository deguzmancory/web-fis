import { Auth } from 'aws-amplify';

const LOCAL_STORAGE_TOKEN = 'guest_token';

const clearToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN);
};

const getToken = () => {
  return new Promise((resolve, reject) => {
    Auth.currentSession()
      .then((session: any) => {
        resolve(session.idToken.jwtToken);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const forceRefreshToken = async () => {
  return await Auth.currentAuthenticatedUser({ bypassCache: true });
};

export default {
  clearToken,
  getToken,
  forceRefreshToken,
};
