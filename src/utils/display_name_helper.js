import base64 from 'react-native-base64';
import utf8 from 'utf8';

export function decodeDisplayName({ displayNameRaw, phoneNumber }) {
  if (displayNameRaw.includes('pitelsdkencode')) {
    const displayNameConvert = displayNameRaw.replace('pitelsdkencode', '');
    const base64Decode = base64.decode(displayNameConvert);
    const displayName = utf8.decode(base64Decode);
    if (displayName == '') {
      return phoneNumber;
    }
    return displayName;
  }
  if (displayNameRaw != '') {
    return displayNameRaw;
  }
  return phoneNumber;
}

export function encodeDisplayName({ displayNameRaw, phoneNumber }) {
  if (displayNameRaw != '') {
    const bytes = utf8.encode(displayNameRaw);
    const base64Str = base64.encode(bytes);
    return `${base64Str}pitelsdkencode`;
  }
  return phoneNumber;
}
