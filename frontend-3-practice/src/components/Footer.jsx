export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-columns">
          <div className="footer-col footer-col-brand">
            <h2 className="footer-brand-title">BARBER &amp; CO</h2>
            <p className="footer-description">
              Премиальный мужской барбершоп в центре Москвы. Безупречное качество стрижек, бритья и ухода.
            </p>
          </div>

          <div className="footer-col footer-col-contacts">
            <h3 className="footer-heading">Контакты</h3>
            <p className="footer-text">г. Москва, ул. Тверская, 12</p>
            <p className="footer-phone">
              <a href="tel:+74951234567">+7 (495) 123-45-67</a>
            </p>
            <p className="footer-text">
              <a href="mailto:info@barberco.ru" className="footer-link">info@barberco.ru</a>
            </p>
          </div>

          <div className="footer-col footer-col-hours">
            <h3 className="footer-heading">Режим работы</h3>
            <p className="footer-text">Пн &mdash; Пт: 09:00 &mdash; 21:00</p>
            <p className="footer-text">Сб &mdash; Вс: 10:00 &mdash; 20:00</p>
            <p className="footer-highlight">Без выходных и перерывов</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">&copy; 2026 BARBER &amp; CO. Все права защищены.</p>
          <div className="footer-legal">
            <a href="#" className="footer-link">Политика конфиденциальности</a>
            <span className="footer-separator">&bull;</span>
            <a href="#" className="footer-link">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
