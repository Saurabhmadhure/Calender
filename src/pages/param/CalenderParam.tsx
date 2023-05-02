import dayjs, { Dayjs } from "dayjs";
import ListParam from "@/pages/param/ListParam";

export default interface CalendarMonthProps {
  currentMonth: Dayjs;
  events: ListParam[];
}

export default interface WeekDay {
  day: number;
  hasEvent: boolean;
}

export default interface CustomPickerDayProps {
  dayIsBetween: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
  day: number;
  selected: boolean;
}

export default interface MyDateCalendarProps {
  renderWeekday: (dayOfWeek: number) => JSX.Element;
}
