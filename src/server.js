const express = require('express')

const { validateEmail } = require('./helpers')
const database = require('./db')
const { generate } = require('./keys')
const { send } = require('./mailer')

const app = express()

app.post('/request-key/:address', (req, res) => {
  const {address} = req.params
  if (validateEmail(address)) {
    const authkey = generate()
    const newAddress = database.create({address, authkey})
    let message = `done, check your email`
    if (newAddress.exists) {
      message = `a key for this address was already requested, key was resent`
    }
    send({address, authkey})

    res.send({message})
  } else {
    res.status(400).send({error: `${address} is not a valid email address`})
  }
})

module.exports = app
