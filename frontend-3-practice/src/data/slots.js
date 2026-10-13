// ==========================================================================
// ДАННЫЕ СЛОТОВ И «СЕГОДНЯ»
// ==========================================================================

export const SERVER_DATA = {
  today: { day: 12, month: 9, year: 2026 }, // 9 = Октябрь (0-индексированный)
};

/**
 * Возвращает группы слотов для выбранного дня
 */
export function getSlotsForDay(day) {
  // Для 15 числа возвращаем точное состояние из макета
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

  // Для остальных дней варьируем занятость
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
