import dotenv from 'dotenv'

dotenv.config()

interface Config {
  bungieApiKey: string
}

export const config: Config = {
  bungieApiKey: process.env.BUNGIE_API_KEY || '',
}
