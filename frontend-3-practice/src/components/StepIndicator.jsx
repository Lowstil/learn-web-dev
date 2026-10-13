export default function StepIndicator() {
  return (
    <nav className="steps-nav" aria-label="Этапы онлайн-записи">
      <div className="container steps-container">
        <div className="step-item step-completed">
          <span className="step-check" aria-hidden="true">&#10003;</span>
          <span className="step-title">1. Мастер</span>
        </div>

        <div className="step-item step-completed">
          <span className="step-check" aria-hidden="true">&#10003;</span>
          <span className="step-title">2. Услуга</span>
        </div>

        <div className="step-item step-current" aria-current="step">
          <span className="step-badge">3</span>
          <span className="step-title">3. Дата и время</span>
        </div>

        <div className="step-item step-upcoming">
          <span className="step-num">4</span>
          <span className="step-title">4. Контакты</span>
        </div>

        <div className="step-item step-upcoming">
          <span className="step-num">5</span>
          <span className="step-title">5. Подтверждение</span>
        </div>
      </div>
    </nav>
  );
}
