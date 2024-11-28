import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Navigation = () => {
  const location = useLocation();

  return (
    <Nav>
      <NavList>
        <NavItem $active={location.pathname === '/'}>
          <NavLink to="/">Home</NavLink>
        </NavItem>
        <NavItem $active={location.pathname === '/portfolios'}>
          <NavLink to="/portfolios">Portfolios</NavLink>
        </NavItem>
        <NavItem $active={location.pathname === '/dividend'}>
          <NavLink to="/dividend">Dividend</NavLink>
        </NavItem>
        <NavItem $active={location.pathname === '/history'}>
          <NavLink to="/history">History</NavLink>
        </NavItem>
        <NavItem $active={location.pathname === '/income'}>
          <NavLink to="/income">Income Mgmt.</NavLink>
        </NavItem>
        <NavItem $active={location.pathname === '/plan'}>
          <NavLink to="/plan">Plan</NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
};

const Nav = styled.nav`
  background: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 20px;
`;

const NavItem = styled.li<{ $active: boolean }>`
  padding: 15px 0;
  border-bottom: 2px solid ${props => props.$active ? '#1a73e8' : 'transparent'};
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  
  &:hover {
    color: #1a73e8;
  }
`;

export default Navigation; 