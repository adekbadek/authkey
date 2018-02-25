require('dotenv').config()

const request = require('supertest')

const authkey = require('../src/server.js')

const instance = authkey({
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
  productName: process.env.PRODUCT_NAME,
  dbFile: '__tests__/db.json',
})

describe('POST /request/:address', () => {
  it('should respond with 200 to valid address', async () => {
    const response = await request(instance).post('/request/something@mail.com')
    expect(response.statusCode).toBe(200)
  })
  it('should respond with 400 to invalid address', async () => {
    const response = await request(instance).post('/request/whatever')
    expect(response.statusCode).toBe(400)
  })
})
