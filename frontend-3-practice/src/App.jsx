import { useState } from "react";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import SummaryCard from "./components/SummaryCard";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import ActionPanel from "./components/ActionPanel";
import Footer from "./components/Footer";
import { SERVER_DATA, getSlotsForDay } from "./data/slots";

function App() {
  // 1. Месяц и год, отображаемые в календаре (пользователь может листать их)
  const [currentMonth, setCurrentMonth] = useState(9); // 9 = Октябрь
  const [currentYear, setCurrentYear] = useState(2026);

  // 2. Фактически выбранная дата (по умолчанию 15 октября 2026)
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2026);

  // 3. Фактически выбранное время (по умолчанию 14:00 из макета)
  const [selectedTime, setSelectedTime] = useState("14:00");

  // 4. Слоты для выбранного дня
  const [slots, setSlots] = useState(() => getSlotsForDay(15));

  // Обработчик выбора дня в календаре
  const handleSelectDay = (day) => {
    // Если кликнули на тот же день в том же месяце, ничего не меняем
    if (
      day === selectedDay &&
      currentMonth === selectedMonth &&
      currentYear === selectedYear
    ) {
      return;
    }

    setSelectedDay(day);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    // ВАЖНО: сбрасываем время при смене дня!
    setSelectedTime(null);

    // Обновляем слоты для нового дня
    setSlots(getSlotsForDay(day));
  };

  // Обработчик выбора слота времени
  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  // Листание на предыдущий месяц
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  // Листание на следующий месяц
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="page">
      <Header />
      <StepIndicator />

      <main className="main-content">
        <div className="container">
          <SummaryCard />

          <h1 className="page-title">Шаг 3. Выберите удобный день и время визита</h1>

          <div className="booking-layout">
            <Calendar
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDay={selectedDay}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              today={SERVER_DATA.today}
              onSelectDay={handleSelectDay}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            <TimeSlots
              selectedDay={selectedDay}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              selectedTime={selectedTime}
              slots={slots}
              onSelectTime={handleSelectTime}
            />
          </div>

          <ActionPanel
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedTime={selectedTime}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
