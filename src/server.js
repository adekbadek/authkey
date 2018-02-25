const express = require('express')

const { validateEmail } = require('./helpers')
const database = require('./db')
const { generate } = require('./keys')
const { mailer } = require('./mailer')

module.exports = (config) => {
  const app = express()
  const mailerInstance = mailer(config)
  const databaseInstance = database(config)

  app.post('/request/:address', async (req, res) => {
    const {address} = req.params
    if (validateEmail(address)) {
      const authkey = generate()
      const newAddress = databaseInstance.create({address, authkey})
      let message = `done, check your email`
      if (newAddress.exists) {
        message = `a key for this address was already requested, key was resent`
      }
      await mailerInstance.send({to: address, authkey})
      res.send({message})
    } else {
      res.status(400).send({error: `${address} is not a valid email address`})
    }
  })

  app.post('/verify/:authkey', (req, res) => {
    const {authkey} = req.params
    const found = databaseInstance.verifyKey(authkey)
    if (found) {
      res.send({message: `key ${authkey} is valid`})
    } else {
      res.status(401).send({message: `key ${authkey} is not valid`})
    }
  })

  app.__resetDataBase = databaseInstance.reset
  app.__getKeyByAddressFromDataBase = databaseInstance.getKeyByAddress

  return app
}
