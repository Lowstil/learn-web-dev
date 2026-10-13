import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import SummaryCard from "./components/SummaryCard";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import ActionPanel from "./components/ActionPanel";
import Footer from "./components/Footer";
import { fetchToday, fetchSlots } from "./api";

function App() {
  // ==========================================================================
  // 1. Состояние начальной загрузки («сегодня» с сервера)
  // ==========================================================================
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  // ==========================================================================
  // 2. Состояние отображения и выбора даты
  // ==========================================================================
  const [currentMonth, setCurrentMonth] = useState(9); // 9 = Октябрь
  const [currentYear, setCurrentYear] = useState(2026);

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  // Выбранное время
  const [selectedTime, setSelectedTime] = useState(null);

  // ==========================================================================
  // 3. Состояние слотов времени
  // ==========================================================================
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  // ==========================================================================
  // 4. Загрузка «сегодня» при открытии страницы
  // ==========================================================================
  const loadToday = useCallback(async () => {
    try {
      setLoadingToday(true);
      setErrorToday(null);
      const data = await fetchToday();

      setToday(data);
      setCurrentMonth(data.month);
      setCurrentYear(data.year);

      // Инициализируем выбранную дату при открытии страницы
      setSelectedDay(data.day);
      setSelectedMonth(data.month);
      setSelectedYear(data.year);
    } catch (err) {
      setErrorToday(err.message || "Не удалось загрузить данные сервера");
    } finally {
      setLoadingToday(false);
    }
  }, []);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  // ==========================================================================
  // 5. Загрузка слотов при выборе дня (с защитой от гонок)
  // ==========================================================================
  const loadSlotsForDate = useCallback(async (day, month, year) => {
    if (!day || month === null || year === null) return;

    try {
      setLoadingSlots(true);
      setErrorSlots(null);

      const response = await fetchSlots({ day, month, year });

      // Защита от гонок: проверяем, что пришедший ответ соответствует текущему выбранному дню
      if (
        response.date.day === day &&
        response.date.month === month &&
        response.date.year === year
      ) {
        setSlots(response.slots || []);
        // Если это день 15 и слоты загрузились впервые, можем предустановить 14:00 для удобства проверки
        if (day === 15 && month === 9 && year === 2026) {
          setSelectedTime("14:00");
        }
      }
    } catch (err) {
      setErrorSlots(err.message || "Ошибка загрузки свободных слотов");
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDay !== null && selectedMonth !== null && selectedYear !== null) {
      loadSlotsForDate(selectedDay, selectedMonth, selectedYear);
    }
  }, [selectedDay, selectedMonth, selectedYear, loadSlotsForDate]);

  // ==========================================================================
  // 6. Обработчики действий пользователя
  // ==========================================================================

  // Выбор дня в календаре
  const handleSelectDay = (day) => {
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

    // ВАЖНО: сброс времени при смене дня!
    setSelectedTime(null);
  };

  // Выбор слота времени
  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  // Листание месяцев
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

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

          {/* Состояние: начальная загрузка календаря */}
          {loadingToday && (
            <div className="initial-status-box initial-loading" aria-live="polite">
              <span className="spinner-large" aria-hidden="true"></span>
              <p>Загрузка календаря…</p>
            </div>
          )}

          {/* Состояние: ошибка начальной загрузки */}
          {!loadingToday && errorToday && (
            <div className="initial-status-box initial-error" role="alert">
              <h2>Не удалось загрузить данные</h2>
              <p>{errorToday}</p>
              <button
                type="button"
                className="btn btn-dark"
                onClick={loadToday}
              >
                Повторить попытку
              </button>
            </div>
          )}

          {/* Основной контент после успешной загрузки today */}
          {!loadingToday && !errorToday && (
            <>
              <div className="booking-layout">
                <Calendar
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  selectedDay={selectedDay}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  today={today}
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
                  loading={loadingSlots}
                  error={errorSlots}
                  onSelectTime={handleSelectTime}
                  onRetry={() => loadSlotsForDate(selectedDay, selectedMonth, selectedYear)}
                />
              </div>

              {selectedDay !== null && (
                <ActionPanel
                  selectedDay={selectedDay}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedTime={selectedTime}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
