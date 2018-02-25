const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const isTest = process.env.NODE_ENV === 'test'

const getMailOptions = ({to, config, authkey}) => ({
  from: `myemail@${config.mailgun.domain}`,
  to,
  subject: `Auth key for ${config.productName}`,
  html: `Your auth key for ${config.productName} is <strong>${authkey}</strong>.`,
  text: `Your auth key for ${config.productName} is ${authkey}.`,
})

const sendMail = ({nodemailerInstance, config}) => ({to, authkey}) => new Promise((resolve, reject) => {
  if (isTest) {
    resolve()
  }
  nodemailerInstance.sendMail(
    getMailOptions({to, config, authkey}),
    (err, info) => err ? reject(err) : resolve(info)
  )
})

module.exports = {
  mailer: (config) => {
    const auth = {
      auth: {
        api_key: config.mailgun.apiKey,
        domain: config.mailgun.domain,
      },
    }
    return ({
      send: sendMail({
        nodemailerInstance: nodemailer.createTransport(mg(auth)),
        config,
      }),
    })
  },
  getMailOptions,
}
