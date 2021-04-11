import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'

import manifestJson from '../../../manifest.json'
import App from '../../components/App'
import favicon from '../../images/favicon.png'
import { config } from '../config'

const manifest: Record<string, string> = manifestJson
const appConfig = {
  clientId: config.bungieClientId,
}

const html = (url: string): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Destiny GM</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <link rel="stylesheet" href="/${manifest['main.css'].replace(/^auto/, '')}" />
  <meta name="theme-color" content="#000000" />
  <link rel="shortcut icon" href="/${favicon}" />
  <link
    rel="apple-touch-icon-precomposed"
    sizes="144x144"
    href="/${favicon}"
  />
  <script type="application/json" id="appConfig">${JSON.stringify(
    appConfig
  )}</script>
</head>
<body>
  <div id="root">${renderToString(
    <Router location={url}>
      <App />
    </Router>
  )}</div>
  <script src="/${manifest['main.js'].replace(/^auto/, '')}"></script>
</body>
</html>`

export default html
