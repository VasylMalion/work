import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './utils/i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {ApolloClient, InMemoryCache, HttpLink, ApolloLink} from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';
import {createUploadLink} from 'apollo-upload-client';
import config from './config/config';
import App from './App';
import AppProviders from './context';
import {BrowserRouter} from 'react-router-dom';
import resolvers from './states/resolvers';

const uploadLink = createUploadLink({uri: config.graph_url});
const link = new HttpLink({uri: config.graph_url});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([uploadLink, link]),
  resolvers,
});

const Loader = () => (
    <div className="App">
      <div>loading...</div>
    </div>
);

ReactDOM.render(
    <Suspense fallback={<Loader/>}>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <AppProviders>
            <App/>
          </AppProviders>
        </ApolloProvider>
      </BrowserRouter>
    </Suspense>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
