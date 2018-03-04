const nodemailer = require('nodemailer')
const aws = require('aws-sdk')

const isTest = process.env.NODE_ENV === 'test'

const defaultMessage = {
  subject: ({config}) => `Auth key for ${config.productName}`,
  html: ({config, authkey}) => `Your auth key for ${config.productName} is <strong>${authkey}</strong>`,
  text: ({config, authkey}) => `Your auth key for ${config.productName} is ${authkey}`,
}

const getMailOptions = ({to, config, authkey}) => {
  const {from, message = {}} = config
  const messageArg = {config, authkey}
  const getMessage = prop => message[prop] ? message : defaultMessage
  return {
    from,
    to,
    subject: getMessage('subject').subject(messageArg),
    html: getMessage('html').html(messageArg),
    text: getMessage('text').text(messageArg),
  }
}

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
