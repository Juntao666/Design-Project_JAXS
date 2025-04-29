import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PAGES = [
  { label: 'Home', destination: '/' },
  { label: 'People', destination: '/people', requiresLogin: true, requiresEditorRole: true},
  { label: 'Dashboard', destination: '/dashboard', requiresLogin: true},
  { label: 'Submissions', destination: '/submission_guide' },
  { label: 'Masthead', destination: '/masthead' },
  { label: 'About', destination: '/about' },
  { label: 'Login', destination: '/login' },
];

function NavLink({ page }) {
  const { label, destination } = page;
  return (
    <li>
      <Link to={destination}>{label}</Link>
    </li>
  );
}
NavLink.propTypes = {
  page: propTypes.shape({
    label: propTypes.string.isRequired,
    destination: propTypes.string.isRequired,
  }).isRequired,
};

function Navbar({ isLoggedIn, hasEditorRole }) {
  const visiblePages = PAGES.filter(
    (page) => 
      (!page.requiresLogin || isLoggedIn) && 
      (!page.requiresEditorRole || hasEditorRole)
  );
  return (
    <nav>
      <ul className="wrapper">
        {visiblePages.map((page) => (
          <NavLink key={page.destination} page={page} />
        ))}
      </ul>
    </nav>
  );
}

Navbar.propTypes = {
  isLoggedIn: propTypes.bool.isRequired,
  hasEditorRole: propTypes.bool,
};

export default Navbar;
