const express = require('express')

const { generate } = require('./keys')
const { validateEmail } = require('./helpers')

const app = express()

app.post('/request-key/:address', (req, res) => {
  const {address} = req.params
  if (validateEmail(address)) {
    res.send({message: `done, key is ${generate}`})
  } else {
    res.status(400).send({error: `${address} is not a valid email address`})
  }
})

module.exports = app
