import { endpoints } from "./config";

export const getAllData = async () => {
  try {
    const response = await fetch(endpoints.events);
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Произошла ошибка:", error);
    return null;
  }
};

export const getDataById = async (id) => {
  try {
    const response = await fetch(endpoints.events);
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }
    const data = await response.json();
    const item = data.find((item) => item.id === id);
    return item;
  } catch (error) {
    console.error("Произошла ошибка:", error);
    return null;
  }
};

export const getDataByDate = async (date) => {
  try {
    const allData = await getAllData();
    if (!allData) {
      throw new Error("Ошибка загрузки всех данных");
    }
    const eventsForDate = allData.filter((event) => event.date === date);
    return eventsForDate;
  } catch (error) {
    console.error("Произошла ошибка:", error);
    return [];
  }
};

export const getDataByCategory = async (category) => {
  try {
    const response = await fetch(endpoints.events);
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }
    const data = await response.json();
    const items = data.filter((item) => item.category.includes(category));
    return items;
  } catch (error) {
    console.error("Произошла ошибка:", error);
    return null;
  }
};

export const getAllEvents = async () => {
  try {
    const response = await fetch(endpoints.events);
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Произошла ошибка:", error);
    return [];
  }
};

export const isResponseOk = (response) => {
  return !(response instanceof Error);
};

const filterEventsByCategory = (events, category) => {
  return events.filter((event) => event.category.includes(category));
};
