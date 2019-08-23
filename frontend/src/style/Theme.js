import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

const theme = {
  green: '#10881a',
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
  medFont: '2rem',
  largeFont: '3rem',
};

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'quick_regular';
    src: url('./Quicksand-Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'quick_regular';
  }
  a {
    text-decoration: none;
    color: ${theme.black};
  }
  button {  font-family: 'Indie Flower', cursive; }
`;

export default function Theme(props) {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        {props.children}
      </>
    </ThemeProvider>
  );
}
