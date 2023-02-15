import axios from 'axios';
import JSZip from 'jszip';
import appConfig from 'src/appConfig';
import { StateService, Toastify } from '.';
import { isEmpty } from '../validations';

export type ZipCode = {
  zipCode: string;
  city: string;
  state: string;
};

let zipCodes: ZipCode[] = [];

const LOCAL_ZIP_CODES_PATH = 'zip-code';

const loadZipCodes = async () => {
  const zipCodeOptions = localStorage.getItem(LOCAL_ZIP_CODES_PATH);
  if (zipCodeOptions) {
    return new Promise((res) => {
      const parseZipCodes = JSON.parse(zipCodeOptions);
      zipCodes = parseZipCodes;
      res(parseZipCodes);
    });
  }

  try {
    const data = await getZipCodesFileZip();
    zipCodes = data;
    localStorage.setItem(LOCAL_ZIP_CODES_PATH, JSON.stringify(data));
    return data;
  } catch (error) {
    Toastify.error(`Fail to get zipcode file: ${error}`);
  }
};

const getPopulatedCityStateFromZipCode = async (zipCode) => {
  if (isEmpty(zipCodes)) {
    await loadZipCodes();
  }
  const populatedCityState = zipCodes.find((x) => x?.zipCode === zipCode);
  const formatOption = {
    ...populatedCityState,
    state: StateService.states.find((state) => state.name === populatedCityState.state)?.code,
  };
  return new Promise((resolve) => {
    resolve({ ok: true, data: formatOption });
  });
};

const getZipCodesFileZip = async (): Promise<ZipCode[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      axios
        .get(`${appConfig.S3_WEB_STORAGE_ASSETS_URL}/zipCodeWithLocal.zip`, {
          responseType: 'arraybuffer',
        })
        .then((data) => data.data)
        .then(async (data) => {
          const jsZip = new JSZip();
          return await jsZip
            .loadAsync(data)
            .then((zip) => {
              return zip.file('zipCodeWithLocalOffice.json').async('string');
            })
            .then(async (text) => {
              // eslint-disable-next-line security/detect-eval-with-expression, no-eval
              const parseData = await eval('(' + text + ')');
              resolve(parseData.zipCodeAll);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export default { getPopulatedCityStateFromZipCode };
