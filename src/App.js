import React from 'react';
import './index.css'
import MyRouter from './Router'
import { Provider } from 'react-redux'
import Store from './Store'

function App() {
  return (

    <Provider store={Store}>

      <div className="App">
        <MyRouter />
      </div>

    </Provider>

  );
}

export default App;
