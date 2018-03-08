const request = require('supertest')

const authkey = require('../src/server.js')

const instance = authkey({
  from: 'someone@mail.com',
  productName: process.env.PRODUCT_NAME,
  dbFile: '__tests__/db.json',
  mailerConfig: {},
})

beforeEach(() => {
  instance.__resetDataBase()
})

const VALID_EMAIL = 'something@mail.com'

describe('POST /request/:address', async () => {
  it('should respond with 400 to invalid address', async () => {
    const invalidResponse = await request(instance).post('/request/whatever')
    expect(invalidResponse.statusCode).toBe(400)
  })
  it('should respond with 200 to valid address', async () => {
    const validResponse = await request(instance).post(`/request/${VALID_EMAIL}`)
    expect(validResponse.statusCode).toBe(200)
  })
  it('should respond with special message if address exists', async () => {
    await request(instance).post(`/request/${VALID_EMAIL}`)
    const validResponse = await request(instance).post(`/request/${VALID_EMAIL}`)
    expect(validResponse.statusCode).toBe(200)
    expect(validResponse.body).toMatchSnapshot()
  })
})

describe('POST /verify/:key', async () => {
  it('should respond with 401 to invalid key', async () => {
    const invalidResponse = await request(instance).post('/verify/whatever')
    expect(invalidResponse.statusCode).toBe(401)
  })
  it('should respond with 200 to valid key', async () => {
    await request(instance).post(`/request/${VALID_EMAIL}`)
    const {authkey} = instance.__getKeyByAddressFromDataBase(VALID_EMAIL)
    const validResponse = await request(instance).post(`/verify/${authkey}`)
    expect(validResponse.statusCode).toBe(200)
  })
})
