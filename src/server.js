const express = require('express')
const cors = require('cors')

const { validateEmail } = require('./helpers')
const database = require('./db')
const { generate } = require('./keys')
const { mailer } = require('./mailer')

module.exports = (config) => {
  const app = express()
  app.use(cors())

  const mailerInstance = mailer(config)
  const databaseInstance = database(config)

  app.post('/request/:address', async (req, res) => {
    const {address} = req.params
    if (validateEmail(address)) {
      const newAddress = databaseInstance.create({address, authkey: generate()})
      let message = `Done, check your email`
      if (newAddress.exists) {
        message = `A key for this address was already requested, it has been resent`
      }
      mailerInstance
        .send({to: address, authkey: newAddress.authkey})
        .then(() => {
          res.send({message})
        })
        .catch(({code, statusCode}) => {
          res.status(statusCode).send({message: code})
        })
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
