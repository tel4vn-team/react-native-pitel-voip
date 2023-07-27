// Register device token
interface RegisterDeviceTokenReqProps {
  pn_token: string;
  pn_type: string;
  app_id: string;
  domain: string;
  extension: string;
  app_mode: string;
  fcm_token: string;
}
interface RegisterDeviceTokenResProps {
  domain: string;
  extension: string;
  pn_token: string;
  pn_type: string;
}

// Remove device token
interface RemoveDeviceTokenReqProps {
  pn_token: string;
  domain: string;
  extension: string;
}
