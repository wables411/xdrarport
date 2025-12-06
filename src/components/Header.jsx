import './Header.css'

function Header({ onContactClick, onPortfolioClick, onSocialsClick, onHomeClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="header-name" onClick={onHomeClick}>
            XD.RAR
          </button>
        </div>
        <div className="header-right">
          <button className="header-button" onClick={onPortfolioClick}>
            Portfolio
          </button>
          <button className="header-button" onClick={onContactClick}>
            Contact
          </button>
          <button className="header-button" onClick={onSocialsClick}>
            Socials
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

