import {
  MONTHS_NOMINATIVE,
  buildCalendarGrid,
  isDateSelectable,
} from "../data/date";

export default function Calendar({
  currentYear,
  currentMonth,
  selectedDay,
  selectedMonth,
  selectedYear,
  today,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}) {
  const cells = buildCalendarGrid(currentYear, currentMonth);

  return (
    <section className="booking-card calendar-card" aria-label="Календарь записи">
      <div className="calendar-header">
        <h2 className="calendar-month">
          {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
        </h2>
        <div className="calendar-nav">
          <button
            type="button"
            className="btn-cal-nav"
            onClick={onPrevMonth}
            aria-label="Предыдущий месяц"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="btn-cal-nav"
            onClick={onNextMonth}
            aria-label="Следующий месяц"
          >
            &#8250;
          </button>
        </div>
      </div>

      <div className="calendar-table">
        <div className="weekdays-row" aria-hidden="true">
          <span>Пн</span>
          <span>Вт</span>
          <span>Ср</span>
          <span>Чт</span>
          <span>Пт</span>
          <span>Сб</span>
          <span>Вс</span>
        </div>

        <div className="days-grid">
          {cells.map((cell, index) => {
            if (cell.otherMonth) {
              return (
                <button
                  key={`other-${index}`}
                  type="button"
                  className="day-btn day-other-month"
                  disabled
                >
                  {cell.day}
                </button>
              );
            }

            const isSelectable = isDateSelectable(
              cell.day,
              currentMonth,
              currentYear,
              today
            );

            if (!isSelectable) {
              return (
                <button
                  key={`disabled-${cell.day}`}
                  type="button"
                  className="day-btn day-disabled"
                  disabled
                  title="Нельзя выбрать дату в прошлом"
                >
                  {cell.day}
                </button>
              );
            }

            const isSelected =
              cell.day === selectedDay &&
              currentMonth === selectedMonth &&
              currentYear === selectedYear;

            const isWeekendDemo =
              cell.day === 18 &&
              currentMonth === 9 &&
              currentYear === 2026 &&
              !isSelected;

            let classNames = "day-btn";
            if (isSelected) classNames += " day-selected";
            if (isWeekendDemo) classNames += " day-weekend";

            return (
              <button
                key={`day-${cell.day}`}
                type="button"
                className={classNames}
                aria-pressed={isSelected}
                onClick={() => onSelectDay(cell.day)}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
