import * as moment from "moment";

export function momentTransform(value: any) {
  const date = moment(value);
  return date.isValid() ? date : null;
}