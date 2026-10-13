import { MONTHS_GENITIVE, DAYS_OF_WEEK } from "../data/date";

export default function ActionPanel({
  selectedDay,
  selectedMonth,
  selectedYear,
  selectedTime,
}) {
  const dateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeek = DAYS_OF_WEEK[dateObj.getDay()];
  const dateStr = `${dayOfWeek}, ${selectedDay} ${MONTHS_GENITIVE[selectedMonth]} ${selectedYear}`;

  return (
    <section className="action-panel" aria-label="Подтверждение выбора">
      <div className="action-selection">
        <span className="selection-label">Выбрано:</span>
        <span className="selection-value">
          {selectedTime ? `${dateStr} в ${selectedTime}` : `${dateStr} (выберите время)`}
        </span>
      </div>

      <div className="action-buttons">
        <a href="#" className="btn btn-secondary action-btn">
          &larr; Назад к услугам
        </a>
        <button
          type="button"
          className="btn btn-dark action-btn"
          disabled={!selectedTime}
        >
          Перейти к контактам &rarr;
        </button>
      </div>
    </section>
  );
}
