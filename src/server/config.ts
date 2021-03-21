import dotenv from 'dotenv'

dotenv.config()

interface Config {
  bungieApiKey: string
  bungieClientId: string
}

export const config: Config = {
  bungieApiKey: process.env.BUNGIE_API_KEY || '',
  bungieClientId: process.env.BUNGIE_CLIENT_ID || '',
}
