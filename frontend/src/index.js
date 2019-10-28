import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import client from './apollo-client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

library.add(faPlus, faEdit);

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
