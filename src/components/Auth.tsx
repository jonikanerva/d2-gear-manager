import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import { Redirect, useLocation } from 'react-router'

import { AuthResponse } from '../server/controllers/getAuth'
import css from './App.css'
import { setAuth } from './localStorage'

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const code = queryString.parse(useLocation().search)?.code?.toString()

  useEffect(() => {
    if (code && code.length > 1) {
      fetch(`/api/auth?code=${code}`)
        .then((response) => response.json())
        .then((authData: AuthResponse) => {
          setAuth(authData)
          setLoading(false)
        })
        .catch((error) => {
          setError(true)

          console.error(error)
        })
    }
  }, [code])

  if (error === true) {
    return (
      <div className={css.centeredHeading}>💩 Authentication failed! 💩</div>
    )
  }

  if (loading === true) {
    return (
      <div className={css.centeredHeading}>
        Authentiacting with Bungie... ⏳
      </div>
    )
  }

  return <Redirect to="/" />
}

export default Auth
