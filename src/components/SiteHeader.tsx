import { Link } from 'react-router-dom';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/" aria-label="The Good and The Bad home">
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="brand__text">
            <span>The Good</span>
            <span>&amp; The Bad</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link className="site-nav__link site-nav__link--good" to="/?section=good">
            Good
          </Link>
          <Link className="site-nav__link site-nav__link--bad" to="/?section=bad">
            Bad
          </Link>
          <Link className="site-nav__link site-nav__link--future" to="/?section=future">
            Future
          </Link>
        </nav>
      </div>
    </header>
  );
}
