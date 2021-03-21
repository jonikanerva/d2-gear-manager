import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'

import css from './App.css'
import Auth from './Auth'
import { getItem } from './localStorage'

const HelloWorld: React.FC = () => {
  const loginUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=1502&response_type=code`

  const [storage, setStorage] = useState<any>()

  useEffect(() => {
    setStorage(getItem('donutVaultManager'))
  }, [setStorage])

  return (
    <div>
      <div className={css.header}>Hello World!</div>
      <br />
      <a href={loginUrl}>Login</a>
      <br />
      You have storage {JSON.stringify(storage)}
    </div>
  )
}

const App: React.FC = () => (
  <Switch>
    <Route path="/auth" render={() => <Auth />} />
    <Route path="/" render={() => <HelloWorld />} />
  </Switch>
)

export default App
