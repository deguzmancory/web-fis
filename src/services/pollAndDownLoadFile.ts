import axios from 'axios';
import { handleShowErrorMsg } from 'src/containers/UsersManagement/helpers';
import { Callback } from 'src/redux/types';

export function pollAndDownloadFile(payload: PollAndDownloadType) {
  const blob = poll(payload.head, payload.get, {
    maxAttempts: payload?.settings?.maxAttempts || 180,
    delayOrDelayCallback: payload?.settings?.delayOrDelayCallback || 1,
  });
  if (blob) {
    const encodeData = URL.createObjectURL(
      new Blob([JSON.stringify(blob)], { type: payload.fileType }) // TODO: tin_pham update correct new Blob
    );

    const link = document.createElement('a');
    link.setAttribute('href', `${encodeData}`);
    link.setAttribute('download', `${payload.fileName}`);
    document.body.appendChild(link);
    link.click();

    payload.onSuccess();
  } else {
    payload.onError();
  }
}

async function poll(
  headUrl: string,
  getUrl: string,
  { maxAttempts = 180, delayOrDelayCallback = 1 }: PollSettings
): Promise<Blob | undefined> {
  let currentAttempt = 0;
  const poll = async (resolve, reject): Promise<boolean> => {
    const response = await axios.head(headUrl, {
      validateStatus: () => true,
      withCredentials: false,
    });
    currentAttempt++;
    if (response.status === 200) {
      return resolve();
    } else if (currentAttempt === maxAttempts) {
      return reject(new Error(`Exceeded max attempts, message = ${response.data}`));
    } else {
      const delay =
        typeof delayOrDelayCallback === 'number' ? delayOrDelayCallback : delayOrDelayCallback();
      setTimeout(poll, delay * 1000, resolve, reject);
    }
  };
  try {
    // ensure the file is available
    await new Promise(poll);
    // download file
    const fileResponse = await axios.get(getUrl, { responseType: 'blob', withCredentials: false });
    return fileResponse.data;
  } catch (error) {
    handleShowErrorMsg(error);
    return undefined;
  }
}

export type PollSettings = {
  maxAttempts: number; //retry download in max x minutes
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
