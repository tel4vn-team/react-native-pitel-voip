const ENDPOINT = 'https://push.tel4vn.com/v1';
const CODE = 'Pitel@@2023!Mobile!PitelConnect';

export const getIceServer = async (): Promise<any> => {
  try {
    const res = await fetch(`${ENDPOINT}/server/turn`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CODE,
      },
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const registerDeviceToken = async (
  params: RegisterDeviceTokenReqProps
): Promise<any> => {
  try {
    const res = await fetch(`${ENDPOINT}/pn/device/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const removeDeviceToken = async (
  params: RemoveDeviceTokenReqProps
): Promise<any> => {
  try {
    const res = await fetch(`${ENDPOINT}/pn/device/token`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
