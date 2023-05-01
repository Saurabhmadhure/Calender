import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import { DayCalendarSkeleton } from "@mui/x-date-pickers";
import styles from "../styles/CustomPickersDay.module.css";
import stylofcustomdate from "../styles/CustomDay.module.css";
interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  dayIsBetween: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
}

const CustomPickersDay = ({
  day,
  dayIsBetween,
  isFirstDay,
  isLastDay,
  selected,
  ...otherProps
}: CustomPickerDayProps) => {
  const className = [
    stylofcustomdate.customPickersDay,
    dayIsBetween ? stylofcustomdate["is-between"] : "",
    isFirstDay ? stylofcustomdate["is-first-day"] : "",
    isLastDay ? stylofcustomdate["is-last-day"] : "",
    selected ? stylofcustomdate.selected : "",
  ].join(" ");

  return <PickersDay {...otherProps} className={className} day={day} />;
};

function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysToHighlight = [2, 3, 4, 9].map((num) => num);

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException("aborted", "AbortError"));
    };
  });
}

function Day(props: PickersDayProps<Dayjs> & { selectedDay?: Dayjs | null }) {
  const { day, selectedDay, ...other } = props;

  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }
  const start = selectedDay.startOf("week");

  const end = selectedDay.endOf("week");
  const dayIsBetween = day.isBetween(start, end, null, "[]");
  const isFirstDay = day.isSame(start, "day");
  const isLastDay = day.isSame(end, "day");

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={dayIsBetween ? { px: 2.5, mx: 0 } : {}}
      dayIsBetween={dayIsBetween}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
    />
  );
}
// const getWeekNumber = (date: Dayjs) => {
//   const startOfYear = date.startOf("year").startOf("week");
//   const diff = date.diff(startOfYear, "day");
//   const week = Math.ceil((diff + startOfYear.day()) / 7);
//   return week;
// };
const getWeekNumber = (date: Dayjs) => {
  const startOfYear = date.startOf("year").startOf("week");
  const diff = date.diff(startOfYear, "day");
  const week = Math.ceil((diff + startOfYear.day()) / 7);
  return week;
};

function CombinedDay(
  props: PickersDayProps<Dayjs> & {
    highlightedDays?: number[];
    selectedDay?: Dayjs | null;
  }
) {
  const { highlightedDays = [], selectedDay, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    (highlightedDays.indexOf(props.day.date()) > -1 ||
      (selectedDay && props.day.isSame(selectedDay, "day")));
  const weekNumber = getWeekNumber(props.day);

  const isWeekStart = props.day.day() === 0;

  return (
    <div className={styles.day}>
      {isWeekStart && <div className={styles.weekNumber}> {weekNumber}</div>}
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? "🌚" : null}
        invisible={!isSelected}
        className={isSelected ? styles.selected : undefined}>
        <Day {...other} selectedDay={selectedDay} />
      </Badge>
    </div>
  );
}

export default function CustomDay() {
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 1]);
  const requestAbortController = React.useRef<AbortController | null>(null);

  const fetchHighlightedDays = (date: Dayjs | null) => {
    const controller = new AbortController();
    fakeFetch(date || dayjs(), {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };
  // useEffect(() => {
  //   fetchHighlightedDays(value);
  //   return () => requestAbortController.current?.abort();
  // }, [value]);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className={styles.container}>
          <div className={styles.columnHeader}>wk</div>
          <DateCalendar<Dayjs>
            value={value}
            onChange={(newValue) => setValue(newValue ? newValue : null)}
            onMonthChange={handleMonthChange}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: CombinedDay,
            }}
            views={["month", "day"]}
            slotProps={{
              day: {
                highlightedDays,
                selectedDay: value,
              } as any,
            }}
          />
          {/* <DayCalendarSkeleton /> */}
        </div>
      </LocalizationProvider>
    </div>
  );
}
