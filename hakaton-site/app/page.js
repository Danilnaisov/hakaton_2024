"use client";

import { HI } from "./components/HI/HI";
import { EventsList } from "./components/EventsList/EventsList";
import { Start } from "./components/Start/Start";

import Styles from "/app/page.module.css";
import Link from "next/link";

export default function Home() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(today.getDate() + 2);
  const dayAfter2Days = new Date();
  dayAfter2Days.setDate(today.getDate() + 3);

  return (
    <main>
      <Start />
      <HI />
      <div className={Styles["eventLists"]}>
        <EventsList date={today} />
        <EventsList date={tomorrow} />
        <EventsList date={dayAfterTomorrow} />
        <EventsList date={dayAfter2Days} />
        <div>
          <Link href={"/events"} className={Styles["calendar"]}>
            <div className={Styles["seeAll"]}>
              <img src="/calendar.svg" alt="calendar" />
              <h3>Открыть полный календарь</h3>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
