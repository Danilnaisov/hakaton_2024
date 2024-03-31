"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "../api/api-utils";
import Styles from "../page.module.css";
import Link from "next/link";
import { Event } from "../components/Event/Event";

export default function EventPage() {
  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const allEvents = await getAllEvents();
      const sortedEvents = sortEvents(allEvents);
      const eventsGroupedByDate = groupEventsByDate(sortedEvents);
      setEventsByDate(eventsGroupedByDate);
    };

    fetchEvents();
  }, []);

  const sortEvents = (events) => {
    const today = new Date();
    const todayDate = today;
    const sortedEvents = events.sort((a, b) => {
      if (a.date === todayDate && b.date === todayDate) {
        return compareTimes(a.time, b.time);
      } else if (a.date === todayDate) {
        return -1;
      } else if (b.date === todayDate) {
        return 1;
      } else {
        return compareDates(a.date, b.date);
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

  const groupEventsByDate = (events) => {
    const groupedEvents = {};
    events.forEach((event) => {
      const date = event.date;
      if (!groupedEvents[date]) {
        groupedEvents[date] = [];
      }
      groupedEvents[date].push(event);
    });
    return groupedEvents;
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
      {Object.keys(eventsByDate).map((date) => (
        <div key={date}>
          <h2 className={Styles["event__category"]}>
            {date === formatDate(new Date()) ? (
              <>
                <span className={Styles["redDot"]} /> Сегодня
              </>
            ) : (
              date
            )}
          </h2>
          <div className={Styles["event__grid"]}>
            {eventsByDate[date]
              .sort((a, b) => compareTimes(a.time, b.time))
              .map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
          </div>
        </div>
      ))}
    </div>
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

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
