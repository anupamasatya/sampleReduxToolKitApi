/**
 * @format
 */

import React from 'react';
import {NativeModules} from 'react-native';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './redux/store/index';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notification
const ReduxApp = () => (
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <App />
    {/* </PersistGate> */}
  </Provider>
);
AppRegistry.registerComponent(appName, () => ReduxApp);
