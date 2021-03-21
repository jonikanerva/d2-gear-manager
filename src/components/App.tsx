import React, { useEffect, useState } from 'react'
import css from './App.css'
import { getItem, setItem } from './localStorage'

const loginUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=1502&response_type=code`

interface Cookies {
  name: string
  value: string
}

const getCookies = (): Cookies[] | undefined =>
  document.cookie === ''
    ? undefined
    : document.cookie.split(';').map((item) => {
        const [cookieName, cookieValue] = item.split('=')

        return { name: cookieName, value: cookieValue }
      })

const App: React.FC = () => {
  const [cookie, setCookie] = useState<Cookies[]>()
  const [storage, setStorage] = useState<Cookies[]>()

  useEffect(() => {
    const cookies = getCookies()
    const storages = getItem('donutVaultManager') as Cookies[]

    setCookie(cookies)
    setStorage(storages)

    if (storages === null) {
      setItem('donutVaultManager', cookies)
    }
  }, [])

  return (
    <div>
      <div className={css.header}>Hello World!</div>
      <a href={loginUrl}>Login</a>
      Sulla on keksi {JSON.stringify(cookie)}
      <br />
      Sulla on localstorage {JSON.stringify(storage)}
      <br />
    </div>
  )
}

export default App
