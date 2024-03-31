"use client";

import { useEffect, useState } from "react";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { getDataByDate } from "@/app/api/api-utils";
import { Event } from "../../components/Event/Event";
import Styles from "../../page.module.css";
import Link from "next/link";

export default function DateEventsPage(props) {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [events, setEvents] = useState([]);
  const date = props.params.date;

  useEffect(() => {
    async function fetchData() {
      if (props.params && props.params.date) {
        const eventData = await getDataByDate(date);
        setEvents(eventData);
      }
      setPreloaderVisible(false);
    }
    fetchData();
  }, [date]);

  console.log(events);

  return (
    <main className={Styles["event__container"]}>
      {preloaderVisible ? (
        <Preloader />
      ) : (
        <>
          <h2 className={Styles["event__category"]}>
            Все мероприятия на {date}:
          </h2>
          <div className={Styles["event__grid"]}>
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function EventCard(props) {
  const maxLength = 80;
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
