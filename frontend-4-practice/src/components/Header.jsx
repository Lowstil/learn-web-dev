export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-container">
        <a href="#" className="logo">
          <span className="logo-badge"></span>
          <span className="logo-text">BARBER &amp; CO</span>
        </a>

        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item"><a href="#" className="nav-link">Главная</a></li>
            <li className="nav-item"><a href="#" className="nav-link">Услуги</a></li>
            <li className="nav-item"><a href="#" className="nav-link">Мастера</a></li>
            <li className="nav-item"><a href="#" className="nav-link">Отзывы</a></li>
            <li className="nav-item"><a href="#" className="nav-link">Контакты</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          <a href="tel:+74951234567" className="header-phone">+7 (495) 123-45-67</a>
          <button type="button" className="btn btn-dark btn-header">Онлайн-запись</button>
        </div>
      </div>
    </header>
  );
}
