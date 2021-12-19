import { BrowserRouter, Routes, Route } from 'react-router-dom';

import styled from 'styled-components';

import Navbar from 'components/Navbar';

import Home from 'screens/Home';
import Details from 'screens/Details';

const Main = styled.main`
  min-height: 100%;
  display: flex;
  padding: 0;
  padding-top: calc(var(--main-logo-height) + var(--navbar-padding) * 2);

  max-width: 960px;
  margin: 0 auto;

  @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: landscape) {
    max-width: 375px;
  }
`;

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Main>
  </BrowserRouter>
);

export default App;
