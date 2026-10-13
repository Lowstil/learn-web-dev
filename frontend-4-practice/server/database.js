// «База данных» имитационного сервера.
//
// Содержит:
//   - today — текущая дата (15 октября 2026);
//   - slotsEvenDay / slotsOddDay — наборы слотов для барбершопа.
export const database = {
  // «Сегодня» по мнению сервера:
  today: { day: 15, month: 9, year: 2026 }, // 9 = Октябрь

  // Слоты для чётных дней:
  slotsEvenDay: [
    { time: "10:00", available: true },
    { time: "11:30", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: false },
    { time: "15:30", available: true },
    { time: "17:00", available: true },
    { time: "18:30", available: true },
    { time: "20:00", available: true },
  ],

  // Слоты для нечётных дней (на 15 октября 11:30 и 18:30 заняты, как в макете):
  slotsOddDay: [
    { time: "10:00", available: true },
    { time: "11:30", available: false },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:30", available: true },
    { time: "17:00", available: true },
    { time: "18:30", available: false },
    { time: "20:00", available: true },
  ],
};