const app = require('../src/server/index')
const request = require('supertest')

describe('GET /', () => {
  test("gets the test endpoint", () => {
    request(app).get('/').then(response => {
      expect(response.status).toBe(200);
    })
  })
});

