import axios from 'axios';
import { Callback } from 'src/redux/types';

export const pollAndDownloadFile = async (payload: PollAndDownloadType) => {
  const blob = await poll(payload.head, payload.get, {
    maxAttempts: payload?.settings?.maxAttempts || 180,
    delayOrDelayCallback: payload?.settings?.delayOrDelayCallback || 1,
  });
  if (blob) {
    const encodeData = URL.createObjectURL(new Blob([blob], { type: payload.fileType }));

    const link = document.createElement('a');
    link.setAttribute('href', `${encodeData}`);
    link.setAttribute('download', `${payload.fileName}`);
    document.body.appendChild(link);
    link.click();

    payload.onSuccess();
  } else {
    payload.onError();
  }
};

const poll = async (
  headUrl: string,
  getUrl: string,
  { maxAttempts = 180, delayOrDelayCallback = 1 }: PollSettings
): Promise<Blob | undefined> => {
  let currentAttempt = 0;
  const poll = async (resolve, reject): Promise<boolean> => {
    return axios
      .head(headUrl)
      .then((response) => {
        if (response.status === 200) {
          return resolve();
        }
      })
      .catch((error) => {
        currentAttempt++;
        if (currentAttempt === maxAttempts) {
          return reject();
        } else {
          const delay =
            typeof delayOrDelayCallback === 'number'
              ? delayOrDelayCallback
              : delayOrDelayCallback();
          setTimeout(poll, delay * 1000, resolve, reject);
        }
      });
  };
  try {
    // ensure the file is available
    await new Promise(poll);

    // download file
    const fileResponse = await axios.get(getUrl, {
      responseType: 'blob',
      withCredentials: false,
    });
    return fileResponse.data;
  } catch (error) {
    return undefined;
  }
};

export type PollSettings = {
  maxAttempts: number; //retry download in max x seconds
  delayOrDelayCallback: number | (() => number); //retry per y second
};

export type PollAndDownloadType = {
  head: string;
  get: string;
  fileName: string;
  fileType: string;
  settings?: PollSettings;
  onSuccess: Callback;
  onError: Callback;
};
