import { useState, useEffect } from "react";
import { Event } from "../Event/Event";
import Styles from "./EventsList.module.css";
import { getAllData } from "@/app/api/api-utils";
import Link from "next/link";

export const EventsList = (props) => {
  const { date } = props;
  const [eventsForDate, setEventsForDate] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await getAllData();
        const eventsForDate = allData
          .filter((event) => event.date === formatDate(date))
          .slice(0, 4);
        setEventsForDate(eventsForDate);
        setAllEvents(
          allData.filter((event) => event.date === formatDate(date))
        );
      } catch (error) {
        console.error("Ошибка:", error.message);
      }
    };

    fetchData();
  }, [date]);

  return (
    <div className={Styles["eventsList"]}>
      {formatDate(date) === formatDate(today) ? (
        <h2 className={Styles["eventsListTitleToday"]}>
          <span className={Styles["redDot"]} /> Сегодня
        </h2>
      ) : (
        <h2 className={Styles["eventsListTitle"]}>{formatDate(date)}</h2>
      )}

      {eventsForDate.length > 0 ? (
        eventsForDate.map((event) => <Event key={event.id} {...event} />)
      ) : (
        <div className={Styles["seeAll"]}>
          <h3>На эту дату нет событий</h3>
        </div>
      )}

      {allEvents.length > 4 && (
        <Link href={`/date/${formatDate(date)}`} className={Styles["all"]}>
          <div className={Styles["seeAll"]}>
            <h3>Все события этой даты</h3>
          </div>
        </Link>
      )}
    </div>
  );
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
