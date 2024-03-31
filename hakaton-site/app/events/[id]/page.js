"use client";

import { useState, useEffect } from "react";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { getDataById } from "@/app/api/api-utils";
import Link from "next/link";
import UncontrolledExample from "../../components/Carousel/Carousel";
import Styles from "./Events.module.css";
import { endpoints } from "@/app/api/config";

export default function EventPage(props) {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [item, setItem] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const id = parseInt(props.params.id);

  useEffect(() => {
    async function fetchData() {
      if (props.params && props.params.id) {
        const eventData = await getDataById(id);
        setItem(eventData);
        const weatherResponse = await fetch(endpoints.weather);
        const weatherJson = await weatherResponse.json();
        setWeatherData(weatherJson);
      }
      setPreloaderVisible(false);
    }
    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getMonth() + 1).padStart(2, "0");
    const month = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}T07:00:00+05:00`;
  };

  const findWeatherForEventDay = () => {
    if (!weatherData || !weatherData.DailyForecasts) return null;

    const eventDateFormatted = formatDate(item.date);

    const weatherForEventDay = weatherData.DailyForecasts.find((forecast) =>
      forecast.Date.includes(eventDateFormatted)
    );

    return weatherForEventDay;
  };

  const weatherForEventDay = findWeatherForEventDay();

  const getWeatherIcon = () => {
    if (!weatherForEventDay) return "sun.svg";

    const { IconPhrase, HasPrecipitation } = weatherForEventDay.Day;

    if (
      IconPhrase.toLowerCase().includes("облачность") ||
      IconPhrase.toLowerCase().includes("облачно")
    ) {
      return "cloud.svg";
    } else if (HasPrecipitation) {
      return "rain.svg";
    } else {
      return "sun.svg";
    }
  };

  return (
    <main className={Styles["main__container"]}>
      {item ? (
        <section className={Styles["event"]}>
          <div className={Styles["event__details"]}>
            <UncontrolledExample
              item={item}
              className={Styles["event__carousel"]}
            />
            <div className={Styles["title__container"]}>
              <div>
                <h2 className={Styles["event__title"]}>{item.name}</h2>
                <h4 className={Styles["event__subtitle"]}>
                  {item.date}
                  <br />
                  {item.time}
                  <br />
                  Категории:{" "}
                  {Array.isArray(item.category)
                    ? item.category.join(", ")
                    : item.category}
                  {/* <br></br>
                  {formatDate(item.date)} */}
                </h4>
              </div>
              {weatherForEventDay ? (
                <div className={Styles["event__weather"]}>
                  <h4 className={Styles["event__weather-temperature"]}>
                    {weatherForEventDay.Temperature.Minimum.Value} -{" "}
                    {weatherForEventDay.Temperature.Maximum.Value}°C
                  </h4>
                  <img src={`/${getWeatherIcon()}`} alt="weather icon" />
                  <h4 className={Styles["event__weather-temperature"]}>
                    {item.date}
                  </h4>
                </div>
              ) : (
                <div className={Styles["event__weather"]}>
                  <Preloader />
                </div>
              )}
            </div>
            {item.description && (
              <>
                <h3>Описание:</h3>
                <h4 className={Styles["event__text"]}>{item.description}</h4>
              </>
            )}
            <div className={Styles["event__base"]}>
              <Link href={item.link}>
                <h4>Сайт мероприятия</h4>
                <img src="/link.svg" alt="link" />
              </Link>
            </div>
          </div>
        </section>
      ) : preloaderVisible ? (
        <Preloader />
      ) : (
        <div> Мероприятие не найдено</div>
      )}
    </main>
  );
}
