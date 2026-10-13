export default function SummaryCard() {
  return (
    <section className="summary-card" aria-label="Выбранная услуга">
      <p className="summary-text">
        <strong>Мастер: Дмитрий Орлов</strong> &bull;{" "}
        <strong>Услуга: Комплекс Стрижка + Борода (75 мин, 2 700 &#8381;)</strong>
      </p>
      <a href="#" className="summary-change-link">
        Изменить
      </a>
    </section>
  );
}
