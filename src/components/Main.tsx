import React, { useEffect, useState } from 'react'

import { AuthResponse } from '../server/controllers/getAuth'
import { getAuth } from './localStorage'
import css from './Main.css'
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
    <div>
      <a className={css.loginLink} href={loginUrl}>
        👉 Please Login with Bungie 👈
      </a>
    </div>
  )
}

export default Main
