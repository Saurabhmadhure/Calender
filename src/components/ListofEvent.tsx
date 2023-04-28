import React, { FC } from "react";
import ListParam from "../pages/param/ListParam";
import styles from "../styles/CalenderEvent.module.css";
import dayjs from "dayjs";

interface CalendarEventListProps {
  events: ListParam[];
}

const CalendarEventList: FC<CalendarEventListProps> = ({ events }) => {
  return (
    <div className={styles["calendar-event-list"]}>
      <h4>Upcoming Events:</h4>
      <ul>
        {events.map((event) => (
          <div key={event.id} className={styles["calendar-event"]}>
            <strong>{event.title}</strong>
            <br />
            {dayjs(event.start).format("M/D/YYYY, h:mm:ss A")} -{" "}
            {dayjs(event.end).format("M/D/YYYY, h:mm:ss A")}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default CalendarEventList;
