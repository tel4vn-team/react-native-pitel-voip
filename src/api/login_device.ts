const ENDPOINT = 'https://push.tel4vn.com/v1';

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
