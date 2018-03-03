const {getMailOptions} = require('../src/mailer')

it('getMailOptions', () => {
  const mailOptions = getMailOptions({
    to: 'someone@maillcom',
    config: {
      from: 'someone@mail.com',
      productName: process.env.PRODUCT_NAME,
    },
    authkey: '72389y4cr8gf23',
  })
  expect(mailOptions).toMatchSnapshot()
})
