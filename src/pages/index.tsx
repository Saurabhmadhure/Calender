import React from "react";
import CustomDay from "../components/Calender";
import { NavbarBrand } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import ListParam from "../pages/param/ListParam";
import CalendarEventList from "../components/ListofEvent";

const events: ListParam[] = [
  {
    id: 1,
    title: "Meeting",
    start: new Date("2023-04-28T14:00:00"),
    end: new Date("2023-04-28T15:00:00"),
  },
  {
    id: 2,
    title: "Appointment",
    start: new Date("2023-04-29T10:00:00"),
    end: new Date("2023-04-29T11:00:00"),
  },
];
const eventList = events.map((event) => ({
  date: new Date(event.start),
  title: event.title,
  id: event.id,
}));

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <NavbarBrand>
          <h4>Events</h4>
          <br />
        </NavbarBrand>
        <CustomDay />

        <hr />
        <CalendarEventList events={events} />
      </div>
      <div className={styles.mainContent}>
        <h1>Welcome</h1>
      </div>
    </div>
  );
};

export default Home;
