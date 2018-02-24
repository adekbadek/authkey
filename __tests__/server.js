require('dotenv').config()

const request = require('supertest')

const app = require('../src/server.js')

describe('POST /request/:address', () => {
  it('should respond with 200 to valid address', async () => {
    const response = await request(app).post('/request/something@mail.com')
    expect(response.statusCode).toBe(200)
  })
  it('should respond with 400 to invalid address', async () => {
    const response = await request(app).post('/request/whatever')
    expect(response.statusCode).toBe(400)
  })
})
