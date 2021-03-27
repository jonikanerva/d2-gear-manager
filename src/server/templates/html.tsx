import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'

import manifestJson from '../../../manifest.json'
import App from '../../components/App'

const manifest: Record<string, string> = manifestJson

const html = (url: string): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Destiny Gear Manager</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <link rel="stylesheet" href="/${manifest['main.css'].replace(/^auto/, '')}" />
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
