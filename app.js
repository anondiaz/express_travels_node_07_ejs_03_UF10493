const path = require('node:path');
const express = require('express');
const app =express();

process.loadEnvFile()
const PORT = process.env.PORT || 12346;

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
