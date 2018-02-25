const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const isTest = process.env.NODE_ENV === 'test'

const sendMail = ({nodemailerInstance, config}) => ({to, authkey}) => {
  if (isTest) {
    return
  }
  nodemailerInstance.sendMail({
    from: `myemail@${config.mailgun.domain}`,
    to,
    subject: `Auth key for ${config.productName}`,
    html: `Your auth key for ${config.productName} is <strong>${authkey}</strong>.`,
    text: `Your auth key for ${config.productName} is ${authkey}.`,
  }, function (err, info) {
    if (err) {
      console.log('Error: ' + err)
    } else {
      console.log('Response: ' + info)
    }
  })
}

module.exports = (config) => {
  const auth = {
    auth: {
      api_key: config.mailgun.apiKey,
      domain: config.mailgun.domain,
    },
  }
  const nodemailerMailgun = !isTest && nodemailer.createTransport(mg(auth))
  return ({
    send: sendMail({
      nodemailerInstance: nodemailerMailgun,
      config,
    }),
  })
}
