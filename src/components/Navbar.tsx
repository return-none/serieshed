import { Link } from 'react-router-dom';

import styled from 'styled-components';

import logo from 'assets/logo.svg';

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: var(--navbar-padding);

  user-select: none;

  background-color: rgb(var(--success-rgb));

  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
`;

const Img = styled.img`
  vertical-align: middle;
  height: var(--main-logo-height);
`;

const Navbar = () => (
  <Header>
    <Link draggable={false} to="/">
      <Img src={logo} alt="logo" draggable={false} />
    </Link>
  </Header>
);

export default Navbar;
