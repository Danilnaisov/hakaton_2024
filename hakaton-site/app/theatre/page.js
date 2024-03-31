"use client";

import { useEffect, useState } from "react";
import { Event } from "../components/Event/Event";
import { getDataByCategory } from "../api/api-utils";
import Styles from "../page.module.css";
import Link from "next/link";

export default function TheatreEventsPage() {
  const [events, setEvents] = useState([]);
  const category = "Театр";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataByCategory(category);
        if (data) {
          const sortedEvents = sortEvents(data);
          setEvents(sortedEvents);
        }
      } catch (error) {
        console.error("Произошла ошибка при загрузке данных:", error);
      }
    };

    fetchData();

    return () => setEvents([]);
  }, [category]);

  const sortEvents = (events) => {
    const sortedEvents = events.sort((a, b) => {
      const dateComparison = compareDates(a.date, b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      } else {
        return compareTimes(a.time, b.time);
      }
    });
    return sortedEvents;
  };

  const compareDates = (date1, date2) => {
    const [day1, month1, year1] = date1.split(".");
    const [day2, month2, year2] = date2.split(".");
    if (year1 !== year2) {
      return parseInt(year1) - parseInt(year2);
    } else if (month1 !== month2) {
      return parseInt(month1) - parseInt(month2);
    } else {
      return parseInt(day1) - parseInt(day2);
    }
  };

  const compareTimes = (time1, time2) => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);
    if (hours1 !== hours2) {
      return hours1 - hours2;
    } else {
      return minutes1 - minutes2;
    }
  };

  return (
    <div className={Styles["event__container"]}>
      <h2 className={Styles["event__category"]}>{category}</h2>

      <div className={Styles["event__grid"]}>
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
      {events.length === 0 && (
        <div className={Styles["event__not-found"]}>
          <h3>Нет событий в данной категории</h3>
        </div>
      )}
    </div>
  );
}

function EventCard(props) {
  const maxLength = 50;
  const truncatedDescription =
    props.description.length > maxLength
      ? `${props.description.slice(0, maxLength)}...`
      : props.description;
  return (
    <Link className={Styles["event__card"]} href={`/events/${props.id}`}>
      <div className={Styles["event"]}>
        <img src={props.image} className={Styles["event__image"]} />
        <h3 className={Styles["event__title"]}>{props.name}</h3>
      </div>
      <h4 className={Styles["event__card-description"]}>
        {truncatedDescription}
      </h4>
      <div className={Styles["event__card-location"]}>
        <h4 className={Styles["event__card-date"]}>{props.date}</h4>
        <h4 className={Styles["event__card-date"]}>{props.time}</h4>
      </div>
    </Link>
  );
}
