import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

export const theme = {
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
  primaryDark: '#333',
  secondaryDark: '#555',
  primaryLight: '#FFF',
  secondaryLight: '#DDD',
  primaryGreen: '#20bd67',
  secondaryGreen: '#199450',
  tertiaryGreen: '#11703c',
};

const GlobalStyle = createGlobalStyle`
html {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
  Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
main {
  margin: 0 auto;
  max-width: 1080px;
}
body {
  color: hsla(0, 0%, 0%, 0.8);
  font-family:-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
  Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: normal;
  word-wrap: break-word;
  font-kerning: normal;
  -moz-font-feature-settings: "kern", "liga", "clig", "calt";
  -ms-font-feature-settings: "kern", "liga", "clig", "calt";
  -webkit-font-feature-settings: "kern", "liga", "clig", "calt";
  font-feature-settings: "kern", "liga", "clig", "calt";
}
img {
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
h1 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 2.25rem;
  line-height: 1.1;
}
h2 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 3rem;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 1.62671rem;
  line-height: 1.1;
}
h3 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 1.38316rem;
  line-height: 1.1;
}
h4 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 1rem;
  line-height: 1.1;
}
h5 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 0.85028rem;
  line-height: 1.1;
}
h6 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 0.78405rem;
  line-height: 1.1;
}
@media only screen and (max-width: 480px) {
  html {
    font-size: 100%;
  }
}
a {
  color: var(--secondary-color);
  text-decoration: none;
}
blockquote {
  margin-left: 1.45rem;
  margin-right: 1.45rem;
  margin-top: 0;
  padding: 1rem;
  margin-bottom: 1.45rem;
  background-color: var(--secondary-green);
  color: var(--primary-light);
  border-radius: 4px;
}
input,
  textarea,
  select {
    display: block;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: 1px solid ${(props) => props.theme.primaryDark};
    &:focus {
      outline: 0;
      border-color: ${(props) => props.theme.secondaryDark};
    }
    &:read-only {
      border: none;
      padding: 0.5rem 0;
      background-color: none;
    }
  }
  label {
    display: block;
    margin: 0 0 2rem 0;
  }
  label > div {
    padding: 0 0 1rem 0;
  }
`;

export default function Theme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  );
}
