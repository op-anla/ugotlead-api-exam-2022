// Using this to create env file based on Netlify UI Environments
const fs = require('fs')
fs.writeFileSync('./.env', `
DB_HOST=${process.env.DB_HOST}\n
DB_USER=${process.env.DB_USER}\n
DB_PASSWORD=${process.env.DB_PASSWORD}\n
DB_NAME=${process.env.DB_NAME}\n
`)
