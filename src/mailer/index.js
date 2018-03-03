const nodemailer = require('nodemailer')
const aws = require('aws-sdk')

const isTest = process.env.NODE_ENV === 'test'

const getMailOptions = ({to, config, authkey}) => ({
  from: config.from,
  to,
  subject: `Auth key for ${config.productName}`,
  html: `Your auth key for ${config.productName} is <strong>${authkey}</strong>.`,
  text: `Your auth key for ${config.productName} is ${authkey}.`,
})

const sendMail = ({nodemailerTransport, config}) => ({to, authkey}) => new Promise((resolve, reject) => {
  if (isTest) {
    resolve()
  }
  nodemailerTransport.sendMail(
    getMailOptions({to, config, authkey}),
    (err, info) => err ? reject(err) : resolve(info)
  )
})

const getSESTransprter = () => {
  if (isTest) {
  } else {
    // configure AWS SDK
    aws.config.loadFromPath('aws-config.json')

    // create Nodemailer SES transporter
    return nodemailer.createTransport({
      SES: new aws.SES(),
    })
  }
}

module.exports = {
  mailer: (config) => {
    return ({
      send: sendMail({
        nodemailerTransport: getSESTransprter(),
        config,
      }),
    })
  },
  getMailOptions,
}
