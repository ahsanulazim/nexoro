import moment from "moment";

export const greeting = (name) => {
  const hour = moment().hour();
  if (hour < 12) {
    return `Good morning, ${name}`;
  } else if (hour < 18) {
    return `Good afternoon, ${name}`;
  } else {
    return `Good evening, ${name}`;
  }
};
