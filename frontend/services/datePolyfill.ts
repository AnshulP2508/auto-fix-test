import 'moment/locale/hi';
import { format } from 'date-fns';

const originalToString = Date.prototype.toString;
if (typeof navigator !== 'undefined' && /iPhone OS 15/.test(navigator.userAgent)) {
  Date.prototype.toString = function patchedDateToString() {
    return format(this, 'yyyy-MM-dd') || originalToString.call(this);
  };
}
