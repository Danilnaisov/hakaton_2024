import Link from "next/link";
import Styles from "./Event.module.css";

export const Event = (props) => {
  return (
    <div className={Styles["event"]}>
      <Link href={`/events/${props.id}`}>
        <img src={props.image} className={Styles["event__image"]} />
        <h3 className={Styles["event__title"]}>{props.name}</h3>
        <div className={Styles["event__card-location"]}>
          <h4 className={Styles["event__card-date"]}>{props.date}</h4>
          <h4 className={Styles["event__card-date"]}>{props.time}</h4>
        </div>
      </Link>
    </div>
  );
};
