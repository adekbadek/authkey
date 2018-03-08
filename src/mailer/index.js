const nodemailer = require('nodemailer')

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

const getNodemailerTransport = ({type, credentials}) => {
  if (!isTest) {
    const transport = {}

    if (type === 'amazonSES') {
      const aws = require('aws-sdk')
      aws.config.update(credentials)
      transport.SES = new aws.SES()
    } else if (type === 'gmail') {
      transport.service = 'gmail'
      transport.auth = credentials
    }

    return nodemailer.createTransport(transport)
  }
}

module.exports = {
  mailer: ({mailerConfig, ...config}) => {
    if (!mailerConfig) {
      throw new Error(`mailerConfig must be provided in config object`)
    }
    return ({
      send: sendMail({
        nodemailerTransport: getNodemailerTransport(mailerConfig),
        config,
      }),
    })
  },
  getMailOptions,
}
