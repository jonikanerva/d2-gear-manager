import React, { useEffect, useState } from 'react'

import css from './Main.css'
import { VaultManagerStorage } from './Auth'
import { getItem } from './localStorage'
import Profile from './Profile'

const loginUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=1502&response_type=code`

const Main: React.FC = () => {
  const [storage, setStorage] = useState<VaultManagerStorage>()

  useEffect(() => {
    const manager = getItem('donutVaultManager') as VaultManagerStorage

    setStorage(manager)
  }, [])

  const loggedIn = storage && storage.expiresAt > Date.now()

  return loggedIn ? (
    <Profile />
  ) : (
    <div>
      <a className={css.loginLink} href={loginUrl}>
        👉 Please Login with Bungie 👈
      </a>
    </div>
  )
}

export default Main
