import { MONTHS_GENITIVE, DAYS_OF_WEEK_SHORT } from "../data/date";

export default function TimeSlots({
  selectedDay,
  selectedMonth,
  selectedYear,
  selectedTime,
  slots,
  onSelectTime,
}) {
  const dateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeekShort = DAYS_OF_WEEK_SHORT[dateObj.getDay()];

  return (
    <section className="booking-card slots-card" aria-label="Свободные слоты времени">
      <div className="slots-header">
        <h2 className="slots-title">
          Свободные слоты: {selectedDay} {MONTHS_GENITIVE[selectedMonth]} ({dayOfWeekShort})
        </h2>
        <p className="slots-duration">Длительность выбранной процедуры &mdash; 75 минут</p>
      </div>

      <div className="slots-content">
        {slots.map((group) => (
          <div key={group.period} className="slots-group">
            <h3 className="slots-group-title">{group.period}</h3>
            <div className="slots-list">
              {group.slots.map((slot) => {
                if (!slot.available) {
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      className="slot-btn slot-disabled"
                      disabled
                    >
                      {slot.time} (занято)
                    </button>
                  );
                }

                const isSelected = slot.time === selectedTime;

                return (
                  <button
                    key={slot.time}
                    type="button"
                    className={`slot-btn ${isSelected ? "slot-selected" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => onSelectTime(slot.time)}
                  >
                    {slot.time}{" "}
                    {isSelected && (
                      <span className="slot-check" aria-hidden="true">
                        &#10003;
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
