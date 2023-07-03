import { Counter } from './components/counter';
import { PitelCallOut } from './components/pitel_call_out';
import { PitelCallNotif } from './components/pitel_call_notif';
import { PitelCallKit } from './screens/call_screen';
import { pitelRegister } from './services/pitel_register';
import { useRegister } from './hooks/register_hook';
import {
  getFcmToken,
  NotificationListener,
  NotificationBackground,
} from './notification/push_notif';

export {
  Counter,
  PitelCallOut,
  PitelCallKit,
  PitelCallNotif,
  pitelRegister,
  useRegister,

  // push notif
  getFcmToken,
  NotificationListener,
  NotificationBackground,
};
