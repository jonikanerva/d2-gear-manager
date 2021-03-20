import React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../../components/App'
import manifestJson from '../../../manifest.json'

const manifest: Record<string, string> = manifestJson

const html = (): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Hello World</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <link rel="stylesheet" href="/${manifest['main.css'].replace(/^auto/, '')}" />
</head>
<body>
  <div id="root">${renderToString(<App />)}</div>
  <script src="/${manifest['main.js'].replace(/^auto/, '')}"></script>
</body>
</html>`

export default html
