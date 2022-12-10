import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import './index.css'
import Store from './Services/Store'

// Just makes the tab a little easier to find :p
if (import.meta.env.REACT_APP_ENV === 'development') document.title = 'BETA'

const app = (
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>
)

ReactDOM.render(app, document.getElementById('root'))
