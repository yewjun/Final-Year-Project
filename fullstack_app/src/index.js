import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import App from './App';
import * as serviceWorker from './serviceWorker';
import Firebase, { FirebaseContext } from './components/firebase';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App/>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
