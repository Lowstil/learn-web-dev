import { MONTHS_GENITIVE, DAYS_OF_WEEK_SHORT, groupSlotsByPeriod } from "../data/date";

export default function TimeSlots({
  selectedDay,
  selectedMonth,
  selectedYear,
  selectedTime,
  slots,
  loading,
  error,
  onSelectTime,
  onRetry,
}) {
  const dateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeekShort = DAYS_OF_WEEK_SHORT[dateObj.getDay()];

  // Группируем слоты по периодам (Утро, День, Вечер)
  const groups = groupSlotsByPeriod(slots);

  return (
    <section className="booking-card slots-card" aria-label="Свободные слоты времени">
      <div className="slots-header">
        <h2 className="slots-title">
          Свободные слоты: {selectedDay} {MONTHS_GENITIVE[selectedMonth]} ({dayOfWeekShort})
        </h2>
        <p className="slots-duration">Длительность выбранной процедуры &mdash; 75 минут</p>
      </div>

      <div className="slots-content">
        {/* Состояние загрузки слотов */}
        {loading && (
          <div className="slots-status slots-loading" aria-live="polite">
            <span className="spinner-inline" aria-hidden="true"></span>
            <span>Загрузка слотов…</span>
          </div>
        )}

        {/* Состояние ошибки при загрузке слотов */}
        {!loading && error && (
          <div className="slots-status slots-error-box" role="alert">
            <p className="slots-error-text">Не удалось загрузить слоты: {error}</p>
            {onRetry && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
                Повторить попытку
              </button>
            )}
          </div>
        )}

        {/* Успешный показ слотов */}
        {!loading && !error && groups.length === 0 && (
          <div className="slots-status slots-empty">
            <p>На эту дату нет доступных слотов для записи.</p>
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <>
            {groups.map((group) => (
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
          </>
        )}
      </div>
    </section>
  );
}
