const {getMailOptions, mailer} = require('../src/mailer')

describe('getMailOptions', () => {
  const createMailOptions = (config) => getMailOptions({
    to: 'someone@maillcom',
    config,
    authkey: '72389y4cr8gf23',
  })
  it('handles default message', () => {
    expect(createMailOptions({
      from: 'someone@mail.com',
      productName: process.env.PRODUCT_NAME,
    })).toMatchSnapshot()
  })
  it('handles custom message', () => {
    expect(createMailOptions({
      from: 'someone@mail.com',
      productName: process.env.PRODUCT_NAME,
      message: {
        subject: ({config}) => `Your personal auth key for ${config.productName}`,
        html: ({config, authkey}) => `Hello! The auth key is ${config.productName} is<br /><strong>${authkey}</strong>`,
        text: ({config, authkey}) => `Hello! The auth key is ${config.productName} is ${authkey}`,
      },
    })).toMatchSnapshot()
  })
})

describe('mailer', () => {
  it('throws if no mailerConfig is provided', () => {
    expect(() => {
      mailer({})
    }).toThrow(/mailerConfig must be/)
  })
})
