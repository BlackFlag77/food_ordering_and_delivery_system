const request = require('supertest');
const app     = require('../index');
const User    = require('../models/User');
let adminToken, userId;

beforeAll(async () => {
  // register & login admin
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin',
      email: 'a@x.com',
      password: 'Admin@1234',
      role: 'admin'
    });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'a@x.com', password: 'Admin@1234' });
  adminToken = res.body.token;
});

describe('User CRUD', () => {
  it('admin can create customer', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Cust',
        email: 'c@x.com',
        password: 'Cust@1234',
        role: 'customer'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('c@x.com');
    userId = res.body.id;
  });

  it('customer can read own profile', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'c@x.com', password: 'Cust@1234' });
    const token = login.body.token;
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('c@x.com');
  });

  it('customer cannot list all users', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'c@x.com', password: 'Cust@1234' });
    const token = login.body.token;
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});
