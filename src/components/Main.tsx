import React, { useEffect, useState } from 'react'

import { AuthResponse } from '../server/controllers/getAuth'
import css from './App.css'
import { getAuth } from './localStorage'
import Profile from './Profile'

const Main: React.FC = () => {
  const [storage, setStorage] = useState<AuthResponse>()

  useEffect(() => {
    const auth = getAuth()

    if (auth !== null) {
      setStorage(auth)
    }
  }, [])

  const loggedIn = storage && storage.expiresAt > Date.now()
  const loginUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=1502&response_type=code`

  return loggedIn && storage ? (
    <Profile
      accessToken={storage.accessToken}
      tokenType={storage.tokenType}
      memberShipType={storage.memberShipType}
      primaryMembershipId={storage.primaryMembershipId}
    />
  ) : (
    <div className={css.centeredHeading}>
      👉
      <a className={css.link} href={loginUrl}>
        Login with Bungie
      </a>
      👈
    </div>
  )
}

export default Main
