const express = require('express');
const config = require('./proxy/config');
const proxyRoutes = require('./proxy/proxyRoutes');

const app = express();

app.use('/', proxyRoutes);

const PORT = config.get('proxyPort');

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
  console.log(`Forwarding to API: ${config.get('apiUrl')}`);
});