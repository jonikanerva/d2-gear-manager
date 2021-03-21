import './App.css'

import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Auth from './Auth'
import Main from './Main'

const App: React.FC = () => (
  <Switch>
    <Route path="/auth" render={() => <Auth />} />
    <Route path="/" render={() => <Main />} />
  </Switch>
)

export default App
