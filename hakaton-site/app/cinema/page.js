"use client";

import { useEffect, useState } from "react";
import { Event } from "../components/Event/Event";
import { getDataByCategory } from "../api/api-utils";
import Styles from "../page.module.css";
import Link from "next/link";

export default function TheatreEventsPage() {
  const [events, setEvents] = useState([]);
  const category = "Кино";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataByCategory(category);
        if (data) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Произошла ошибка при загрузке данных:", error);
      }
    };

    fetchData();

    return () => setEvents([]);
  }, [category]);

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
