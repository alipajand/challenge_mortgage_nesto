import { Link, NavLink } from 'react-router';
import logoUrl from '../../assets/nesto-EN_Primary.png';
import { paths } from '@/app/paths';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to={paths.home} className="site-header-logo">
          <img src={logoUrl} alt="nesto home" width={115} height={32} />
        </Link>

        <nav aria-label="Main">
          <ul role="list" className="site-nav">
            <li>
              <NavLink to={paths.home} end className="site-nav-link">
                Rates
              </NavLink>
            </li>
            <li>
              <NavLink to={paths.applications} className="site-nav-link">
                Applications
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
