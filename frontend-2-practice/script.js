// ==========================================================================
// 1. ДАННЫЕ (ДАННЫЕ СЕРВЕРА И СЛОТЫ)
// ==========================================================================

// Имитация ответа сервера.
// «Сегодня» зафиксировано на 12 октября 2026 года для наглядной демонстрации:
// дни 1–11 октября приглушены и недоступны для записи (раньше «сегодня»).
const SERVER_DATA = {
  today: { day: 12, month: 9, year: 2026 }, // 9 = Октябрь (0-индексированный месяц)
};

// Функция генерации слотов для конкретного дня.
// Имитирует разную занятость мастеров в разные дни.
function getSlotsForDay(day) {
  // Для 15 числа возвращаем точное состояние из макета:
  if (day === 15) {
    return [
      {
        period: "Утро",
        slots: [
          { time: "10:00", available: true },
          { time: "11:30", available: false },
        ],
      },
      {
        period: "День",
        slots: [
          { time: "13:00", available: true },
          { time: "14:00", available: true },
          { time: "15:30", available: true },
        ],
      },
      {
        period: "Вечер",
        slots: [
          { time: "17:00", available: true },
          { time: "18:30", available: false },
          { time: "20:00", available: true },
        ],
      },
    ];
  }

  // Для остальных дней варьируем доступность в зависимости от четности:
  const isEven = day % 2 === 0;
  return [
    {
      period: "Утро",
      slots: [
        { time: "10:00", available: isEven },
        { time: "11:30", available: !isEven },
      ],
    },
    {
      period: "День",
      slots: [
        { time: "13:00", available: true },
        { time: "14:00", available: isEven },
        { time: "15:30", available: !isEven },
      ],
    },
    {
      period: "Вечер",
      slots: [
        { time: "17:00", available: true },
        { time: "18:30", available: !isEven },
        { time: "20:00", available: true },
      ],
    },
  ];
}

// ==========================================================================
// 2. СОСТОЯНИЕ (STATE)
// ==========================================================================

// Состояние интерфейса: хранит текущий отображаемый месяц/год,
// а также фактически выбранную дату и время визита.
const STATE = {
  currentYear: 2026,
  currentMonth: 9, // 9 = Октябрь
  selectedYear: 2026,
  selectedMonth: 9,
  selectedDay: 15, // При загрузке сразу выбран 15 день
  selectedTime: "14:00", // При загрузке сразу выбрано время 14:00 (как в макете)
};

// ==========================================================================
// 3. ЧИСТЫЕ ФУНКЦИИ И КОНСТАНТЫ ДАТ
// ==========================================================================

const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const DAYS_OF_WEEK_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

/**
 * Сравнивает две даты без учёта времени.
 * Возвращает: -1 (d1 < d2), 0 (d1 === d2), 1 (d1 > d2)
 */
function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Проверяет, можно ли выбрать указанный день (он не должен быть раньше today).
 */
function isDateSelectable(day, month, year, today) {
  return compareDates({ day, month, year }, today) >= 0;
}

/**
 * Строит сетку календаря для указанного месяца и года.
 * Возвращает массив объектов ячеек { day, otherMonth }.
 */
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // Сдвиг для того, чтобы неделя начиналась с понедельника (0 = Пн, 6 = Вс)
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  // Дни предыдущего месяца
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  // Дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  // Дни следующего месяца до полной сетки (кратной 7)
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  return cells;
}

// ==========================================================================
// 4. ОТРИСОВКА (RENDER) И ОБНОВЛЕНИЕ DOM
// ==========================================================================

// Ссылки на элементы DOM
const monthTitleEl = document.getElementById("calendar-month-title");
const prevMonthBtn = document.getElementById("prev-month-btn");
const nextMonthBtn = document.getElementById("next-month-btn");
const daysGridEl = document.getElementById("days-grid");
const slotsHeaderTitleEl = document.getElementById("slots-header-title");
const slotsContentEl = document.getElementById("slots-content");
const selectionValueEl = document.getElementById("selection-value");
const btnNextStep = document.getElementById("btn-next-step");

/**
 * Отрисовка календаря
 */
function renderCalendar() {
  // Обновляем заголовок месяца
  monthTitleEl.textContent = `${MONTHS_NOMINATIVE[STATE.currentMonth]} ${STATE.currentYear}`;

  // Получаем ячейки для сетки
  const cells = buildCalendarGrid(STATE.currentYear, STATE.currentMonth);

  daysGridEl.innerHTML = "";

  cells.forEach((cell) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("day-btn");
    btn.textContent = cell.day;

    if (cell.otherMonth) {
      btn.classList.add("day-other-month");
      btn.disabled = true;
    } else {
      // Проверяем, доступен ли день для выбора (не раньше сегодня)
      const selectable = isDateSelectable(
        cell.day,
        STATE.currentMonth,
        STATE.currentYear,
        SERVER_DATA.today
      );

      if (!selectable) {
        btn.classList.add("day-disabled");
        btn.disabled = true;
        btn.title = "Нельзя выбрать дату в прошлом";
      } else {
        // Проверяем, выбран ли этот день
        const isSelected =
          cell.day === STATE.selectedDay &&
          STATE.currentMonth === STATE.selectedMonth &&
          STATE.currentYear === STATE.selectedYear;

        if (isSelected) {
          btn.classList.add("day-selected");
          btn.setAttribute("aria-pressed", "true");
        }

        // Подсветка воскресенья 18 числа из макета
        if (cell.day === 18 && STATE.currentMonth === 9 && STATE.currentYear === 2026 && !isSelected) {
          btn.classList.add("day-weekend");
        }

        // Навешиваем обработчик клика на доступный день
        btn.addEventListener("click", () => onDayClick(cell.day));
      }
    }

    daysGridEl.appendChild(btn);
  });
}

