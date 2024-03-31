import { data } from "./data.js";

export const getEventByDate = (date) => {
  return data.filter((event) => {
    return event.date.find((item) => {
      return item.name === date;
    });
  });
};

export const getEventById = (id) => {
  return data.find((event) => event.id === Number(id));
};
