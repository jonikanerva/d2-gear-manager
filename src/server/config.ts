import * as dotenv from 'dotenv'

dotenv.config()

interface Config {
  bungieApiKey: string
  bungieClientId: number
  environment: string
}

export const config: Config = {
  bungieApiKey: process.env.BUNGIE_API_KEY || '',
  bungieClientId: parseInt(process.env.BUNGIE_CLIENT_ID || '', 10),
  environment: process.env.APP_ENV || '',
}
