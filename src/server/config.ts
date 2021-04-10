import * as dotenv from 'dotenv'

dotenv.config()

interface Config {
  bungieApiKey: string
  bungieClientId: string
  environment: string
}

export const config: Config = {
  bungieApiKey: process.env.BUNGIE_API_KEY || '',
  bungieClientId: process.env.BUNGIE_CLIENT_ID || '',
  environment: process.env.APP_ENV || '',
}