/**
 * Отрисовка слотов времени для выбранного дня
 */
function renderTimeSlots() {
  // Получаем день недели для заголовка слотов
  const dateObj = new Date(STATE.selectedYear, STATE.selectedMonth, STATE.selectedDay);
  const dayOfWeekShort = DAYS_OF_WEEK_SHORT[dateObj.getDay()];

  slotsHeaderTitleEl.textContent = `Свободные слоты: ${STATE.selectedDay} ${MONTHS_GENITIVE[STATE.selectedMonth]} (${dayOfWeekShort})`;

  const groups = getSlotsForDay(STATE.selectedDay);
  slotsContentEl.innerHTML = "";

  groups.forEach((group) => {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("slots-group");

    const titleH3 = document.createElement("h3");
    titleH3.classList.add("slots-group-title");
    titleH3.textContent = group.period;
    groupDiv.appendChild(titleH3);

    const listDiv = document.createElement("div");
    listDiv.classList.add("slots-list");

    group.slots.forEach((slot) => {
      const slotBtn = document.createElement("button");
      slotBtn.type = "button";
      slotBtn.classList.add("slot-btn");

      if (!slot.available) {
        slotBtn.classList.add("slot-disabled");
        slotBtn.disabled = true;
        slotBtn.textContent = `${slot.time} (занято)`;
      } else {
        const isSelected = slot.time === STATE.selectedTime;

        if (isSelected) {
          slotBtn.classList.add("slot-selected");
          slotBtn.setAttribute("aria-pressed", "true");
          slotBtn.innerHTML = `${slot.time} <span class="slot-check" aria-hidden="true">&#10003;</span>`;
        } else {
          slotBtn.textContent = slot.time;
        }

        slotBtn.addEventListener("click", () => onTimeSlotClick(slot.time));
      }

      listDiv.appendChild(slotBtn);
    });

    groupDiv.appendChild(listDiv);
    slotsContentEl.appendChild(groupDiv);
  });
}

/**
 * Обновление нижней панели с выбранной датой и временем
 */
function updateBottomBar() {
  const dateObj = new Date(STATE.selectedYear, STATE.selectedMonth, STATE.selectedDay);
  const dayOfWeek = DAYS_OF_WEEK[dateObj.getDay()];
  const dateStr = `${dayOfWeek}, ${STATE.selectedDay} ${MONTHS_GENITIVE[STATE.selectedMonth]} ${STATE.selectedYear}`;

  if (STATE.selectedTime) {
    selectionValueEl.textContent = `${dateStr} в ${STATE.selectedTime}`;
    btnNextStep.disabled = false;
  } else {
    selectionValueEl.textContent = `${dateStr} (выберите время)`;
    btnNextStep.disabled = true;
  }
}

// ==========================================================================
// 5. ОБРАБОТЧИКИ СОБЫТИЙ (HANDLERS)
// ==========================================================================

/**
 * Обработка клика по дню календаря
 */
function onDayClick(day) {
  // Если кликнули на тот же день в том же месяце, ничего не меняем
  if (
    STATE.selectedDay === day &&
    STATE.selectedMonth === STATE.currentMonth &&
    STATE.selectedYear === STATE.currentYear
  ) {
    return;
  }

  STATE.selectedDay = day;
  STATE.selectedMonth = STATE.currentMonth;
  STATE.selectedYear = STATE.currentYear;

  // ВАЖНО: сбрасываем выбранное время при смене дня!
  STATE.selectedTime = null;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

/**
 * Обработка клика по слоту времени
 */
function onTimeSlotClick(time) {
  STATE.selectedTime = time;
  renderTimeSlots();
  updateBottomBar();
}

/**
 * Настройка переключения месяцев
 */
function setupMonthNavigation() {
  prevMonthBtn.addEventListener("click", () => {
    STATE.currentMonth--;
    if (STATE.currentMonth < 0) {
      STATE.currentMonth = 11;
      STATE.currentYear--;
    }
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    STATE.currentMonth++;
    if (STATE.currentMonth > 11) {
      STATE.currentMonth = 0;
      STATE.currentYear++;
    }
    renderCalendar();
  });
}

// ==========================================================================
// 6. ИНИЦИАЛИЗАЦИЯ (INIT)
// ==========================================================================

function init() {
  setupMonthNavigation();
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

// Запуск после построения дерева DOM
document.addEventListener("DOMContentLoaded", init);
