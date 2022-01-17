import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import queryString from 'qs';
import Styled from './Timong.styled';
import { Calendar } from './Calendar';
import Header from './Header';
import Users from './Users';

export const themes = {
  light: {
    foregroundHeader: '#6a6a6a',
    backgroundHeader: '#f2f2f2',
    foreground: '#000000',
    icon: 'black',
  },
  dark: {
    foregroundHeader: '#f2f2f2',
    backgroundHeader: '#2a2a2a',
    foreground: '#dadada',
    icon: 'white',
  },
};

export const ThemeContext = React.createContext(themes.light);

const qs = queryString.parse(location.search, {
  ignoreQueryPrefix: true,
});

const Timong = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<string>(qs.mode + '' ?? 'light');
  const toggleMode = () => {
    const _mode = mode === 'dark' ? 'light' : 'dark';

    setMode(`${_mode}`);
    setSearchParams(`?mode=${_mode}`);
  };

  useEffect(() => {
    if (mode === 'dark') document.body.style.background = '#2f3336';
    else document.body.style.background = '#ffffff';
  }, [mode]);

  return (
    <>
      <ThemeContext.Provider
        value={mode === 'dark' ? themes.dark : themes.light}
      >
        <Header toggleMode={toggleMode} />
        <Styled.Body>
          <Calendar />
        </Styled.Body>
        <Users />
      </ThemeContext.Provider>
    </>
  );
};

export default Timong;
