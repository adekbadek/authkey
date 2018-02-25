const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const isTest = process.env.NODE_ENV === 'test'

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
}

const nodemailerMailgun = !isTest && nodemailer.createTransport(mg(auth))

const send = ({to, authkey}) => {
  if (isTest) {
    return
  }
  nodemailerMailgun.sendMail({
    from: `myemail@${process.env.MAILGUN_DOMAIN}`,
    to,
    subject: `Auth key for ${process.env.PRODUCT_NAME}`,
    html: `Your auth key for ${process.env.PRODUCT_NAME} is <strong>${authkey}</strong>.`,
    text: `Your auth key for ${process.env.PRODUCT_NAME} is ${authkey}.`,
  }, function (err, info) {
    if (err) {
      console.log('Error: ' + err)
    } else {
      console.log('Response: ' + info)
    }
  })
}

module.exports = {
  send,
}
